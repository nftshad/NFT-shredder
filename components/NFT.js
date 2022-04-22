import React, { useEffect, useState } from "react";
import { formatIpfsUrl, ipfs2http } from "../util";
import { config } from "../config";
import { useAppContext } from "../context/state";

export const NFT = (nft) => {
  const { nfts, rejectNFT } = useAppContext();
  const [isRejected, setIsRejected] = useState(false);

  useEffect(() => {
    setIsRejected(nfts[nft.id]?.isRejected);
  }, []);

  return (
    <>
      <div
        className="text-left w-24
        cursor-pointer rounded-md shadow-xs
        mr-3 mb-3 sm:mr-4 text-center"
      >
        <img
          src={formatIpfsUrl(nft.image)}
          className="rounded-md h-auto bg-black"
        />
        <a
          className="rounded-b-md px-1 hover:underline"
          href={`/${config.STARTING_INDEX == 1 ? nft.id + 1 : nft.id}`}
        >
          <h3 className="text-xs text-gray-600">
            #{config.STARTING_INDEX == 1 ? nft.id + 1 : nft.id}
          </h3>
        </a>
        <button
          className="text-sm bg-red-300 hover:bg-red-400 py-2 w-full text-white rounded-md"
          onClick={() => {
            rejectNFT(nft.id);
            setIsRejected(!isRejected);
          }}
        >
          {isRejected ? "Rejected" : "Reject"}
        </button>
      </div>
    </>
  );
};
