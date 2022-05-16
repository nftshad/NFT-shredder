import Head from "next/head";
import React, { createRef, useState } from "react";
import { NextSeo } from "next-seo";
import { NFT } from "../components/NFT";
import { SideBar } from "../components/SideBar";
import { PageNumbers } from "../components/PageNumbers";
import Navbar from "../components/Navbar";
import { TraitFilters } from "../components/TraitFilters";
import { Footer } from "../components/Footer";
import { config } from "../config";
import { getFilters, getNFTs } from "../util/requests";
import { useAppContext } from "../context/state";
import { downloadNFTJSON } from "../util";
import { FiDownload } from "react-icons/fi";

function Home({ title, img, description, nfts, pages, filters, query }) {
  const ref = createRef(null);
  const [showMenu, setShowMenu] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const { all_traits, attr_count } = filters;
  const { state, dispatch } = useAppContext();
  const { nfts: nftJSON } = state;

  return (
    <div
      className="flex flex-col items-center justify-center 
    min-h-screen bg-gradient-to-r from-rose-50 to-rose-100 h-full"
      ref={ref}
    >
      <Head>
        <title>{title}</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <NextSeo
        title={title}
        openGraph={{
          images: [
            {
              url: img,
            },
          ],
        }}
        twitter={{
          image: img,
          cardType: "summary_large_image",
        }}
        description={description}
      />
      <Navbar
        title={title}
        menu={true}
        setShowMenu={setShowMenu}
        showMenu={showMenu}
      />
      <main className="relative flex justify-center w-full flex-1 h-screen">
        <SideBar
          all_traits={all_traits}
          attr_count={attr_count}
          showMenu={showMenu}
          setShowMenu={setShowMenu}
        />
        <div className="flex flex-col w-full w-5xl px-10">
          {showMenu}
          <div className="max-w8xl flex justify-end mt-6 mr-4">
            <span className="text-sm justify-center items-center flex mr-4 text-gray-400">
              Rejected:{" "}
              {nftJSON && nftJSON.filter((nft) => nft.isRejected).length}/
              {nftJSON.length}
            </span>
            <button
              className="flex justify-center items-center text-sm text-white bg-blue-400 hover:bg-blue-500 p-4 rounded-md"
              onClick={() => {
                setIsDownloading(true);
                downloadNFTJSON(nftJSON, setIsDownloading);
              }}
            >
              <FiDownload className="inline mr-1" />
              <span>{isDownloading ? "Downloading..." : "Download"}</span>
            </button>
          </div>
          <TraitFilters />

          <div className="flex flex-wrap justify-between sm:justify-start max-w-9xl w-full">
            {query.sort_by == "rejected" &&
              nftJSON
                .filter((nft) => nft.isRejected)
                .map(
                  (nft, idx) => nft && <NFT {...nft} index={idx} key={idx} />
                )}

            {query.sort_by == "accepted" &&
              nftJSON
                .filter((nft) => !nft.isRejected)
                .map(
                  (nft, idx) => nft && <NFT {...nft} index={idx} key={idx} />
                )}

            {query.sort_by !== "rejected" &&
              query.sort_by !== "accepted" &&
              nfts.map(
                (nft, idx) => nft && <NFT {...nft} index={idx} key={idx} />
              )}
          </div>
          {query.sort_by !== "rejected" && query.sort_by !== "accepted" && (
            <PageNumbers pages={pages} />
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}

Home.getInitialProps = async ({ query }) => {
  let { nfts = [], pages } = await getNFTs(query);
  console.log(query);
  let filters = await getFilters(query);
  return {
    title: config.COLLECTION_TITLE,
    description: config.COLLECTION_DESCRIPTION,
    img: config.COLLECTION_IMG_LINK,
    nfts,
    pages,
    filters,
    query,
  };
};

export default Home;
