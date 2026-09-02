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

  var heroHeader = document.querySelector('.site-header.header-hero');
  if (heroHeader) {
    var updateHeroHeader = function () {
      heroHeader.classList.toggle('scrolled', window.scrollY > 40);
    };
    updateHeroHeader();
    window.addEventListener('scroll', updateHeroHeader, { passive: true });
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
});
