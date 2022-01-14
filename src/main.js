"use strict";

const path = require("path");
const isLocal = typeof process.pkg === "undefined";
const basePath = isLocal ? process.cwd() : path.dirname(process.execPath);
const fs = require("fs");
const sha1 = require(path.join(basePath, "/node_modules/sha1"));
const { createCanvas, loadImage } = require(path.join(
  basePath,
  "/node_modules/canvas"
));
const buildDir = path.join(basePath, "/build");
const layersDir = path.join(basePath, "/layers");
console.log(path.join(basePath, "/src/config.js"));
const {
  format,
  // baseUri,
  description,
  uniqueDnaTolerance,
  layerConfigurations,
  rarityDelimiter,
  shuffleLayerConfigurations,
  extraMetadata,
} = require(path.join(basePath, "/src/config.js"));
const canvas = createCanvas(format.width, format.height);
const ctx = canvas.getContext("2d");
var metadataList = [];
var selectedColor = "";
var attributesList = [];
var dnaList = [];

const buildSetup = () => {
  if (fs.existsSync(buildDir)) {
    fs.rmdirSync(buildDir, { recursive: true });
  }
  fs.mkdirSync(buildDir);
  fs.mkdirSync(path.join(buildDir, "/json"));
  fs.mkdirSync(path.join(buildDir, "/images"));
};

const getWeightNumber = (_str) => {
  // _str = folder name
  var weightNumberMaybeWithExtension = _str.split(rarityDelimiter).pop();
  var weightNumber = Number(weightNumberMaybeWithExtension.replace(".png", ""));
  if (isNaN(weightNumber)) {
    weightNumber = 0;
  }
  return weightNumber;
};

const cleanDna = (_str) => {
  var dna = Number(_str.split(":").shift());
  return dna;
};

const cleanName = (_str) => {
  let nameWithoutExtension = _str.replace(".png", "");
  var nameWithoutWeight = nameWithoutExtension.split(rarityDelimiter).shift();
  return nameWithoutWeight;
};

const getElements = (path) => {
  return fs
    .readdirSync(path)
    .filter((item) => !/(^|\/)\.[^\/\.]/g.test(item))
    .map((i, index) => {
      return {
        id: index,
        name: cleanName(i),
        filename: i,
        path: `${path}${i}`,
        weight: getWeightNumber(i),
      };
    });
};

const layersSetup = (layersOrder) => {
  // layersOrder: [
  //   { name: 'Rarity' },
  //   { name: 'Background' },
  //   { name: 'Shoulder' },
  //   { name: 'Chest' },
  //   { name: 'Weapon' }
  // ]
  const layers = layersOrder.map((layerObj, index) => {
    return {
      id: index,
      name: layerObj.name,
      elements: getElements(`${layersDir}/${layerObj.name}/`),
      blendMode:
        layerObj["blend"] != undefined ? layerObj["blend"] : "source-over",
      opacity: layerObj["opacity"] != undefined ? layerObj["opacity"] : 1,
    };
  });
  return layers;
};

const saveImage = (_editionCount) => {
  fs.writeFileSync(
    `${buildDir}/images/${_editionCount}.png`,
    canvas.toBuffer("image/png")
  );
};

const getValue = (selectedColor) => {
  switch (selectedColor) {
    case "Common":
      return "Mix";

    case "Rare":
      return "Natural";

    case "Epic":
      return "Hero";

    case "Legendary":
      return "God";
  }
};

const addMetadata = (_dna, _edition) => {
  let dateTime = Date.now();
  let tempMetadata = {
    dna: sha1(_dna.join("")),
    //TODO: name is here
    name: `Deus ex Sol #${_edition + 1}`,
    description: description,
    // image: `${baseUri}/${_edition}.png`,
    image: `image.png`,
    edition: _edition,
    date: dateTime,
    ...extraMetadata,
    attributes: [
      {
        trait_type: "Feather",
        value: getValue(selectedColor),
      },
      ...attributesList,
    ],
  };
  // single metadata file
  metadataList.push(tempMetadata);
  selectedColor = "";
  attributesList = [];
};

const addAttributes = (_element) => {
  // console.log({ _element });
  let selectedElement = _element.layer.selectedElement;
  attributesList.push({
    trait_type: _element.layer.name,
    value: selectedElement.name,
  });
};

const loadLayerImg = async (_layer) => {
  return new Promise(async (resolve) => {
    const image = await loadImage(_layer.selectedElement.path);
    resolve({ layer: _layer, loadedImage: image });
  });
};

const drawElement = (_renderObject) => {
  ctx.globalAlpha = _renderObject.layer.opacity;
  ctx.globalCompositeOperation = _renderObject.layer.blendMode;
  ctx.drawImage(_renderObject.loadedImage, 0, 0, format.width, format.height);
  addAttributes(_renderObject);
};

const constructLayerToDna = (_dna = [], _layersFolders = []) => {
  let mappedDnaToLayers = _layersFolders.map((layer, index) => {
    let selectedElement = layer.elements.find((e) => {
      return e.id == cleanDna(_dna[index]);
    });
    // console.log({selectedElement});
    return {
      name: layer.name,
      blendMode: layer.blendMode,
      opacity: layer.opacity,
      selectedElement: selectedElement,
    };
  });
  return mappedDnaToLayers;
};

const isDnaUnique = (_DnaList = [], _dna = []) => {
  let foundDna = _DnaList.find((i) => i.join("") === _dna.join(""));
  return foundDna == undefined ? true : false;
};

