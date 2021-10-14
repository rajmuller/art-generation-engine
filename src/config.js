"use strict";

const path = require("path");
const isLocal = typeof process.pkg === "undefined";
const basePath = isLocal ? process.cwd() : path.dirname(process.execPath);
const { MODE } = require(path.join(basePath, "src/blendMode.js"));

const description = "Price test of 600";

// Rarity is weighted, make a folder summ 1000 then it is percentage based 10 = 1%
const layerConfigurations = [
  {
    growEditionSizeTo: 700,
    layersOrder: [
      { name: "Background" },
      { name: "Eyeball" },
      { name: "Eye color" },
      { name: "Iris" },
      { name: "Shine" },
      { name: "Bottom lid" },
      { name: "Top lid" },
    ],
  },
  {
    growEditionSizeTo: 850,
    race: "Zombie",
    layersOrder: [
      { name: "Background" },
      { name: "Eyeball" },
      { name: "Eye color" },
      { name: "Iris" },
      { name: "Shine" },
      { name: "Top lid" },
    ],
  },
  {
    growEditionSizeTo: 1000,
    race: "Zombie",
    layersOrder: [
      { name: "Background" },
      { name: "Eyeball" },
      // { name: "Eye color" },
      { name: "Iris" },
      { name: "Shine" },
      { name: "Bottom lid" },
      { name: "Top lid" },
    ],
  },
];

// If multiple edition then true else it is in order ie: parrots then hawks
const shuffleLayerConfigurations = false;

const debugLogs = false;

const format = {
  width: 512,
  height: 512,
};

const background = {
  generate: false,
  brightness: "80%",
};

const extraMetadata = {
  symbol: "TSTP",
  seller_fee_basis_points: 270, // 250 = 2.5% royalty
  collection: {
    name: "Price Test Collection",
    family: "Price Test Collection",
  },
  properties: {
    files: [
      {
        uri: "image.png",
        type: "image/png",
      },
    ],
    category: "image",
    creators: [
      {
        address: "HxJgA9nfJirrWEeghDVSjsgymphBaxwzWJF4AoP7Yqtq", // receive payments here
        share: 100,
      },
    ],
  },
};

const rarityDelimiter = "#";

const uniqueDnaTolerance = 50000;

const preview = {
  thumbPerRow: 5,
  thumbWidth: 50,
  imageRatio: format.width / format.height,
  imageName: "preview.png",
};

module.exports = {
  format,
  // baseUri,
  description,
  background,
  uniqueDnaTolerance,
  layerConfigurations,
  // layerSubsetAttributes,
  rarityDelimiter,
  preview,
  shuffleLayerConfigurations,
  debugLogs,
  extraMetadata,
};
