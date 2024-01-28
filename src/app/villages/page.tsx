"use client";

import OnchainConfig from "@/configs/onchain";
import VillageContractABI from "@/contracts/Village.json";
import { TVillage } from "@/types/onchain";
import { useEffect, useState } from "react";
import { useContractRead } from "wagmi";

export default function Home() {
  const { data: villages } = useContractRead({
    address: OnchainConfig.contracts.village,
    abi: VillageContractABI.abi,
    functionName: "tokenURIs",
    args: [[1, 2]],
    enabled: true,
  });

  const [villageNftMetadata, setVillageNftMetadata] = useState<TVillage[]>();

  useEffect(() => {
    villages &&
      setVillageNftMetadata(
        villages.map((data) => JSON.parse(atob(data.substring(29))))
      );
  }, [villages]);

  return (
    <main
      style={{
        display: "flex",
        maxWidth: "1000px",
        gap: "3rem",
        justifyContent: "center",
        margin: "0 auto",
        flexWrap: "wrap",
      }}
    >
      {villageNftMetadata &&
        villageNftMetadata.map((villageMetadata) => (
          <div>
            <img
              style={{
                borderRadius: "42px",
                boxShadow:
                  "rgba(50, 50, 93, 0.25) 0px 50px 100px -20px, rgba(0, 0, 0, 0.3) 0px 30px 60px -30px",
              }}
              src={villageMetadata.image}
            ></img>
          </div>
        ))}
    </main>
  );
}
