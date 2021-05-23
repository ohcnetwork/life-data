from .scrapable import Scrapable

class CovidDelhiCom(Scrapable):
  hospital = 'https://coviddelhi.com/data/coviddelhi.com/bed_data.json'
  plasma = 'https://coviddelhi.com/data/coviddelhi.com/plasma_data.json'

  # column_map = {
  #   'available_beds_allocated_to_covid': '1',
  #   'hospital_name': '2',
  #   'hospital_poc_phone': '3',
  #   'bed_breakup': '4',
  #   'area': '5',
  #   'fee_regulated_beds': '6',
  #   'hospital_category': '7',
  #   'hospital_phone': '8',
  #   'officer_name': '9',
  #   'last_updated_on': '10',
  #   'district': '11',
  #   'hospital_poc_designation': '12',
  #   'officer_designation': '13',
  #   'total_beds_allocated_to_covid': '14',
  #   'pincode': '15',
  #   'hospital_poc_name': '16',
  #   'hospital_address': '17',
  #   'charges': '18'
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
  data = CovidDelhiCom()
  print('Columns', data.dataframe().columns)
