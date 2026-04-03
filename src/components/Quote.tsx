import React from 'react';
import { Link } from 'react-router-dom';
import StaggerChildren from '../staggerChildren';

const Quote: React.FC = () => {
  return (
    <div className="px-6 md:px-12 gap-10 flex flex-col-reverse text-gray-300 md:flex-row items-center">
      <StaggerChildren className="flex-1 flex flex-col">
        <p>
          {' '}
          Get a quick look at how the 6-week journey is structured. Each week is intentionally
          designed to build your clarity, skills, and confidence as you navigate your path in the
          energy sector. From understanding the energy landscape to developing personal visibility,
          every session delivers practical guidance, real-world insights, and mentorship that helps
          you grow with purpose.{' '}
        </p>
        <Link
          to="/schedule"
          className="inline-flex fade-in w-fit mt-7 items-center rounded-full bg-white text-black shadow font-medium overflow-hidden px-1 fade-in-delay-200"
        >
          <span className="pl-4 pr-3 py-3 inline-flex items-center">View Schedule</span>
          <span className="w-10 h-10 rounded-full bg-black text-white inline-flex items-center justify-center">
            ↗
          </span>
        </Link>
      </StaggerChildren>
      <div className="flex flex-col flex-1">
        <p className="cursive-font gradient-text font-extrabold text-7xl">
          “The future belongs to those who prepare for it today.”
        </p>
        <p className="text-end mt-4">~ Malcolm X</p>
      </div>
    </div>
  );
};

export default Quote;
