import { parametreize } from "../../lib/utils";
import { findResource } from "/lib/api";
import NextCors from 'nextjs-cors';

const handler = async (req, res) => {
  await NextCors(req, res, {
     methods: ['GET'],
     origin: '*',
     optionsSuccessStatus: 200,
  });

  let { state, district, resource } = req.query;

  resource = parametreize(resource)

  if (state && district && resource) {
    switch (resource) {
      case "oxygen":
      case "medicine":
      case "ambulance":
      case "helpline":
      case "hospital":
        res.status(200).json({ data: findResource(state, district, resource) });
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

export default handler;
