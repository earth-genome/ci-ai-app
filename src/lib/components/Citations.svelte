<script>
	import { onMount } from 'svelte';
	import { pdf_citation_mapping } from '$lib/pdf_citation_mapping.js';

	let searchTerm = '';
	let filteredCitations = Object.values(pdf_citation_mapping);

	function formatCitationWithDOI(citation) {

		// const yearRegex = /\b(19|20)\d{2}\b/g;
		// citation = citation.replace(yearRegex, '<i>$&</i>');

        // console.log('citation: ', citation);
		
		// const titleRegex = /"([^"]*)"/g;
		// citation = citation.replace(titleRegex, '<b>"$1"</b>');

		// const doiRegex = /\b(https:\/\/doi\.org\/10\.\d{4,}(?:\.\d+)*\/\S+)\b/;
		// citation = citation.replace(doiRegex, (match) => `<a href="${match}" target="_blank">${match}</a>`);
		
		// return citation;


		const doiRegex = /\b(https:\/\/doi\.org\/10\.\d{4,}(?:\.\d+)*\/\S+)\b/;
		const doiMatches = citation.match(doiRegex);
		
        // find doi strings and make them links

		// find years and italicize
		// const yearRegex = /\b(19|20)\d{2}\b/g;
		// citation = citation.replace(yearRegex, (match, p1, offset) => {
		// 	// make sure the regex match in not part of a doi string
		// 	const isInDOI = doiMatches && doiMatches.some(doi => doi.includes(match));
		// 	return isInDOI ? match : `<i>${match}</i>`;
		// });

		// Bold the titles
		const titleRegex = /"([^"]*)"/g;
		citation = citation.replace(titleRegex, '<b>"$1"</b>');

		citation = citation.replace(doiRegex, (match) => `<a href="${match}" target="_blank">${match}</a>`);

		
		return citation;
	}

	$: {
		filteredCitations = Object.values(pdf_citation_mapping).filter(citation =>
			citation.toLowerCase().includes(searchTerm.toLowerCase())
		);
	}
</script>

<div class="citations">
	<div class="prose">
		<h2 style="margin-bottom: 0rem;">List of available research</h2>
		<p>CI AI has access to the following publications:</p>
	</div>
	<div class="search-box">
		<input
			type="text"
			placeholder="Search citations..."
			bind:value={searchTerm}
		/>
	</div>
	<div class="citation-list">
		<ul>
			{#each filteredCitations as citation}
				<li>{@html formatCitationWithDOI(citation)}</li>
			{/each}
		</ul>
	</div>
</div>

<style>
	.citations {
		margin-top: 2rem;
		font-size: 0.9rem;
		color: #333333;
	}

	.citation-list {
		height: 35vh;
		overflow-y: auto;
		/* border: 1px solid #ccc; */
		/* border-radius: 4px; */
		/* padding-left: 1rem; */
		padding-top: 5px;
		padding-bottom: 1rem;
		padding-right: 1rem;

	}

	.citation-list ul {
		list-style-type: none;
		padding: 0;
	}

	.citation-list li {
		margin-bottom: 1rem;
		padding: 1rem;
		background-color: #e6ffe6;
		border-radius: 4px;
		box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
		color: #333333; 
	}

	:global(.citations a) {
		color: theme('colors.primary');
		text-decoration: none;
		transition: background-color 0.2s ease-in-out;
		background-color: #DBEEFB;
		padding: 0.1em 0.3em;
		border-radius: 3px;
		word-wrap: break-word;
		word-break: break-all;
		display: inline-block;
		max-width: 100%;
	}

	:global(.citations a:hover) {
		background-color: #80C5EF;
	}

	:global(.citations p) {
		margin-bottom: 0.5em;
	}

	:global(.citations i) {
		font-style: italic;
	}

	:global(.citations b) {
		font-weight: bold;
	}

	.search-box {
		margin-bottom: 1rem;
        margin-right: 2rem;
	}

	.search-box input {
		width: 100%;
		padding: 0.5rem;
		font-size: 1rem;
		border: 1px solid #ccc;
		border-radius: 4px;
	}
</style>
