//Script that can be used for fetching latitude langitude of address data.
//This script needs to be run as an App Script inside Google Sheets as it is heavily dependant on the specific columns.
//Plz pay attention to the comments.

//Replace the API_KEY with correct value
var YOUR_API_KEY = "";

//Replace the sheetId and column indices with correct value
const sheetId = "1aoTSpY4KrKmDNuPN1Wg5uk15b94QXAT5XgBGtxdentc";
const sheetName = "master";
const addressIndex = 17;
const titleIndex = 1;
const districtIndex = 4;
const stateIndex = 5;
const pincodeIndex = 6;
const latIndex = 22;
const lngIndex = 23;
const latCharIndex = 'W';
const lngCharIndex = 'X';

function fetchCoordinates(address) {
  var serviceUrl = "https://maps.googleapis.com/maps/api/geocode/json?address=" + encodeURI(address) + "&key=" + YOUR_API_KEY;

  var response = UrlFetchApp.fetch(serviceUrl, {
    contentType: "application/json",
  });
  if (response.getResponseCode() == 200) {
    const data = JSON.parse(response.getContentText())
    if (data.results && data.results.length > 0) {
      const location = data.results[0].geometry.location;
      console.log(location);
      return [location.lat, location.lng];
    }
  }
}

function useDataRange() {
  var ss = SpreadsheetApp.openById(sheetId);
  var sheet = ss.getSheetByName(sheetName);
  var rows = sheet.getDataRange().getValues();
  
  for (var rowIndex in rows) {
    if (Number(rowIndex) < 2) continue;
    var row = rows[rowIndex - 1];
    var lat = row[latIndex];
    var lng = row[lngIndex];
    var address = row[addressIndex];
    var title = row[titleIndex];
    var district = row[districtIndex];
    var state = row[stateIndex];
    var pincode = row[pincodeIndex];
    //We are further testing the accuracy of data using title/state/district of a resource.
    // if (title && address.indexOf(title) === -1) {
    //   address = `${title} ${address}`;
    // }

    // if (district && address.indexOf(district) === -1) {
    //   address = `${address} ${district}`;
    // }

    // if (state && address.indexOf(state) === -1) {
    //   address = `${address} ${state}`;
    // }

    if (pincode && address.indexOf(pincode) === -1) {
      address = `${address} ${pincode}`;
    }
  
    address = address.replace(/[,.\n"\\]/g, ' ');
    if (lat === '' && lng === '' && address) {
      const location = fetchCoordinates(address);
      if (location) {
        const [latValue, lngValue] = location;
        console.log(address);
        sheet.getRange(`${latCharIndex}${rowIndex}`).setValue(latValue);
        sheet.getRange(`${lngCharIndex}${rowIndex}`).setValue(lngValue);
        console.log(`Updated -> ${latCharIndex}${rowIndex} with ${latValue}`);
        console.log(`Updated -> ${lngCharIndex}${rowIndex} with ${lngValue}`);
      }
    }
  }
}
