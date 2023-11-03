import React, { useState } from 'react';

export const Box = ({ children }: { children: React.ReactNode }) => {
  const [isOpen, setIsOpen] = useState(true);
  return (
    <div className="relative w-96 max-w-md rounded-md bg-[#2b3035] h-full overflow-auto scrollbar transition-all duration-700">
      <button
        onClick={() => setIsOpen((open) => !open)}
        className="sticky top-2 mr-2 right-0 flex aspect-square h-4 items-center justify-center rounded-full bg-[#212529] float-right"
      >
        {/* <span className="mb-1.5 text-xl">{isOpen ? '-' : '+'}</span> */}
        {isOpen ? '-' : '+'}
      </button>
      {isOpen && children}
    </div>
  );
};
