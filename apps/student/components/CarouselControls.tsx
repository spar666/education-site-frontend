import React from 'react';

const CarouselControls = ({ onSlideChange }: any) => {
  const handleClick = (direction: string) => {
    onSlideChange({ direction });
  };

  return (
    <div className="flex justify-end">
      <button
        type="button"
        aria-label="Previous Slide"
        onClick={() => handleClick('prev')}
        className="mr-4" // Add margin-right for spacing
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 19l-7-7 7-7"
          />
        </svg>
      </button>
      <button
        type="button"
        aria-label="Next Slide"
        onClick={() => handleClick('next')}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5l7 7-7 7"
          />
        </svg>
      </button>
    </div>
  );
};

export default CarouselControls;
