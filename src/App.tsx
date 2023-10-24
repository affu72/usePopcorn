// import reactLogo from './assets/react.svg'

import React, { useEffect, useState } from 'react';
import Loading from './Loading';
import StarRating from './StarRating';
import RateConversion from './RateConversion';

type MovieType = {
  imdbID: string;
  Title: string;
  Year: string;
  Poster: string;
};

type watchedListType = {
  imdbID: string;
  Title: string;
  Year: string;
  Poster: string;
  runtime: number;
  imdbRating: number;
  userRating: number;
};
const API_KEY = '46b47180';

function App() {
  const [movies, setMovies] = useState([]);
  const [watched, setWached] = useState([]);
  const [query, setQuery] = useState('');
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const [isLoading, setIsLoading] = useState(false);
  const [err, setErr] = useState('');

  function handleSelectMovie(id: string) {
    setSelectedId((selectedId) => (id === selectedId ? null : id));
  }

  function handleCloseMovieDetails() {
    console.log(
      'change selected id to null, settstae will be called and hence this component will get rended so all its child will also re-render, but as details component unmounted, the effect will not run',
    );
    setSelectedId(null);
  }

  useEffect(() => {
    const controller = new AbortController();
    async function getMovieData() {
      try {
        setIsLoading(true);
        setErr('');
        const res = await fetch(
          `http://www.omdbapi.com/?apikey=${API_KEY}&s=${query}`,
          { signal: controller.signal },
        );

        if (!res.ok)
          throw new Error('Something went wrong in fetching movie data');

        const data = await res.json();

        if (data.Response === 'False') {
          throw new Error(data.Error);
        }

        setMovies(() => data.Search);
      } catch (err: any) {
        setMovies([]);
        if (err.name !== 'AbortError') {
          setErr(err.message);
        }
      } finally {
        setIsLoading(false);
      }
    }

    if (query.length < 3) {
      setMovies([]);
      setErr('');
      return;
    }

    handleCloseMovieDetails();
    getMovieData();

    return function () {
      controller.abort();
    };
  }, [query]);

  return (
    <>
      <NavBar>
        {movies.length > 0 && <Statistics movies={movies} />}
        <Search query={query} setQuery={setQuery}></Search>
      </NavBar>
      <Main>
        <Box>
          {!query && <StartSearchText></StartSearchText>}
          {err && <ErrorMessage message={err} />}
          {isLoading && <Loading />}
          {!err && !isLoading && (
            <MovieList movies={movies} onSelect={handleSelectMovie} />
          )}
        </Box>
        <Box>
          {selectedId ? (
            <MovieDetails
              selectedId={selectedId}
              onClose={handleCloseMovieDetails}
            />
          ) : (
            <>
              <WatchedSummary watched={watched}></WatchedSummary>
              <WatchList watched={watched}></WatchList>
            </>
          )}
        </Box>
      </Main>
    </>
  );
}

