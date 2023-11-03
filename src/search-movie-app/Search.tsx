import React, { useRef } from 'react';
import { useKeyboard } from '../custom-hooks/useKeyboard';

type PropSearch = {
  query: string;
  setQuery: (s: string) => void;
};
export const Search = ({ query, setQuery }: PropSearch) => {
  const inputEl = useRef<HTMLInputElement>(null);

  useKeyboard('Enter', function () {
    if (document.activeElement === inputEl.current) return;
    inputEl.current!.focus();
    setQuery('');
  });

  return (
    <input
      ref={inputEl}
      type="text"
      className="text-md ms:px-4 ms:py-4 ms:text-xl w-40 rounded-md bg-[#7950f2]  px-3 py-2 outline-none transition-all duration-300 placeholder:text-sm sm:w-72 sm:placeholder:text-base sm:focus:w-96 search"
      placeholder="Search movies... <min 3 char>"
      onChange={(e) => setQuery(e.target.value)}
      value={query}
    />
  );
};
