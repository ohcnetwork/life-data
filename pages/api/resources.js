import { parametreize } from "../../lib/utils";
import { findResource } from "/lib/api";
import NextCors from 'nextjs-cors';

const handler = async (req, res) => {
  await NextCors(req, res, {
     methods: ['GET'],
     origin: '*',
     optionsSuccessStatus: 200,
  });

  let { state, district, resource, epoch } = req.query;

  resource = parametreize(resource)

  if (state && district && resource) {
    switch (resource) {
      case "oxygen":
      case "medicine":
      case "ambulance":
      case "helpline":
      case "hospital":
      case "food":
        res.status(200).json({ data: findResource(state, district, resource).filter(withEpoch(epoch)) });
        break;
      default:
        res
          .status(405)
          .json({ error: "Unable to find resource with key: " + resource });
    }
  } else {
    res
      .status(405)
      .json({ error: "Please make sure that the state, district and resource are present and valid" });
  }
}

const withEpoch = (epoch) => {
  return record => {
    const verified_date = new Date(record.last_verified_on);
    const epoch_date = new Date();
    epoch_date.setDate(epoch_date.getDate() - epoch);
  
    console.log(epoch, epoch_date)
    return !(epoch_date >= verified_date);
  }
}

export default handler;
