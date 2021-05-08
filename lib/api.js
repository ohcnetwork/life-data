import ambulancesObjects from "/data/ambulance_v2.json";
import oxygenObjects from "/data/oxygen_v2.json";
import medicineObjects from "/data/medicine_v2.json";
import hospitalObjects from "/data/hospital_v2.json";
import helplineObjects from "/data/helpline_v2.json";
import foodObjects from "/data/food_v2.json";

import { activeDistricts, shuffle, parametreize } from "./utils";

class get {
  constructor(object, type) {
    this.object = object;
    this.type = type;
  }

  from(state, district, isSortingRequired) {
    let obs = this.object["data"].filter(
      (p) =>
        parametreize(p.state) == parametreize(state)
        && parametreize(p.district) == parametreize(district)
    );
    if (isSortingRequired) {
      obs = this.sortByVerified(obs);
    }
    obs = obs.map((e) => ({ ...e, resourceType: this.type }));
    return shuffle(obs);
  }
}

export function getAmbulances() {
  return ambulancesObjects;
}

export function getOxygen() {
  return oxygenObjects;
}

export function getMedicines() {
  return medicineObjects;
}

export function getFood() {
  return foodObjects;
}

export function hospitalByDistrict(state, district, isSortingRequired) {
  return new get(hospitalObjects, "Hospital").from(
    state,
    district,
    isSortingRequired
  );
}

export function medicineByDistrict(state, district, isSortingRequired) {
  return new get(medicineObjects, "Medicine").from(
    state,
    district,
    isSortingRequired
  );
}

export function oxygenByDistrict(state, district, isSortingRequired) {
  return new get(oxygenObjects, "Oxygen").from(
    state,
    district,
    isSortingRequired
  );
}

export function ambulanceByDistrict(state, district, isSortingRequired) {
  return new get(ambulancesObjects, "Ambulance").from(
    state,
    district,
    isSortingRequired
  );
}

export function helplineByDistrict(state, district, isSortingRequired) {
  return new get(helplineObjects, "Helpline").from(
    state,
    district,
    isSortingRequired
  );
}

export function foodByDistrict(state, district, isSortingRequired) {
  return new get(helplineObjects, "Food").from(
    state,
    district,
    isSortingRequired
  );
}

export function statesAndDistrict() {
  return stateObjects;
}

export const districtWithState = (page = "all") => activeDistricts(page);

export function getDistricts(state) {
  return activeDistricts("all").filter((f) => parametreize(f.state) == state);
}

export const findResource = (state, district, resource) => {
  switch (resource) {
    case "oxygen":
      return oxygenByDistrict(state, district, false);
    case "medicine":
      return medicineByDistrict(state, district, false);
    case "helpline":
      return helplineByDistrict(state, district, false);
    case "hospital":
      return hospitalByDistrict(state, district, false);
    case "ambulance":
      return ambulanceByDistrict(state, district, false);
    case "food":
      return foodByDistrict(state, district, false);
  }
};
