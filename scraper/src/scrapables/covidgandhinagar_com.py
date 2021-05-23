from .scrapable import Scrapable

class CovidGandhiNagarCom(Scrapable):
  hospital = 'https://covidgandhinagar.com/data/covidgandhinagar.com/bed_data.json'
  plasma = 'https://covidgandhinagar.com/data/covidgandhinagar.com/plasma_data.json'

  # column_map = {
  #   'hospital_address': '1',
  #   'charges': '2',
  #   'hospital_poc_name': '3',
  #   'hospital_name': '4',
  #   'total_icu_beds_with_ventilator': '5',
  #   'total_beds_with_oxygen': '6',
  #   'district': '7',
  #   'hospital_poc_designation': '8',
  #   'pincode': '9',
  #   'last_updated_on': '10',
  #   'available_icu_beds_with_ventilator': '11',
  #   'area': '12',
  #   'available_beds_without_oxygen': '13',
  #   'total_icu_beds_without_ventilator': '14',
  #   'total_beds_allocated_to_covid': '15',
  #   'hospital_poc_phone': '16',
  #   'available_icu_beds_without_ventilator': '17',
  #   'available_beds_with_oxygen': '18',
  #   'total_beds_without_oxygen': '19'
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
  data = CovidGandhiNagarCom()
  print('Columns', data.dataframe().columns)
