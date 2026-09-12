import { ImageResponse } from "next/og";
import { SITE_NAME } from "@/shared/lib/config";

export const alt = `${SITE_NAME} — Professional Haircare Distribution`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OgImage(): ImageResponse {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#000000",
          color: "#ffffff",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "24px",
          }}
        >
          <div
            style={{
              fontSize: "18px",
              fontWeight: 600,
              letterSpacing: "0.25em",
              textTransform: "uppercase",
              color: "#C8322C",
            }}
          >
            PT ALFA BEAUTY COSMETICA
          </div>
          <div
            style={{
              fontSize: "46px",
              fontWeight: 700,
              textAlign: "center",
              lineHeight: 1.2,
              maxWidth: "880px",
            }}
          >
            Distributor Resmi Produk Salon &amp; Hair Academy
          </div>
          <div
            style={{
              fontSize: "18px",
              color: "rgba(255,255,255,0.7)",
              textAlign: "center",
              maxWidth: "700px",
            }}
          >
            Importir Eksklusif Alfaparf Milano, Montibello, Farmavita &amp; Gamma+ Più di Indonesia
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
