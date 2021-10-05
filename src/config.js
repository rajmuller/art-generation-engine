"use strict";

const path = require("path");
const isLocal = typeof process.pkg === "undefined";
const basePath = isLocal ? process.cwd() : path.dirname(process.execPath);
const { MODE } = require(path.join(basePath, "src/blendMode.js"));

//TODO: change this description
const description = "Test description";
// const baseUri = "image.png";

// Set this if you want to add "album" names to the different layerconfigs' attributes
const layerSubsetAttributes = [
  { key: "Race", values: ["Vampire", "Zombie"] },
  { key: "Drug", values: ["Ketamine", "Lsd"] },
];

// Rarity is weighted, make a folder summ 1000 then it is percentage based 10 = 1%
const layerConfigurations = [
  {
    growEditionSizeTo: 1,
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
    growEditionSizeTo: 2,
    race: "Zombie",
    layersOrder: [
      { name: "Background" },
      { name: "Eyeball" },
      { name: "Eye color" },
      { name: "Iris" },
      { name: "Shine" },
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
  symbol: "TST",
  seller_fee_basis_points: 270, // 250 = 2.5% royalty
  collection: {
    name: "Test Collection Name",
    family: "Test Collection Family",
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
        address: "SOLFLR15asd9d21325bsadythp547912501b", // receive payments here
        share: 100,
      },
    ],
  },
};

const rarityDelimiter = "#";

const uniqueDnaTolerance = 1000;

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
  layerSubsetAttributes,
  rarityDelimiter,
  preview,
  shuffleLayerConfigurations,
  debugLogs,
  extraMetadata,
};
