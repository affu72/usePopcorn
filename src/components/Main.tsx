import React from 'react';

export const Main = ({ children }: { children: React.ReactNode }) => {
  return (
    <main className="mt-6 flex h-[calc(100dvh-7.2rem-3*2.4rem)] flex-wrap justify-center gap-6 sm:mt-6">
      {children}
    </main>
  );
};
