// @ts-nocheck
import Swup from "swup";
import SwupHeadPlugin from "@swup/head-plugin";

const pageFns = {};

const pageFnHandler = () => {
  const fn = pageFns[location.pathname];
  console.log('pageFnHandler')
  if (fn) {
    const cleanupFn = fn();
    document.addEventListener("swup:transitionStart", cleanupFn, {
      once: true
    });
  }
};

export const onPageView = (fn, moduleUrl) => {
  pageFns[location.pathname] = fn;
  pageFnHandler();
};

const swup = new Swup({
  plugins: [new SwupHeadPlugin()],
  containers: ["#main"]
});


swup.on("pageView", pageFnHandler);

const onHeadMutation = function (mutationList, observer) {
  for (const mutation of mutationList) {
    if (mutation.type === "childList") {
      mutation.addedNodes.forEach(async (node) => {
        if (
          node instanceof HTMLScriptElement &&
          node.getAttribute("type") === "module"
        ) {
          await import(/* @vite-ignore */ node.src);
        }
      });
    }
  }
};

const headObserver = new MutationObserver(onHeadMutation);

headObserver.observe(document.head, {
  attributes: true,
  childList: true,
  subtree: true
});
