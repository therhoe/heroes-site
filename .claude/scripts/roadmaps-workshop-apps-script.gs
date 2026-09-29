/**
 * Expert review & roadmaps workshop submissions — Apps Script web app.
 *
 * Separate deployment from the other workshop sessions on purpose
 * (Shep's call, 2026-09-15; this session added 2026-09-28): its own sheet,
 * its own Drive folder, its own /exec URL.
 *
 * ONE TAB PER EXERCISE (2026-09-29): each kind of submission (pdp-review,
 * pace-review, pace-feedback, ...) gets its own tab, created the first time
 * one arrives, with one column per answer. New answer keys become new
 * columns at the right, so workshop changes never need a script change.
 *
 * Setup (one time):
 * 1. Create a Google Sheet named "rhoe-roadmaps-workshop-submissions".
 * 2. In that sheet: Extensions → Apps Script, paste this whole file in.
 * 3. Deploy → New deployment → Web app:
 *      - Execute as: Me
 *      - Who has access: Anyone
 * 4. Copy the /exec URL into ROADMAPS_ENDPOINT at the top of
 *    workshop/workshop.js.
 *
 * Updating the code later: paste it in, then Deploy → Manage deployments →
 * (pencil) Edit → Version: New version → Deploy. That keeps the SAME /exec
 * URL, so workshop.js doesn't change. ("New deployment" makes a new URL.)
 *
 * Each tab's columns: timestamp, email, page, screenshots, then one per
 * answer key in the order the site sends them.
 *
 * doGet returns submissions as JSON (?exercise=pace-review reads just that
 * tab). Emails are NEVER included in the doGet output — the endpoint is
 * public. Rows written by the older one-tab version of this script (answers
 * as JSON in column G, no header) are still read.
 */

var FOLDER_NAME = 'roadmaps-workshop-submissions';
var FIXED = ['timestamp', 'email', 'page', 'screenshots'];

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
  var keys = Object.keys(answers);

  // two people sending at once must not both add the same new column
  var lock = LockService.getScriptLock();
  lock.waitLock(20000);
  try {
    var sheet = tabFor_(data.exercise);
    var header = headerOf_(sheet);

    var missing = keys.filter(function (k) { return header.indexOf(k) === -1; });
    if (missing.length) {
      sheet.getRange(1, header.length + 1, 1, missing.length).setValues([missing]);
      header = header.concat(missing);
    }

    var row = header.map(function (col) {
      if (col === 'timestamp') return new Date();
      if (col === 'email') return safe_(data.email || '');
      if (col === 'page') return safe_(data.page || '');
      if (col === 'screenshots') return links.join('\n');
      return answers.hasOwnProperty(col) ? safe_(answers[col]) : '';
    });
    sheet.appendRow(row);
  } finally {
    lock.releaseLock();
  }

  return ContentService.createTextOutput('ok');
}

function doGet(e) {
  var want = (e.parameter && e.parameter.exercise) || '';
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheets = want ? [ss.getSheetByName(tabName_(want))].filter(Boolean) : ss.getSheets();
  var out = [];

  sheets.forEach(function (sheet) {
    var rows = sheet.getDataRange().getValues();
    if (!rows.length) return;

    if (rows[0][0] === 'timestamp') {
      // one tab per exercise: answers are every non-fixed column
      var header = rows[0];
      rows.slice(1).forEach(function (r) {
        if (!r[0]) return;
        var answers = {};
        header.forEach(function (col, i) {
          if (FIXED.indexOf(col) !== -1 || r[i] === '' || r[i] === null) return;
          answers[col] = String(r[i]);
        });
        out.push({ t: String(r[0]), exercise: sheet.getName(), answers: answers });
      });
    } else {
      // older one-tab rows: 0 timestamp, 1 email, 2 page, 3 exercise, 4 text, 5 links, 6 json
      rows.forEach(function (r) {
        if (!r[0] || !r[6]) return;
        if (want && r[3] !== want) return;
        var answers = {};
        try { answers = JSON.parse(r[6]); } catch (err) { return; }
        out.push({ t: String(r[0]), exercise: r[3], answers: answers });
      });
    }
  });

  return ContentService.createTextOutput(JSON.stringify(out))
    .setMimeType(ContentService.MimeType.JSON);
}

// the tab for an exercise, created with its header row the first time
function tabFor_(exercise) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var name = tabName_(exercise);
  var sheet = ss.getSheetByName(name);
  if (!sheet) {
    sheet = ss.insertSheet(name);
    sheet.getRange(1, 1, 1, FIXED.length).setValues([FIXED]);
    sheet.setFrozenRows(1);
    sheet.getRange('1:1').setFontWeight('bold');
  }
  return sheet;
}

function headerOf_(sheet) {
  var width = sheet.getLastColumn();
  if (!width) {
    sheet.getRange(1, 1, 1, FIXED.length).setValues([FIXED]);
    return FIXED.slice();
  }
  return sheet.getRange(1, 1, 1, width).getValues()[0].map(String);
}

// tab names can't contain some characters and max out at 100
function tabName_(exercise) {
  return String(exercise || 'other').replace(/[\[\]\*\?\/\\:]/g, '-').slice(0, 100);
}

// typed answers that start like a formula (=, +, -, @) stay plain text
function safe_(v) {
  var s = String(v);
  return /^[=+\-@]/.test(s) ? "'" + s : s;
}

function getFolder_() {
  var it = DriveApp.getFoldersByName(FOLDER_NAME);
  return it.hasNext() ? it.next() : DriveApp.createFolder(FOLDER_NAME);
}
