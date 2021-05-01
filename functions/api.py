from re import sub as replace
import json, random


def parameterize(word: str) -> str:
    return word.replace(" ", "_").lower().strip()

def send_response(data):
    data = data["data"]
    shuffled_data = random.choices(population=data, weights=[1 for i in data], k=len(data))
    return {
        "data": data
    }

def get_randomized_data(state, district, type):
    if not state:
        return
    state = parameterize(state)
    if district:
        district = parameterize(district)
        with open(f"data/{state}/{district}/{type}.json", "r") as json_file:
            json_data = json.loads(json_file.read())
            return send_response(json_data)
    else:
        with open(f"data/{state}/{type}.json", "r") as json_file:
            json_data = json.loads(json_file.read())
            return send_response(json_data)

if __name__ == "__main__":
    response = get_randomized_data("Tamil Nadu", "Chennai", "Oxygen")
    print(response)
