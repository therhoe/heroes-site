(function () {
  // Google Apps Script web app URL for workshop submissions.
  // Deploy .claude/scripts/workshop-apps-script.gs, then paste the /exec URL here.
  var ENDPOINT = '';

  // the hub page every session starts from and returns to
  var CONTENTS = 'index.html';

  // one array per session — arrows flow within a session only;
  // past either end you land back on the contents page.
  var SESSIONS = [
    ['journey-1.html', 'journey-2.html', 'journey-3.html', 'pace-intro.html',
     'pace.html', 'pace-overview.html',
     'pace-p.html', 'pace-a.html', 'pace-c.html', 'pace-e.html',
     'together.html', 'together-p.html', 'together-a.html', 'together-c.html', 'together-e.html'],
    ['analytics.html'],
    ['testing.html'],
    ['confidence.html']
  ];

  // left over from the old email gate — still read so submissions from
  // people who unlocked the gate before it was removed keep their email
  var STORE_KEY = 'workshop_email';

  function storedEmail() {
    try { return localStorage.getItem(STORE_KEY) || ''; } catch (e) { return ''; }
  }

  initSlide();

  // --- slide nav ----------------------------------------------------------
  function initSlide() {
    var here = location.pathname.split('/').pop() || 'index.html';

    var session = null, i = -1;
    SESSIONS.forEach(function (s) {
      var idx = s.indexOf(here);
      if (idx !== -1) { session = s; i = idx; }
    });

    document.querySelectorAll('form.exercise').forEach(wireExercise);
    if (!session) return;

    // past either end of a session you land back on contents
    var prev = i > 0 ? session[i - 1] : CONTENTS;
    var next = i < session.length - 1 ? session[i + 1] : CONTENTS;

    var nav = document.createElement('div');
    nav.className = 'slidenav';
    nav.innerHTML =
      '<a href="' + prev + '">&#8592;</a>' +
      '<span class="count">' + (i + 1) + ' / ' + session.length + '</span>' +
      '<a href="' + next + '">&#8594;</a>';
    document.body.appendChild(nav);

    document.addEventListener('keydown', function (ev) {
      var tag = (ev.target.tagName || '').toLowerCase();
      if (tag === 'input' || tag === 'textarea') return;
      if (ev.key === 'ArrowLeft') location.href = prev;
      if (ev.key === 'ArrowRight') location.href = next;
    });
  }

  // --- exercise submissions ----------------------------------------------
  // <form class="exercise" data-exercise="name"> — text inputs, textareas,
  // and file inputs (screenshots) are collected and posted as JSON.
  function wireExercise(form) {
    var btn = form.querySelector('button.send');
    var status = form.querySelector('.status');

    form.addEventListener('submit', function (ev) {
      ev.preventDefault();
      if (!ENDPOINT) {
        status.className = 'status bad';
        status.textContent = '// submissions are not wired up yet (no endpoint)';
        return;
      }
      btn.disabled = true;
      status.className = 'status muted';
      status.textContent = '// sending…';

      var answers = {};
      var imagePromises = [];
      Array.prototype.forEach.call(form.elements, function (el) {
        if (!el.name) return;
        if (el.type === 'file') {
          Array.prototype.forEach.call(el.files, function (file) {
            imagePromises.push(shrinkImage(file).then(function (img) {
              img.field = el.name;
              return img;
            }));
          });
        } else if (el.tagName !== 'BUTTON') {
          answers[el.name] = el.value;
        }
      });

      Promise.all(imagePromises).then(function (images) {
        return fetch(ENDPOINT, {
          method: 'POST',
          mode: 'no-cors',
          body: JSON.stringify({
            email: storedEmail(),
            page: location.pathname.split('/').pop(),
            exercise: form.getAttribute('data-exercise') || '',
            answers: answers,
            images: images
          })
        });
      }).then(function () {
        status.className = 'status ok';
        status.textContent = '// got it. saved.';
        btn.disabled = false;
      }).catch(function () {
        status.className = 'status bad';
        status.textContent = '// something broke — email it to shep@therealheroesofecommerce.com instead';
        btn.disabled = false;
      });
    });
  }

  // downscale big screenshots client-side so uploads stay fast
  function shrinkImage(file) {
    var MAX = 1600;
    return new Promise(function (resolve, reject) {
      var img = new Image();
      var url = URL.createObjectURL(file);
      img.onload = function () {
        URL.revokeObjectURL(url);
        var scale = Math.min(1, MAX / Math.max(img.width, img.height));
        var canvas = document.createElement('canvas');
        canvas.width = Math.round(img.width * scale);
        canvas.height = Math.round(img.height * scale);
        canvas.getContext('2d').drawImage(img, 0, 0, canvas.width, canvas.height);
        var dataUrl = canvas.toDataURL('image/jpeg', 0.85);
        resolve({
          name: file.name,
          type: 'image/jpeg',
          data: dataUrl.split(',')[1]
        });
      };
      img.onerror = function () { URL.revokeObjectURL(url); reject(new Error('bad image')); };
      img.src = url;
    });
  }
})();
