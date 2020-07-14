const autoCompleteConfig = {
	renderOption: (movie) => {
		return `
			<img src="${movie.Poster === "N/A" ? "" : movie.Poster}" />
			${movie.Title} (${movie.Year})
		`;
	},
	inputValue(movie) {
		return movie.Title;
	},
	async fetchData(itemSearch) {
		const response = await axios.get("http://www.omdbapi.com/", {
			params: {
				apikey: "f2cb1c88",
				s: itemSearch,
			},
		});

		if (response.data.Error)
			// if no data is found
			return []; // empty array

		return response.data.Search; // Only data we're now interested in.
	}
};

createAutoComplete({
	...autoCompleteConfig,
	root: document.querySelector('#left-autocomplete'),
	onOptionSelect(movie) {
		// Function to perform when user clicks on item from search
		document.querySelector('.tutorial').classList.add('is-hidden');
		onMovieSelect(movie, document.querySelector('#left-summary'), 'left'); // Any application specific function could be called here.
	}
});

createAutoComplete({
	...autoCompleteConfig,
	root: document.querySelector('#right-autocomplete'),
	onOptionSelect(movie) {
		// Function to perform when user clicks on item from search
		document.querySelector('.tutorial').classList.add('is-hidden');
		onMovieSelect(movie, document.querySelector('#right-summary'), 'right'); // Any application specific function could be called here.
	}
});

let leftMovieData, rightMovieData;
const onMovieSelect = async (movie, elementToPlaceContent, elementPlace) => {
	const response = await axios.get("http://www.omdbapi.com/", {
		params: {
			apikey: "f2cb1c88",
			i: movie.imdbID,
		},
	});

	elementPlace === 'left' ? leftMovieData = response.data : rightMovieData = response.data;

	console.log(elementToPlaceContent, elementPlace);
	elementToPlaceContent.innerHTML = movieTemplate(response.data);

	if (leftMovieData && rightMovieData) runComparison();
};

const runComparison = () => {
	const leftStats = document.querySelectorAll('#left-summary .notification');
	const rightStats = document.querySelectorAll('#right-summary .notification');

	leftStats.forEach((leftStatEachElement, index) => {
		let rightStatEachElement = rightStats[index];

		let leftStatValue = parseInt(leftStatEachElement.dataset.value);
		let rightStatValue = parseInt(rightStatEachElement.dataset.value);

		if (leftStatValue > rightStatValue) {
			leftStatEachElement.classList.remove('is-info');
			leftStatEachElement.classList.add('is-success');
			rightStatEachElement.classList.remove('is-info');
			rightStatEachElement.classList.add('is-danger');
		} else {
			leftStatEachElement.classList.remove('is-info');
			leftStatEachElement.classList.add('is-danger');
			rightStatEachElement.classList.remove('is-info');
			rightStatEachElement.classList.add('is-success');
		}

	});

}

const movieTemplate = (movieDetails /* contains all details */) => {
	// Taking out each value for each movie and converting them into their appropriate types instead of default string

	const movieData = {
		dollars: movieDetails.BoxOffice && movieDetails.BoxOffice !== 'N/A' ? parseInt(movieDetails.BoxOffice.replace(/\$/g, '').replace(/,/g, '')) : 0,
		metaScore: movieDetails.Metascore !== 'N/A' ? parseInt(movieDetails.Metascore) : 0,
		imdbRating: movieDetails.imdbRating !== 'N/A' ? parseFloat(movieDetails.imdbRating) : 0,
		imdbVotes: movieDetails.imdbVotes !== 'N/A' ? parseInt(
			movieDetails.imdbVotes.replace(/,/g, '')
		) : 0,
		awards: movieDetails.Awards !== 'N/A' ? movieDetails.Awards.split(' ').reduce((previousValue, word) => {
			return isNaN(parseInt(word)) ? previousValue : previousValue + parseInt(word);
		}, 0) : 0
	};

	console.log(movieData);

	return `
	<article class="media">
		<figure class="media-left">
				<img src="${movieDetails.Poster}" />
 			</p >
	</figure >
	<div class="media-content">
		<div class="content">
			<h1>${movieDetails.Title}</h1>
			<h4>${movieDetails.Genre}</h4>
			<p>${movieDetails.Plot}</p>
		</div>
	</div>
	</article >

	<article data-value = "${movieData.awards}" class="notification is-info">
		<p class="title">${movieDetails.Awards}</p>
		<p class="subtitle">Awards</p>
	</article>
	<article data-value = "${movieData.dollars}" class="notification is-info">
		<p class="title">${movieDetails.BoxOffice}</p>
		<p class="subtitle">Box Office</p>
	</article>
	<article data-value = "${movieData.metaScore}" class="notification is-info">
		<p class="title">${movieDetails.Metascore}</p>
		<p class="subtitle">Metascore</p>
	</article>
<article data-value = "${movieData.imdbRating}" class="notification is-info">
	<p class="title">${movieDetails.imdbRating}</p>
	<p class="subtitle">IMDB Rating</p>
</article>
<article data-value = "${movieData.imdbVotes}" class="notification is-info">
	<p class="title">${movieDetails.imdbVotes}</p>
	<p class="subtitle">IMDB Votes</p>
</article>


	`;
};
