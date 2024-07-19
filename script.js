// Fetching HTML elements..
const movieSearchInputElement = document.getElementById('movie-search');
const suggestionUlElement = document.querySelector('.suggestions-ul');
const suggestionsDivElement = document.querySelector('.suggestions');


// Check if any movie is searching or not....
if (movieSearchInputElement) {
    movieSearchInputElement.addEventListener('input', () => {
        const query = movieSearchInputElement.value.toLowerCase();
        if (query !== null) {
            movieData(query);
        }

    })
}

// Fetch the Movie Data from API using Fetch...
const movieData = async function (query) {
    try {
        const response = await fetch(
            `https://www.omdbapi.com/?apikey=2cfa3f4b&s=${query}`
        );
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        //   console.log(data.Search); 
        getMoviesList(data.Search);


    } catch (error) {
        console.error("Error fetching movies data:", error);
    }
};


// Get the list of movies as per the user seacrh input... and display the list of movies with Favorite Icon..
function getMoviesList(moviesList) {
    if (moviesList != undefined) {
        console.log(moviesList);
        suggestionUlElement.innerHTML = ''
        for (let movie in moviesList) {
            const movieTitle = moviesList[movie]['Title'];
            const imdbID = moviesList[movie]['imdbID'];
            const movieImage = moviesList[movie]['Poster'];
            console.log(movieImage);
            suggestionsDivElement.innerHTML = '';

            const suggestionMovieItem = document.createElement("li");
            suggestionMovieItem.className = 'suggestion-list-item';
            suggestionMovieItem.id = imdbID;

            const movieNameSpanElement = document.createElement('span');
            movieNameSpanElement.className = 'movie-name-span'
            movieNameSpanElement.textContent = movieTitle;

            const addToFavoritesSpanElement = document.createElement('span');
            addToFavoritesSpanElement.className = 'add-to-favorites';

            const favoritesIconElement = document.createElement('i');
            favoritesIconElement.className = 'fa-solid fa-heart';
            
            suggestionMovieItem.appendChild(movieNameSpanElement);
            addToFavoritesSpanElement.appendChild(favoritesIconElement);
            suggestionMovieItem.appendChild(addToFavoritesSpanElement);
            suggestionUlElement.appendChild(suggestionMovieItem);
            suggestionsDivElement.appendChild(suggestionUlElement);
            suggestionsDivElement.style.display = 'block';

            let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
            let isFavorite = favorites.some(movie => movie.imdbID === imdbID);
            if (isFavorite) {
                favoritesIconElement.style.color = 'red'; 
            } else {
                favoritesIconElement.style.color = 'rgb(165, 198, 227)'; 
            }

            // Calling the functions to add the movie to the favorites list
            addToFavorites(favoritesIconElement, imdbID, movieImage, movieTitle);

            // display the details on click of suggestion movie list item...
            movieNameSpanElement.addEventListener("click", () => {
                window.location.href = `./movie.html?imdbID=${imdbID}`;
            })
            

        }
    }
    // If no movies are searching hide the movies list div element...
    else if (moviesList === undefined) {
        suggestionsDivElement.style.display = 'none';
    }
}

// Function to add the movie to Favorites by clicking on favorites Icon..
function addToFavorites(addToFavoritesIcon, imdbID, movieImage, movieTitle) {
    addToFavoritesIcon.addEventListener('click', () => {
        console.log(movieImage);
        const movie = {
            imdbID: imdbID,
            image: movieImage,
            title: movieTitle
        };

        if (addToFavoritesIcon.style.color === 'red') {
            addToFavoritesIcon.style.color = 'rgb(165, 198, 227)';
            // removing movie from local storage..
            removeFromLocalStorage(imdbID);
        } else {
            addToFavoritesIcon.style.color = 'red';
            // Adding movie to the local storage...
            saveToLocalStorage(movie);
        }
    });
}

// After clicking on favorites icon, function to add the movie in local storage..
function saveToLocalStorage(movie) {
    let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    favorites.push(movie);
    localStorage.setItem('favorites', JSON.stringify(favorites));
}

// Function to remove the movie item from the local storage...
function removeFromLocalStorage(imdbID) {
    let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    favorites = favorites.filter(movie => movie.imdbID !== imdbID);
    localStorage.setItem('favorites', JSON.stringify(favorites));
}

