import React, { useMemo } from "react";
import { useCurrentFrame, useVideoConfig, interpolate, Easing } from "remotion";

type KenBurnsProps = {
  src: string;
  durationInFrames: number;
  fromX?: number;
  fromY?: number;
  fromScale?: number;
  toX?: number;
  toY?: number;
  toScale?: number;
};

/**
 * Ken Burns effect — slow zoom + pan on a still image.
 * Defaults: gentle zoom from 1.15 -> 1.3, slight drift.
 */
export const KenBurns: React.FC<KenBurnsProps> = ({
  src,
  durationInFrames,
  fromX = 0,
  fromY = 0,
  fromScale = 1.15,
  toX = 0,
  toY = 0,
  toScale = 1.3,
}) => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();

  const progress = useMemo(
    () =>
      interpolate(frame, [0, durationInFrames], [0, 1], {
        easing: Easing.bezier(0.45, 0, 0.55, 1),
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      }),
    [frame, durationInFrames],
  );

  const scale = interpolate(progress, [0, 1], [fromScale, toScale]);
  const translateX = interpolate(progress, [0, 1], [fromX, toX]);
  const translateY = interpolate(progress, [0, 1], [fromY, toY]);

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        overflow: "hidden",
        position: "absolute",
        top: 0,
        left: 0,
      }}
    >
      <img
        src={src}
        alt=""
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          transform: `scale(${scale}) translate(${translateX}px, ${translateY}px)`,
          transformOrigin: "center center",
        }}
      />
    </div>
  );
};
