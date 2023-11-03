import React from 'react';
import { watchedListType } from '../../types';
import { WatchedMovie } from './WatchedMovie';

export const WatchList = ({
  watched,
  onDeleteWatchedMovie,
}: {
  watched: watchedListType[];
  onDeleteWatchedMovie: (id: string) => void;
}) => {
  return (
    <ul className="divide-y divide-stone-700">
      {watched.map((movie) => {
        return (
          <WatchedMovie
            movie={movie}
            key={movie.imdbID}
            onDeleteWatchedMovie={onDeleteWatchedMovie}
          />
        );
      })}
    </ul>
  );
};
