/**
 * Merge Module - Smart merge logic
 */

const Merge = {
    /**
     * Parse and validate JSON
     */
    parseJSON(jsonStr) {
        try {
            const data = JSON.parse(jsonStr);
            
            if (typeof data !== 'object' || Array.isArray(data)) {
                return { success: false, error: 'Invalid format. Expected an object with keys.' };
            }
            
            // Validate structure
            for (const [key, value] of Object.entries(data)) {
                if (typeof value !== 'object' || !value.type || !value.desc) {
                    return { 
                        success: false, 
                        error: `Invalid entry "${key}". Each entry must have "type" and "desc".` 
                    };
                }
            }
            
            return { success: true, data };
        } catch (e) {
            return { success: false, error: `JSON parse error: ${e.message}` };
        }
    },

    /**
     * Analyze import and categorize changes
     */
    analyze(newData) {
        const current = Storage.getAll();
        const result = {
            new: [],
            update: [],
            skip: [],
            summary: { new: 0, update: 0, skip: 0 }
        };
        
        Object.entries(newData).forEach(([key, value]) => {
            if (!current[key]) {
                result.new.push({
                    key,
                    type: value.type,
                    desc: value.desc
                });
            } else if (current[key].desc !== value.desc || current[key].type !== value.type) {
                result.update.push({
                    key,
                    type: value.type,
                    desc: value.desc,
                    oldType: current[key].type,
                    oldDesc: current[key].desc
                });
            } else {
                result.skip.push({
                    key,
                    type: value.type,
                    desc: value.desc
                });
            }
        });
        
        result.summary = {
            new: result.new.length,
            update: result.update.length,
            skip: result.skip.length
        };
        
        return result;
    },

    /**
     * Apply merge with selected items
     */
    apply(analysis, selectedNewKeys, selectedUpdateKeys) {
        const current = Storage.getAll();
        let addedCount = 0;
        let updatedCount = 0;
        
        // Add new entries
        analysis.new.forEach(item => {
            if (selectedNewKeys.includes(item.key)) {
                current[item.key] = { type: item.type, desc: item.desc };
                addedCount++;
            }
        });
        
        // Update existing entries
        analysis.update.forEach(item => {
            if (selectedUpdateKeys.includes(item.key)) {
                current[item.key] = { type: item.type, desc: item.desc };
                updatedCount++;
            }
        });
        
        Storage.saveAll(current);
        
        return {
            added: addedCount,
            updated: updatedCount,
            skipped: analysis.skip.length + 
                     (analysis.new.length - addedCount) + 
                     (analysis.update.length - updatedCount)
        };
    }
};