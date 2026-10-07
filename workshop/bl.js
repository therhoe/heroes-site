// Session four (the backlog) — loaded after workshop.js on four slides.
// Each part self-guards on its anchor element, so one file is safe on all of
// them:
//   #ice      (bl-ice.html)        live ICE score under each hypothesis
//   #mde      (bl-mde.html)        sample size / weeks-to-run calculator
//   #cards    (bl-backlog.html)    drag-rank the three, seeded in ICE order
//             (bl-conclusion.html) data-readonly + #export — the final list
(function () {
  var R = window.WORKSHOP_REVIEW;
  var HS = ['1', '2', '3'];

  function num(v) {
    var n = parseFloat(String(v == null ? '' : v).replace(/[^0-9.\-]/g, ''));
    return isFinite(n) ? n : 0;
  }

  // the ICE average, or 0 until all three parts are scored
  function ice(answers, n) {
    var i = num(answers['h' + n + '_impact']);
    var c = num(answers['h' + n + '_confidence']);
    var e = num(answers['h' + n + '_ease']);
    if (!i || !c || !e) return 0;
    return Math.round(((i + c + e) / 3) * 10) / 10;
  }

  function esc(s) {
    var d = document.createElement('div');
    d.textContent = s == null ? '' : s;
    return d.innerHTML;
  }

  // --- live ICE readouts -------------------------------------------------
  var iceWrap = document.getElementById('ice');
  if (iceWrap) {
    var renderIce = function () {
      var answers = R.inProgress();
      HS.forEach(function (n) {
        var out = iceWrap.querySelector('[data-ice-out="' + n + '"]');
        if (!out) return;
        var score = ice(answers, n);
        if (!score) {
          out.className = 'readout empty';
          out.textContent = '// score once all three are set';
          return;
        }
        var i = num(answers['h' + n + '_impact']);
        var c = num(answers['h' + n + '_confidence']);
        var e = num(answers['h' + n + '_ease']);
        // flag the case the average hides: a strong score resting on a weak part
        var weak = Math.min(i, c, e);
        var caveat = weak <= 3 && score >= 5
          ? ' &nbsp;<span class="muted">— carried by the average; the '
            + (weak === e ? 'ease' : weak === c ? 'confidence' : 'impact')
            + ' is a ' + weak + '</span>'
          : '';
        out.className = 'readout';
        out.innerHTML = '<span class="big">' + score.toFixed(1) + '</span> / 10'
          + ' &nbsp;<span class="muted">· impact ' + i + ' · confidence ' + c
          + ' · ease ' + e + '</span>' + caveat;
      });
    };
    // workshop.js writes the store in its own click handler on each .opt, and
    // this fires afterwards on the way up to the document
    document.addEventListener('click', function (ev) {
      if (ev.target.closest && ev.target.closest('#ice .q.scale .opt')) renderIce();
    });
    renderIce();
  }

  // --- sample size / weeks to run ---------------------------------------
  var mde = document.getElementById('mde');
  if (mde) {
    var mdeOut = document.getElementById('mde-out');
    var WEEKS_PER_MONTH = 4.33;

    var renderMde = function () {
      var a = R.inProgress();
      var sessions = num(a.mde_sessions);
      var p = num(a.mde_cvr) / 100;
      var lift = num(a.mde_lift) / 100;

      if (sessions <= 0 || p <= 0 || p >= 1 || lift <= 0) {
        mdeOut.className = 'readout empty';
        mdeOut.textContent = '// fill in all three';
        return;
      }

      // 16 * p * (1-p) / delta^2 — 95% significance at 80% power
      var delta = p * lift;
      var perVariant = Math.ceil(16 * p * (1 - p) / (delta * delta));
      var weeks = Math.ceil((perVariant * 2) / (sessions / WEEKS_PER_MONTH));

      var verdict = weeks <= 4
        ? '<span class="ok">testable — run it</span>'
        : weeks <= 8
          ? '<span class="muted">borderline — widen the lift you\'d accept, or test the whole page template</span>'
          : '<span class="bad">don\'t test this — ship the fix and compare snapshots</span>';

      var plural = function (n, unit) { return n + ' ' + unit + (n === 1 ? '' : 's'); };
      var howLong = weeks > 104
        ? plural(Math.round(weeks / 52), 'year')
        : weeks > 8 ? plural(Math.round(weeks / 4.33), 'month') : plural(weeks, 'week');

      mdeOut.className = 'readout';
      mdeOut.innerHTML =
        '<span class="big">' + perVariant.toLocaleString('en-US') + '</span>'
        + ' visitors per variant'
        + '<br><span class="muted">' + (perVariant * 2).toLocaleString('en-US')
        + ' in total · at ' + Math.round(sessions / WEEKS_PER_MONTH)
        + ' a week that is <strong>' + howLong + '</strong></span>'
        + '<br>' + verdict;
    };

    mde.querySelectorAll('input[data-key]').forEach(function (el) {
      el.addEventListener('input', renderMde);
    });
    renderMde();
  }

  // --- the queue ---------------------------------------------------------
  var list = document.getElementById('cards');
  if (!list) return;

  var readonly = list.hasAttribute('data-readonly');
  var ORDER_KEY = 'workshop_priorities_backlog';
  // the backlog they sent; if they haven't sent it, whatever they've filled in
  var answers = R.sent() || R.inProgress();

  var about = ['Trail Runner 2'];
  if (answers.page_pick && answers.page_pick !== 'Trail Runner 2') {
    about.push('you picked ' + answers.page_pick);
  }
  about = about.join(' · ');
  var reviewing = document.getElementById('reviewing');
  if (reviewing) reviewing.textContent = '// backlog for: ' + about;

  var cards = [];
  HS.forEach(function (n) {
    var text = (answers['h' + n] || '').trim();
    if (!text) return;
    cards.push({
      key: 'h' + n,
      section: answers['h' + n + '_route'] || 'not routed',
      title: text,
      route: answers['h' + n + '_route'] || '',
      impact: num(answers['h' + n + '_impact']),
      confidence: num(answers['h' + n + '_confidence']),
      ease: num(answers['h' + n + '_ease']),
      score: ice(answers, n)
    });
  });
  if (!cards.length) {
    var empty = document.getElementById('empty');
    if (empty) empty.hidden = false;
    return;
  }

  // highest ICE first (ties keep the order they were written in)
  cards = cards.map(function (c, i) { c.i = i; return c; }).sort(function (x, y) {
    return (y.score - x.score) || (x.i - y.i);
  });

  // a saved order only applies to the same answers — editing a score drops it
  var sig = JSON.stringify(answers);
  try {
    var saved = JSON.parse(localStorage.getItem(ORDER_KEY) || 'null');
    if (saved && saved.sig === sig) {
      var byKey = {};
      cards.forEach(function (c) { byKey[c.key] = c; });
      var kept = saved.order.filter(function (k) { return byKey[k]; })
        .map(function (k) { return byKey[k]; });
      cards.filter(function (c) { return saved.order.indexOf(c.key) === -1; })
        .forEach(function (c) {
          var at = 0;
          kept.forEach(function (k, i) { if (k.score >= c.score) at = i + 1; });
          kept.splice(at, 0, c);
        });
      cards = kept;
    }
  } catch (e) {}

  list.innerHTML = cards.map(function (c, i) {
    var score = c.score
      ? '<span class="meter" aria-hidden="true"><span style="width: '
        + (c.score * 10) + '%"></span></span> ICE ' + c.score.toFixed(1) + ' / 10'
      : '<span class="muted">not scored</span>';
    var parts = c.score
      ? '<span class="card-notes muted">impact ' + c.impact + ' · confidence '
        + c.confidence + ' · ease ' + c.ease + '</span>'
      : '';
    // "instrument first" items are blockers — mark them the way tasks are marked
    var blocker = c.route === 'instrument first' ? ' is-task' : '';
    return '<li class="card' + blocker + '" data-key="' + c.key + '">' +
      '<span class="rank">' + (readonly ? (i + 1) + '.' : '') + '</span>' +
      '<span class="card-body">' +
      '<span class="card-section">' + esc(c.section) + '</span>' +
      '<span class="card-value">' + esc(c.title) + '</span>' +
      '<span class="card-urgency">' + score + '</span>' + parts + '</span>' +
      (readonly ? '' : '<span class="grip" aria-hidden="true">⋮⋮</span>') + '</li>';
  }).join('');

  var byKey = {};
  cards.forEach(function (c) { byKey[c.key] = c; });

  function currentOrder() {
    return Array.prototype.map.call(list.children, function (li) {
      return li.getAttribute('data-key');
    });
  }

  // keep the hidden fields on bl-backlog.html in step with the dragged order
  var oPage = document.getElementById('o-page');
  var oOrder = document.getElementById('o-order');
  function syncForm() {
    if (oPage) oPage.value = about;
    if (!oOrder) return;
    oOrder.value = currentOrder().map(function (k, i) {
      var c = byKey[k];
      return (i + 1) + '. ' + c.title
        + ' [' + (c.route || 'not routed') + ', ICE '
        + (c.score ? c.score.toFixed(1) : 'n/a') + ']';
    }).join('\n');
  }

  function save() {
    try {
      localStorage.setItem(ORDER_KEY, JSON.stringify({ sig: sig, order: currentOrder() }));
    } catch (e) {}
    syncForm();
  }
  syncForm();
  if (!readonly) R.sortable(list, save);

  // --- take it with you --------------------------------------------------
  // (no Google sign-in — they paste it into their own sheet)
  var exp = document.getElementById('export');
  if (!exp) return;
  exp.hidden = false;
  var expStatus = document.getElementById('export-status');

  function rows() {
    var out = [['rank', 'hypothesis', 'route', 'impact', 'confidence', 'ease', 'ICE score']];
    Array.prototype.forEach.call(list.children, function (li, i) {
      var c = byKey[li.getAttribute('data-key')];
      out.push([String(i + 1), c.title, c.route,
        c.impact ? String(c.impact) : '',
        c.confidence ? String(c.confidence) : '',
        c.ease ? String(c.ease) : '',
        c.score ? c.score.toFixed(1) : '']);
    });
    out.push([], ['page', about]);
    return out;
  }

  document.getElementById('copy-sheet').addEventListener('click', function () {
    var data = rows();
    // Sheets reads the html table (keeps multi-line text in one cell);
    // the tab-separated text is the fallback for everything else
    var html = '<table>' + data.map(function (r) {
      return '<tr>' + r.map(function (v) {
        return '<td>' + esc(v).replace(/\n/g, '<br>') + '</td>';
      }).join('') + '</tr>';
    }).join('') + '</table>';
    var text = data.map(function (r) {
      return r.map(function (v) { return v.replace(/[\t\r\n]+/g, ' '); }).join('\t');
    }).join('\n');
    var copying = window.ClipboardItem && navigator.clipboard.write
      ? navigator.clipboard.write([new ClipboardItem({
          'text/html': new Blob([html], { type: 'text/html' }),
          'text/plain': new Blob([text], { type: 'text/plain' })
        })])
      : navigator.clipboard.writeText(text);
    copying.then(function () {
      expStatus.innerHTML = 'copied ✓ — now <a href="https://sheets.new" target="_blank" rel="noopener">open a blank Google Sheet</a>, click cell A1, and paste (ctrl/⌘ + V).';
    }).catch(function () {
      expStatus.textContent = 'couldn\'t copy in this browser — use download .csv instead, then File → Import in Google Sheets.';
    });
  });

  document.getElementById('download-csv').addEventListener('click', function () {
    var csv = rows().map(function (r) {
      return r.map(function (v) {
        return /[",\n\r]/.test(v) ? '"' + v.replace(/"/g, '""') + '"' : v;
      }).join(',');
    }).join('\r\n');
    var a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob(['﻿' + csv], { type: 'text/csv' }));
    a.download = 'cro-backlog-trail-runner-2.csv';
    document.body.appendChild(a);
    a.click();
    a.remove();
    expStatus.textContent = 'downloaded ✓ — in Google Sheets: File → Import → Upload.';
  });
})();
