const { fetchApiData } = require("./Function");
const redis = require("redis");

let redisClient;

(async () => {
  redisClient = redis.createClient();

  redisClient.on("error", (error) => console.error(`Error : ${error}`));

  await redisClient.connect();
})();

exports.Intro = (req, res) => {
  return res.status(200).json({ message: "Welcome to Redis Sample API" });
};

exports.getSpeciesData = async (req, res) => {
  const species = req.params.species;
  let results;
  let isCached = false;
  console.log("mencari data .....", species);
  try {
    const cacheResults = await redisClient.get(species);
    if (cacheResults) {
      isCached = true;
      results = JSON.parse(cacheResults);
    } else {
      results = await fetchApiData(species);
      if (results.length === 0) {
        throw res.status(400).json({ message: "API returned an empty array" });
      }
      await redisClient.set(species, JSON.stringify(results));
    }

    let dataToSHOW = results.replaceAll("\n", "");
    return res.status(200).json({
      fromCache: isCached,
      data: dataToSHOW,
    });
  } catch (error) {
    console.error(error);
    return res.status(404).send("Data unavailable");
  }
};
