"use client";

import { ConnectKitProvider, getDefaultConfig } from "connectkit";
import { Inter } from "next/font/google";
import { polygonMumbai } from "viem/chains";
import { WagmiConfig, createConfig } from "wagmi";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

const config = createConfig(
  getDefaultConfig({
    alchemyId: "Pis2PKqCOQUtKwjl1Fpilx4puyEhidS5",
    walletConnectProjectId: "",
    appName: "Zuvillage Framework",
    chains: [polygonMumbai],
  })
);

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <title>Zuvillage Framework</title>
      </head>
      <WagmiConfig config={config}>
        <ConnectKitProvider>
          <body
            className={inter.className}
            style={{
              background: "white",
              gap: "2rem",
              padding: "4rem 2rem",
            }}
          >
            <nav
              style={{
                padding: "0 0 4rem",
                display: "flex",
                justifyContent: "center",
                gap: "4rem",
              }}
            >
              <a
                href="/admin"
                style={{
                  color: "#0C090A",
                  fontSize: "1rem",
                  fontWeight: "bold",
                }}
              >
                🛠 Create Village
              </a>
              <a
                href="/villages"
                style={{
                  color: "#0C090A",
                  fontSize: "1rem",
                  fontWeight: "bold",
                }}
              >
                🏡 All Villages
              </a>
              <a
                href="/about"
                style={{
                  color: "#0C090A",
                  fontSize: "1rem",
                  fontWeight: "bold",
                }}
              >
                ⁉️ About
              </a>
            </nav>
            {children}
          </body>
        </ConnectKitProvider>
      </WagmiConfig>
    </html>
  );
}
