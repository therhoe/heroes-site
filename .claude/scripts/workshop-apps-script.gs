/**
 * Workshop submissions — Apps Script web app.
 *
 * Setup (one time):
 * 1. Create a Google Sheet named "rhoe-workshop-submissions".
 * 2. In the sheet: Extensions → Apps Script, paste this whole file in.
 * 3. Deploy → New deployment → Web app:
 *      - Execute as: Me
 *      - Who has access: Anyone
 * 4. Copy the /exec URL into ENDPOINT at the top of workshop/workshop.js.
 *
 * doPost appends a row per submission: timestamp, email, page, exercise,
 * answers (one per line), Drive links to any uploaded screenshots, and
 * the raw answers as JSON (used by doGet).
 *
 * doGet returns submissions as JSON for the answers page
 * (?exercise=pace-workshop filters). Emails are NEVER included in the
 * doGet output — the endpoint is public.
 */

var FOLDER_NAME = 'workshop-submissions';

function doPost(e) {
  var data = JSON.parse(e.postData.contents);

  var links = [];
  var images = data.images || [];
  if (images.length) {
    var folder = getFolder_();
    images.forEach(function (img) {
      var stamp = Utilities.formatDate(new Date(), 'GMT', 'yyyyMMdd-HHmmss');
      var name = stamp + ' ' + (data.email || 'unknown') + ' ' + (img.name || 'screenshot.jpg');
      var blob = Utilities.newBlob(Utilities.base64Decode(img.data), img.type || 'image/jpeg', name);
      var file = folder.createFile(blob);
      links.push(file.getUrl());
    });
  }

  var answers = data.answers || {};
  var answerText = Object.keys(answers).map(function (k) {
    return k + ': ' + answers[k];
  }).join('\n');

  SpreadsheetApp.getActiveSpreadsheet().getSheets()[0].appendRow([
    new Date(),
    data.email || '',
    data.page || '',
    data.exercise || '',
    answerText,
    links.join('\n'),
    JSON.stringify(answers)
  ]);

  return ContentService.createTextOutput('ok');
}

function doGet(e) {
  var rows = SpreadsheetApp.getActiveSpreadsheet().getSheets()[0].getDataRange().getValues();
  var want = (e.parameter && e.parameter.exercise) || '';
  var out = [];
  rows.forEach(function (r) {
    // columns: 0 timestamp, 1 email, 2 page, 3 exercise, 4 text, 5 links, 6 json
    if (!r[0] || !r[6]) return;
    if (want && r[3] !== want) return;
    var answers = {};
    try { answers = JSON.parse(r[6]); } catch (err) { return; }
    out.push({ t: String(r[0]), exercise: r[3], answers: answers });
  });
  return ContentService.createTextOutput(JSON.stringify(out))
    .setMimeType(ContentService.MimeType.JSON);
}

function getFolder_() {
  var it = DriveApp.getFoldersByName(FOLDER_NAME);
  return it.hasNext() ? it.next() : DriveApp.createFolder(FOLDER_NAME);
}
