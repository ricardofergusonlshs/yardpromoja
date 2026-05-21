import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "YardPromoJa — Jamaica's promo and link-up planner";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          position: "relative",
          overflow: "hidden",
          background:
            "radial-gradient(circle at 12% 14%, rgba(0,138,61,0.55), transparent 32%), radial-gradient(circle at 90% 18%, rgba(255,212,0,0.34), transparent 28%), linear-gradient(135deg, #020806 0%, #06130d 58%, #020806 100%)",
          color: "white",
          fontFamily: "Arial, sans-serif",
        }}
      >
        <div
          style={{
            position: "absolute",
            right: -22,
            bottom: -35,
            fontSize: 190,
            fontWeight: 900,
            letterSpacing: "-0.12em",
            color: "rgba(255,255,255,0.06)",
          }}
        >
          YP
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            padding: "74px",
            width: "76%",
            zIndex: 1,
          }}
        >
          <div
            style={{
              display: "inline-flex",
              width: "fit-content",
              padding: "14px 20px",
              borderRadius: 999,
              border: "1px solid rgba(255,212,0,0.48)",
              background: "rgba(0,0,0,0.26)",
              color: "#ffd400",
              fontSize: 26,
              fontWeight: 900,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
            }}
          >
            YardPromoJa
          </div>

          <div
            style={{
              marginTop: 28,
              fontSize: 76,
              lineHeight: 0.95,
              letterSpacing: "-0.07em",
              fontWeight: 900,
              textTransform: "uppercase",
            }}
          >
            Social media gets attention. YardPromoJa turns it into action.
          </div>

          <div
            style={{
              marginTop: 26,
              display: "flex",
              gap: 14,
              fontSize: 28,
              color: "rgba(255,255,255,0.82)",
              fontWeight: 700,
            }}
          >
            <span>Events</span>
            <span style={{ color: "#ffd400" }}>•</span>
            <span>Food</span>
            <span style={{ color: "#ffd400" }}>•</span>
            <span>Campaigns</span>
            <span style={{ color: "#ffd400" }}>•</span>
            <span>Link-Up Planner</span>
          </div>
        </div>
      </div>
    ),
    size
  );
}
