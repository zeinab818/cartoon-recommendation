export const TMDB_CONFIG = {
  BASE_URL: "https://api.themoviedb.org/3",
  API_KEY: process.env.EXPO_PUBLIC_CARTOON_API_KEY,
  headers: {
    accept: "application/json",
    Authorization: `Bearer ${process.env.EXPO_PUBLIC_CARTOON_API_KEY}`,
  },
};


export const fetchMovies = async ({
  query,
}: {
  query: string;
}): Promise<Movie[]> => {
  const endpoint = query
    ? `${TMDB_CONFIG.BASE_URL}/search/movie?query=${encodeURIComponent(
        query
      )}&include_adult=false&with_genres=16&certification_country=US&certification.lte=PG`
    : `${TMDB_CONFIG.BASE_URL}/discover/movie?sort_by=popularity.desc&include_adult=false&with_genres=16,10751&certification_country=US&certification.lte=PG`;

  const response = await fetch(endpoint, {
    method: "GET",
    headers: TMDB_CONFIG.headers,
  });

  if (!response.ok) {
    console.error("❌ TMDB Fetch error:", response.statusText);
    return [];
  }

  const data = await response.json();

  // 🧠 تأكيد إن النتائج موجودة فعلاً
  if (!data || !Array.isArray(data.results)) {
    console.warn("⚠️ No valid results returned from TMDB:", data);
    return [];
  }


  const filtered = data.results.filter(
    (movie: any) =>
      movie.genre_ids?.includes(16) || movie.genre_ids?.includes(10751)
  );

  return filtered;
};

export const fetchMovieDetails = async (
  movieId: string
): Promise<MovieDetails> => {
  try {
    const response = await fetch(
  `${TMDB_CONFIG.BASE_URL}/movie/${movieId}?append_to_response=videos&include_adult=false`,
  {
    method: "GET",
    headers: TMDB_CONFIG.headers,
  }
);


    if (!response.ok) {
      throw new Error(`Failed to fetch movie details: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching movie details:", error);
    throw error;
  }
};
