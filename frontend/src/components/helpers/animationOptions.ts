import { MotionProps } from "framer-motion";

//Modal Animation's Options
export const modalAnimationOptions: MotionProps = {
  initial: { y: -200, opacity: 0.8 },
  animate: { y: 0, opacity: 1 },
  exit: { y: -200, opacity: 0 },
};

//Close Button Animation's Options
export const closeBtnAnimationsOptions: MotionProps = {
  initial: { x: 100, opacity: 0.8 },
  animate: { x: 0, opacity: 1 },
  exit: { x: 100, opacity: 0 },
  transition: {
    type: "tween",
    duration: 0.2,
  },
};
