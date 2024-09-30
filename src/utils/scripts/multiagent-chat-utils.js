// prompt builder

export function buildSystemPrompt(userOptions) {
    /**userOptions = {
     *  formality: val,
     *  technical_depth: val,
     *  conciceness: val,
     *  directness: val,
     * }
     * */ 
    let prompt = "";
    for (const [key, value] of Object.entries(userOptions)) {
        const description = userOptionsWordsMap[key][value];
        prompt += `Your ${key} is described by: ${description}. `;
    }
    return prompt;
}


export const userOptionsWordsMap = {
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
    }  
}

/**
 * 
 * Data and analysis expert: is expert on numerical data and its analysis in the papers. always tries to find the statistical confidence levels, p levels, etc from a paper, measures of stat sig
 * Methodology expert: could suggest changes in methodology, assess methodology used and give how it could be flawed or improved
 * Professor: could have a unique contextual slider for grade level?
 * 
 * 
 * expert scientist, curious generalist, professor/techer, data analyst, methodology expert
 */