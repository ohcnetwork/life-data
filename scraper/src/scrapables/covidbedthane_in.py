from .scrapable import Scrapable

class CovidBedThaneIn(Scrapable):
  hospital = 'https://covidbaroda.com/data/covidbaroda.com/bed_data.json'
  plasma = 'https://covidbaroda.com/data/covidbaroda.com/plasma_data.json'

  # column_map = {
  #   'available_beds_without_oxygen': '1',
  #   'hospital_name': '2',
  #   'total_icu_beds_without_ventilator': '3',
  #   'hospital_address': '4',
  #   'total_icu_beds_with_ventilator': '5',
  #   'available_beds_with_oxygen': '6',
  #   'hospital_poc_name': '7',
  #   'available_icu_beds_with_ventilator': '8',
  #   'district': '9',
  #   'charges': '10',
  #   'area': '11',
  #   'hospital_poc_designation': '12',
  #   'hospital_poc_phone': '13',
  #   'total_beds_with_oxygen': '14',
  #   'available_icu_beds_without_ventilator': '15',
  #   'total_beds_without_oxygen': '16',
  #   'pincode': '17',
  #   'total_beds_allocated_to_covid': '18',
  #   'hospital_phone': '19'
  # }
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
  data = CovidBedThaneIn()
  print('Columns', data.dataframe().columns)
