"use client";

import OnchainConfig from "@/configs/onchain";
import ManagerContractABI from "@/contracts/Manager.json";
import VillageContractABI from "@/contracts/Village.json";
import { TMintVillagePayload } from "@/types/onchain";
import { ConnectKitButton } from "connectkit";
import React, { useEffect, useState } from "react";
import {
  useAccount,
  useContractRead,
  useContractWrite,
  useWaitForTransaction,
} from "wagmi";

export default function Home() {
  const { address: connectedAddress } = useAccount();
  const { data: villageHeadStatus, refetch: refetchVillageHeadStatus } =
    useContractRead({
      address: OnchainConfig.contracts.manager,
      abi: ManagerContractABI.abi,
      functionName: "villageHeads",
      args: [connectedAddress],
      enabled: false,
    });

  const { data: dataContractVillageMint, write: writeContractVillageMint } =
    useContractWrite({
      address: OnchainConfig.contracts.village,
      abi: VillageContractABI.abi,
      functionName: "mint",
    });

  const {
    isLoading: isLoadingContractVillageMint,
    isSuccess: isSuccessContractVillageMint,
    isError: isErrorContractVillageMint,
  } = useWaitForTransaction({
    hash: dataContractVillageMint?.hash,
  });

  const [mintFormData, setMintFormData] = useState({
    name: "",
    periodFrom: "",
    periodTo: "",
    permitPrice: undefined,
    color0: "#fff",
    color1: "#f00",
    color2: "#0f0",
    color3: "#00f",
  });

  const isMintFormDataValid = !!(
    mintFormData.name &&
    mintFormData.periodFrom &&
    mintFormData.periodTo &&
    +(mintFormData.permitPrice || 0) &&
    mintFormData.color0 &&
    mintFormData.color1 &&
    mintFormData.color2 &&
    mintFormData.color3
  );

  const [isConnectedAddressAVillageHead, setIsConnectedAddressAVillageHead] =
    useState<boolean>();

  const isAbleToMintVillage =
    isConnectedAddressAVillageHead &&
    isMintFormDataValid &&
    !isLoadingContractVillageMint;

  useEffect(() => {
    connectedAddress
      ? refetchVillageHeadStatus()
      : setIsConnectedAddressAVillageHead(undefined);
  }, [connectedAddress]);

  useEffect(() => {
    villageHeadStatus &&
      Number(villageHeadStatus) == 1 &&
      setIsConnectedAddressAVillageHead(true);
  }, [villageHeadStatus]);

  useEffect(() => {
    isErrorContractVillageMint && alert("Smth went wrong...");
    isSuccessContractVillageMint &&
      alert("Minted! Check your village on 'All Villages' page");
  }, [isErrorContractVillageMint, isSuccessContractVillageMint]);

  const onMintFormChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    fieldName: string
  ) =>
    setMintFormData({
      ...mintFormData,
      [fieldName]: event.currentTarget?.value,
    });

  const onMintButtonClick = () =>
    isMintFormDataValid
      ? mintVillage(getMintVillagePayload(mintFormData))
      : alert("Please, fill the form");

  const mintVillage = (payload: TMintVillagePayload) =>
    writeContractVillageMint({
      args: [
        {
          ...payload,
          head: connectedAddress,
          pollinationScore: 0,
          villagerCount: 0,
        },
      ],
    });

  const getMintVillagePayload = (
    _mintFormData: typeof mintFormData
  ): TMintVillagePayload => ({
    ...mintFormData,
    duration: [
      Math.floor(new Date(mintFormData.periodFrom).getTime() / 1000),
      Math.floor(new Date(mintFormData.periodTo).getTime() / 1000),
    ],
    dataURI: "",
    color0: _mintFormData.color0.substring(1),
    color1: _mintFormData.color1.substring(1),
    color2: _mintFormData.color2.substring(1),
    color3: _mintFormData.color3.substring(1),
    permitPrices: [mintFormData.permitPrice!],
  });

  const rendomiseSignatureColors = () =>
    setMintFormData(
      Array(4)
        .fill(null)
        .map((_, i) => i)
        .reduce(
          (acc, el) => ({
            ...acc,
            [`color${el}`]:
              "#" + ((Math.random() * 0xffffff) << 0).toString(16),
          }),
          mintFormData
        )
    );

  return (
    <main
      style={{
        display: "flex",
        alignItems: "center",
        gap: "2rem",
        flexDirection: "column",
      }}
    >
      <ConnectKitButton />
      {/* {isConnectedAddressAVillageHead === true ? ( */}
      {true === true ? (
        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            flexDirection: "column",
            gap: "2rem",
          }}
        >
          <p
            style={{
              color: "#222",
              textAlign: "center",
              fontSize: "1.25rem",
              padding: "1rem",
              alignSelf: "center",
            }}
          >
            Congraz on being a village head! 🎉<br></br>
            <br></br>
            Feel free to mint a village here 🏠
          </p>

          <input
            style={{ width: "100%" }}
            placeholder="Village name"
            value={mintFormData.name}
            onChange={(e) => onMintFormChange(e, "name")}
          ></input>

          <div>
            <p className="label">Duration (UTC)</p>
            <div>
              <input
                type="date"
                value={mintFormData.periodFrom}
                max={mintFormData.periodTo}
                onChange={(e) => onMintFormChange(e, "periodFrom")}
              ></input>{" "}
              ➡️{" "}
              <input
                type="date"
                min={mintFormData.periodFrom}
                value={mintFormData.periodTo}
                onChange={(e) => onMintFormChange(e, "periodTo")}
              ></input>
            </div>
          </div>

          <input
            style={{ width: "100%" }}
            type="number"
            placeholder="Permit price/day in Ξ"
            value={mintFormData.permitPrice}
            onChange={(e) => onMintFormChange(e, "permitPrice")}
          ></input>

          <div
            style={{
              width: "100%",
            }}
          >
            <div
              style={{
                width: "100%",
                display: "flex",
                gap: ".5rem",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <p className="label">Signature colors</p>
              <button
                onClick={rendomiseSignatureColors}
                style={{
                  background: "transparent",
                  border: "none",
                  boxShadow: "rgba(17, 12, 46, 0.15) 0px 48px 100px 0px;",
                  padding: ".5rem",
                  cursor: "pointer",
                  fontSize: "2rem",
                }}
              >
                🌈
              </button>
            </div>

            <div
              style={{
                width: "100%",
                display: "flex",
                gap: ".5rem",
                justifyContent: "space-between",
              }}
            >
              <input
                type="color"
                value={mintFormData.color0}
                onChange={(e) => onMintFormChange(e, "color0")}
              ></input>
              <input
                type="color"
                value={mintFormData.color1}
                onChange={(e) => onMintFormChange(e, "color1")}
              ></input>
              <input
                type="color"
                value={mintFormData.color2}
                onChange={(e) => onMintFormChange(e, "color2")}
              ></input>
              <input
                type="color"
                value={mintFormData.color3}
                onChange={(e) => onMintFormChange(e, "color3")}
              ></input>
            </div>
          </div>
        </div>
      ) : isConnectedAddressAVillageHead === false ? (
        <p style={{ color: "#222", textAlign: "center", fontWeight: "bold" }}>
          Not a village head<br></br>
          <br></br>
          Feel free to apply <a style={{ color: "red" }}>here</a>
        </p>
      ) : (
        ""
      )}

      <button
        onClick={onMintButtonClick}
        style={{ padding: "1rem 2rem" }}
        disabled={!isAbleToMintVillage}
      >
        {isLoadingContractVillageMint ? "Minting..." : "MINT VILLAGE NFT"}
      </button>
    </main>
  );
}
