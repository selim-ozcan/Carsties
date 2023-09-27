"use client";

import React, { useEffect, useState } from "react";
import AuctionCard from "./AuctionCard";
import AppPagination from "../components/AppPagination";
import { getData } from "../actions/auctionActions";
import Filters from "./Filters";
import { useParamsStore } from "../hooks/useParamsStore";
import { shallow } from "zustand/shallow";
import qs from "query-string";
import EmptyFilter from "../components/EmptyFilter";
import { useAuctionStore } from "../hooks/useAuctionStore";

export default function Listing() {
  const [loading, setLoading] = useState(true);
  const params = useParamsStore(
    (state) => ({
      pageNumber: state.pageNumber,
      pageSize: state.pageSize,
      searchTerm: state.searchTerm,
      pageCount: state.pageCount,
      orderBy: state.orderBy,
      filterBy: state.filterBy,
      seller: state.seller,
      winner: state.winner,
    }),
    shallow
  );

  const data = useAuctionStore((state) => ({
    auctions: state.auctions,
    pageCount: state.pageCount,
    totalCount: state.totalCount,
  }));

  const setData = useAuctionStore((state) => state.setData);

  const setParams = useParamsStore((state) => state.setParams);
  const url = qs.stringifyUrl({ url: "", query: params });

  function setPageNumber(pageNumber: number) {
    setParams({ pageNumber });
  }

  useEffect(() => {
    getData(url).then((data) => {
      setData(data);
      setLoading(false);
    });
  }, [url, setParams, setData]);

  if (loading) return <h3>Loading...</h3>;
  return (
    <>
      <Filters />
      {data.totalCount === 0 ? (
        <EmptyFilter showReset />
      ) : (
        <>
          <div className="grid grid-cols-4 gap-6">
            {params.seller
              ? data.auctions.map((auction) =>
                  auction.seller === params.seller ? (
                    <AuctionCard auction={auction} key={auction.id} />
                  ) : null
                )
              : data.auctions.map((auction) => (
                  <AuctionCard auction={auction} key={auction.id}></AuctionCard>
                ))}
          </div>
          <div className="flex justify-center mt-4">
            <AppPagination
              currentPage={params.pageNumber}
              pageCount={data.pageCount}
              pageChanged={setPageNumber}
            ></AppPagination>
          </div>
        </>
      )}
    </>
  );
}
