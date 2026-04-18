import "./index.css";
import { Composition } from "remotion";
import { MyComposition } from "./Composition";

const FPS = 30;
const TRANSITION_DURATION = 20;
const TITLE_DURATION = 3 * FPS;
const SCENE_DURATION = 3.5 * FPS;
const VIDEO_DURATION = 15 * FPS;
const CELEBRATION_DURATION = 3.5 * FPS;
const STATS_DURATION = 6 * FPS;
const CLOSING_DURATION = 3 * FPS;
const photoCount = 6;
const transitionCount = photoCount + 4;
const totalFrames =
  TITLE_DURATION +
  photoCount * SCENE_DURATION +
  VIDEO_DURATION +
  CELEBRATION_DURATION +
  STATS_DURATION +
  CLOSING_DURATION -
  transitionCount * TRANSITION_DURATION;

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="HalfMarathon"
        component={MyComposition}
        durationInFrames={totalFrames}
        fps={FPS}
        width={1920}
        height={1080}
      />
    </>
  );
};
