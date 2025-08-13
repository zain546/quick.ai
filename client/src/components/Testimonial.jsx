import React from "react";
import { assets } from "../assets/assets";

const Testimonial = () => {
  const dummyTestimonialData = [
    {
      image:
        "https://images.unsplash.com/photo-1633332755192-727a05c4013d?q=80&w=200",
      name: "John Doe",
      title: "Marketing Director, TechCorp",
      content:
        "ContentAI has revolutionized our content workflow. The quality of the articles is outstanding, and it saves us hours of work every week.",
      rating: 4,
    },
    {
      image:
        "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=200",
      name: "Jane Smith",
      title: "Content Creator, TechCorp",
      content:
        "ContentAI has made our content creation process effortless. The AI tools have helped us produce high-quality content faster than ever before.",
      rating: 5,
    },
    {
      image:
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=200&h=200&auto=format&fit=crop",
      name: "David Lee",
      title: "Content Writer, TechCorp",
      content:
        "ContentAI has transformed our content creation process. The AI tools have helped us produce high-quality content faster than ever before.",
      rating: 4,
    },
  ];

  return (
    <div className="px-4 sm:px-6 md:px-12 lg:px-20 xl:px-32 py-12 sm:py-16 md:py-20 lg:py-24">
      {/* Header */}
      <div className="text-center mb-8 sm:mb-12 md:mb-16 lg:mb-20">
        <h2 className="text-slate-700 text-2xl sm:text-3xl md:text-4xl lg:text-[42px] font-semibold leading-tight">
          Loved by Creators
        </h2>
        <p className="text-gray-500 max-w-sm sm:max-w-md lg:max-w-lg mx-auto mt-3 sm:mt-4 text-sm sm:text-base">
          Don't just take our word for it. Here's what our users are saying.
        </p>
      </div>

      {/* Testimonials Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8 lg:gap-10 justify-items-center">
        {dummyTestimonialData.map((testimonial, index) => (
          <div
            key={index}
            className="w-full max-w-xs sm:max-w-sm p-4 sm:p-6 md:p-8 rounded-xl bg-[#FDFDFE] shadow-lg border border-gray-100 hover:-translate-y-1 transition-all duration-300 cursor-pointer hover:shadow-xl"
          >
            {/* Rating Stars */}
            <div className="flex items-center gap-1 mb-3 sm:mb-4 md:mb-5">
              {Array(5).fill(0).map((_, index) => (
                <img 
                  key={index} 
                  src={index < testimonial.rating ? assets.star_icon : assets.star_dull_icon} 
                  className="w-4 h-4 sm:w-5 sm:h-5" 
                  alt="stars"
                />
              ))}
            </div>

            {/* Content */}
            <p className="text-gray-500 text-sm sm:text-base my-3 sm:my-4 md:my-5 leading-relaxed">
              "{testimonial.content}"
            </p>

            {/* Divider */}
            <hr className="mb-3 sm:mb-4 md:mb-5 border-gray-300" />

            {/* Author Info */}
            <div className="flex items-center gap-3 sm:gap-4">
              <img
                src={testimonial.image}
                className="w-10 h-10 sm:w-12 sm:h-12 object-cover rounded-full border-2 border-gray-200"
                alt={testimonial.name}
              />
              <div className="min-w-0 flex-1">
                <h3 className="font-medium text-sm sm:text-base text-gray-800 truncate">
                  {testimonial.name}
                </h3>
                <p className="text-xs sm:text-sm text-gray-500 truncate">
                  {testimonial.title}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Testimonial;
