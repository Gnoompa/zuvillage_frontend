import { Address } from "viem";

export type TMintVillagePayload = {
  name: string;
  permitPrices: number[];
  duration: [number, number];
  dataURI: string;
  color0: string;
  color1: string;
  color2: string;
  color3: string;
};

export type TVillage = {
  head: Address;
  name: string;
  permitPrices: number[];
  duration: [number, number];
  dataURI: string;
  color0: string;
  color1: string;
  color2: string;
  color3: string;
  pollinationScore: number;
  permitCount: number;
};
