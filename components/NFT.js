import React, { useEffect, useState } from "react";
import { formatIpfsUrl, formatPrice, ipfs2http } from "../util";
import { config } from "../config";
import { useAppContext } from "../context/state";
import { FiX } from "react-icons/fi";

const Trait = (attribute) => {
  return (
    <div className="flex flex-col justify-start w-full mb-4 p-2">
      <div className="flex justify-between w-full text-xs mb-2">
        <span className="text-gray-500">
          {attribute?.trait_type.toUpperCase()}{" "}
        </span>
        <span className="text-red-500 font-bold">
          +{attribute.rarity_score?.toFixed(2)}
        </span>
      </div>
      <div className="flex justify-between w-full text-xs text-gray-700">
        <span>{attribute.value ? attribute.value : "-"} </span>
        {/* <span>{attribute.percentile} | </span> */}
        <span className="font-bold">{attribute.count}</span>
      </div>
    </div>
  );
};

export const NFT = (nft) => {
  const { state: nfts, dispatch } = useAppContext();
  const [showModal, setShowModal] = useState(false);
  const [isRejected, setIsRejected] = useState(false);
  const img_url = formatIpfsUrl(nft.image);

  return (
    <>
      <div
        className="text-left w-24
        cursor-pointer rounded-md shadow-xs
        mr-3 mb-3 sm:mr-4 text-center"
      >
        <div onClick={() => setShowModal(true)}>
          <img
            src={formatIpfsUrl(nft.image)}
            className="rounded-md h-auto bg-black"
          />
          <a
            className="rounded-b-md mt-1 hover:underline"
            // href={`/${config.STARTING_INDEX == 1 ? nft.id + 1 : nft.id}`}
          >
            <h3 className="text-xs text-gray-600 mt-1 mb-1">
              #{config.STARTING_INDEX == 1 ? nft.id + 1 : nft.id}
            </h3>
          </a>
        </div>

        <button
          className={`text-sm  ${
            nfts && nfts[nft.id]?.isRejected ? "bg-red-500" : "bg-green-500"
          } py-2 w-full text-white rounded-md`}
          onClick={() => {
            dispatch({ type: "REJECT_NFT", id: nft.id });
            setIsRejected(!isRejected);
          }}
        >
          {nfts ? (nfts[nft.id]?.isRejected ? "Rejected" : "Reject") : ""}
        </button>
      </div>
      {showModal && (
        <div
          style={{ backgroundColor: "rgba(0, 0, 0, 0.75)" }}
          className="fixed inset-0 flex items-center justify-center z-50"
        >
          <div
            onClick={() => setShowModal(false)}
            className="fixed flex justify-center items-center right-0 top-0 bg-red w-24 h-24 text-white hover:opacity-40"
          >
            <FiX className="w-12 h-12" />
          </div>
          <div className="bg-white rounded-md w-1/2 h-max p-4 flex gap-4">
            {/* right */}
            <div className="relative rounded-md">
              <img className="rounded-md h-96" src={img_url} />
              <span
                className="absolute top-5 left-5
              text-white px-2 py-2 font-medium text-xs rounded-md bg-yellow-100 text-yellow-600"
              >
                #{nft.rarity_rank + 1}
              </span>
              <div className="py-4 px-2 w-full rounded-md text-lg text-center mt-4 bg-yellow-100 text-yellow-500">
                ♦️ {nft.rarity_score.toFixed(2)}
              </div>
              <button
                className={`text-lg ${
                  nfts && nfts[nft.id]?.isRejected
                    ? "bg-red-500"
                    : "bg-green-500"
                } py-4 mt-4 w-full text-white rounded-md`}
                onClick={() => {
                  dispatch({ type: "REJECT_NFT", id: nft.id });
                  setIsRejected(!isRejected);
                }}
              >
                {nfts && nfts[nft.id]?.isRejected ? "Rejected" : "Reject"}
              </button>
            </div>
            {/* left */}
            <div className="w-7/12">
              {nft?.attributes?.map((attribute, idx) => (
                <Trait key={idx} {...attribute} />
              ))}
              {/* <h2 className="px-2 text-xl mb-2 font-bold text-gray-800">Missing Traits</h2> */}
              {nft?.missing_traits?.map((attribute, idx) => (
                <Trait key={idx * 100} {...attribute} />
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
};
