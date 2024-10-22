<script>
	import { onMount } from 'svelte';
	import { pdf_citation_mapping } from '$lib/pdf_citation_mapping.js';
	import { input } from '$lib/stores.js';
	import plusIcon from '$lib/images/plus.png'; // Import the plus icon

	let searchTerm = '';
	let filteredCitations = Object.values(pdf_citation_mapping);

	function getAuthorYearPart(citation) {
		return citation.split('"')[0].trim();
	}

	function selectCitation(citation) {
		const authorYearPart = getAuthorYearPart(citation);
		input.update(currentInput => currentInput + (currentInput ? ' ' : '') + authorYearPart);
	}

	function formatCitationWithDOI(citation) {
		const doiRegex = /\b(https:\/\/doi\.org\/10\.\d{4,}(?:\.\d+)*\/\S+)\b/;
		const titleRegex = /"([^"]*)"/;

		// Extract the part before the first quote (authors and year)
		const authorYearPart = getAuthorYearPart(citation);

		// Extract the title
		const titleMatch = citation.match(titleRegex);
		const title = titleMatch ? titleMatch[1] : '';

			// Format the citation
			let formattedCitation = `${authorYearPart}` + (title ? ` <b>"${title}"</b>` : '');

			// Add DOI link if present
			const doiMatches = citation.match(doiRegex);
			if (doiMatches) {
				formattedCitation += ` <a href="${doiMatches[0]}" target="_blank">${doiMatches[0]}</a>`;
			}

			return formattedCitation;
	}

	$: {
		filteredCitations = Object.values(pdf_citation_mapping).filter(citation =>
			citation.toLowerCase().includes(searchTerm.toLowerCase())
		);
	}
</script>

<div class="citations">
	<div class="flex items-center">
		<div class="search-box flex-grow">
			<input
				type="text"
				placeholder="Search publications..."
				bind:value={searchTerm}
			/>
		</div>
		<div class="tooltip tooltip-bottom ml-2" data-tip="Creativity, aka 'temperature,' controls response randomness. Lower values make results more focused and predictable, while higher values increase creativity and diversity but reduce coherence.">
			<span class="badge badge-info cursor-help">?</span>
		</div>
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
		margin-bottom: 10px;
		margin-top: 10px;
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
