import React from "react";
import Header from "../../components/Header";

const SectionOne = () => {
  return (
    <>
      <Header
        sectionId="PART ONE"
        pillTitle={`Interactive Map`}
        title="Interactive Map + Case Studies"
        instructions="The following section includes a series of interactive maps examining development at a citywide 
        level from 2012-2022. The SITE x SITE web tool is intended to provide greater insight into 
        site-specific conditions that affect development under rezonings. The findings highlight limitations 
        in the CEQR methodology for identifying soft sites."
        bgImage="map"
        logoStyle={"outline"}
      />
    </>
  );
};

export default SectionOne;
