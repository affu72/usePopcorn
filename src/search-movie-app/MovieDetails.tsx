import { useEffect, useRef, useState } from 'react';
import Loading from '../shared/Loading';
import StarRating from '../shared/StarRating';
import { useKeyboard } from '../custom-hooks/useKeyboard';
import { TmovieDetails, watchedListType } from '../../types';
import { API_KEY } from '../App';

export function MovieDetails({
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

  useKeyboard('Escape', onClose);

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
