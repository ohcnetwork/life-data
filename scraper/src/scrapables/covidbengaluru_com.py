from .scrapable import Scrapable

class CovidBengaluruCom(Scrapable):
  hospital = 'https://covidbengaluru.com/data/covidbengaluru.com/bed_data.json'
  plasma = 'https://covidbengaluru.com/data/covidbengaluru.com/plasma_data.json'

  # column_map = {
  #   'available_icu_beds_without_ventilator': '1',
  #   '__delete__': '2',
  #   'total_icu_beds_without_ventilator': '3',
  #   'available_beds_without_oxygen': '4',
  #   'last_updated_on': '5',
  #   'available_icu_beds_with_ventilator': '6',
  #   'hospital_phone': '7',
  #   'pincode': '8',
  #   'hospital_name': '9',
  #   'hospital_address': '10',
  #   'total_beds_without_oxygen': '11',
  #   'total_icu_beds_with_ventilator': '12',
  #   'Notes': '13',
  #   'available_beds_with_oxygen': '14',
  #   'district': '15',
  #   'bed_breakup': '16',
  #   'total_beds_allocated_to_covid': '17',
  #   'total_beds_with_oxygen': '18',
  #   'area': '19',
  #   'available_beds_allocated_to_covid': '20'
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
  data = CovidBengaluruCom()
  print('Columns', data.dataframe().columns)
