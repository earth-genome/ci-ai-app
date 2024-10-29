<script>
	import { pdf_citation_mapping } from '$lib/pdf_citation_mapping.js';
	import { input, tooltipStore } from '$lib/stores.js';
	import plusIcon from '$lib/images/plus.png'; // Import the plus icon

	let searchTerm = '';
	let filteredCitations = Object.values(pdf_citation_mapping);

	function getAuthorYearPart(citation) {
		return citation.split('"')[0].trim();
	}

	function selectCitation(citation) {
		const authorYearPart = getAuthorYearPart(citation);
		input.update((currentInput) => currentInput + (currentInput ? ' ' : '') + authorYearPart);
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
		filteredCitations = Object.values(pdf_citation_mapping).filter((citation) =>
			citation.toLowerCase().includes(searchTerm.toLowerCase())
		);
	}

	function showTooltip(event) {
		const tooltipText =
			'Search the list of citations below to see what publications CI AI has access to. Click on a citation to insert it into the chat input. Click on the DOI to open the publication in a new tab.';
		const position = 'right';

		// Get the bounding rect of the target element
		const rect = event.currentTarget.getBoundingClientRect();
		const x = rect.right + 8;
		const y = rect.top + rect.height / 2;

		tooltipStore.set({
			visible: true,
			text: tooltipText,
			position: position,
			x: x,
			y: y
		});
	}

	function hideTooltip() {
		tooltipStore.set({
			visible: false,
			text: '',
			position: 'right',
			x: 0,
			y: 0
		});
	}
</script>

<div class="citations">
	<div class="flex items-center">
		<div class="search-box flex-grow">
			<input type="text" placeholder="Search publications..." bind:value={searchTerm} />
		</div>
		<span
			class="badge badge-info cursor-help"
			on:mouseenter={showTooltip}
			on:mouseleave={hideTooltip}
		>
			?
		</span>
	</div>
	<div class="citation-list">
		<ul>
			{#each filteredCitations as citation}
				<li>
					<button on:click={() => selectCitation(citation)} class="citation-button">
						{@html formatCitationWithDOI(citation)}
						<img src={plusIcon} alt="Add" class="add-icon" />
					</button>
				</li>
			{/each}
		</ul>
	</div>
</div>

<style>
	.citations {
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
		background-color: #f1e9d2;
		border-radius: 4px;
		box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
		color: #333333;
		cursor: pointer;
		transition: background-color 0.2s ease-in-out;
		text-align: left;
	}

	.citation-list li:hover {
		background-color: #e8d8b0;
	}

	:global(.citations a) {
		color: #1d4ed8;
		text-decoration: none;
		transition: background-color 0.2s ease-in-out;
		background-color: #dbeefb;
		padding: 0.1em 0.3em;
		border-radius: 3px;
		word-wrap: break-word;
		word-break: break-all;
		display: inline-block;
		max-width: 100%;
	}

	:global(.citations a:hover) {
		background-color: #80c5ef;
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
		border: 1px solid #ccc;
		border-radius: 40px;
		background-color: #fff;
		color: #2c665d;
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
		position: relative;
	}

	.add-icon {
		position: absolute;
		bottom: -8px;
		right: -8px;
		width: 18px;
		height: 18px;
		fill: green;
	}
</style>
