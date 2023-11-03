import React from 'react';
import { watchedListType } from '../../types';

export const WatchedMovie = ({
  movie,
  onDeleteWatchedMovie,
}: {
  movie: watchedListType;
  onDeleteWatchedMovie: (id: string) => void;
}) => {
  return (
    <li
      key={movie.imdbID}
      className="flex justify-between pr-8 transition-all duration-500"
    >
      <div className="grid grid-cols-[40px_1fr] items-center gap-x-6 px-8 py-4">
        <img
          src={movie.poster}
          alt={`${movie.title} poster`}
          className="row-span-2 w-full"
        />
        <h3 className="text-base font-semibold">{movie.title}</h3>
        <div className="flex items-center gap-4 text-sm">
          <p className="flex gap-1">
            <span>⭐</span>
            <span>{movie.imdbRating}</span>
          </p>
          <p className="flex gap-1">
            <span>🌟</span>
            <span>{movie.userRating}</span>
          </p>
          <p className="flex gap-1">
            <span>⌛</span>
            <span>{movie.runtime} mins</span>
          </p>
        </div>
      </div>
      <button
        className="font-semibold self-center bg-red-500 aspect-square h-4 rounded-full text-black text-xs flex items-center justify-center"
        onClick={() => onDeleteWatchedMovie(movie.imdbID)}
      >
        X
      </button>
    </li>
  );
};
