import { writable } from 'svelte/store';

export const selectedOption = writable(0);
export const Coords = writable({  lon: 0, lat: 0});
export const pointInfo = writable({});
export const currentCitations = writable([]);
export const textEditorContent = writable('');
export const codeBlocksMap = writable(new Map());
export const tooltipStore = writable({
    visible: false,
    text: '',
    position: 'right',
    x: 0,
    y: 0
});
export const promptModifiers = writable({
    length: {
        1: 'Give a very consice response with only the essential information.',
        2: 'Give a concise response in no more than two paragraphs',
        3: '', //Nothing, normal response. Already pretty wordy.
        4: 'Give a long, detailed response with no concern for the response length'
    },

    formatting: {
        1: 'Do not use any formatting whatsoever.',
        2: `Use some limited basic formatting such as italic or bold.
            Only use HTML tags:
                - Use <i></i> for italics
                - Use <b></b> for bold.`,
        3: `Use more advanced formatting such as italics, bold, headers, and paragraphs.
            Use emojis in a limited way, between 0 - 3 per response.
            Only use HTML tags:
                - Use <h1></h1> tags to create title headers.
                - Use <h2></h2> tags to create sub headers.
                - Use <b></b> tags to bold important keywords or concepts.
                - Use <i></i> tags to italicize terms that need emphasis.
                - Use <p></p> tags to create paragraphs for clear formatting.`,
        4: `Use abundant formatting such as italics, bold, headers, and paragraphs, lists, tables, bullets/numbers, or code blocks.
        Use emojis when appropriate.
        Only use HTML tags:
            - Use <h1></h1> tags to create title headers.
            - Use <h2></h2> tags to create sub headers.
            - Use <b></b> tags to bold important keywords or concepts.
            - Use <i></i> tags to italicize terms that need emphasis.
            - Use <p></p> tags to create paragraphs for clear formatting.`,
    },

    grade: {
        1: 'Pretend you are responding to a first grader.',
        2: 'Pretend you are responding to a second grader.',
        3: 'Pretend you are responding to a third grader.',
        4: 'Pretend you are responding to a fourth grader.',
        5: 'Pretend you are responding to a fifth grader.',
        6: 'Pretend you are responding to a sixth grader.',
        7: 'Pretend you are responding to a seventh grader.',
        8: 'Pretend you are responding to a eighth grader.',
        9: 'Pretend you are responding to a ninth grader.',
        10: 'Pretend you are responding to a tenth grader.',
        11: 'Pretend you are responding to a eleventh grader.',
        12: 'Pretend you are responding to a twelfth grader.',
        13: 'Pretend you are responding to a undergraduate student.',
        14: 'Pretend you are responding to a graduate student.',
        15: 'Pretend you are responding to a PhD student.'
    }
});

export const selectedAgentIndex = writable(0);

export const sliderValues = writable({
    temperature: 1,
    length: 1,
    formatting: 1,
    grade: 1
})

export const input = writable('');
export const chatHistory = writable([]);
export const isLoading = writable(false);
export const chatUsed = writable(false);
