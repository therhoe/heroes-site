(function () {
  // Google Apps Script web app URL for workshop submissions.
  // Deploy .claude/scripts/workshop-apps-script.gs, then paste the /exec URL here.
  var ENDPOINT = 'https://script.google.com/macros/s/AKfycbwbEk18wCCbw1P3vqsI1s82Hteb4u_SLfa1WeWnzzfodorKr1eihNI6lOaiNJscnbbE-Q/exec';
  window.WORKSHOP_ENDPOINT = ENDPOINT; // answers.html reads submissions from here

  // Analytics workshop — SEPARATE sheet + deployment on purpose.
  // Deploy .claude/scripts/analytics-workshop-apps-script.gs, paste the /exec URL here.
  var ANALYTICS_ENDPOINT = 'https://script.google.com/macros/s/AKfycbwoehsgPtDzZORlrZ4q2Qf0NTN0KargpD32jrVkr7oe502X27d0PP9VgR3HUp2mB84lsw/exec';
  window.WORKSHOP_ANALYTICS_ENDPOINT = ANALYTICS_ENDPOINT; // analytics-answers.html reads from here

  // Expert review & roadmaps workshop — SEPARATE sheet + deployment too.
  // Deploy .claude/scripts/roadmaps-workshop-apps-script.gs, paste the /exec URL here.
  var ROADMAPS_ENDPOINT = 'https://script.google.com/macros/s/AKfycby4YdL6Dn43QF4DyrE7iFTLtSQN5ysK3mHRO7V3SsgWUjOJRoQMwAl_C7Uhq2QCf4V3Ng/exec';
  window.WORKSHOP_ROADMAPS_ENDPOINT = ROADMAPS_ENDPOINT;

  // forms with data-endpoint="analytics" / "roadmaps" post to that session's deployment
  function endpointFor(form) {
    var which = form.getAttribute('data-endpoint');
    if (which === 'analytics') return ANALYTICS_ENDPOINT;
    if (which === 'roadmaps') return ROADMAPS_ENDPOINT;
    return ENDPOINT;
  }

  // the hub page every session starts from and returns to
  var CONTENTS = 'index.html';

  // one array per session — arrows flow within a session only;
  // past either end you land back on the contents page.
  var SESSIONS = [
    ['intro.html',
     'journey-1.html', 'journey-2.html', 'journey-3.html', 'pace-intro.html',
     'pace.html', 'pace-overview.html',
     'pace-p.html', 'pace-a.html', 'pace-c.html', 'pace-e.html',
     'together.html', 'together-p.html', 'together-a.html', 'together-c.html', 'together-e.html',
     'together-quadrant.html'],
    ['analytics.html', 'analytics-2.html', 'analytics-3.html', 'analytics-4.html', 'analytics-5.html'],
    ['roadmaps.html', 'review.html', 'review-pace.html',
     'review-pdp.html', 'review-e.html',
     'roadmaps-intro.html', 'prioritize.html', 'roadmaps-planner.html'],
    ['confidence.html']
  ];

  // left over from the old email gate — still read so submissions from
  // people who unlocked the gate before it was removed keep their email
  var STORE_KEY = 'workshop_email';

  function storedEmail() {
    try { return localStorage.getItem(STORE_KEY) || ''; } catch (e) { return ''; }
  }

  // PDP expert review answers, kept across slides until sent (see initReview)
  var REVIEW_KEY = 'workshop_review';
  var REVIEW_ORDER = [
    'pdp_url',
    'p_reiterated', 'p_text_visuals', 'p_fold', 'p_implicit', 'p_rating',
    'a_aligned', 'a_describe', 'a_fold', 'a_implicit', 'a_rating',
    'c_benefits', 'c_specs', 'c_proof'
  ];

  initSlide();
  initReview();

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

  // --- PDP expert review ---------------------------------------------------
  // The review spans several slides, so answers live in localStorage until
  // the <form data-review> on the criteria slide sends them all as one row.
  //   <div class="q" data-key="..."> — one question: button.opt choices
  //     (data-stop on a choice = nothing after it on that slide applies),
  //     or a text input. Later questions stay locked until it's answered.
  //   <input data-key="..."> outside a .q — plain remembered field.
  // (REVIEW_KEY / REVIEW_ORDER are declared up top, before initReview runs)

  // the prioritize slide reads these
  window.WORKSHOP_REVIEW = {
    order: REVIEW_ORDER,
    sent: function () {
      try { return JSON.parse(localStorage.getItem(REVIEW_KEY + '_sent') || 'null'); } catch (e) { return null; }
    },
    inProgress: reviewAnswers
  };

  function reviewStore() {
    try { return JSON.parse(localStorage.getItem(REVIEW_KEY) || '{}'); } catch (e) { return {}; }
  }
  function saveReview(store) {
    try { localStorage.setItem(REVIEW_KEY, JSON.stringify(store)); } catch (e) {}
  }
  // stored answers in a fixed order, so every sheet row reads the same way
  function reviewAnswers() {
    var store = reviewStore(), out = {};
    REVIEW_ORDER.forEach(function (k) { if (store[k]) out[k] = store[k]; });
    return out;
  }

  function initReview() {
    var store = reviewStore();

    // Enter in a review text box shouldn't send a half-finished review
    document.querySelectorAll('form[data-review] input').forEach(function (el) {
      el.addEventListener('keydown', function (ev) {
        if (ev.key === 'Enter') ev.preventDefault();
      });
    });

    document.querySelectorAll('input[data-key]:not(.q input)').forEach(function (el) {
      el.value = store[el.getAttribute('data-key')] || '';
      el.addEventListener('input', function () {
        store[el.getAttribute('data-key')] = el.value.trim();
        saveReview(store);
      });
    });

    document.querySelectorAll('.review').forEach(function (review) {
      var qs = Array.prototype.slice.call(review.querySelectorAll('.q'));

      function render() {
        var locked = false;
        qs.forEach(function (q) {
          var key = q.getAttribute('data-key');
          if (locked) delete store[key]; // stale answer below a "no" or a gap
          var val = store[key] || '';
          q.classList.toggle('locked', locked);
          q.querySelectorAll('button.opt').forEach(function (b) {
            b.disabled = locked;
            b.classList.toggle('on', !!val && b.getAttribute('data-v') === val);
          });
          var input = q.querySelector('input');
          if (input) {
            input.disabled = locked;
            if (document.activeElement !== input) input.value = val;
          }
          var chosen = q.querySelector('button.opt.on');
          if (!val || (chosen && chosen.hasAttribute('data-stop'))) locked = true;
        });
        saveReview(store);
      }

      qs.forEach(function (q) {
        var key = q.getAttribute('data-key');
        q.querySelectorAll('button.opt').forEach(function (b) {
          b.addEventListener('click', function () {
            store[key] = b.getAttribute('data-v');
            render();
          });
        });
        var input = q.querySelector('input');
        if (input) {
          input.addEventListener('input', function () {
            store[key] = input.value.trim();
            render();
          });
        }
      });

      render();
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
      var endpoint = endpointFor(form);
      if (!endpoint) {
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

      if (form.hasAttribute('data-review')) {
        var all = reviewAnswers();
        Object.keys(answers).forEach(function (k) { all[k] = answers[k]; });
        answers = all;
      }

      Promise.all(imagePromises).then(function (images) {
        return fetch(endpoint, {
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
        // sent — the next review starts from a clean slate
        // (a copy of what was sent stays behind for the prioritize slide)
        if (form.hasAttribute('data-review')) {
          try {
            localStorage.setItem(REVIEW_KEY + '_sent', JSON.stringify(answers));
            localStorage.removeItem(REVIEW_KEY);
          } catch (e) {}
        }
        var next = form.getAttribute('data-next');
        if (next) {
          try {
            sessionStorage.setItem('workshop_last_submission', JSON.stringify({
              exercise: form.getAttribute('data-exercise') || '',
              answers: answers
            }));
          } catch (e) {}
          setTimeout(function () { location.href = next; }, 700);
        }
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
