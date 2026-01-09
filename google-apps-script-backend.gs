
/**
 * EMTCT Track Pro - Apps Script Backend
 * 
 * Instructions:
 * 1. Create a Google Sheet with tabs: "Users", "Infants", "Facilities", "Districts", "AuditLogs".
 * 2. Paste this code into Extensions > Apps Script.
 * 3. Deploy as a Web App (Access: Anyone with Google Account).
 */

function doGet(e) {
  return HtmlService.createHtmlOutputFromFile('index')
    .setTitle('EMTCT Track Pro')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL)
    .addMetaTag('viewport', 'width=device-width, initial-scale=1');
}

/**
 * Validates the user's role and retrieves their scope.
 */
function getUserProfile() {
  const email = Session.getActiveUser().getEmail();
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const userSheet = ss.getSheetByName("Users");
  const data = userSheet.getDataRange().getValues();
  
  for (let i = 1; i < data.length; i++) {
    if (data[i][0] === email && data[i][5] === "Active") {
      return {
        email: data[i][0],
        name: data[i][1],
        role: data[i][2],
        facility: data[i][3],
        district: data[i][4],
        status: data[i][5]
      };
    }
  }
  return null; // Not found or inactive
}

/**
 * Scoped data retrieval for Infants.
 */
function getInfants() {
  const user = getUserProfile();
  if (!user) throw new Error("Unauthorized");
  
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const infantSheet = ss.getSheetByName("Infants");
  const data = infantSheet.getDataRange().getValues();
  const headers = data[0];
  
  const filtered = [];
  for (let i = 1; i < data.length; i++) {
    const row = data[i];
    const infant = {};
    headers.forEach((h, index) => infant[h] = row[index]);
    
    // Apply Role-Based Filtering
    if (user.role === "System Admin") {
      filtered.push(infant);
    } else if (user.role === "District EMTCT Focal Point" && infant.district === user.district) {
      filtered.push(infant);
    } else if (user.role === "Facility EMTCT Focal Point" && infant.facility === user.facility) {
      filtered.push(infant);
    }
  }
  return filtered;
}

/**
 * Updates a specific infant record with audit logging.
 */
function updateInfantRecord(infantId, updates) {
  const user = getUserProfile();
  if (!user) throw new Error("Unauthorized");
  
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName("Infants");
  const data = sheet.getDataRange().getValues();
  const headers = data[0];
  
  let rowIdx = -1;
  for (let i = 1; i < data.length; i++) {
    if (data[i][0] === infantId) {
      rowIdx = i + 1;
      // Scope Check
      if (user.role === "Facility EMTCT Focal Point" && data[i][4] !== user.facility) throw new Error("Access Denied");
      if (user.role === "District EMTCT Focal Point" && data[i][5] !== user.district) throw new Error("Access Denied");
      break;
    }
  }
  
  if (rowIdx === -1) throw new Error("Record not found");
  
  // Apply updates and log
  const auditSheet = ss.getSheetByName("AuditLogs");
  for (let key in updates) {
    const colIdx = headers.indexOf(key) + 1;
    if (colIdx > 0) {
      const oldValue = sheet.getRange(rowIdx, colIdx).getValue();
      sheet.getRange(rowIdx, colIdx).setValue(updates[key]);
      
      auditSheet.appendRow([
        new Date(),
        user.email,
        infantId,
        key,
        oldValue,
        updates[key]
      ]);
    }
  }
  return true;
}
