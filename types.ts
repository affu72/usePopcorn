export type MovieType = {
  imdbID: string;
  Title: string;
  Year: string;
  Poster: string;
};

export type watchedListType = {
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

export type TmovieDetails = {
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
