export const parametreize = (string) => {
  return string.replace(/\s/gu, "_").toLowerCase();
};

export const humanize = (str) => {
  return str
    .replace(/^[\s_]+|[\s_]+$/g, "")
    .replace(/[_\s]+/g, " ")
    .replace(/^[a-z]/, function (m) {
      return m.toUpperCase();
    });
};

export const activeDistricts = (page = "all") => {
  if (page === "all") return activeDistrictData.data;
  return activeDistrictData.data.filter((data) => data[page]);
};

export const activeStates = (activeDistricts) =>
  activeDistricts.reduce(
    (acc, curr) => (acc.includes(curr.state) ? acc : [...acc, curr.state]),
    []
  );

export const shuffle = (array) => {
  var currentIndex = array.length,
    temporaryValue,
    randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {
    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
};
