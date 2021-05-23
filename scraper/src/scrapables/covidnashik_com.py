from .scrapable import Scrapable

class CovidNashikCom(Scrapable):
  hospital = 'https://covidnashik.com/data/covidnashik.com/bed_data.json'
  plasma = 'https://covidnashik.com/data/covidnashik.com/plasma_data.json'

  # column_map = {
  #   'hospital_name': '1',
  #   'hospital_phone': '2',
  #   'available_beds_with_oxygen': '3',
  #   'available_beds_without_oxygen': '4',
  #   'total_icu_beds_without_ventilator': '5',
  #   'total_icu_beds_with_ventilator': '6',
  #   'area': '7',
  #   'hospital_address': '8',
  #   'available_icu_beds_with_ventilator': '9',
  #   'available_icu_beds_without_ventilator': '10',
  #   'total_beds_with_oxygen': '11',
  #   'officer_designation': '12',
  #   'last_updated_on': '13',
  #   'officer_name': '14',
  #   'total_beds_allocated_to_covid': '15',
  #   'total_beds_without_oxygen': '16',
  #   'hospital_category': '17'
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
  data = CovidNashikCom()
  print('Columns', data.dataframe().columns)