const isLayerIndependent = (layer) => {
  if (
    ["Rarity", "Weapon", "Arm", "Eyes", "Beak", "Background"].includes(
      layer.name
    )
  ) {
    return true;
  }
  return false;
};

const getColorsByRarity = (rarity) => {
  switch (rarity) {
    case "Common":
      return ["Grey", "Green"];

    case "Rare":
      return ["Blue", "Red"];

    case "Epic":
      return ["Purple"];

    case "Legendary":
      return ["Purple"];
  }
};

const getElementsByRarity = (elements, rarity) => {
  return elements.filter((element) =>
    getColorsByRarity(rarity).includes(element.name)
  );
};

const createDna = (_layersFolders) => {
  let randNum = [];
  let rarityColor;
  _layersFolders.forEach((layer) => {
    var totalWeight = 0;
    if (isLayerIndependent(layer)) {
      // console.log({ totalWeight });
      layer.elements.forEach((element) => {
        // console.log({ element });
        // {
        //   id: 0,
        //   name: 'Common',
        //   filename: 'Common#50',
        //   path: '/home/rajfta/web3/hashlips_art_engine/layers/Rarity/Common#50',
        //   weight: 50
        // }
        totalWeight += element.weight;
      });
      // number between 0 - totalWeight
      let random = Math.floor(Math.random() * totalWeight);
      for (var i = 0; i < layer.elements.length; i++) {
        // subtract the current weight from the random weight until we reach a sub zero value.
        random -= layer.elements[i].weight;
        if (random < 0) {
          randNum.push(`${layer.elements[i].id}:${layer.elements[i].filename}`);
          if (layer.name === "Rarity") {
            rarityColor = layer.elements[i].name;
          }
          break;
        }
      }
    } else {
      const relevantElements = getElementsByRarity(layer.elements, rarityColor);
      relevantElements.forEach((element) => {
        totalWeight += element.weight;
      });
      let random = Math.floor(Math.random() * totalWeight);
      for (var i = 0; i < relevantElements.length; i++) {
        // subtract the current weight from the random weight until we reach a sub zero value.
        random -= relevantElements[i].weight;
        if (random < 0) {
          randNum.push(
            `${relevantElements[i].id}:${relevantElements[i].filename}`
          );
          break;
        }
      }
    }
  });
  // { randNum: [ '12:Red-Black-Blue#10', '1:v2#900', '1:b#450' ] }
  return randNum;
};

const writeMetaData = (_data) => {
  fs.writeFileSync(`${buildDir}/json/_metadata.json`, _data);
};

const saveMetaDataSingleFile = (_editionCount) => {
  let metadata = metadataList.find((meta) => meta.edition == _editionCount);
  fs.writeFileSync(
    `${buildDir}/json/${_editionCount}.json`,
    JSON.stringify(metadata, null, 2)
  );
};

function shuffle(array) {
  let currentIndex = array.length,
    randomIndex;
  while (currentIndex != 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex],
      array[currentIndex],
    ];
  }
  return array;
}

const startCreating = async () => {
  let layerBatchIndex = 0;
  let editionCount = 1;
  let failedCount = 0;
  let abstractedIndexes = [];
  for (
    let i = 0;
    i < layerConfigurations[layerConfigurations.length - 1].growEditionSizeTo;
    i++
  ) {
    abstractedIndexes.push(i);
  }

  if (shuffleLayerConfigurations) {
    abstractedIndexes = shuffle(abstractedIndexes);
  }

  // batchek kb
  while (layerBatchIndex < layerConfigurations.length) {
    const layersFolders = layersSetup(
      layerConfigurations[layerBatchIndex].layersOrder
    );
    // Exact PNG generation inside a batch
    while (
      editionCount <= layerConfigurations[layerBatchIndex].growEditionSizeTo
    ) {
      let newDna = createDna(layersFolders);
      if (isDnaUnique(dnaList, newDna)) {
        let results = constructLayerToDna(newDna, layersFolders);
        // console.log({ results });
        selectedColor = results[0].selectedElement.name;
        // console.log({ selectedColor });
        let loadedElements = [];
        results.forEach((layer) => {
          if (layer.name !== "Rarity") {
            loadedElements.push(loadLayerImg(layer));
          }
        });

        await Promise.all(loadedElements).then((renderObjectArray) => {
          ctx.clearRect(0, 0, format.width, format.height);
          renderObjectArray.forEach((renderObject) => {
            drawElement(renderObject);
          });
          saveImage(abstractedIndexes[0]);
          console.log({ newDna });
          addMetadata(newDna, abstractedIndexes[0]);
          saveMetaDataSingleFile(abstractedIndexes[0]);
          console.log(
            `Created edition: ${abstractedIndexes[0]}, with DNA: ${sha1(
              newDna.join("")
            )}`
          );
        });
        dnaList.push(newDna);
        editionCount++;
        abstractedIndexes.shift();
      } else {
        console.log("DNA exists!");
        failedCount++;
        if (failedCount >= uniqueDnaTolerance) {
          console.log(
            `You need more layers or elements to grow your edition to ${layerConfigurations[layerBatchIndex].growEditionSizeTo} artworks!`
          );
          process.exit();
        }
      }
    }
    layerBatchIndex++;
  }
  writeMetaData(JSON.stringify(metadataList, null, 2));
};

module.exports = { startCreating, buildSetup };
