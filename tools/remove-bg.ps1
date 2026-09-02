Add-Type -AssemblyName System.Drawing

$csharp = @'
using System;
using System.Drawing;
using System.Drawing.Imaging;
using System.Runtime.InteropServices;
using System.Collections.Generic;

public static class BgRemover
{
    public static void Run(string srcPath, string outPath, byte whiteThreshold, int pad)
    {
        using (var src = new Bitmap(srcPath))
        {
            int w = src.Width, h = src.Height;
            using (var bmp = new Bitmap(w, h, PixelFormat.Format32bppArgb))
            {
                using (var g = Graphics.FromImage(bmp)) g.DrawImage(src, 0, 0, w, h);

                var rect = new Rectangle(0, 0, w, h);
                var data = bmp.LockBits(rect, ImageLockMode.ReadWrite, PixelFormat.Format32bppArgb);
                int stride = data.Stride;
                int len = stride * h;
                byte[] bytes = new byte[len];
                Marshal.Copy(data.Scan0, bytes, 0, len);

                bool[] isBg = new bool[w * h];
                bool[] visited = new bool[w * h];
                var queue = new Queue<int>();

                Func<int,int,int> idx = (x, y) => y * stride + x * 4;

                Action<int,int> tryEnqueue = (x, y) =>
                {
                    if (x < 0 || x >= w || y < 0 || y >= h) return;
                    int p = y * w + x;
                    if (visited[p]) return;
                    int i = idx(x, y);
                    byte b = bytes[i], gg = bytes[i+1], r = bytes[i+2];
                    if (b >= whiteThreshold && gg >= whiteThreshold && r >= whiteThreshold)
                    {
                        visited[p] = true;
                        isBg[p] = true;
                        queue.Enqueue(p);
                    }
                };

                for (int x = 0; x < w; x++) { tryEnqueue(x, 0); tryEnqueue(x, h - 1); }
                for (int y = 0; y < h; y++) { tryEnqueue(0, y); tryEnqueue(w - 1, y); }

                while (queue.Count > 0)
                {
                    int p = queue.Dequeue();
                    int x = p % w, y = p / w;
                    tryEnqueue(x + 1, y);
                    tryEnqueue(x - 1, y);
                    tryEnqueue(x, y + 1);
                    tryEnqueue(x, y - 1);
                }

                int minX = w, minY = h, maxX = -1, maxY = -1;

                for (int y = 0; y < h; y++)
                {
                    for (int x = 0; x < w; x++)
                    {
                        int p = y * w + x;
                        int i = idx(x, y);
                        if (isBg[p]) { bytes[i+3] = 0; continue; }

                        bool touchesBg =
                            (x > 0 && isBg[p-1]) ||
                            (x < w-1 && isBg[p+1]) ||
                            (y > 0 && isBg[p-w]) ||
                            (y < h-1 && isBg[p+w]);

                        if (touchesBg)
                        {
                            byte b = bytes[i], gg = bytes[i+1], r = bytes[i+2];
                            int minCh = Math.Min(r, Math.Min(gg, b));
                            int alpha = 255 - Math.Max(0, Math.Min(255, (minCh - 200) * 4));
                            bytes[i+3] = (byte)alpha;
                        }
                        else
                        {
                            bytes[i+3] = 255;
                        }

                        if (bytes[i+3] > 10)
                        {
                            if (x < minX) minX = x;
                            if (x > maxX) maxX = x;
                            if (y < minY) minY = y;
                            if (y > maxY) maxY = y;
                        }
                    }
                }

                Marshal.Copy(bytes, 0, data.Scan0, len);
                bmp.UnlockBits(data);

                minX = Math.Max(0, minX - pad);
                minY = Math.Max(0, minY - pad);
                maxX = Math.Min(w - 1, maxX + pad);
                maxY = Math.Min(h - 1, maxY + pad);
                int cropW = maxX - minX + 1, cropH = maxY - minY + 1;

                using (var cropped = bmp.Clone(new Rectangle(minX, minY, cropW, cropH), PixelFormat.Format32bppArgb))
                {
                    cropped.Save(outPath, ImageFormat.Png);
                    Console.WriteLine("Saved " + outPath + "  (" + cropped.Width + " x " + cropped.Height + ")");
                }
            }
        }
    }
}
'@

Add-Type -TypeDefinition $csharp -ReferencedAssemblies System.Drawing

$srcPath = "C:\Users\asus\Boaz\AI\HomeStateInspectionsWebsite\logo-source.jpeg"
$outPath = "C:\Users\asus\Boaz\AI\HomeStateInspectionsWebsite\logo-transparent.png"

[BgRemover]::Run($srcPath, $outPath, [byte]246, 6)
