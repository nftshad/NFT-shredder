import Head from "next/head";
import React, { createRef, useState } from "react";
import { NextSeo } from "next-seo";
import { useRouter } from "next/router";
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

function Home({ title, img, description, nfts, pages, filters }) {
  const router = useRouter();
  const ref = createRef(null);
  const [showMenu, setShowMenu] = useState(false);
  const { all_traits, attr_count } = filters;
  const { nfts: nftJSON } = useAppContext();

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
        <div className="flex flex-col w-full w-5xl px-4">
          {showMenu}
          <div className="max-w-5xl flex justify-end mt-4">
            <button
              className="flex justify-center items-center text-sm text-white bg-blue-200 hover:bg-blue-400 p-4 rounded-md"
              onClick={() => {
                downloadNFTJSON(nftJSON);
              }}
            >
              <FiDownload className="inline mr-1" />
              <span>Download</span>
            </button>
          </div>
          <TraitFilters />
          <div className="flex flex-wrap justify-between sm:justify-start max-w-5xl w-full">
            {nfts.map(
              (nft, idx) => nft && <NFT {...nft} index={idx} key={idx} />
            )}
          </div>
          <PageNumbers pages={pages} />
        </div>
      </main>
      <Footer />
    </div>
  );
}

Home.getInitialProps = async ({ query }) => {
  let { nfts = [], pages } = await getNFTs(query);
  let filters = await getFilters(query);
  return {
    title: config.COLLECTION_TITLE,
    description: config.COLLECTION_DESCRIPTION,
    img: config.COLLECTION_IMG_LINK,
    nfts,
    pages,
    filters,
  };
};

export default Home;
