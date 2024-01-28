"use client";

export default function Home() {
  return (
    <main
      style={{
        display: "flex",
        alignItems: "center",
        gap: "2rem",
        flexDirection: "column",
      }}
    >
      <img
        src={"zuvillage_framework.png"}
        style={{
          width: "100%",
          maxWidth: "1000px",
          borderRadius: "20px",
          boxShadow:
            "rgba(50, 50, 93, 0.25) 0px 30px 60px -12px, rgba(0, 0, 0, 0.3) 0px 18px 36px -18px",
        }}
        alt="zuvillage framework scheme"
      ></img>
    </main>
  );
}
