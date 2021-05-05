from .scrapable import Scrapable

class CovidBarodaCom(Scrapable):
  hospital = 'https://covidbaroda.com/data/covidbaroda.com/bed_data.json'
  plasma = 'https://covidbaroda.com/data/covidbaroda.com/plasma_data.json'

  column_map = {
    'area': '1',
    'total_beds_with_oxygen': '2',
    'total_icu_beds_with_ventilator': '3',
    'hospital_poc_name': '4',
    'hospital_address': '5',
    'total_beds_without_oxygen': '6',
    'available_beds_without_oxygen': '7',
    'total_icu_beds_without_ventilator': '8',
    'hospital_phone': '9',
    'available_icu_beds_without_ventilator':'10',
    'hospital_poc_phone':'11',
    'pincode':'12',
    'available_beds_with_oxygen':'13',
    'charges':'14',
    'district':'15',
    'available_icu_beds_with_ventilator':'16',
    'hospital_poc_designation':'17',
    'hospital_name':'18',
    'total_beds_allocated_to_covid':'19'
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
  data = CovidBarodaCom()
  print('Columns', data.dataframe().columns)
