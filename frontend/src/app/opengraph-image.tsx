import { ImageResponse } from "next/og";
import { SITE_NAME, BRAND_COLORS } from "@/shared/lib/config";

export const alt = `${SITE_NAME} — Professional Haircare Distribution`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const revalidate = 86400;

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
          backgroundColor: "#0A0A0A",
          color: "#ffffff",
          fontFamily: "sans-serif",
          position: "relative",
          padding: "48px",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "6px",
            backgroundColor: BRAND_COLORS.crimson,
          }}
        />
        <div
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            border: "1px solid rgba(255, 255, 255, 0.12)",
            padding: "40px 60px",
            gap: "24px",
          }}
        >
          <div
            style={{
              fontSize: "15px",
              fontWeight: 600,
              letterSpacing: "0.25em",
              textTransform: "uppercase",
              color: BRAND_COLORS.crimson,
              padding: "6px 20px",
              border: "1px solid rgba(200, 50, 44, 0.35)",
              backgroundColor: "rgba(200, 50, 44, 0.08)",
            }}
          >
            {SITE_NAME.toUpperCase()}
          </div>
          <div
            style={{
              fontSize: "48px",
              fontWeight: 700,
              textAlign: "center",
              lineHeight: 1.2,
              maxWidth: "920px",
              color: "#ffffff",
            }}
          >
            Distributor Resmi Produk Salon & Hair Academy
          </div>
          <div
            style={{
              fontSize: "19px",
              color: "rgba(255,255,255,0.72)",
              textAlign: "center",
              maxWidth: "760px",
              lineHeight: 1.5,
            }}
          >
            Importir Eksklusif Alfaparf Milano, Montibello, Farmavita & Gamma+ Più di Indonesia
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
