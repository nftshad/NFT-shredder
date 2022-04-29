// src/context/state.js
import { createContext, useContext, useReducer, useEffect } from "react";

const AppContext = createContext();
const nfts = require("../data/collection.json");
const initalState = {
  nfts,
};

nfts.map((nft) => (nft["isRejected"] = false));

const findIndex = (id, nfts) => {
  return nfts.findIndex((node) => node.id == id);
};

const rejectNFT = (id, nfts) => {
  let index = findIndex(id, nfts);
  nfts[index]["isRejected"] = !nfts[index]["isRejected"];
  window.localStorage.setItem("nfts", JSON.stringify(nfts));
  return nfts;
};

function reducer(state, action) {
  switch (action.type) {
    case "REJECT_NFT":
      return { ...state, nfts: rejectNFT(action.id, nfts) };
    case "INIT":
      return { ...state, nfts: action.value };
  }
}

export function AppWrapper({ children }) {
  const [state, dispatch] = useReducer(reducer, initalState);

  useEffect(() => {
    let init = window.localStorage.getItem("nfts") ? true : false;
    if (init)
      dispatch({
        type: "INIT",
        value: JSON.parse(window.localStorage.getItem("nfts")),
      });
  }, []);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  return useContext(AppContext);
}
