document.addEventListener('DOMContentLoaded', function () {
  var yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  var toggle = document.querySelector('.nav-toggle');
  var nav = document.getElementById('main-nav');
  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      var open = nav.classList.toggle('open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    nav.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        nav.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // Quote form: no backend, so this opens the visitor's email client with the
  // details pre-filled to boaz@homestateinspects.com (form's action/enctype
  // attributes cover the no-JS fallback for the same mailto behavior).
  var form = document.getElementById('quote-form');
  var status = document.getElementById('form-status');
  if (form && status) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var data = new FormData(form);
      var lines = [
        'Name: ' + (data.get('name') || ''),
        'Email: ' + (data.get('email') || ''),
        'Phone: ' + (data.get('phone') || ''),
        'Property address: ' + (data.get('property_address') || ''),
        'Preferred date: ' + (data.get('preferred_date') || ''),
        '',
        'Message:',
        data.get('message') || '(none)'
      ];
      var subject = encodeURIComponent('New quote request — Home State Inspections');
      var body = encodeURIComponent(lines.join('\n'));
      window.location.href = 'mailto:boaz@homestateinspects.com?subject=' + subject + '&body=' + body;
      status.style.color = '';
      status.textContent = "Opening your email app to send this to Boaz — if nothing opens, call or text 513-237-9552 instead.";
    });
  }

  // Services page: collapse the categories on phones.
  //
  // The groups and the jump list are <details> that ship open, so desktop and the
  // no-JS case get the old flat page. All this does is close them below 700px. The
  // general inspection stays open because it is the service most visitors came for
  // and burying it behind a tap would be a step backwards.
  //
  // State is only reset when the breakpoint actually changes, not on every resize,
  // so a group the visitor opened stays open while they scroll on a phone (mobile
  // browsers fire resize when the address bar hides).
  var svcGroups = document.querySelectorAll('.svc-group');
  var svcJump = document.querySelector('.svc-jump');

  if (svcGroups.length || svcJump) {
    var phone = window.matchMedia('(max-width: 700px)');

    var applyBreakpoint = function () {
      var narrow = phone.matches;
      Array.prototype.forEach.call(svcGroups, function (group, i) {
        group.open = narrow ? i === 0 : true;
      });
      if (svcJump) {
        svcJump.open = !narrow;
      }
      // Whatever we just closed may have been holding the anchor the visitor
      // arrived on, so re-open the path to it.
      revealTarget(window.location.hash);
    };

    // Opens every <details> between the target and the page, innermost first, so a
    // jump link can reach a service inside a collapsed category.
    function revealTarget(hash) {
      if (!hash || hash.length < 2) return null;
      var target;
      try {
        target = document.querySelector(hash);
      } catch (e) {
        return null; // not a usable selector
      }
      if (!target) return null;
      var box = target.closest('details');
      while (box) {
        box.open = true;
        box = box.parentElement ? box.parentElement.closest('details') : null;
      }
      return target;
    }

    document.addEventListener('click', function (e) {
      var link = e.target.closest ? e.target.closest('a[href^="#"]') : null;
      if (!link) return;
      var target = revealTarget(link.getAttribute('href'));
      if (!target) return;
      // The category was just opened, so let the browser lay it out before it
      // scrolls, otherwise it aims at where the anchor used to be.
      e.preventDefault();
      history.pushState(null, "", link.getAttribute("href"));
      target.scrollIntoView({ behavior: "smooth" });
      // On a phone the jump list is covering the page, so get it out of the way.
      if (svcJump && phone.matches) svcJump.open = false;
    });

    window.addEventListener('hashchange', function () {
      var target = revealTarget(window.location.hash);
      if (target) target.scrollIntoView();
    });

    if (phone.addEventListener) {
      phone.addEventListener('change', applyBreakpoint);
    } else if (phone.addListener) {
      phone.addListener(applyBreakpoint); // Safari < 14
    }
    applyBreakpoint();

    // Landing on services.html#mold from another page: the browser attempted that
    // scroll while the category was still collapsed and the anchor was at height 0,
    // so it ended up at the top of the page. applyBreakpoint has since opened the
    // category, so the jump has to be made again.
    var landed = revealTarget(window.location.hash);
    if (landed) landed.scrollIntoView();
  }
});
