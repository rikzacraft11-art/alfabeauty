import { ImageResponse } from "next/og";
import { SITE_NAME } from "@/shared/lib/config";

export const runtime = "edge";
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
              color: "#a4161a",
            }}
          >
            PT Alfa Beauty Cosmetica
          </div>
          <div
            style={{
              fontSize: "48px",
              fontWeight: 700,
              textAlign: "center",
              lineHeight: 1.15,
              maxWidth: "800px",
            }}
          >
            Connecting Global Hair Innovation to Indonesia
          </div>
          <div
            style={{
              fontSize: "18px",
              color: "rgba(255,255,255,0.6)",
              textAlign: "center",
              maxWidth: "600px",
            }}
          >
            Exclusive importer and distributor of leading Italian and Spanish
            professional haircare brands
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
