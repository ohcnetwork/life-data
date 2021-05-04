const sheetId = "1R3af0Fq9lsjUA631zafb3ggjpZKEWVPCcetH5NJNzE4";
const sheetName = "master";
const mealLocationMap = {
    "Andhra Pradesh": "Andhra Pradesh",
    "Assam": "Assam",
    "Bihar": "Bihar",
    "Chandigarh": "Chandigarh (UT)",
    "Chhattisgarh": "Chhattisgarh",
    "Delhi NCR": "Delhi (NCT)",
    "Goa": "Goa",
    "Gujarat": "Gujarat",
    "Haryana": "Haryana",
    "Himachal Pradesh": "Himachal Pradesh",
    "Jammu and Kashmir": "Jammu & Kashmir (UT)",
    "Jharkhand": "Jharkhand",
    "Karnataka": "Karnataka",
    "Kerala": "Kerala",
    "Ladakh": "Ladakh (UT)",
    "Madhya Pradesh": "Madhya Pradesh",
    "Maharashtra": "Maharashtra",
    "Manipur": "Manipur",
    "Mizoram": "Mizoram",
    "Odisha": "Odisha",
    "Puducherry": "Puducherry (UT)",
    "Punjab": "Punjab",
    "Rajasthan": "Rajasthan",
    "Tamil Nadu": "Tamil Nadu",
    "Telangana": "Telangana",
    "Tripura": "Tripura",
    "Uttarakhand": "Uttarakhand",
    "Uttar Pradesh": "Uttar Pradesh",
    "West Bengal": "West Bengal"
}
var pincodeToDistrict = {};
var restaurantBaseURL = "https://api.covidmealsforindia.com/user";

function fetchDistrictFromPincode(pincode) {
    if (pincodeToDistrict[pincode]) {
        return pincodeToDistrict[pincode];
    }

    var pincodeAPIUrl = `http://www.postalpincode.in/api/pincode/${pincode}`;
    var response = UrlFetchApp.fetch(pincodeAPIUrl, {
        contentType: "application/json",
    });
    if (response.getResponseCode() == 200) {
        const data = JSON.parse(response.getContentText())
        if (data["PostOffice"]) {
            var district = data["PostOffice"][0]["District"];
            pincodeToDistrict[pincode] = district;
            return district;
        }
    }
}

function fetchMealData() {
    var locationFilterUrl = `${restaurantBaseURL}/location_filter`;
    var response = UrlFetchApp.fetch(locationFilterUrl, {
        contentType: "application/json",
    });
    var locations = [];
    if (response.getResponseCode() == 200) {
        const data = JSON.parse(response.getContentText())
        locations = data.data;
    }

    var mealData = [];

    const getRestaurantsByLocation = (location, page = 1) => {
        var query = `${restaurantBaseURL}/restaurants?page_no=${page}&search_query=&location_filter=${location}&charity_only=false`;
        const response = UrlFetchApp.fetch(query, {
            contentType: "application/json",
        });

        if (response.getResponseCode() == 200) {
            const data = JSON.parse(response.getContentText())

            const parseRestaurants = (restaurants) => {
                parsedRestaurants = [];
                for (var restaurant of restaurants) {
                    var parsedRestaurant = {
                        title: restaurant['restaurant_name'],
                        resource_type: "Food",
                        state: mealLocationMap[location],
                        city: restaurant['tmp_location']['city'],
                        phone_1: restaurant['phone_numbers'][0] || "",
                        phone_2: restaurant['phone_numbers'][1] || "",
                        verification_status: restaurant['verification_status'],
                        created_on: restaurant['createdAt'],
                        description: restaurant['description'],
                        address: restaurant['tmp_location']['address_complete'],
                        pin_code: restaurant['tmp_location']['zip_code'],
                        district: restaurant['tmp_location']['zip_code'] !== null ? fetchDistrictFromPincode(restaurant['tmp_location']['zip_code']) : "",
                        source_link: "https://covidmealsforindia.com"
                    }
                    parsedRestaurants.push(parsedRestaurant);
                }
                return parsedRestaurants;
            }

            var meals = parseRestaurants(data.data.restaurants);

            if (data.data.next_page) {
                // console.log("Page " + page)
                return meals.concat(getRestaurantsByLocation(location, page + 1));
            } else {
                return meals;
            }
        }
    }

    for (var location of locations) {
        console.log(location);
        mealData = mealData.concat(getRestaurantsByLocation(location));
        // break; // fetching only one location for now. please comment to fetch all
    }

    return mealData;
}

function insertDataIntoSheet() {
    var ss = SpreadsheetApp.openById(sheetId);
    var sheet = ss.getSheetByName(sheetName);

    var districtSheet = ss.getSheetByName('districts');
    var districtValues = districtSheet.getDataRange().getValues();
    var districts = [];
    for (n = 0; n < districtValues.length; ++n) {
        districts.push(districtValues[n][0]);
    }

    var mealData = fetchMealData();
    // console.log(mealData.length);

    for (var mealIndex in mealData) {
        var meal = mealData[mealIndex];

        var client_verification_status = meal['verification_status'];
        var ver_status = client_verification_status == '' ? 'Pending' : client_verification_status == 'VERIFIED' ? 'Available and verified' : 'Pending';
        sheet.getRange(`B${mealIndex + 2}`).setValue(meal['title']);
        //Adding new line for setting column B to Food
        sheet.getRange(`C${mealIndex + 2}`).setValue("Food");
        sheet.getRange(`D${mealIndex + 2}`).setValue(meal['resource_type']);
        sheet.getRange(`E${mealIndex + 2}`).setValue(meal['district'] ? districts.filter(s => s.toLowerCase().includes(meal['district'].toLowerCase()))[0] : "");
        sheet.getRange(`F${mealIndex + 2}`).setValue(meal['state']);
        sheet.getRange(`G${mealIndex + 2}`).setValue(meal['pin_code']);
        sheet.getRange(`H${mealIndex + 2}`).setValue(meal['phone_1']);
        sheet.getRange(`I${mealIndex + 2}`).setValue(meal['phone_2']);
        sheet.getRange(`M${mealIndex + 2}`).setValue(ver_status);
        sheet.getRange(`Q${mealIndex + 2}`).setValue(meal['created_on']);
        sheet.getRange(`R${mealIndex + 2}`).setValue(meal['address']);
        sheet.getRange(`S${mealIndex + 2}`).setValue(meal['description']);
        sheet.getRange(`U${mealIndex + 2}`).setValue(meal['source_link']);
    }
}
