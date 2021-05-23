from .scrapable import Scrapable

class CovidMPCom(Scrapable):
  hospital = 'https://covidmp.com/data/covidmp.com/bed_data.json'
  plasma = 'https://covidmp.com/data/covidmp.com/plasma_data.json'

  # column_map = {
  #   'hospital_category': '1',
  #   'district': '2',
  #   'total_icu_beds_without_ventilator': '3',
  #   'available_icu_beds_with_ventilator': '4',
  #   'total_icu_beds_with_ventilator': '5',
  #   'hospital_name': '6',
  #   'last_updated_on': '7',
  #   'total_beds_without_oxygen': '8',
  #   'available_beds_without_oxygen': '9',
  #   'hospital_phone': '9',
  #   'available_beds_with_oxygen': '10',
  #   'available_icu_beds_without_ventilator': '11',
  #   'hospital_address': '12',
  #   'hospital_poc_phone': '13',
  #   'area': '14',
  #   'pincode': '15',
  #   'total_beds_with_oxygen': '16',
  #   'hospital_poc_name': '17'
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
  data = CovidMPCom()
  print('Columns', data.dataframe().columns)
