import { writable } from 'svelte/store';

export const selectedOption = writable(0);
export const Coords = writable({  lon: 0, lat: 0});
export const pointInfo = writable({});
export const currentCitations = writable([]);
export const textEditorContent = writable('');
export const codeBlocksMap = writable(new Map());
export const promptModifiers = writable({
    formality: {
        1: "very casual, conversational tone, informal language, colloquial expressions",
        2: "casual, relaxed tone, everyday language, friendly but not overly formal",
        3: "semi-casual, professional but approachable, light formality, balanced tone",
        4: "neutral, moderately formal, professional but not rigid, clear and respectful",
        5: "semi-formal, professional tone, polite and courteous, slight formality",
        6: "formal, structured tone, respectful and clear, professional language",
        7: "very formal, highly structured, polite and professional, precise language",
        8: "extremely formal, rigid tone, academic or business-level language, no casual expressions"
    },    
    technical_depth: {
        1: "basic overview, layperson terms, easy to understand, everyday language",
        2: "high-level explanation, non-technical terms, clear and straightforward, general audience-friendly",
        3: "fundamental concepts, light technical detail, accessible explanation, non-expert friendly",
        4: "some technical terms, mid-level detail, clear examples with minimal jargon, general understanding with depth",
        5: "moderate technical jargon, in-depth explanation, detailed breakdown, informative but accessible",
        6: "technical terminology, complex ideas explained, specifics with examples, expert audience but not overly technical",
        7: "advanced technical terms, detailed technical analysis, focused on precision and depth, specialist audience",
        8: "highly specialized terminology, deep technical insights, comprehensive and exhaustive, expert-level analysis, no simplifications"
    },
    conciseness: {
        1: "very concise, minimal detail, straight to the point, brief summary",
        2: "concise, limited elaboration, key points only, compact explanation",
        3: "moderate brevity, clear and focused, essential details included, not overly brief",
        4: "balanced explanation, some detail with focus on clarity, avoids unnecessary elaboration",
        5: "moderate detail, expands on key points, more comprehensive but not lengthy",
        6: "detailed, in-depth explanation, elaborates on key areas, fairly thorough",
        7: "very detailed, covers most aspects, expanded elaboration, almost comprehensive",
        8: "extremely detailed, exhaustive explanation, covers every aspect in depth, no brevity"
    },
    directness: {
        1: "very direct, straight to the point, no elaboration, minimal engagement",
        2: "direct, clear and focused, minimal digression, efficient communication",
        3: "mostly direct, focused with slight elaboration, occasional side points",
        4: "balanced, provides clear answers with some engagement, moderate elaboration",
        5: "moderately indirect, provides context and background, engages in dialogue",
        6: "indirect, more exploratory and conversational, includes additional context and examples",
        7: "very indirect, detailed and exploratory, engaging conversation with multiple points",
        8: "extremely indirect, highly exploratory, deeply conversational, rich in context and examples"
    },
    grade: {
        1: "first",
        2: "second",
        3: "third",
        4: "fourth",
        5: "fifth",
        6: "sixth",
        7: "seventh",
        8: "eighth",
        9: "ninth",
        10: "tenth",
        11: "eleventh",
        12: "twelfth"
    }
})
export const sliderValues = writable({
    formality: 4,    
    technical_depth: 4,
    conciseness: 4,
    directness: 4,
    grade: 12,
})