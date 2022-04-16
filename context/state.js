// src/context/state.js
import { createContext, useContext } from "react";
const AppContext = createContext();
const nfts = require("../data/collection.json");

nfts.map((nft) => (nft["isRejected"] = false));

const rejectNFT = (id) => {
  nfts[id]["isRejected"] = true;
};

export function AppWrapper({ children }) {
  let sharedState = { nfts, rejectNFT };

  return (
    <AppContext.Provider value={sharedState}>{children}</AppContext.Provider>
  );
}

export function useAppContext() {
  return useContext(AppContext);
}
