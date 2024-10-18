<script>
	import { onMount } from 'svelte';
	import { pdf_citation_mapping } from '$lib/pdf_citation_mapping.js';
	import { input } from '$lib/stores.js';
	import plusIcon from '$lib/images/plus.png'; // Import the plus icon

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

	function selectCitation(citation) {
		input.update(currentInput => currentInput + (currentInput ? ' ' : '') + citation);
	}

	$: {
		filteredCitations = Object.values(pdf_citation_mapping).filter(citation =>
			citation.toLowerCase().includes(searchTerm.toLowerCase())
		);
	}
</script>

<div class="citations">
	<div class="prose">
		<h4>CI AI has access to the following publications:</h4>
	</div>
	<div class="search-box">
		<input
			type="text"
			placeholder="Search publications..."
			bind:value={searchTerm}
		/>
	</div>
	<div class="citation-list">
		<ul>
			{#each filteredCitations as citation}
				<li>
					<button
						on:click={() => selectCitation(citation)}
						class="citation-button"
					>
						{@html formatCitationWithDOI(citation)}
						<img src={plusIcon} alt="Add" class="add-icon" /> <!-- Use the imported icon -->
					</button>
				</li>
			{/each}
		</ul>
	</div>
</div>

<style>
	.citations {
		/* margin-top: 2rem; */
		font-size: 9pt;
		color: #333333;
		display: flex;
		flex-direction: column;
		height: 100%;
		overflow: hidden;
	}

	.prose {
		flex-shrink: 0;
	}

	.search-box {
		flex-shrink: 0;
		padding: 10px;
	}

	.citation-list {
		flex-grow: 1;
		overflow-y: auto;
		padding: 0 10px;
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
		cursor: pointer;
		transition: background-color 0.2s ease-in-out;
		text-align: left;
		/* margin: 10px; */

	}

	.citation-list li:hover {
		background-color: #E8D8B0;
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
		padding: 10px;
		font-size: 1rem;
		border: 1px solid oklch(var(--s));;
		border-radius: 40px;
		background-color: #fff;
		color: #2C665D;
	}

	.citation-list button {
		width: 100%;
		text-align: left;
		background: none;
		border: none;
		padding: 0;
		font: inherit;
		cursor: pointer;
	}

	.citation-button {
		position: relative; /* Added to position the icon */
	}

	.add-icon {
		position: absolute; /* Positioning the icon */
		bottom: -8px; /* Adjust as needed */
		right: -8px; /* Adjust as needed */
		width: 18px; /* Set the width of the icon */
		height: 18px; /* Set the height of the icon */
		fill: green; /* Set the color to green */
	}
</style>
