import React, { useMemo } from "react";
import {
  AbsoluteFill,
  useVideoConfig,
  useCurrentFrame,
  staticFile,
  interpolate,
  Easing,
  Sequence,
} from "remotion";
import { Video, Audio } from "@remotion/media";
import {
  TransitionSeries,
  linearTiming,
} from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { KenBurns } from "./KenBurns";
import { TitleCard, StatsScreen, ClosingCard } from "./Typography";

// ---------------------------------------------------------------------------
// Config
// ---------------------------------------------------------------------------
const FPS = 30;
const TRANSITION_DURATION = 20; // frames (~0.67s crossfade)

const TITLE_DURATION = 3 * FPS; // 3s
const SCENE_DURATION = 3.5 * FPS; // 3.5s per photo
const VIDEO_DURATION = 15 * FPS; // 15s — generous to cover full video
const VIDEO_FADEOUT = 1.5 * FPS; // fade-out in last 1.5s
const CELEBRATION_DURATION = 3.5 * FPS; // celebration photo
const STATS_DURATION = 6 * FPS; // 6s for race stats
const CLOSING_DURATION = 3 * FPS; // 3s

const photoCount = 6;
const totalPhotoScenes = photoCount * SCENE_DURATION;
// transitions: title→s1, s1→s2, ... s6→video, video→celebration, celebration→stats, stats→closing = 10
const transitionCount = photoCount + 4;
const totalFrames =
  TITLE_DURATION +
  totalPhotoScenes +
  VIDEO_DURATION +
  CELEBRATION_DURATION +
  STATS_DURATION +
  CLOSING_DURATION -
  transitionCount * TRANSITION_DURATION;

// ---------------------------------------------------------------------------
// Photo scene definitions
// ---------------------------------------------------------------------------
interface PhotoScene {
  src: string;
  fromX?: number;
  fromY?: number;
  fromScale?: number;
  toX?: number;
  toY?: number;
  toScale?: number;
}

const photoScenes: PhotoScene[] = [
  // 1 — Pre-dawn start gate
  {
    src: staticFile("assets/IMG_20260329_035325.jpg"),
    fromScale: 1.1,
    toScale: 1.25,
    fromY: 0,
    toY: -15,
  },
  // 2 — Pre-race selfie with crowd
  {
    src: staticFile("assets/IMG_20260329_052558.jpg"),
    fromScale: 1.15,
    toScale: 1.3,
    fromX: 0,
    toX: -20,
  },
  // 3 — Pro photo mid-stride (TIC_3053, portrait)
  {
    src: staticFile("assets/TIC_3053.jpg"),
    fromScale: 1.05,
    toScale: 1.2,
    fromY: 10,
    toY: -10,
  },
  // 4 — India Gate in background
  {
    src: staticFile("assets/TIU_3329.jpg"),
    fromScale: 1.1,
    toScale: 1.28,
    fromX: 10,
    toX: -10,
  },
  // 5 — Selfie at India Gate
  {
    src: staticFile("assets/IMG_20260329_082220.jpg"),
    fromScale: 1.15,
    toScale: 1.3,
    fromY: 0,
    toY: -12,
  },
  // 6 — Finisher medal
  {
    src: staticFile("assets/IMG_20260329_094921_flipped.jpg"),
    fromScale: 1.1,
    toScale: 1.25,
    fromX: 0,
    toX: -15,
  },
];

