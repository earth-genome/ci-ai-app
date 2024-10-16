<script>
	import { onMount } from 'svelte';
	import { pdf_citation_mapping } from '$lib/pdf_citation_mapping.js';

	let searchTerm = '';
	let filteredCitations = Object.values(pdf_citation_mapping);

	function formatCitationWithDOI(citation) {

		const doiRegex = /\b(https:\/\/doi\.org\/10\.\d{4,}(?:\.\d+)*\/\S+)\b/;
		const doiMatches = citation.match(doiRegex);

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

	let windowHeight;

	// onMount(() => {
	// 	const updateHeight = () => {
	// 		windowHeight = window.innerHeight;
	// 	};

	// 	updateHeight();
	// 	window.addEventListener('resize', updateHeight);

	// 	return () => {
	// 		window.removeEventListener('resize', updateHeight);
	// 	};
	// });

	// $: citationListHeight = windowHeight
	// 	? `${windowHeight - citationsTop - 160}px`
	// 	: 'auto';
</script>

<div class="citations">
	<div class="prose">
		<!-- <h2 style="margin-bottom: 0rem;">List of available research</h2> -->
		<h4 style="margin: 10px">CI AI has access to the following publications:</h4>
	</div>
	<div class="search-box">
		<input
			type="text"
			placeholder="Search publications..."
			bind:value={searchTerm}
		/>
	</div>
	<!-- <div class="citation-list" style="height: {citationListHeight};"> -->
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
		font-size: 9pt;
		color: #333333;
		height: 51vh; 
		display: flex;
		flex-direction: column;
	}

	.citation-list {
		flex-grow: 1;
		overflow-y: auto;
		padding-right: 10px;
		margin: 10px;
	}

	.citation-list ul {
		list-style-type: none;
		padding: 0;
	}

	.citation-list li {
		margin-bottom: 1rem;
		padding: 1rem;
		background-color: #F1E9D2;
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
		margin-left: 10px;
		margin-bottom: 10px;
		margin-top: 10px;
		margin-right: 35px;

	}

	.search-box input {
		width: 100%;
		padding: 0.5rem;
		font-size: 1rem;
		border: 1px solid #ccc;
		border-radius: 4px;
	}
</style>
