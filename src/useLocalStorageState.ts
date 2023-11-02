import { useEffect, useState } from 'react';

type watchedListType = {
  imdbID: string;
  title: string;
  year: string;
  poster: string;
  runtime: number;
  imdbRating: number;
  userRating: number;
  countRatingDecision: number;
  list: number[];
};

export function useLocalStorageState(initialState: Array<any>, key: string) {
  const [value, setValue] = useState<watchedListType[]>(() => {
    const storedValue = localStorage.getItem(key);
    return storedValue ? JSON.parse(storedValue) : initialState;
  });

  useEffect(
    function () {
      localStorage.setItem(key, JSON.stringify(value));
    },

    [value, key],
  );

  return [value, setValue];
}