// Relodiong the Favorites Movies Page DOM... to get the movies from local storage...
document.addEventListener('DOMContentLoaded', () => {
    const favoritesMoviesDivElement = document.querySelector('.favorite-movies');
    console.log(favoritesMoviesDivElement);
    if (favoritesMoviesDivElement) {
        let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
        favorites.forEach(movie => {
            console.log(movie);
            addMovieToFavoritesDiv(movie)
        });
    }
});

// Function to add Movie to Favorites...
function addMovieToFavoritesDiv(movie) {
    const favoritesMoviesDivElement = document.querySelector('.favorite-movies');
    const movieCardDivElement = document.createElement('div');
    movieCardDivElement.className = 'movie-card';

    const movieImgElement = document.createElement('img');
    movieImgElement.src = movie.image;

    const movieTitlePElement = document.createElement('p');


    movieTitlePElement.textContent = movie.title;

    const buttonsDivElement = document.createElement('div');
    buttonsDivElement.className = 'fav-card-btns';

    const detailsBtnElement = document.createElement('button');
    detailsBtnElement.className = 'details-button';
    detailsBtnElement.textContent = 'Details';

    const removeBtnElement = document.createElement('button');
    removeBtnElement.className = 'remove-from-fav-button';
    removeBtnElement.textContent = 'Remove';

    buttonsDivElement.appendChild(detailsBtnElement);
    buttonsDivElement.appendChild(removeBtnElement);

    movieCardDivElement.appendChild(movieImgElement)
    movieCardDivElement.appendChild(movieTitlePElement)
    movieCardDivElement.appendChild(buttonsDivElement);

    favoritesMoviesDivElement.appendChild(movieCardDivElement);

    // On click of remove button in favorites.. removing the movie from favorites..
    removeBtnElement.addEventListener('click', () => {
        movieCardDivElement.remove();
        removeFromLocalStorage(movie.imdbID);
    });

    // On click of details button redirecting to the movie details page and display the details 
    detailsBtnElement.addEventListener("click", () => {
        window.location.href = `./movie.html?imdbID=${movie.imdbID}`;
    })
}

// function -- On click on out side of the search element hide the Movie list div element...
function handleClickOutside(event) {
    if (suggestionsDivElement && !suggestionsDivElement.contains(event.target) && !movieSearchInputElement.contains(event.target)) {
        suggestionsDivElement.style.display = 'none';
    }
}
// alling the onclick on outside function...
document.addEventListener('click', handleClickOutside);

// Fetching the movie details with movie imdbID and redirecting the url based on the ID..
document.addEventListener('DOMContentLoaded', async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const imdbID = urlParams.get('imdbID');

    if (imdbID) {
        try {
            const response = await fetch(`https://www.omdbapi.com/?i=${imdbID}&apikey=2cfa3f4b`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const movieData = await response.json();
            displayMovieDetails(movieData);
        } catch (error) {
            console.error("Error fetching movie details:", error);
        }
    }
});

// Function to get the movie details and display on movie page
function displayMovieDetails(movie) {
    const movieDetailsDivElement = document.querySelector('.movie-details');
    const mivieNameHeadingDiv = document.querySelector('.movie-details-header')

    if (movieDetailsDivElement) {
        movieDetailsDivElement.innerHTML = '';
        mivieNameHeadingDiv.innerHTML = '';

        const headingH2Element = document.createElement('h2');
        headingH2Element.textContent = `Movie Name : ${movie.Title} :`;
        
        const movieImgElement = document.createElement('img');
        movieImgElement.src = movie.Poster;
        movieImgElement.alt = movie.Title;

        const movieNameElement = document.createElement('p');
        movieNameElement.innerHTML = `<b>Name:</b> ${movie.Title}`;

        const moviePlotElement = document.createElement('p');
        moviePlotElement.innerHTML = `<b>Plot:</b> ${movie.Plot}`;

        const movieActorsElement = document.createElement('p');
        movieActorsElement.innerHTML = `<b>Actors:</b> ${movie.Actors}`;

        const movieYearElement = document.createElement('p');
        movieYearElement.innerHTML = `<b>Year:</b> ${movie.Year}`;

        mivieNameHeadingDiv.appendChild(headingH2Element);
        movieDetailsDivElement.appendChild(movieImgElement);
        movieDetailsDivElement.appendChild(movieNameElement);
        movieDetailsDivElement.appendChild(moviePlotElement);
        movieDetailsDivElement.appendChild(movieActorsElement);
        movieDetailsDivElement.appendChild(movieYearElement);
    }
}


