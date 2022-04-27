// src/context/state.js
import { createContext, useContext, useReducer, useEffect } from "react";

const AppContext = createContext();
const nfts = require("../data/collection.json");
const initalState = nfts;

nfts.map((nft) => (nft["isRejected"] = false));

const rejectNFT = (id, state) => {
  state[id]["isRejected"] = !state[id]["isRejected"];
  window.localStorage.setItem("nfts", JSON.stringify(state));
  return state;
};

function reducer(state, action) {
  switch (action.type) {
    case "REJECT_NFT":
      return rejectNFT(action.id, state);
    case "INIT":
      return action.value;
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
