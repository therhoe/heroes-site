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
 * Each submission appends a row: timestamp, email, page, exercise,
 * answers (one per line), and Drive links to any uploaded screenshots.
 * Screenshots land in a Drive folder named "workshop-submissions".
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
    links.join('\n')
  ]);

  return ContentService.createTextOutput('ok');
}

function getFolder_() {
  var it = DriveApp.getFoldersByName(FOLDER_NAME);
  return it.hasNext() ? it.next() : DriveApp.createFolder(FOLDER_NAME);
}
