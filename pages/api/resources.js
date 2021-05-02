import { findResource } from "/lib/api";

export default (req, res) => {
  const { state, district, resource } = req.query;
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
