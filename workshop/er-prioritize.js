// Prioritize slides for the PACE expert review (session three v2).
//   <ol class="sortable" id="cards" data-round="1"> — the four PACE stages
//   data-round="2" — the stages plus the tasks from the feedback review
// Cards start most urgent first; once someone drags them, their order is
// kept (per round) until they start a new review. Round 2 starts from the
// order they left round 1 in, with the feedback tasks slotted in by urgency.
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
      urgency: Number(answers[s.key + '_urgency']) || 0,
      notes: answers[s.key + '_notes'] || ''
    });
  });
  tasks.forEach(function (t) {
    cards.push({
      key: 't' + t.id,
      section: 'feedback · ' + [STAGE_NAME[t.stage], t.source].filter(Boolean).join(' · '),
      title: t.task,
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

  list.innerHTML = cards.map(function (c) {
    // ten-segment meter + the number
    var urgency = c.urgency
      ? '<span class="meter" aria-hidden="true"><span style="width: ' + (c.urgency * 10) + '%"></span></span>' +
        ' urgency ' + c.urgency + ' / 10'
      : '<span class="muted">not rated</span>';
    var notes = c.key.charAt(0) === 't' ? ''
      : c.notes ? '<span class="card-notes">' + esc(c.notes) + '</span>'
      : '<span class="card-notes muted">no notes</span>';
    return '<li class="card' + (c.section ? ' is-task' : '') + '" data-key="' + c.key + '">' +
      '<span class="rank"></span>' +
      '<span class="card-body">' +
      (c.section ? '<span class="card-section">' + esc(c.section) + '</span>' : '') +
      '<span class="card-value">' + esc(c.title) + '</span>' +
      '<span class="card-urgency">' + urgency + '</span>' + notes + '</span>' +
      '<span class="grip" aria-hidden="true">⋮⋮</span></li>';
  }).join('');

  function save() {
    var order = Array.prototype.map.call(list.children, function (li) { return li.getAttribute('data-key'); });
    try { localStorage.setItem(ORDER_KEY, JSON.stringify({ sig: sig, order: order })); } catch (e) {}
  }
  R.sortable(list, save);
})();
