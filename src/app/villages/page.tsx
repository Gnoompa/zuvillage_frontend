"use client";

import OnchainConfig from "@/configs/onchain";
import VillageContractABI from "@/contracts/Village.json";
import { TVillageMetadata } from "@/types/onchain";
import { useEffect, useState } from "react";
import { useContractRead } from "wagmi";

export default function Home() {
  const { data: villagesTotalSupply } = useContractRead({
    address: OnchainConfig.contracts.village,
    abi: VillageContractABI.abi,
    functionName: "totalSupply",
    enabled: true,
  });

  const { data: villages, refetch } = useContractRead({
    address: OnchainConfig.contracts.village,
    abi: VillageContractABI.abi,
    functionName: "tokenURIs",
    args: [
      Array(Number(villagesTotalSupply) || 0)
        .fill(null)
        .map((_, i) => i + 1),
    ],
    enabled: false,
  });

  console.log(villagesTotalSupply);

  const [villageNftMetadata, setVillageNftMetadata] =
    useState<TVillageMetadata[]>();

  useEffect(() => {
    villagesTotalSupply && refetch();
  }, [villagesTotalSupply]);

  useEffect(() => {
    villages &&
      setVillageNftMetadata(
        // @ts-ignore
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
              src={villageMetadata.image!}
            ></img>
          </div>
        ))}
    </main>
  );
}
