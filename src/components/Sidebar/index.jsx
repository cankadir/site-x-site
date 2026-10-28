import React from "react";
// Side-effect import: registers Bootstrap's `data-bs-toggle="collapse"` click
// handlers that the sidebar accordions rely on. Never referenced directly.
// eslint-disable-next-line no-unused-vars
import { Collapse } from "bootstrap";
import CEQRIntroSideBar from "./CEQRIntroSideBar";
import SecOneloadSizeFarSideBar from "./SecOneloadSizeFarSideBar";
import SecThreeDevLimitsSideBar from "./SecThreeDevLimitsSideBar";
import SecTwoSocialNeighSideBar from "./SecTwoSocialNeighSideBar";

//currentMap acceptable values: ceqrIntro, secOneloadSizeFar, secTwoSocialNeigh, secThreeDevLimits
function Sidebar({currentMap}) {
  if (currentMap === "ceqrIntro") {
    return <CEQRIntroSideBar />;
  } else if (currentMap === "secOneloadSizeFar") {
    return <SecOneloadSizeFarSideBar />;
  } else if (currentMap === "secTwoSocialNeigh") {
    return <SecTwoSocialNeighSideBar />;
  } else if (currentMap === "secThreeDevLimits") {
    return <SecThreeDevLimitsSideBar />;
  } else {
    return null;
  }
}

export default Sidebar;
