from .scrapable import Scrapable

class CovidApsCom(Scrapable):
  hospital = 'https://covidaps.com/data/covidaps.com/bed_data.json'
  plasma = 'https://covidaps.com/data/covidaps.com/plasma_data.json'

  column_map = {
    'last_updated_on': '1',
    'available_icu_beds_without_ventilator': '2',
    'total_icu_beds_with_ventilator': '3',
    'total_beds_with_oxygen': '4',
    'area': '5',
    'available_beds_without_oxygen': '6',
    'hospital_address': '7',
    'hospital_phone': '8',
    'available_icu_beds_with_ventilator': '9',
    'total_icu_beds_without_ventilator': '10',
    'pincode': '11',
    'district': '12',
    'hospital_name': '13',
    '__delete__': '14',
    'total_beds_without_oxygen': '15',
    'available_beds_with_oxygen': '16'
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
  data = CovidApsCom()
  print('Columns', data.dataframe().columns)
