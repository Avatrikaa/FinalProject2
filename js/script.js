let movies = [];
let visibleMovies = 3;
const topMovies = document.getElementById("topMovie");
const loadMoreButton = document.getElementById("load-more-button");

const fetchMovies = async () => {
  try {
    const response = await fetch(
      "https://www.omdbapi.com/?apikey=df6f6c34&s=movie&page=1"
    );
    const data = await response.json();
    console.log(data);
    if (data.Search) {
      movies = data.Search;
    } else {
      console.error("Unexpected response structure:", data);
    }
    renderMovies();
  } catch (error) {
    console.error("Error fetching movies:", error);
  }
};

function starRating(rating) {
  const rateDown = Math.floor(rating / 2);
  const rateUp = Math.ceil(rating / 2 - rateDown);
  let stars = "";
  for (let i = 0; i < rateDown; i++) {
    stars += '<img id="star" src="../images/Star.png" alt="star" />';
  }

  for (let i = 0; i < rateUp; i++) {
    stars += '<img id="halfstar" src="../images/HalfStar.png" alt="star" />';
  }
  return stars;
}

const movieDetails = async (imdbID) => {
  try {
    const response = await fetch(
      `http://www.omdbapi.com/?apikey=df6f6c34&i=${imdbID}&plot=full`
    );
    const data = await response.json();
    if (data.Response === "True") {
      const detailsTab = window.open("movieDetails.html", "_Blank");
      detailsTab.onload = function () {
        detailsTab.document.getElementById("backgroundposter").src =
          data.Poster;
        const movieDitail = detailsTab.document.getElementById("detailsMain");
        const movieCardItem = document.createElement("div");
        movieCardItem.classList.add("movieCardItem");
        movieCardItem.classList.add("movie-card");
        movieCardItem.innerHTML = `
          <h1>${data.Title}</h1>
          <div class="rating">${starRating(data.imdbRating)}</div>
          <div class="plotText"><p>${data.Plot}</p></div>
          <img  id="poster" src=${data.Poster} alt="movie Poster"/>`;
        movieDitail.appendChild(movieCardItem);
      };
    }
  } catch {
    console.error("Error fetching movie details:", error);
  }
};

const renderMovies = async () => {
  topMovies.innerHTML = "";
  if (Array.isArray(movies)) {
    for (const movie of movies.slice(0, visibleMovies)) {
      try {
        const response = await fetch(
          `http://www.omdbapi.com/?apikey=df6f6c34&i=${movie.imdbID}&plot=full`
        );
        const data = await response.json();
        const rating = starRating(data.imdbRating);
        console.log(data.Released);
        const card = document.createElement("div");
        card.classList.add("movieCard");
        card.innerHTML = `
          <img src="${movie.Poster}" alt="${movie.Title}"/>
          <h3>${movie.Title}</h3>
          <div class="rating">${rating}</div>
          <p class="releaseDate">${data.Released}</p>
          <p class="plot">${data.Plot}</p>
          <p id="imdbRating">${data.imdbRating}</p>`;
        card.addEventListener("click", () => {
          movieDetails(movie.imdbID);
        });
        topMovies.appendChild(card);
      } catch (error) {
        console.error(
          `Error fetching details for movie ${movie.Title}:`,
          error
        );
      }
    }
    topMovies.appendChild(loadMoreButton);
  } else {
    console.error("Movies is not an array:", movies);
  }
};

const showMoreMovies = () => {
  visibleMovies += 3;
  renderMovies();
};

loadMoreButton.addEventListener("click", showMoreMovies);

fetchMovies();
