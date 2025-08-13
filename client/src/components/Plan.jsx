import React from "react";
import { PricingTable } from "@clerk/clerk-react";

const Plan = () => {
  return (
    <div className="max-w-6xl mx-auto z-20 my-12 sm:my-16 md:my-20 lg:my-30 px-4 sm:px-6">
      {/* Header */}
      <div className="text-center mb-8 sm:mb-12 md:mb-16 lg:mb-20">
        <h2 className="text-slate-700 text-2xl sm:text-3xl md:text-4xl lg:text-[42px] font-semibold leading-tight">
          Choose Your Plan
        </h2>
        <p className="text-gray-500 max-w-sm sm:max-w-md lg:max-w-lg mx-auto mt-3 sm:mt-4 text-sm sm:text-base leading-relaxed">
          Start for free and scale up as you grow. Find the perfect plan for
          your content creation needs.
        </p>
      </div>

      {/* Pricing Table - Force Row Layout on Desktop */}
      <div className="mt-8 sm:mt-10 md:mt-12 lg:mt-14">
        <div className="flex flex-col lg:flex-row lg:justify-center lg:items-start lg:gap-6">
          <PricingTable 
            appearance={{
              elements: {
                rootBox: "w-1/2 lg:w-auto lg:flex-1",
                pricingCard: "lg:min-w-0"
              }
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default Plan;
