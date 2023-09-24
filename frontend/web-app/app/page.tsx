import { get } from "http";
import Listing from "./auctions/Listings";

export default async function Home() {
  return (
    <div>
      <Listing></Listing>
    </div>
  );
}
