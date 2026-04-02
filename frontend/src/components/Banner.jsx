import React, { useState, useEffect, useRef } from 'react';
import Slider from 'react-slick';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";

const Banner = () => {
  const sliderRef = useRef(null);

  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const settings = {
    dots: true,
    arrows: false,
    infinite: true,
    autoplay: true,
    speed: 500,
    autoplaySpeed: 5000,
    slidesToShow: 1,
    slidesToScroll: 1,
  };

  const cards = [
    "https://s.rmjo.in/Fitness-Offer-HP-Web-%20(1).jpg",
    "https://s.rmjo.in/WP-Web.png",
    "https://s.rmjo.in/AC-Offer-Banner-Web-.jpg",
    "https://s.rmjo.in/Paytm-Offer-banner-for-web.jpg",
    "https://s.rmjo.in/Paytm-Bank-Desktop-banner-%20(1).jpg",
  ];

  return (
    <section className="min-h-screen flex flex-col items-center justify-center gap-14 bg-gray-50 text-center px-4">
      <div className="w-full max-w-1200px mx-auto rounded-[30px] bg-transparent xl:bg-[#d4e0e9] relative overflow-hidden">
        {/* Slider */}
        
          <div className="relative h-300px sm:h-350px md:h-400px w-full mx-auto rounded-[30px]">
          
          {/* Left Arrow */}
          <button
            onClick={() => sliderRef.current.slickPrev()}
            aria-label="Previous Slide"
            className="absolute top-1/2 left-2 md:left-10 -translate-y-1/2 z-20 h-12 w-12 rounded-r-md bg-gray-200 hover:bg-gray-300 flex items-center justify-center transition"
          >
            <ChevronLeft size={24} />
          </button>

          {/* Right Arrow */}
          <button
            onClick={() => sliderRef.current.slickNext()}
            aria-label="Next Slide"
            className="absolute top-1/2 right-2 md:right-10 -translate-y-1/2 z-20 h-12 w-12 rounded-l-md bg-gray-200 hover:bg-gray-300 flex items-center justify-center transition"
          >
            <ChevronRight size={24} />
          </button>

          {/* Slider Component */}
          <Slider ref={sliderRef} {...settings}>
            {cards.map((url, index) => (
  <           div key={index} className="h-full w-full overflow-hidden rounded-[30px]">
             <img src={url} alt={`Slide ${index + 1}`} className="w-full h-full object-cover" />
              </div>
            ))}
          </Slider>
        </div>

        {/* Footer Banner */}
        {windowWidth >= 1280 && (
            <div className="absolute -bottom-12.5 left-1/2 transform -translate-x-1/2 flex flex-col xl:flex-row justify-center items-center gap-3 lg:gap-5 px-4 text-left xl:text-center">
            <img 
              src="https://www.rentomojo.com/public/images/icons/virusSafetyGreen.png" 
              alt="Safety Icon" 
              className="w-5 h-5" 
            />
           
            <a 
              href="https://www.rentomojo.com/covid19-response" 
              target="_blank" 
              rel="noreferrer"
              className="flex items-center text-blue-600 hover:underline"
            >
              Know more <ArrowRight size={16} className="ml-1" />
            </a>
          </div>
        )}
      </div>
    </section>
  );
};

export default Banner