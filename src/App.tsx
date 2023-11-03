// import reactLogo from './assets/react.svg'

import { useState } from 'react';
import Loading from './shared/Loading';
import { useMovies } from './custom-hooks/useMovies';
import { useLocalStorageState } from './custom-hooks/useLocalStorageState';
import { watchedListType } from './../types';
import RateConversion from './RateConversion';
import { Box } from './components/Box';
import GeoLocation from './GeoLocation';
import { InitialText } from './search-movie-app/InitialText';
import { WatchList } from './search-movie-app/WatchList';
import { WatchedSummary } from './search-movie-app/WatchedSummary';
import { Search } from './search-movie-app/Search';
import { NavBar, Statistics } from './search-movie-app/NavBar';
import { ErrorMessage } from './components/ErrorMessage';
import { MovieDetails } from './search-movie-app/MovieDetails';
import { Main } from './components/Main';
import { MovieList } from './search-movie-app/Movie';

export const API_KEY = '46b47180';

function App() {
  const [watched, setWatched] = useLocalStorageState([], 'watched');

  // const [watched, setWatched] = useState<watchedListType[]>([]);
  // const [watched, setWatched] = useState<watchedListType[]>(() => {
  //   const storedValue = localStorage.getItem('watched')!;
  //   return JSON.parse(storedValue);
  // });

  const [query, setQuery] = useState('');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const { movies, err, isLoading } = useMovies(query); //custom hook

  function handleSelectMovie(id: string) {
    setSelectedId((selectedId) => (id === selectedId ? null : id));
  }

  function handleCloseMovieDetails() {
    setSelectedId(null);
  }

  function handleDeleteMovie(id: string) {
    setWatched((prev) => prev.filter((m) => m.imdbID !== id));
  }

  function handleAddWatched(movie: watchedListType) {
    setWatched((prev) => [...prev, movie]);
    handleCloseMovieDetails();
  }

  return (
    <>
      <NavBar>
        {movies.length > 0 && <Statistics movies={movies} />}
        <Search query={query} setQuery={setQuery}></Search>
      </NavBar>
      <Main>
        <Box>
          {!query && <InitialText></InitialText>}
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
              watchedlist={watched} //ts problem
              onClose={handleCloseMovieDetails}
              onAddWatched={handleAddWatched}
            />
          ) : (
            <>
              <WatchedSummary watched={watched}></WatchedSummary> //ts problem
              <WatchList
                watched={watched}
                onDeleteWatchedMovie={handleDeleteMovie}
              ></WatchList>
            </>
          )}
        </Box>
      </Main>
      {/* Here render the other small apps other than the search movie */}
      {/* <RateConversion></RateConversion> */}
      <GeoLocation></GeoLocation>
    </>
  );
}

export default App;

