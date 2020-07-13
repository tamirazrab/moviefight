const fetchData = async (itemSearch) => {
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
};

createAutoComplete({
	root: document.querySelector('.autocomplete'),
	renderOption: (movie) => {
		return `
			<img src="${movie.Poster === "N/A" ? "" : movie.Poster}" />
			${movie.Title} (${movie.Year})
		`;
	},
	onOptionSelect(movie) {
		onMovieSelect(movie); // Any application specific function could be called here.
	},
	inputValue(movie) {
		return movie.Title;
	}
});



const onMovieSelect = async (movie) => {
	const response = await axios.get("http://www.omdbapi.com/", {
		params: {
			apikey: "f2cb1c88",
			i: movie.imdbID,
		},
	});

	document.querySelector('.outputTest').innerHTML = movieTemplate(response.data);
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
