from .scrapable import Scrapable

class CovidTelanganaCom(Scrapable):
  hospital = 'https://covidtelangana.com/data/covidtelangana.com/bed_data.json'
  plasma = 'https://covidtelangana.com/data/covidtelangana.com/plasma_data.json'

  # column_map = {
  #   'hospital_name': '1',
  #   'last_updated_date': '2',
  #   'last_updated_time': '3',
  #   'total_beds_with_oxygen': '4',
  #   'area': '5',
  #   'available_beds_with_oxygen': '6',
  #   'district': '7',
  #   'pincode': '8',
  #   'total_icu_beds_without_ventilator': '9',
  #   'hospital_address': '10',
  #   'hospital_phone': '11',
  #   'total_beds_without_oxygen': '12',
  #   'available_icu_beds_without_ventilator': '13',
  #   'last_updated_on': '14',
  #   'total_icu_beds_with_ventilator': '15',
  #   'available_icu_beds_with_ventilator': '16',
  #   'available_beds_without_oxygen': '17'
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
  data = CovidTelanganaCom()
  print('Columns', data.dataframe().columns)
