/**
 * Prompt Module - Build prompts
 */

const DEFAULT_INSTRUCTION = "Continue this story. Maintain consistency with the characters, locations, and details provided in MEMORY CONTEXT.";

const Prompt = {
    /**
     * Build augmented prompt with memory context
     */
    buildAugmented(story, matchedKeys, instruction) {
        const parts = [];
        
        // Add memory context if there are matches
        if (matchedKeys && matchedKeys.length > 0) {
            const matchedEntries = Search.getMatchedEntries(matchedKeys);
            if (Object.keys(matchedEntries).length > 0) {
                parts.push('[MEMORY CONTEXT]');
                parts.push(JSON.stringify(matchedEntries, null, 2));
                parts.push('');
            }
        }
        
        // Add story input
        if (story && story.trim()) {
            parts.push('[STORY INPUT]');
            parts.push(story.trim());
            parts.push('');
        }
        
        // Add instruction
        parts.push('[INSTRUCTION]');
        parts.push(instruction && instruction.trim() ? instruction.trim() : DEFAULT_INSTRUCTION);
        
        return parts.join('\n');
    },

    /**
     * Build extraction prompt
     */
    buildExtraction(story, types) {
        if (!types || types.length === 0) {
            types = ['character', 'location', 'item', 'event']; }
        
        const typesList = types.join(', ');
        
        return `Analyze the following story and extract all ${typesList}.

Return the data as a JSON object with this exact format:
{
  "Name of Entity": {"type": "category", "desc": "Summarized narrative description"},
  "Another Entity": {"type": "category", "desc": "Summarized narrative description"}
}

Rules:
- Use the actual name as the key
- "type" should be one of: ${typesList}
- "desc" should be a summarized narrative of EVERYTHING related to the entity:

  For CHARACTERS/PERSONS:
  - Physical appearance (face, hair, eyes, body type, height, distinguishing features)
  - Clothing and accessories typically worn
  - Personality traits and temperament
  - Background and history
  - Objectives, goals, and motivations
  - Relationships with other characters
  - Skills, abilities, or powers
  - Current status or situation

  For LOCATIONS/PLACES:
  - Where it is located (geography, region, relative position)
  - What it looks like (architecture, landscape, atmosphere, colors, lighting)
  - What it is used for (purpose, function)
  - Who owns or controls it
  - Notable features or landmarks within
  - History or significance
  - Current condition or state
  - Mood or feeling it evokes

  For ITEMS/OBJECTS:
  - What it is (type of object)
  - What it looks like (size, shape, color, material, markings)
  - What makes it special or unique
  - What it does or how it functions
  - Who owns or created it
  - History or origin
  - Current location or status

  For EVENTS:
  - What happened
  - When and where it occurred
  - Who was involved
  - Why it happened (causes)
  - What were the consequences
  - Significance to the story

- Write descriptions as flowing narrative paragraphs, not bullet points
- Include ALL details mentioned in the story about each entity
- If information is not provided in the story, do not invent it
- Extract ALL relevant ${typesList} mentioned in the story
- Do not include any markdown formatting, only return valid JSON

IMPORTANT: Output MUST be in the SAME LANGUAGE as the input story.
If the story is in Thai, output in Thai.
If the story is in Japanese, output in Japanese.
If the story is in English, output in English.
Match the language of the story exactly.

Story:
${story}`;
    }
};