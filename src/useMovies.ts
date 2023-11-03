import { useEffect, useState } from 'react';
import { MovieType } from './../types';
const API_KEY = '46b47180';

// export function useMovies(query: string, callback?: () => void) {

//when aded the callback in deopendency array it it giving invite error, so removing that funtionality for now.

export function useMovies(query: string) {
  const [movies, setMovies] = useState<MovieType[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [err, setErr] = useState('');
  useEffect(() => {
    // callback?.();
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

    getMovieData();

    return function () {
      controller.abort();
    };
  }, [query]);

  return { movies, err, isLoading };
}
