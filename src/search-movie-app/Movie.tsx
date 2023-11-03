import { MovieType } from '../../types';

export const Movie = ({
  movie,
  onSelect,
}: {
  movie: MovieType;
  onSelect: (id: string) => void;
}) => {
  return (
    <li
      className="grid grid-cols-[40px_1fr] items-center gap-x-6 px-8 py-4 cursor-pointer hover:bg-stone-900 w-full"
      onClick={() => onSelect(movie.imdbID)}
      tabIndex={0}
    >
      <img
        src={movie.Poster}
        alt="movie poster"
        className="row-span-2 w-full"
      />
      <h3 className="text-base font-semibold">{movie.Title}</h3>
      <div className="flex items-center gap-2">
        <span>🗓</span>
        <span>{movie.Year}</span>
      </div>
    </li>
  );
};
export const average = (value: number[]) =>
  value.reduce((acc, num) => num / value.length + acc, 0);
export const MovieList = ({
  movies,
  onSelect,
}: {
  movies: MovieType[];
  onSelect: (id: string) => void;
}) => {
  return (
    <ul className="divide-y divide-stone-700">
      {movies.map((movie) => {
        return (
          <Movie movie={movie} key={movie.imdbID} onSelect={onSelect}></Movie>
        );
      })}
    </ul>
  );
};
