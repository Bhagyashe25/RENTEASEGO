
import { Subtitles } from 'lucide-react';
import React from 'react';

const Title = ({ title, subTitle, align = "center" }) => {
  return (
    <div className={`flex flex-col justify-center items-center text-center mb-12 ${
      align === "left" ? "md:items-start md:text-left" : ""
    }`}>
      <h1 className='font-bold text-4xl md:text-[40px] lg:text-[48px] leading-tight bg-linear-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent drop-shadow-lg'>
        {title}
      </h1>
      {subTitle && (
        <p className='text-base md:text-lg lg:text-xl text-gray-600 mt-3 md:mt-4 max-w-md lg:max-w-2xl font-medium leading-relaxed'>
          {subTitle}
        </p>
      )}
      <div className="w-24 h-1 bg-linear-to-r from-blue-500 to-purple-500 rounded-full mt-6 shadow-md"></div>
    </div>
  );
};

export default Title;