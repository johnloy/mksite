//@ts-nocheck

// import { AcceptedElements } from "@motionone/dom";
import { animate } from "motion";

export const color = (oldEl) => {
  const oldColor = getComputedStyle(oldEl).color;
  return (newEl) => {
    const newColor = getComputedStyle(newEl).color

    animate(newEl, { color: [oldColor, newColor] }, { duration: 1 })
  };
};
