> Archived as we no longer have a need for the unified database. The code base could be re-used to create a nation wide database of resources with a unified schema at a time of need. 

# Life Data Transformation Pipeline

## Special API

```
endpoint: https://life-pipeline.coronasafe.network/api/resources?state=state_name&district&district_name&resource=resource_type&epoch=number
params:
  - state: state_name
  - district: district_name
  - resource: oxygen | medicine | hospital | helpline | ambulance | food
  - (optional) epoch: number (verified in last n days)
```

### Example

Try: https://life-pipeline.coronasafe.network/api/resources?resource=oxygen&state=maharashtra&district=thane
