import React from 'react';
import { watchedListType } from '../../types';
import { average } from './Movie';

export const WatchedSummary = ({ watched }: { watched: watchedListType[] }) => {
  const avgImbdRating = average(watched.map((movie) => movie.imdbRating));
  const avgUserRating = average(watched.map((movie) => movie.userRating));
  const avgRunTime = average(watched.map((movie) => movie.runtime));

  return (
    <div className="bg-[#343a40] px-8 pb-6 pt-4 rounded-md shadow-md sticky top-0">
      <h3 className="uppercase text-lg mb-1 tracking-wide font-normal">
        movies you watched
      </h3>
      <div className="flex items-center justify-between text-sm">
        <p className="flex gap-1.5 font-medium">
          <span>#️⃣</span>
          <span>
            {watched.length} movie{watched.length > 1 && 's'}
          </span>
        </p>
        <p className="flex gap-1.5 font-medium">
          <span>⭐</span>
          <span>{avgImbdRating.toFixed(2)}</span>
        </p>
        <p className="flex gap-1.5 font-medium">
          <span>🌟</span>
          <span>{avgUserRating.toFixed(2)}</span>
        </p>
        <p className="flex gap-1.5 font-medium">
          <span>⌛</span>
          <span>{avgRunTime.toFixed(2)} mins</span>
        </p>
      </div>
    </div>
  );
};
