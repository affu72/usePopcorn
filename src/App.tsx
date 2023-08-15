// import reactLogo from './assets/react.svg'

import React, { useState } from 'react';

type MovieType = {
  imdbID: string;
  Title: string;
  Year: string;
  Poster: string;
};

const tempMovieData: MovieType[] = [
  {
    imdbID: 'tt1375666',
    Title: 'Inception',
    Year: '2010',
    Poster:
      'https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg',
  },
  {
    imdbID: 'tt0133093',
    Title: 'The Matrix',
    Year: '1999',
    Poster:
      'https://m.media-amazon.com/images/M/MV5BNzQzOTk3OTAtNDQ0Zi00ZTVkLWI0MTEtMDllZjNkYzNjNTc4L2ltYWdlXkEyXkFqcGdeQXVyNjU0OTQ0OTY@._V1_SX300.jpg',
  },
  {
    imdbID: 'tt6751668',
    Title: 'Parasite',
    Year: '2019',
    Poster:
      'https://m.media-amazon.com/images/M/MV5BYWZjMjk3ZTItODQ2ZC00NTY5LWE0ZDYtZTI3MjcwN2Q5NTVkXkEyXkFqcGdeQXVyODk4OTc3MTY@._V1_SX300.jpg',
  },
];

type watchedListType = {
  imdbID: string;
  Title: string;
  Year: string;
  Poster: string;
  runtime: number;
  imdbRating: number;
  userRating: number;
};

const tempWatchedData: watchedListType[] = [
  {
    imdbID: 'tt1375666',
    Title: 'Inception',
    Year: '2010',
    Poster:
      'https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg',
    runtime: 148,
    imdbRating: 8.8,
    userRating: 10,
  },
  {
    imdbID: 'tt0088763',
    Title: 'Back to the Future',
    Year: '1985',
    Poster:
      'https://m.media-amazon.com/images/M/MV5BZmU0M2Y1OGUtZjIxNi00ZjBkLTg1MjgtOWIyNThiZWIwYjRiXkEyXkFqcGdeQXVyMTQxNzMzNDI@._V1_SX300.jpg',
    runtime: 116,
    imdbRating: 8.5,
    userRating: 9,
  },
];

function App() {
  const [movies, setMovies] = useState(tempMovieData);
  const [watched, setWached] = useState(tempWatchedData);
  return (
    <>
      <NavBar>
        <Search></Search>
        <Statistics movies={movies} />
      </NavBar>
      <Main>
        <Box>
          <MovieList movies={movies} />
        </Box>
        <Box>
          <WatchedSummary watched={watched}></WatchedSummary>
          <WatchList watched={watched}></WatchList>
        </Box>
      </Main>
    </>
  );
}

const NavBar = ({ children }: { children: React.ReactNode }) => {
  return (
    <nav className="flex h-16 items-center justify-between rounded-md bg-[#6741d9] px-8 py-2">
      <Logo />
      {children}
    </nav>
  );
};

const Main = ({ children }: { children: React.ReactNode }) => {
  return (
    <main className="mt-6 flex h-[calc(100dvh-7.2rem-3*2.4rem)] flex-wrap justify-center gap-6 sm:mt-6">
      {children}
    </main>
  );
};

const Logo = () => {
  return (
    <div className="flex items-center text-sm sm:text-xl">
      <span role="img" className="text-3xl">
        🍿
      </span>
      <h1 className="hidden font-bold sm:block">usePopcorn</h1>
    </div>
  );
};

const Search = () => {
  const [query, setQuery] = useState('');
  return (
    <input
      type="text"
      className="text-md ms:px-4 ms:py-4 ms:text-xl w-40 rounded-md bg-[#7950f2]  px-3 py-2 outline-none transition-all duration-300 placeholder:text-sm sm:w-72 sm:placeholder:text-base sm:focus:w-96"
      placeholder="Search movies..."
      onChange={(e) => setQuery(e.target.value)}
    />
  );
};

const Statistics = ({ movies }: { movies: MovieType[] }) => {
  return (
    <div className="">
      <p className="text-sm sm:text-xl">
        Found <span className="font-bold">{movies.length}</span> results
      </p>
    </div>
  );
};

const Box = ({ children }: { children: React.ReactNode }) => {
  const [isOpen, setIsOpen] = useState(true);
  return (
    <div className="relative w-96 max-w-sm rounded-md bg-[#2b3035] h-full overflow-auto scrollbar transition-all duration-700">
      <button
        onClick={() => setIsOpen((open) => !open)}
        className="absolute right-2 top-2 flex aspect-square h-4 items-center justify-center rounded-full bg-[#212529]"
      >
        <span className="mb-1.5 text-xl">{isOpen ? '-' : '+'}</span>
      </button>
      {isOpen && children}
    </div>
  );
};

const average = (value: number[]) =>
  value.reduce((acc, num) => num / value.length + acc, 0);

const MovieList = ({ movies }: { movies: MovieType[] }) => {
  return (
    <ul className="divide-y divide-stone-700">
      {movies.map((movie) => {
        return <Movie movie={movie} key={movie.imdbID}></Movie>;
      })}
    </ul>
  );
};

const Movie = ({ movie }: { movie: MovieType }) => {
  return (
    <li className="grid grid-cols-[40px_1fr] items-center gap-x-6 px-8 py-4">
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

const WatchedSummary = ({ watched }: { watched: watchedListType[] }) => {
  const avgImbdRating = average(watched.map((movie) => movie.imdbRating));
  const avgUserRating = average(watched.map((movie) => movie.userRating));
  const avgRunTime = average(watched.map((movie) => movie.runtime));

  return (
    <div className="bg-[#343a40] px-8 pb-6 pt-4 rounded-md shadow-md">
      <h3 className="uppercase text-lg mb-1 tracking-wide font-normal">
        movies you watched
      </h3>
      <div className="flex items-center justify-between text-sm">
        <p className="flex gap-1.5 font-medium">
          <span>#️⃣</span>
          <span>{watched.length} movies</span>
        </p>
        <p className="flex gap-1.5 font-medium">
          <span>⭐</span>
          <span>{avgImbdRating}</span>
        </p>
        <p className="flex gap-1.5 font-medium">
          <span>🌟</span>
          <span>{avgUserRating}</span>
        </p>
        <p className="flex gap-1.5 font-medium">
          <span>⌛</span>
          <span>{avgRunTime} mins</span>
        </p>
      </div>
    </div>
  );
};

const WatchList = ({ watched }: { watched: watchedListType[] }) => {
  return (
    <ul className="divide-y divide-stone-700">
      {watched.map((movie) => {
        return <WatchedMovie movie={movie} key={movie.imdbID} />;
      })}
    </ul>
  );
};

const WatchedMovie = ({ movie }: { movie: watchedListType }) => {
  return (
    <li
      key={movie.imdbID}
      className="grid grid-cols-[40px_1fr] items-center gap-x-6 px-8 py-4"
    >
      <img
        src={movie.Poster}
        alt="movie poster"
        className="row-span-2 w-full"
      />
      <h3 className="text-base font-semibold">{movie.Title}</h3>
      <div className="flex items-center gap-4 text-sm">
        <p className="flex gap-1">
          <span>⭐</span>
          <span>{8.65}</span>
        </p>
        <p className="flex gap-1">
          <span>🌟</span>
          <span>{8.65}</span>
        </p>
        <p className="flex gap-1">
          <span>⌛</span>
          <span>{132} mins</span>
        </p>
      </div>
    </li>
  );
};

export default App;
