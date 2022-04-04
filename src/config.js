"use strict";

const path = require("path");
const isLocal = typeof process.pkg === "undefined";
const basePath = isLocal ? process.cwd() : path.dirname(process.execPath);

const description = "Deus ex Sol deities";
const baseUri = "asdasd";

const layerConfigurations = [
  {
    growEditionSizeTo: 10,
    layersOrder: [
      { name: "Dye" },
      { name: "Background" },
      { name: "Cape" },
      { name: "Body" },
      { name: "Arm" },
      { name: "Eye" },
      { name: "Head" },
      { name: "Shoulder" },
      { name: "Chest" },
      { name: "Weapon" },
      { name: "Beak" },
      { name: "Face" },
    ],
  },
  // {
  //   growEditionSizeTo: 850,
  //   race: "Zombie",
  //   layersOrder: [
  //     { name: "Background" },
  //     { name: "Eyeball" },
  //     { name: "Eye color" },
  //     { name: "Iris" },
  //     { name: "Shine" },
  //     { name: "Top lid" },
  //   ],
  // },
  // {
  //   growEditionSizeTo: 1000,
  //   race: "Zombie",
  //   layersOrder: [
  //     { name: "Background" },
  //     { name: "Eyeball" },
  //     // { name: "Eye color" },
  //     { name: "Iris" },
  //     { name: "Shine" },
  //     { name: "Bottom lid" },
  //     { name: "Top lid" },
  //   ],
  // },
];

// If multiple edition then true else it is in order ie: parrots then hawks
const shuffleLayerConfigurations = false;

const format = {
  width: 500,
  height: 500,
};

const extraMetadata = {
  symbol: "DEP",
  collection: {
    name: "Deus ex Sol",
    family: "Deus ex Sol",
  },
  properties: {
    files: [
      {
        uri: "image.png",
        type: "image/png",
      },
    ],
    category: "image",
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
  baseUri,
  description,
  uniqueDnaTolerance,
  layerConfigurations,
  rarityDelimiter,
  preview,
  shuffleLayerConfigurations,
  extraMetadata,
};
