import React from "react";

const CompanyLogoMarquee = () => {
  const companies = [
    "slack",
    "framer",
    "netflix",
    "google",
    "linkedin",
    "instagram",
    "facebook",
    "slack",
    "framer",
    "netflix",
    "google",
    "linkedin",
    "instagram",
    "facebook",
  ];

  return (
    <div className="overflow-hidden w-full relative max-w-5xl mx-auto select-none top-10">
      {/* Left gradient */}
      <div className="absolute left-0 top-0 h-full w-20 z-10 pointer-events-none bg-gradient-to-r from-[#ffffff] to-transparent"></div>

      {/* Marquee scrolling logos */}
      <div
        className="marquee-inner flex will-change-transform min-w-[200%]"
        style={{ animationDuration: "30s" }}
      >
        <div className="flex">
          {companies.map((company, index) => (
            <img
              key={index}
              alt={company}
              className="w-full h-full object-cover mx-6"
              draggable="false"
              src={`https://raw.githubusercontent.com/prebuiltui/prebuiltui/main/assets/companyLogo/${company}.svg`}
            />
          ))}
        </div>
      </div>

      {/* Right gradient */}
      <div className="absolute right-0 top-0 h-full w-20 md:w-40 z-10 pointer-events-none bg-gradient-to-l from-[#ffffff] to-transparent"></div>
    </div>
  );
};

export default CompanyLogoMarquee;
