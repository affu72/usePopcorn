import React from 'react';
import { MovieType } from '../../types';
import { Logo } from './Logo';

export const NavBar = ({ children }: { children: React.ReactNode }) => {
  return (
    <nav className="flex h-16 items-center justify-between rounded-md bg-[#6741d9] px-8 py-2">
      <Logo />
      {children}
    </nav>
  );
};
export const Statistics = ({ movies }: { movies: MovieType[] }) => {
  return (
    <div className="justify-self-end">
      <p className="text-sm sm:text-xl">
        Found <span className="font-bold">{movies.length}</span> results
      </p>
    </div>
  );
};
