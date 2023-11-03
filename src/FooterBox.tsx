import React, { ReactNode } from 'react';

export default function ({ children }: { children: ReactNode }) {
  return (
    <div className=" bg-[#2b3035]  mt-8 h-28 flex justify-between p-4 items-center">
      {children}
    </div>
  );
}
