from .scrapable import Scrapable

class CovidAmdCom(Scrapable):
  hospital = 'https://covidamd.com/data/covidamd.com/bed_data.json'
  plasma = 'https://covidamd.com/data/covidamd.com/plasma_data.json'

  column_map = {
    'total_beds_with_oxygen': '1',
    'amc_available_beds_with_oxygen': '2',
    'hospital_address': '3',
    'amc_available_beds_without_oxygen': '4',
    'private_occupied_beds_with_oxygen': '5',
    'available_icu_beds_without_ventilator': '6',
    'amc_occupied_beds_with_oxygen': '7',
    'area': '8',
    'amc_available_icu_beds_with_ventilator': '9',
    'total_beds_without_oxygen': '10',
    'hospital_phone': '11',
    'private_occupied_icu_beds_without_ventilator': '12',
    'pincode': '13',
    'available_icu_beds_with_ventilator': '14',
    'available_beds_with_oxygen': '15',
    'total_icu_beds_with_ventilator': '16',
    'hospital_name': '17',
    'private_available_beds_with_oxygen': '18',
    'district': '19',
    'amc_occupied_icu_beds_with_ventilator': '20',
    'amc_occupied_icu_beds_without_ventilator': '21',
    'private_occupied_beds_without_oxygen': '22',
    'private_available_icu_beds_without_ventilator': '23',
    'amc_occupied_beds_without_oxygen': '24',
    'private_available_icu_beds_with_ventilator': '25',
    'amc_available_icu_beds_without_ventilator': '26',
    'available_beds_without_oxygen': '27',
    'private_available_beds_without_oxygen': '28',
    'total_icu_beds_without_ventilator': '29',
    'private_occupied_icu_beds_with_ventilator': '30'
  }
  def get_json(self):
    import requests
    response = requests.get(self.hospital)
    keys = set([key for x in response.json() for key in x.keys()])
    data = { col: list() for col in keys }
    for record in response.json():
      for key in keys:
        if key not in record.keys():
          record[key]=None
        data[key].append(record[key])
    return data


if __name__=='__main__':
  data = CovidAmdCom()
  print('Columns', data.dataframe().columns)
