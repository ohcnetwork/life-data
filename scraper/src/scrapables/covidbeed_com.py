from .scrapable import Scrapable

class CovidBeedCom(Scrapable):
  hospital = 'https://covidbeed.com/data/covidbeed.com/bed_data.json'
  plasma = 'https://covidbeed.com/data/covidbeed.com/plasma_data.json'

  # column_map = {
  #   'total_beds_without_oxygen': '1',
  #   'state': '2',
  #   'hospital_address': '3',
  #   'total_icu_beds_with_ventilator': '4',
  #   'total_beds_allocated_to_covid': '5',
  #   'fee_regulated_beds': '6',
  #   'hospital_poc_email': '7',
  #   'available_icu_beds_with_ventilator': '8',
  #   'hospital_name': '9',
  #   'pincode': '10',
  #   'charges': '11',
  #   'area': '12',
  #   'hospital_poc_designation': '13',
  #   'district': '14',
  #   'hospital_poc_name': '15',
  #   'hospital_category': '16',
  #   'available_beds_with_oxygen': '17',
  #   'hospital_poc_phone': '18',
  #   'available_icu_beds_without_ventilator': '19',
  #   'last_updated_on': '20',
  #   'available_beds_without_oxygen': '21',
  #   'facility_id': '22',
  #   'total_icu_beds_without_ventilator': '23',
  #   'total_beds_with_oxygen': '24'
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
  data = CovidBeedCom()
  print('Columns', data.dataframe().columns)
