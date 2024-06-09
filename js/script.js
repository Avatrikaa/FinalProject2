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
    console.log(data); // Log the response data for inspection
    if (data.Search) {
      movies = data.Search; // Adjust based on the actual response structure
    } else {
      console.error("Unexpected response structure:", data);
    }
    renderMovies();
  } catch (error) {
    console.error("Error fetching", error);
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

const renderMovies = () => {
  topMovies.innerHTML = "";
  const rating = starRating(7.74);
  if (Array.isArray(movies)) {
    movies.slice(0, visibleMovies).forEach((movie) => {
      const card = document.createElement("div");
      card.classList.add("movieCard");
      card.innerHTML = `
        <img src="${movie.Poster}" alt="${movie.Title}"/>
        <h3>${movie.Title}</h3>
        <div class="rating">${rating}</div>`;
      topMovies.appendChild(card);
    });
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