// ---------------------------------------------------------------------------
// Photo scene (no chapter marker)
// ---------------------------------------------------------------------------
const PhotoScene: React.FC<PhotoScene & { durationInFrames: number }> = ({
  src,
  fromX,
  fromY,
  fromScale,
  toX,
  toY,
  toScale,
  durationInFrames,
}) => {
  return (
    <AbsoluteFill style={{ backgroundColor: "#0a0a0a" }}>
      <KenBurns
        src={src}
        durationInFrames={durationInFrames}
        fromX={fromX}
        fromY={fromY}
        fromScale={fromScale}
        toX={toX}
        toY={toY}
        toScale={toScale}
      />
      {/* Vignette overlay */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,0.45) 100%)",
          pointerEvents: "none",
        }}
      />
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------
// Video scene — plays full video, fades out near the end
// ---------------------------------------------------------------------------
const VideoScene: React.FC<{ fadeOutFrames: number; durationInFrames: number }> = ({
  fadeOutFrames,
  durationInFrames,
}) => {
  const frame = useCurrentFrame();

  const fadeOpacity = useMemo(
    () =>
      interpolate(frame, [durationInFrames - fadeOutFrames, durationInFrames], [1, 0], {
        easing: Easing.bezier(0.45, 0, 0.55, 1),
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      }),
    [frame, durationInFrames, fadeOutFrames],
  );

  return (
    <AbsoluteFill style={{ backgroundColor: "#0a0a0a" }}>
      <div style={{ position: "absolute", inset: 0 }}>
        <Video
          src={staticFile("assets/video_20260329_082004.mp4")}
          style={{ width: "100%", height: "100%" }}
          volume={0}
          muted
          objectFit="cover"
        />
      </div>
      {/* Vignette overlay */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,0.45) 100%)",
          pointerEvents: "none",
        }}
      />
      {/* Fade-out overlay at end */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundColor: "#0a0a0a",
          opacity: 1 - fadeOpacity,
          pointerEvents: "none",
        }}
      />
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------
// Celebration photo — arms-wide finisher pose
// ---------------------------------------------------------------------------
const CelebrationPhoto: React.FC = () => {
  const frame = useCurrentFrame();

  return (
    <AbsoluteFill style={{ backgroundColor: "#0a0a0a" }}>
      <KenBurns
        src={staticFile("assets/2d75bd58-88a5-42e9-88b6-1cb8fed50121.jpg")}
        durationInFrames={CELEBRATION_DURATION}
        fromScale={1.0}
        toScale={1.05}
        fromX={0}
        toX={0}
        fromY={0}
        toY={0}
      />
      {/* Vignette overlay */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,0.45) 100%)",
          pointerEvents: "none",
        }}
      />
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------
// Main composition
// ---------------------------------------------------------------------------
export const MyComposition: React.FC = () => {
  const { fps } = useVideoConfig();

  const audioStart = TITLE_DURATION;
  const audioEnd = totalFrames - CLOSING_DURATION;
  const fadeFrames = 1.5 * fps;

  return (
    <AbsoluteFill style={{ backgroundColor: "#0a0a0a" }}>
      {/* Background music */}
      <Sequence from={audioStart}>
        <Audio
          src={staticFile("assets/4_5852578670983517958.mp3")}
          volume={(f) =>
            interpolate(
              f,
              [0, fadeFrames, audioEnd - audioStart - fadeFrames, audioEnd - audioStart],
              [0, 0.4, 0.4, 0],
              {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
              },
            )
          }
        />
      </Sequence>

      <TransitionSeries>
        {/* Title card */}
        <TransitionSeries.Sequence durationInFrames={TITLE_DURATION}>
          <TitleCard />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({ durationInFrames: TRANSITION_DURATION })}
        />

        {/* Photo scenes — no chapter markers */}
        {photoScenes.map((scene, i) => (
          <React.Fragment key={i}>
            <TransitionSeries.Sequence durationInFrames={SCENE_DURATION}>
              <PhotoScene {...scene} durationInFrames={SCENE_DURATION} />
            </TransitionSeries.Sequence>
            {i < photoScenes.length - 1 && (
              <TransitionSeries.Transition
                presentation={fade()}
                timing={linearTiming({
                  durationInFrames: TRANSITION_DURATION,
                })}
              />
            )}
          </React.Fragment>
        ))}

        {/* Transition to video */}
        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({ durationInFrames: TRANSITION_DURATION })}
        />

        {/* Video scene — full video with fade-out */}
        <TransitionSeries.Sequence durationInFrames={VIDEO_DURATION}>
          <VideoScene
            fadeOutFrames={VIDEO_FADEOUT}
            durationInFrames={VIDEO_DURATION}
          />
        </TransitionSeries.Sequence>

        {/* Transition to celebration photo */}
        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({ durationInFrames: TRANSITION_DURATION })}
        />

        {/* Celebration photo — arms wide, finish line */}
        <TransitionSeries.Sequence durationInFrames={CELEBRATION_DURATION}>
          <CelebrationPhoto />
        </TransitionSeries.Sequence>

        {/* Transition to stats */}
        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({ durationInFrames: TRANSITION_DURATION })}
        />

        {/* Stats screen */}
        <TransitionSeries.Sequence durationInFrames={STATS_DURATION}>
          <StatsScreen />
        </TransitionSeries.Sequence>

        {/* Transition to closing */}
        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({ durationInFrames: TRANSITION_DURATION })}
        />

        {/* Closing card */}
        <TransitionSeries.Sequence durationInFrames={CLOSING_DURATION}>
          <ClosingCard />
        </TransitionSeries.Sequence>
      </TransitionSeries>
    </AbsoluteFill>
  );
};
