import JSZip from "jszip";
import { config } from "../config";
import { saveAs } from "file-saver";

let basePath =
  config.env == "local"
    ? `http://${config.LOCAL_API_URL}`
    : `https://${config.API_URL}`;

export const getDesc = (nft) => {
  let desc;
  desc = `
  🔷ID: ${config.STARTING_INDEX == 1 ? nft.id + 1 : nft.id}
  
  🔷Rarity score: ${nft.rarity_score.toFixed(2)}
  
  🔷Rarity rank: ${nft.rarity_rank + 1}
  
  ${
    nft.current_price !== "-"
      ? `🔷Price: Ξ${formatPrice(nft.current_price)}`
      : ""
  }
  `;
  return desc;
};

export const ipfs2http = (ipfs_url) => {
  if (ipfs_url) {
    let url = new URL(ipfs_url);
    return `${url.host}${url.pathname}`;
  } else {
    return "";
  }
};

export const formatIpfsUrl = (image_url) => {
  if (image_url) {
    const img_url = new URL(
      image_url.includes("http") || image_url.includes("ipfs")
        ? image_url
        : `${basePath}${image_url}`
    );
    if (img_url.protocol.includes("http")) {
      return img_url;
    } else if (img_url.protocol.includes("ipfs")) {
      return `https://ipfs.io/ipfs/${ipfs2http(image_url)}`;
    }
  }
};

export const fetcher = (url) => fetch(url).then((r) => r.json());

export const json2query = (json) => {
  return Object.keys(json)
    .map((key) => key + "=" + json[key])
    .join("&");
};

export const formatPrice = (price) => {
  // wei = 10^18
  if (price !== "-") return (price / 10 ** 18).toFixed(2);
  else return "-";
};

// for download button on index.js
export const downloadNFTJSON = async (nfts, cb) => {
  const unrejectedNFTs = nfts.filter((nft) => nft.isRejected === false);
  const zip = new JSZip();
  const imageszip = zip.folder("images");
  const imagesJSON = zip.folder("json");
  const promises = unrejectedNFTs.map(async (nft, index) => {
    const url = new URL(`${basePath}/${nft.image}`);
    const img = await fetch(url);
    const blob = await img.blob();
    nft.id = index;
    nft.name = `Series 2 #${nft.id}`;
    nft.image = `/images/${nft.id}.png`;
    imageszip.file(`${index}.png`, blob, { base64: true });
    imagesJSON.file(`${index}.json`, JSON.stringify(nft, null, 2));
  });
  Promise.all(promises).then(() => {
    cb(false);
    console.log("done");
    zip.generateAsync({ type: "blob" }).then(function (content) {
      console.log("downloading");
      saveAs(content, "collection.zip");
    });
  });
};
