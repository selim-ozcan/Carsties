"use client";

import { HubConnection, HubConnectionBuilder } from "@microsoft/signalr";
import React, { ReactNode, useEffect, useState } from "react";
import { useAuctionStore } from "../hooks/useAuctionStore";
import { useBidStore } from "../hooks/useBidStore";
import { Auction, AuctionFinished, Bid } from "@/types";
import { User } from "next-auth";
import toast from "react-hot-toast";
import AuctionCreatedToast from "../components/AuctionCreatedToast";
import { getDetailedViewData } from "../actions/auctionActions";
import AuctionFinishedToast from "../components/AuctionFinishedToast";

type Props = {
  children: ReactNode;
  user: User | null;
};

export default function SignalRProvider({ children, user }: Props) {
  const [connection, setConnection] = useState<HubConnection | null>(null);
  const setCurrentPrice = useAuctionStore((state) => state.setCurrentPrice);
  const addBid = useBidStore((state) => state.addBid);
  const apiUrl =
    process.env.NODE_ENV === "production"
      ? "https://api.carsties.com/notifications"
      : process.env.NEXT_PUBLIC_NOTIFY_URL;

  useEffect(() => {
    console.log(apiUrl);
    const newConnection = new HubConnectionBuilder()
      .withUrl(apiUrl!)
      .withAutomaticReconnect()
      .build();

    setConnection(newConnection);
  }, [apiUrl]);

  useEffect(() => {
    if (connection) {
      connection
        .start()
        .then(() => {
          console.log("Connected to the notification hub");

          connection.on("BidPlaced", (bid: Bid) => {
            console.log("Bid Placed event received");
            if (bid.bidStatus.includes("Accepted")) {
              setCurrentPrice(bid.auctionId, bid.amount);
            }
            addBid(bid);
          });

          connection.on("AuctionCreated", (auction: Auction) => {
            if (user?.username !== auction.seller)
              return toast(<AuctionCreatedToast auction={auction} />, {
                duration: 5000,
              });
          });

          connection.on(
            "AuctionFinished",
            (finishedAuction: AuctionFinished) => {
              const auction = getDetailedViewData(finishedAuction.auctionId);
              return toast.promise(
                auction,
                {
                  loading: "loading",
                  success: (auction) => (
                    <AuctionFinishedToast
                      auction={auction}
                      finishedAuction={finishedAuction}
                    />
                  ),
                  error: (err) => "Auction Finished",
                },
                { success: { duration: 5000, icon: null } }
              );
            }
          );
        })
        .catch((error) => console.log(error));
    }

    return () => {
      connection?.stop();
    };
  }, [connection, setCurrentPrice, addBid, user?.username]);

  return children;
}
