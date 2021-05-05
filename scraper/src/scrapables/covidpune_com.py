from .scrapable import Scrapable

class CovidPuneCom(Scrapable):
  hospital = 'https://covidpune.com/data/covidpune.com/bed_data.json'
  plasma = 'https://covidpune.com/data/covidpune.com/plasma_data.json'

  column_map = {
    'total_beds_allocated_to_covid': '1',
    'total_icu_beds_with_ventilator': '2',
    'district': '3',
    'hospital_category': '4',
    'officer_name': '5',
    'hospital_address': '6',
    'area': '7',
    'officer_designation': '8',
    'available_icu_beds_with_ventilator': '9',
    'hospital_name': '10',
    'charges': '11',
    'available_beds_without_oxygen': '12',
    'last_updated_on': '13',
    'pincode': '14',
    'hospital_phone': '15',
    'available_beds_with_oxygen': '16',
    'available_icu_beds_without_ventilator': '17',
    'fee_regulated_beds': '18',
    'total_beds_without_oxygen': '19',
    'total_icu_beds_without_ventilator': '20',
    'total_beds_with_oxygen': '21'
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
  data = CovidPuneCom()
  print('Columns', data.dataframe().columns)
