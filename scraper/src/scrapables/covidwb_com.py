from .scrapable import Scrapable

class CovidWBCom(Scrapable):
  hospital = 'https://covidwb.com/data/covidwb.com/bed_data.json'
  plasma = 'https://covidwb.com/data/covidwb.com/plasma_data.json'

  # column_map = {
  #   'available_beds_with_oxygen': '1',
  #   'total_beds_without_oxygen': '2',
  #   'available_beds_without_oxygen': '3',
  #   'total_beds_allocated_to_covid': '4',
  #   'available_icu_beds_without_ventilator': '5',
  #   'last_updated_on': '6',
  #   'district': '7',
  #   'available_icu_beds_with_ventilator': '8',
  #   'hospital_address': '9',
  #   'hospital_phone': '10',
  #   'pincode': '11',
  #   'hospital_name': '12',
  #   'total_icu_beds_with_ventilator': '13',
  #   'total_icu_beds_without_ventilator': '14',
  #   'total_beds_with_oxygen': '15',
  #   'area': '16'
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
  data = CovidWBCom()
  print('Columns', data.dataframe().columns)
