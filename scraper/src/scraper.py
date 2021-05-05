from scrapables.covidamd_com import CovidAmdCom
from scrapables.covidaps_com import CovidApsCom
from scrapables.covidbaroda_com import CovidBarodaCom
from scrapables.covidbedthane_in import CovidBedThaneIn
from scrapables.covidbeed_com import CovidBeedCom
from scrapables.covidbengaluru_com import CovidBengaluruCom
from scrapables.coviddelhi_com import CovidDelhiCom
from scrapables.covidgandhinagar_com import CovidGandhiNagarCom
from scrapables.covidmp_com import CovidMPCom
from scrapables.covidnashik_com import CovidNashikCom
from scrapables.covidpune_com import CovidPuneCom
from scrapables.covidtelangana_com import CovidTelanganaCom
from scrapables.covidtnadu_com import CovidTNaduCom
from scrapables.covidwb_com import CovidWBCom

scrapables = [
  CovidAmdCom,
  CovidApsCom,
  CovidBarodaCom,
  CovidBedThaneIn,
  CovidBeedCom,
  CovidBengaluruCom,
  CovidDelhiCom,
  CovidGandhiNagarCom,
  CovidMPCom,
  CovidNashikCom,
  CovidPuneCom,
  CovidTelanganaCom,
  CovidTNaduCom,
  CovidWBCom
]

import pandas as pd
df = pd.DataFrame()
#print([sorted(list(map(int,x().dataframe().columns))) for x in scrapables])
df.append(
  [x().dataframe() for x in scrapables],
  ignore_index = True
).to_csv('../../data/hospital-ext.csv')
