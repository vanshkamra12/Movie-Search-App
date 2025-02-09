const API_KEY = '5d81c06e3964adb433d9c57838bbfc34';
const BASE_URL = 'https://api.themoviedb.org/3';
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';

const searchInput = document.querySelector('.search-input');
const moviesGrid = document.querySelector('.movies-grid');
const modal = document.querySelector('.modal');
const modalBody = document.querySelector('.modal-body');
const closeButton = document.querySelector('.close-button');
const loadingIndicator = document.querySelector('.loading');



function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
    const later = () => {
    clearTimeout(timeout);
    func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    };
}


async function fetchMovies(query) {
    try {
    loadingIndicator.style.display = 'block';
    moviesGrid.innerHTML = '';

    const response = await fetch(
    `${BASE_URL}/search/movie?api_key=${API_KEY}&query=${query}&language=en-US&page=1`
    );
    const data = await response.json();
        
    if (data.results.length === 0) {
    moviesGrid.innerHTML = '<p style="text-align: center; grid-column: 1/-1;">No movies found</p>';
    return;
        }

    displayMovies(data.results);
    } catch (error) {
        console.error('Error:', error);
        moviesGrid.innerHTML = '<p style="text-align: center; grid-column: 1/-1;">Error fetching movies</p>';
    } finally {
        loadingIndicator.style.display = 'none';
    }
}


function displayMovies(movies) {
    moviesGrid.innerHTML = '';
    movies.forEach(movie => {
    const movieCard = document.createElement('div');
    movieCard.classList.add('movie-card');
    movieCard.innerHTML = `
    <img 
    src="${movie.poster_path ? IMAGE_BASE_URL + movie.poster_path : '/api/placeholder/200/300'}"
    alt="${movie.title}"
    class="movie-poster"
    >
    <div class="movie-info">
    <h3 class="movie-title">${movie.title}</h3>
    <span class="movie-rating">⭐ ${movie.vote_average.toFixed(1)}</span>
            </div>
        `;
        movieCard.addEventListener('click', () => showMovieDetails(movie.id));
        moviesGrid.appendChild(movieCard);
    });
}


async function showMovieDetails(movieId) {
    try {
        const response = await fetch(
            `${BASE_URL}/movie/${movieId}?api_key=${API_KEY}&language=en-US`
        );
        const movie = await response.json();

        modalBody.innerHTML = `
        <img 
        src="${movie.poster_path ? IMAGE_BASE_URL + movie.poster_path : '/api/placeholder/300/450'}"
        alt="${movie.title}"
        class="modal-poster"
        >
        <div class="modal-info">
        <h2 class="modal-title">${movie.title}</h2>
        <p class="modal-overview">${movie.overview}</p>
        <div class="modal-details">
        <p><strong>Release Date:</strong> ${movie.release_date}</p>
        <p><strong>Rating:</strong> ⭐ ${movie.vote_average.toFixed(1)} (${movie.vote_count} votes)</p>
        <p><strong>Runtime:</strong> ${movie.runtime} minutes</p>
        <p><strong>Genres:</strong> ${movie.genres.map(genre => genre.name).join(', ')}</p>
                </div>
            </div>
        `;
        modal.style.display = 'block';
    } catch (error) {
        console.error('Error:', error);
    }
}


searchInput.addEventListener('input', debounce((e) => {
    const query = e.target.value.trim();
    if (query.length >= 3) {
        fetchMovies(query);
    }
}, 500));

closeButton.addEventListener('click', () => {
    modal.style.display = 'none';
});

window.addEventListener('click', (e) => {
    if (e.target === modal) {
        modal.style.display = 'none';
    }
});


async function loadPopularMovies() {
    try {
        loadingIndicator.style.display = 'block';
        const response = await fetch(
            `${BASE_URL}/movie/popular?api_key=${API_KEY}&language=en-US&page=1`
        );
        const data = await response.json();
        displayMovies(data.results);
    } catch (error) {
        console.error('Error:', error);
        moviesGrid.innerHTML = '<p style="text-align: center; grid-column: 1/-1;">Error fetching movies</p>';
    } finally {
        loadingIndicator.style.display = 'none';
    }
}


loadPopularMovies();
