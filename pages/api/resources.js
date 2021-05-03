import { parametreize } from "../../lib/utils";
import { findResource } from "/lib/api";

export default (req, res) => {
  let { state, district, resource } = req.query;

  state = parametreize(state);
  district = parametreize(district);
  resource = parametreize(resource);

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
          .status(404)
          .json({ name: "Unable to find resource with key: " + resource });
    }
  } else {
    res
      .status(404)
      .json({ error: "Unable to verify state or district or resource" });
  }
};
