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
