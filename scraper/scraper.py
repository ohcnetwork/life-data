import requests
import os
import json

STATES_WITH_DISTRICTS = requests.get(
    "https://life-api.coronasafe.network/data/states.json").json()
STATES = STATES_WITH_DISTRICTS.keys()

root_dir = "data"


def get_records(url):
    records = requests.get(url).json()
    return records


def parameterize(word: str) -> str:
    return word.replace(" ", "_").lower().strip()



def get_district_data(data):
    memozied = {
        state: {
            district: [] for district in STATES_WITH_DISTRICTS[state]
        }
        for state in STATES
    }
    for record in data:
        state = record.get("state", "")
        district = record.get("district", "")
        if (state in memozied) and (district in memozied[state]):
            memozied[state][district] += [record]
    return memozied


def dump_seperate_data(url, fileName):
    data = get_records(url)
    district_data = get_district_data(data["data"])
    for state, districts in district_data.items():
        state_data = []
        for district, data in districts.items():
            state_data.extend(data)
            # Dump District Level Data Eg: /kerala/ernakulam/ambulance.json
            dump_data(
                f"{parameterize(state)}/{parameterize(district)}/{fileName}", data)

        # Dump State Level Data Eg: /kerala/ambulance.json
        dump_data(
            f"{parameterize(state)}/{fileName}", state_data)
        print(f"Completed Dumping {state}'s {fileName} data")


def create_directories():
    for state, districts in STATES_WITH_DISTRICTS.items():
        state = parameterize(state)
        state_path = f"{root_dir}/{state}"
        if not os.path.exists(state_path):
            os.makedirs(state_path)

        for district in districts:
            district = parameterize(district)
            district_path = f"{root_dir}/{state}/{district}"
            if not os.path.exists(district_path):
                os.makedirs(district_path)
    print("Directories Created")


def dump_data(filename, data):
    # Wrapping the list of items with a container
    data = {
        "data": data
    }
    with open(f"{root_dir}/{filename}", "w") as json_file:
        json_file.write(json.dumps(data, sort_keys=True))


if __name__ == "__main__":
    print("Hope you are running this file at root level", end=" ")
    print("with python .\scraper\src\scraper.py")

    # Creates all the state/district directories
    create_directories()

    # Data Endpoints that are to be dumped according to state/district
    datas_to_be_dumped = [
        {
            "url": "https://life-api.coronasafe.network/data/ambulance.json",
            "fileName": "ambulance.json"
        },
        {
            "url": "https://life-api.coronasafe.network/data/oxygen.json",
            "fileName": "oxygen.json"
        },
        {
            "url": "https://life-api.coronasafe.network/data/helpline.json",
            "fileName": "helpline.json"
        },
        {
            "url": "https://life-api.coronasafe.network/data/hospital_clinic_centre.json",
            "fileName": "hospital_clinic_centre.json"
        },
        {
            "url": "https://life-api.coronasafe.network/data/medicine.json",
            "fileName": "medicine.json"
        },
        {
            "url": "https://life-api.coronasafe.network/data/oxygen.json",
            "fileName": "oxygen.json"
        }
    ]

    # Dumps all from the given endpoints
    for endpoint in datas_to_be_dumped:
        url, fileName = endpoint.get("url"), endpoint.get("fileName")
        dump_seperate_data(url, fileName)
        print(
            f"Completed Dumping {fileName} data for all states and districts")
