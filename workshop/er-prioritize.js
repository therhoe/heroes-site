// Prioritize slides for the PACE expert review (session three v2).
//   <ol class="sortable" id="cards" data-round="1"> — the four PACE stages
//   data-round="2" — the stages plus the tasks from the feedback review
// Cards start most urgent first; once someone drags them, their order is
// kept (per round) until they start a new review. Round 2 starts from the
// order they left round 1 in, with the feedback tasks slotted in by urgency.
//   data-readonly on the list (the conclusion slide) — shows a round's
//   final order without dragging, plus the copy / download buttons.
(function () {
  var STAGES = [
    { key: 'p', name: 'P // Prognosis' },
    { key: 'a', name: 'A // Activity' },
    { key: 'c', name: 'C // Criteria' },
    { key: 'e', name: 'E // Events' }
  ];
  var STAGE_NAME = {};
  STAGES.forEach(function (s) { STAGE_NAME[s.key] = s.name; });

  var list = document.getElementById('cards');
  var round = list.getAttribute('data-round') || '1';
  var readonly = list.hasAttribute('data-readonly');
  var ORDER_KEY = round === '2' ? 'workshop_priorities_pace_2' : 'workshop_priorities_pace';

  var R = window.WORKSHOP_REVIEW;
  // the review they sent; if they haven't sent one, whatever they've filled in so far
  var answers = R.sent() || R.inProgress();
  var tasks = round === '2' ? window.WORKSHOP_FEEDBACK.tasks() : [];

  var about = [answers.pdp_url, answers.device].filter(Boolean).join(' · ');
  if (about) document.getElementById('reviewing').textContent = '// reviewing: ' + about;

  var cards = [];
  STAGES.forEach(function (s) {
    if (!answers[s.key + '_notes'] && !answers[s.key + '_urgency']) return;
    cards.push({
      key: s.key,
      title: s.name,
      stage: s.name,
      source: 'expert review',
      urgency: Number(answers[s.key + '_urgency']) || 0,
      notes: answers[s.key + '_notes'] || ''
    });
  });
  tasks.forEach(function (t) {
    cards.push({
      key: 't' + t.id,
      section: 'feedback · ' + [STAGE_NAME[t.stage], t.source].filter(Boolean).join(' · '),
      title: t.task,
      stage: STAGE_NAME[t.stage] || '',
      source: t.source || '',
      urgency: Number(t.urgency) || 0
    });
  });
  if (!cards.length) { document.getElementById('empty').hidden = false; return; }

  // most urgent first (ties keep stages-then-tasks order)
  cards = cards.map(function (c, i) { c.i = i; return c; }).sort(function (x, y) {
    return (y.urgency - x.urgency) || (x.i - y.i);
  });

  // a saved order only applies to the same review; cards added since
  // (new feedback tasks) slot in by urgency, removed ones drop out
  var sig = JSON.stringify(answers);
  try {
    var saved = JSON.parse(localStorage.getItem(ORDER_KEY) || 'null');
    if (!saved && round === '2') saved = JSON.parse(localStorage.getItem('workshop_priorities_pace') || 'null');
    if (saved && saved.sig === sig) {
      var byKey = {};
      cards.forEach(function (c) { byKey[c.key] = c; });
      var kept = saved.order.filter(function (k) { return byKey[k]; }).map(function (k) { return byKey[k]; });
      cards.filter(function (c) { return saved.order.indexOf(c.key) === -1; }).forEach(function (c) {
        // right after the last card that's at least as urgent (top if none is)
        var at = 0;
        kept.forEach(function (k, i) { if (k.urgency >= c.urgency) at = i + 1; });
        kept.splice(at, 0, c);
      });
      cards = kept;
    }
  } catch (e) {}

  function esc(s) {
    var d = document.createElement('div');
    d.textContent = s;
    return d.innerHTML;
  }

  list.innerHTML = cards.map(function (c, i) {
    // ten-segment meter + the number
    var urgency = c.urgency
      ? '<span class="meter" aria-hidden="true"><span style="width: ' + (c.urgency * 10) + '%"></span></span>' +
        ' urgency ' + c.urgency + ' / 10'
      : '<span class="muted">not rated</span>';
    var notes = c.key.charAt(0) === 't' ? ''
      : c.notes ? '<span class="card-notes">' + esc(c.notes) + '</span>'
      : '<span class="card-notes muted">no notes</span>';
    return '<li class="card' + (c.section ? ' is-task' : '') + '" data-key="' + c.key + '">' +
      '<span class="rank">' + (readonly ? (i + 1) + '.' : '') + '</span>' +
      '<span class="card-body">' +
      (c.section ? '<span class="card-section">' + esc(c.section) + '</span>' : '') +
      '<span class="card-value">' + esc(c.title) + '</span>' +
      '<span class="card-urgency">' + urgency + '</span>' + notes + '</span>' +
      (readonly ? '' : '<span class="grip" aria-hidden="true">⋮⋮</span>') + '</li>';
  }).join('');

  function save() {
    var order = Array.prototype.map.call(list.children, function (li) { return li.getAttribute('data-key'); });
    try { localStorage.setItem(ORDER_KEY, JSON.stringify({ sig: sig, order: order })); } catch (e) {}
  }
  if (!readonly) R.sortable(list, save);

  // --- take it with you: copy / download the list in its current order ---
  // (no Google sign-in — they paste it into their own sheet)
  var exp = document.getElementById('export');
  if (!exp) return;
  exp.hidden = false;
  var expStatus = document.getElementById('export-status');
  var byKey = {};
  cards.forEach(function (c) { byKey[c.key] = c; });

  function rows() {
    var out = [['rank', 'item', 'PACE stage', 'source', 'urgency (1-10)', 'notes']];
    Array.prototype.forEach.call(list.children, function (li, i) {
      var c = byKey[li.getAttribute('data-key')];
      out.push([String(i + 1), c.title, c.stage, c.source, c.urgency ? String(c.urgency) : '', c.notes || '']);
    });
    if (about) out.push([], ['reviewing', about]);
    return out;
  }

  document.getElementById('copy-sheet').addEventListener('click', function () {
    var data = rows();
    // Sheets reads the html table (keeps multi-line notes in one cell);
    // the tab-separated text is the fallback for everything else
    var html = '<table>' + data.map(function (r) {
      return '<tr>' + r.map(function (v) { return '<td>' + esc(v).replace(/\n/g, '<br>') + '</td>'; }).join('') + '</tr>';
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
      return r.map(function (v) { return /[",\n\r]/.test(v) ? '"' + v.replace(/"/g, '""') + '"' : v; }).join(',');
    }).join('\r\n');
    var slug = (answers.brand || 'pdp').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    var a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob(['﻿' + csv], { type: 'text/csv' }));
    a.download = 'cro-roadmap-' + slug + '.csv';
    document.body.appendChild(a);
    a.click();
    a.remove();
    expStatus.textContent = 'downloaded ✓ — in Google Sheets: File → Import → Upload.';
  });
})();
