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
		onMovieSelect(movie, document.querySelector('#left-summary')); // Any application specific function could be called here.
	}
});

createAutoComplete({
	...autoCompleteConfig,
	root: document.querySelector('#right-autocomplete'),
	onOptionSelect(movie) {
		// Function to perform when user clicks on item from search
		document.querySelector('.tutorial').classList.add('is-hidden');
		onMovieSelect(movie, document.querySelector('#right-summary')); // Any application specific function could be called here.
	}
});


const onMovieSelect = async (movie, elementToPlaceContent) => {
	const response = await axios.get("http://www.omdbapi.com/", {
		params: {
			apikey: "f2cb1c88",
			i: movie.imdbID,
		},
	});

	elementToPlaceContent.innerHTML = movieTemplate(response.data);
};

const movieTemplate = (movieDetails /* contains all details */) => {
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

	<article class="notification is-primary">
		<p class="title">${movieDetails.Awards}</p>
		<p class="subtitle">Awards</p>
	</article>
	<article class="notification is-info">
		<p class="title">${movieDetails.BoxOffice}</p>
		<p class="subtitle">Box Office</p>
	</article>
	<article class="notification is-info">
		<p class="title">${movieDetails.Metascore}</p>
		<p class="subtitle">Metascore</p>
	</article>
<article class="notification is-info">
	<p class="title">${movieDetails.imdbRating}</p>
	<p class="subtitle">IMDB Rating</p>
</article>
<article class="notification is-info">
	<p class="title">${movieDetails.imdbVotes}</p>
	<p class="subtitle">IMDB Votes</p>
</article>


	`;
};
