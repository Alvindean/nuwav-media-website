/**
 * Sell-your-data funnel -> Google Sheet.
 *
 * Paste this into Extensions > Apps Script on the "Replay Referrals" sheet and
 * deploy it as a web app (see README.md next to this file).
 *
 * Each submission:
 *   1. fills columns A:G of the "Deals" tab (the columns the referrer owns),
 *      leaving Status and everything after it for Replay to manage;
 *   2. logs all 10 answers plus tracking info to a "Funnel Responses" tab,
 *      which is created on the first submission.
 */

var DEALS_SHEET = 'Deals';
var RESPONSES_SHEET = 'Funnel Responses';

var RESPONSE_COLUMNS = [
  ['submittedAt', 'Submitted At'],
  ['companyName', 'Company Name'],
  ['contactName', 'Contact Name'],
  ['email', 'Contact Email'],
  ['industry', 'Industry'],
  ['peakFte', 'Peak FTE'],
  ['yearFounded', 'Year Founded'],
  ['dataSources', 'Data Sources'],
  ['companyStatus', 'Company Status'],
  ['dataHistory', 'Years of Data Available'],
  ['role', 'Role'],
  ['utmSource', 'UTM Source'],
  ['utmMedium', 'UTM Medium'],
  ['utmCampaign', 'UTM Campaign'],
  ['ref', 'Ref'],
  ['referrer', 'Referrer'],
  ['pageUrl', 'Page URL'],
];

function doPost(e) {
  var lock = LockService.getScriptLock();
  lock.waitLock(20000);
  try {
    var data = JSON.parse(e.postData.contents);
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    appendDeal_(ss, data);
    appendResponse_(ss, data);
    return json_({ ok: true });
  } catch (err) {
    console.error(err);
    return json_({ ok: false, error: String(err) });
  } finally {
    lock.releaseLock();
  }
}

// Quick check in a browser: opening the web-app URL should say "ok".
function doGet() {
  return ContentService.createTextOutput('ok');
}

function appendDeal_(ss, d) {
  var sheet = ss.getSheetByName(DEALS_SHEET);
  if (!sheet) throw new Error('Missing tab: ' + DEALS_SHEET);

  var year = Number(d.yearFounded);
  var years = year ? new Date().getFullYear() - year : '';
  var row = [
    d.companyName,
    d.contactName,
    d.email,
    d.industry,
    d.peakFte ? d.peakFte + ' employees' : '',
    year ? years + ' years (' + year + ')' : '',
    d.dataSources,
  ].map(clean_);

  // Write to the first empty row in column A so formulas further right
  // (Days Open, etc.) don't push new leads to the bottom of the sheet.
  var colA = sheet.getRange('A:A').getValues();
  var last = colA.length - 1;
  while (last > 0 && String(colA[last][0]).trim() === '') last--;
  var target = last + 2; // row after the last filled one (row 1 is the header)
  sheet.getRange(target, 1, 1, row.length).setValues([row]);
}

function appendResponse_(ss, d) {
  var sheet = ss.getSheetByName(RESPONSES_SHEET);
  if (!sheet) {
    sheet = ss.insertSheet(RESPONSES_SHEET);
    sheet.appendRow(RESPONSE_COLUMNS.map(function (c) { return c[1]; }));
    sheet.setFrozenRows(1);
    sheet.getRange(1, 1, 1, RESPONSE_COLUMNS.length).setFontWeight('bold');
  }
  sheet.appendRow(RESPONSE_COLUMNS.map(function (c) { return clean_(d[c[0]]); }));
}

// Plain text only, and stop values like "=IMPORTXML(...)" running as formulas.
function clean_(value) {
  var s = value == null ? '' : String(value).slice(0, 1000);
  return /^[=+\-@]/.test(s) ? "'" + s : s;
}

function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}
