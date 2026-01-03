/**
 * Search Module - Exact key matching
 */

const Search = {
    /**
     * Find all exact key matches in text
     */
    findMatches(text) {
        const memory = Storage.getAll();
        const keys = Object.keys(memory);
        const matches = [];
        
        keys.forEach(key => {
            if (text.includes(key)) {
                matches.push(key);
            }
        });
        
        // Sort by position in text
        matches.sort((a, b) => text.indexOf(a) - text.indexOf(b));
        
        return matches;
    },

    /**
     * Get memory entries for matched keys
     */
    getMatchedEntries(keys) {
        const memory = Storage.getAll();
        const result = {};
        
        keys.forEach(key => {
            if (memory[key]) {
                result[key] = memory[key];
            }
        });
        
        return result;
    }
};