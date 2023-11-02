// import reactLogo from './assets/react.svg'

import React, { DOMElement, useEffect, useRef, useState } from 'react';
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
  title: string;
  year: string;
  poster: string;
  runtime: number;
  imdbRating: number;
  userRating: number;
  countRatingDecision: number;
  list: number[];
};

type TmovieDetails = {
  title: string;
  year: string;
  poster: string;
  runtime: string;
  imdbRating: string;
  plot: string;
  released: string;
  director: string;
  genre: string;
  actor: string;
};
const API_KEY = '46b47180';

function App() {
  const [movies, setMovies] = useState<MovieType[]>([]);
  // const [watched, setWatched] = useState<watchedListType[]>([]);
  const [watched, setWatched] = useState<watchedListType[]>(() => {
    const storedValue = localStorage.getItem('watched')!;
    return JSON.parse(storedValue);
  });
  const [query, setQuery] = useState('');
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const [isLoading, setIsLoading] = useState(false);
  const [err, setErr] = useState('');

  function handleSelectMovie(id: string) {
    setSelectedId((selectedId) => (id === selectedId ? null : id));
  }

  function handleCloseMovieDetails() {
    setSelectedId(null);
  }

  function handleDeleteMovie(id: string) {
    setWatched((prev) => prev.filter((m) => m.imdbID !== id));
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

  function handleAddWatched(movie: watchedListType) {
    setWatched((prev) => [...prev, movie]);
    handleCloseMovieDetails();
  }

  useEffect(
    function () {
      localStorage.setItem('watched', JSON.stringify(watched));
    },
    [watched],
  );

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
              watchedlist={watched}
              onClose={handleCloseMovieDetails}
              onAddWatched={handleAddWatched}
            />
          ) : (
            <>
              <WatchedSummary watched={watched}></WatchedSummary>
              <WatchList
                watched={watched}
                onDeleteWatchedMovie={handleDeleteMovie}
              ></WatchList>
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
  onAddWatched,
  watchedlist,
}: {
  selectedId: string;
  onClose: () => void;
  onAddWatched: (movie: watchedListType) => void;
  watchedlist: watchedListType[];
}) {
  const [movie, setMovie] = useState<TmovieDetails>({
    title: '',
    year: '',
    poster: '',
    runtime: '',
    imdbRating: '',
    plot: '',
    released: '',
    director: '',
    genre: '',
    actor: '',
  });

  const [isLoading, setIsLoading] = useState(false);
  const [userRating, setUserRating] = useState<number>(0);
  const countRef = useRef(0);
  const ratingDecisionList = useRef<number[]>([]);

  const isWatched = watchedlist?.find((m) => m.imdbID === selectedId);

  useEffect(
    function () {
      if (userRating) {
        countRef.current++;
        ratingDecisionList.current.push(userRating);
      }
    },
    [userRating],
  );

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

  useEffect(
    function () {
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

  function handleAdd() {
    const newWatchedMovie: watchedListType = {
      imdbID: selectedId,
      title,
      year,
      poster,
      imdbRating: +imdbRating,
      runtime: +runtime.split(' ').at(0),
      userRating,
      countRatingDecision: countRef.current,
      list: ratingDecisionList.current,
    };

    onAddWatched(newWatchedMovie);
  }

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
        <div className="bg-gray-800/60 rounded-md p-4 flex flex-col">
          {!isWatched ? (
            <>
              <StarRating
                maxRating={10}
                size={36}
                onRate={setUserRating}
              ></StarRating>
              {userRating > 0 && (
                <button
                  className="bg-[#6741d9] px-4 py-2 rounded-xl mt-2 transition-all duration-300 hover:bg-[#6741a9]"
                  onClick={handleAdd}
                >
                  +Add to list
                </button>
              )}
            </>
          ) : (
            <p className="text-white tracking-wider">
              You rated this movie {isWatched.userRating}⭐
            </p>
          )}
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
  // 1.
  const inputEl = useRef<HTMLInputElement>(null);

  useEffect(
    function () {
      function callback(e: KeyboardEvent) {
        if (document.activeElement === inputEl.current) return; // if element is already focused just return

        if (e.code === 'Enter') {
          inputEl.current!.focus(); // focus whenevr we click the enter key.
          setQuery('');
        }
      }

      document.addEventListener('keydown', callback);
      // console.log(inputEl.current);
      inputEl.current!.focus(); //this will focus when app mount

      return () => removeEventListener('keydown', callback);
    },
    [query],
  );
  // useEffect(function () {
  //   const el = document.querySelector('.search') as HTMLInputElement;
  //   console.log(el);
  //   el.focus();
  // }, []);

  return (
    <input
      ref={inputEl}
      type="text"
      className="text-md ms:px-4 ms:py-4 ms:text-xl w-40 rounded-md bg-[#7950f2]  px-3 py-2 outline-none transition-all duration-300 placeholder:text-sm sm:w-72 sm:placeholder:text-base sm:focus:w-96 search"
      placeholder="Search movies... <min 3 char>"
      onChange={(e) => setQuery(e.target.value)}
      value={query}
      // autoFocus={true}
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
        {/* <span className="mb-1.5 text-xl">{isOpen ? '-' : '+'}</span> */}
        {isOpen ? '-' : '+'}
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
      className="grid grid-cols-[40px_1fr] items-center gap-x-6 px-8 py-4 cursor-pointer hover:bg-stone-900 w-full"
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

const WatchList = ({
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

const WatchedMovie = ({
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

function StartSearchText() {
  return (
    <div className="flex flex-col items-center h-full border-red-300 w-full justify-center">
      <span className="tracking-wide text-xl">
        Press <em>Enter</em> to
      </span>
      <span className="uppercase text-4xl tracking-widest font-extrabold">
        Start
      </span>
      <span className="tracking-wide text-xl">searching a movie...</span>
    </div>
  );
}


export default App;

