import React from "react";
import {
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  Easing,
  AbsoluteFill,
} from "remotion";

export const TitleCard: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const accentOpacity = interpolate(frame, [0, 0.3 * fps], [0, 1], {
    easing: Easing.bezier(0.16, 1, 0.3, 1),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const titleOpacity = interpolate(frame, [0.15 * fps, 0.5 * fps], [0, 1], {
    easing: Easing.bezier(0.16, 1, 0.3, 1),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const subtitleOpacity = interpolate(frame, [0.35 * fps, 0.75 * fps], [0, 1], {
    easing: Easing.bezier(0.16, 1, 0.3, 1),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const dateOpacity = interpolate(frame, [0.55 * fps, 0.9 * fps], [0, 0.5], {
    easing: Easing.out(Easing.cubic),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const accentW = interpolate(frame, [0, 0.3 * fps], [0, 80], {
    easing: Easing.out(Easing.cubic),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const accentY = interpolate(frame, [0, 0.3 * fps], [30, 0], {
    easing: Easing.out(Easing.cubic),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const titleY = interpolate(frame, [0.15 * fps, 0.5 * fps], [50, 0], {
    easing: Easing.out(Easing.cubic),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const subtitleY = interpolate(frame, [0.35 * fps, 0.75 * fps], [25, 0], {
    easing: Easing.out(Easing.cubic),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const dateY = interpolate(frame, [0.55 * fps, 0.9 * fps], [20, 0], {
    easing: Easing.out(Easing.cubic),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#0a0a0a",
        justifyContent: "center",
        alignItems: "center",
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
      }}
    >
      {/* Thin accent line */}
      <div
        style={{
          width: accentW,
          height: 3,
          backgroundColor: "#f0f0f0",
          transform: `translateY(${accentY}px)`,
          opacity: accentOpacity,
          marginBottom: 32,
          borderRadius: 2,
        }}
      />

      {/* Title — 21.1K */}
      <div
        style={{
          color: "#ffffff",
          fontSize: 88,
          fontWeight: 800,
          letterSpacing: "-0.03em",
          lineHeight: 1,
          textAlign: "center",
          opacity: titleOpacity,
          transform: `translateY(${titleY}px)`,
        }}
      >
        21.1K
      </div>

      {/* Subtitle */}
      <div
        style={{
          color: "rgba(255,255,255,0.55)",
          fontSize: 22,
          fontWeight: 400,
          letterSpacing: "0.18em",
          textTransform: "uppercase",
          marginTop: 16,
          opacity: subtitleOpacity,
          transform: `translateY(${subtitleY}px)`,
        }}
      >
        Times Internet Half Marathon
      </div>

      {/* Bottom detail */}
      <div
        style={{
          position: "absolute",
          bottom: 70,
          opacity: dateOpacity,
          transform: `translateY(${dateY}px)`,
          color: "rgba(255,255,255,0.45)",
          fontSize: 14,
          fontWeight: 500,
          letterSpacing: "0.12em",
          textTransform: "uppercase",
        }}
      >
        Delhi &middot; 29 March 2026
      </div>
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------
// Stats screen — race results with staggered pop-in then group fade-out
// ---------------------------------------------------------------------------
interface StatItemProps {
  label: string;
  value: string;
  opacity: number;
  translateY: number;
  scale: number;
}

const StatItem: React.FC<StatItemProps> = ({ label, value, opacity, translateY, scale }) => (
  <div
    style={{
      textAlign: "center",
      opacity,
      transform: `translateY(${translateY}px) scale(${scale})`,
      minWidth: 160,
    }}
  >
    <div
      style={{
        color: "rgba(255,255,255,0.45)",
        fontSize: 12,
        fontWeight: 500,
        letterSpacing: "0.15em",
        textTransform: "uppercase",
        marginBottom: 6,
      }}
    >
      {label}
    </div>
    <div
      style={{
        color: "#ffffff",
        fontSize: 32,
        fontWeight: 700,
        letterSpacing: "-0.01em",
      }}
    >
      {value}
    </div>
  </div>
);

export const StatsScreen: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, width } = useVideoConfig();

  // Total duration of this scene
  const totalDuration = 6 * fps; // 6 seconds
  const popInStart = 0.3 * fps; // stats start appearing after 0.3s
  const popInDuration = 2.5 * fps; // 2.5s staggered pop-in
  const holdStart = popInStart + popInDuration;
  const fadeOutStart = 4.5 * fps; // fade out in last 1.5s

  // Group fade-out opacity (applied to entire content)
  const groupOpacity = interpolate(
    frame,
    [fadeOutStart, totalDuration],
    [1, 0],
    {
      easing: Easing.bezier(0.45, 0, 0.55, 1),
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    },
  );

  // Header elements
  const headerOpacity = interpolate(
    frame,
    [0, 0.25 * fps],
    [0, 1],
    {
      easing: Easing.bezier(0.16, 1, 0.3, 1),
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    },
  );

  const headerY = interpolate(frame, [0, 0.25 * fps], [20, 0], {
    easing: Easing.out(Easing.cubic),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const accentW = interpolate(frame, [0, 0.25 * fps], [0, 120], {
    easing: Easing.out(Easing.cubic),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const subtitleOpacity = interpolate(
    frame,
    [0.15 * fps, 0.4 * fps],
    [0, 0.5],
    {
      easing: Easing.out(Easing.cubic),
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    },
  );

  // Stat items — staggered pop-in
  const stats = [
    { label: "Net Time", value: "03:09:27" },
    { label: "Gross Time", value: "03:10:57" },
    { label: "Net Pace", value: "08:59" },
    { label: "Gross Pace", value: "09:03" },
    { label: "Net Speed", value: "6.68 km/h" },
    { label: "Overall Rank", value: "1633 / 1821" },
    { label: "Gender Rank", value: "1464 / 1605" },
    { label: "Category Rank", value: "513 / 559" },
  ];

  const row1 = stats.slice(0, 3);
  const row2 = stats.slice(3, 6);
  const row3 = stats.slice(6, 8);

  const renderStat = (stat: (typeof stats)[number], index: number) => {
    const itemStart = popInStart + index * 0.12 * fps;
    const itemEnd = itemStart + 0.5 * fps;

    const itemOpacity = interpolate(
      frame,
      [itemStart, itemEnd],
      [0, 1],
      {
        easing: Easing.bezier(0.16, 1, 0.3, 1),
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      },
    );

    const itemY = interpolate(
      frame,
      [itemStart, itemEnd],
      [20, 0],
      {
        easing: Easing.out(Easing.cubic),
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      },
    );

    const itemScale = interpolate(
      frame,
      [itemStart, itemEnd],
      [0.9, 1],
      {
        easing: Easing.out(Easing.cubic),
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      },
    );

    return (
      <StatItem
        key={stat.label}
        label={stat.label}
        value={stat.value}
        opacity={itemOpacity}
        translateY={itemY}
        scale={itemScale}
      />
    );
  };

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#0a0a0a",
        justifyContent: "center",
        alignItems: "center",
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
        padding: "60px 80px",
        boxSizing: "border-box",
      }}
    >
      {/* All content wrapped in group fade */}
      <div
        style={{
          width: "100%",
          opacity: groupOpacity,
        }}
      >
        {/* Header */}
        <div
          style={{
            textAlign: "center",
            marginBottom: 48,
            opacity: headerOpacity,
            transform: `translateY(${headerY}px)`,
          }}
        >
          {/* Accent line */}
          <div
            style={{
              width: accentW,
              height: 3,
              backgroundColor: "#f0f0f0",
              margin: "0 auto 24px",
              borderRadius: 2,
            }}
          />
          <div
            style={{
              color: "#ffffff",
              fontSize: 38,
              fontWeight: 700,
              letterSpacing: "-0.02em",
              marginBottom: 8,
            }}
          >
            Race Stats
          </div>
          <div
            style={{
              color: "rgba(255,255,255,0.4)",
              fontSize: 14,
              fontWeight: 500,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              opacity: subtitleOpacity,
            }}
          >
            Anunak Roy &middot; BIB 210978 &middot; Under 29
          </div>
        </div>

        {/* Row 1 — Time stats */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: 48,
            marginBottom: 36,
          }}
        >
          {row1.map(renderStat)}
        </div>

        {/* Row 2 — Pace & Speed + Ranks */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: 48,
            marginBottom: 36,
          }}
        >
          {row2.map(renderStat)}
        </div>

        {/* Row 3 — Rank stats */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: 48,
          }}
        >
          {row3.map(renderStat)}
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------
// Closing card
// ---------------------------------------------------------------------------
export const ClosingCard: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const accentW = interpolate(frame, [0, 0.3 * fps], [0, 60], {
    easing: Easing.out(Easing.cubic),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const accentOpacity = interpolate(frame, [0, 0.3 * fps], [0, 1], {
    easing: Easing.bezier(0.16, 1, 0.3, 1),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const titleOpacity = interpolate(frame, [0.1 * fps, 0.4 * fps], [0, 1], {
    easing: Easing.bezier(0.16, 1, 0.3, 1),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const subtitleOpacity = interpolate(frame, [0.3 * fps, 0.6 * fps], [0, 1], {
    easing: Easing.bezier(0.16, 1, 0.3, 1),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const accentY = interpolate(frame, [0, 0.3 * fps], [25, 0], {
    easing: Easing.out(Easing.cubic),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const titleY = interpolate(frame, [0.1 * fps, 0.4 * fps], [40, 0], {
    easing: Easing.out(Easing.cubic),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const subtitleY = interpolate(frame, [0.3 * fps, 0.6 * fps], [20, 0], {
    easing: Easing.out(Easing.cubic),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#0a0a0a",
        justifyContent: "center",
        alignItems: "center",
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
      }}
    >
      <div
        style={{
          opacity: titleOpacity,
          transform: `translateY(${titleY}px)`,
          textAlign: "center",
        }}
      >
        {/* Thin accent line */}
        <div
          style={{
            width: accentW,
            height: 3,
            backgroundColor: "#f0f0f0",
            margin: "0 auto 28px",
            borderRadius: 2,
            opacity: accentOpacity,
          }}
        />
        <div
          style={{
            color: "#ffffff",
            fontSize: 64,
            fontWeight: 700,
            letterSpacing: "-0.02em",
          }}
        >
          Finisher
        </div>
        <div
          style={{
            color: "rgba(255,255,255,0.45)",
            fontSize: 18,
            fontWeight: 400,
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            marginTop: 14,
            opacity: subtitleOpacity,
            transform: `translateY(${subtitleY}px)`,
          }}
        >
          21.1K &middot; Done
        </div>
      </div>
    </AbsoluteFill>
  );
};