function MovieDetails({
  selectedId,
  onClose,
}: {
  selectedId: string;
  onClose: () => void;
}) {
  const [movie, setMovie] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const {
    Title: title,
    Year: year,
    Poster: poster,
    Runtime: runtime,
    imdbRating,
    Plot: plot,
    Released: released,
    Director: director,
    Genre: genre,
    Actor: actor,
  } = movie;

  useEffect(() => {
    async function getMovieDetails() {
      setIsLoading(true);
      const res = await fetch(
        `http://www.omdbapi.com/?apikey=${API_KEY}&i=${selectedId}`,
      );

      const data = await res.json();

      setMovie(data);
      setIsLoading(false);
    }

    getMovieDetails();
  }, [selectedId]);

  useEffect(
    function () {
      console.log(selectedId);
      if (!title) return;
      document.title = selectedId ? `Movie | ${title}` : 'usePopcorn';

      return function () {
        document.title = 'usePopcorn';
        console.log('runs when unmount and re-render');
      };
    },
    [title, selectedId],
  );

  useEffect(() => {
    function handleKeypress(e) {
      if (e.code === 'Escape') {
        onClose();
      }
    }

    document.addEventListener('keydown', handleKeypress);
    return function () {
      document.removeEventListener('keydown', handleKeypress);
    };
  }, []);

  return isLoading ? (
    <Loading />
  ) : (
    <div className="p-2 flex flex-col gap-4 justify-center">
      <header className="relative flex">
        <button
          className="bg-gray-200/80 lex aspect-square h-8 flex items-center justify-center rounded-full text-3xl font-bold absolute text-gray-900"
          onClick={onClose}
        >
          <span className="mb-1.5">&larr;</span>
        </button>
        <img src={poster} alt={`poster of the ${title}`} className="h-40" />
        <div className="flex flex-col gap-1 ml-8">
          <h2 className="font-bold">{title}</h2>
          <p>
            {released} &bull; {runtime}
          </p>
          <p>{genre}</p>
          <p>
            <span>⭐</span>
            {imdbRating} imdb rating
          </p>
        </div>
      </header>

      <section className="flex flex-col gap-4 ml-4">
        <div className="bg-gray-800/60 rounded-md px-6 self-center py-4 w-full">
          <StarRating maxRating={10} size={36}></StarRating>
        </div>
        <p>
          <em>{plot}</em>
        </p>
        <p>Starring {actor}</p>
        <p>Directed by {director}</p>
      </section>
    </div>
  );
}

function ErrorMessage({ message }: { message: string }) {
  return (
    <div className="h-full flex items-center justify-center">
      <p>{message}</p>
    </div>
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

type PropSearch = {
  query: string;
  setQuery: (s: string) => void;
};

const Search = ({ query, setQuery }: PropSearch) => {
  return (
    <input
      type="text"
      className="text-md ms:px-4 ms:py-4 ms:text-xl w-40 rounded-md bg-[#7950f2]  px-3 py-2 outline-none transition-all duration-300 placeholder:text-sm sm:w-72 sm:placeholder:text-base sm:focus:w-96"
      placeholder="Search movies... <min 3 char>"
      onChange={(e) => setQuery(e.target.value)}
      value={query}
      autoFocus={true}
    />
  );
};

const Statistics = ({ movies }: { movies: MovieType[] }) => {
  return (
    <div className="justify-self-end">
      <p className="text-sm sm:text-xl">
        Found <span className="font-bold">{movies.length}</span> results
      </p>
    </div>
  );
};

const Box = ({ children }: { children: React.ReactNode }) => {
  const [isOpen, setIsOpen] = useState(true);
  return (
    <div className="relative w-96 max-w-md rounded-md bg-[#2b3035] h-full overflow-auto scrollbar transition-all duration-700">
      <button
        onClick={() => setIsOpen((open) => !open)}
        className="sticky top-2 mr-2 right-0 flex aspect-square h-4 items-center justify-center rounded-full bg-[#212529] float-right"
      >
        <span className="mb-1.5 text-xl">{isOpen ? '-' : '+'}</span>
      </button>
      {isOpen && children}
    </div>
  );
};

const average = (value: number[]) =>
  value.reduce((acc, num) => num / value.length + acc, 0);

const MovieList = ({
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

const Movie = ({
  movie,
  onSelect,
}: {
  movie: MovieType;
  onSelect: (id: string) => void;
}) => {
  return (
    <li
      className="grid grid-cols-[40px_1fr] items-center gap-x-6 px-8 py-4 cursor-pointer hover:bg-stone-900"
      onClick={() => onSelect(movie.imdbID)}
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

function StartSearchText() {
  return (
    <div className="flex flex-col items-center h-full border-red-300 w-full justify-center">
      <span className="uppercase text-4xl tracking-widest font-extrabold">
        Start
      </span>
      <span className="tracking-wide text-xl">Searching a movie...</span>
    </div>
  );
}

export default App;
