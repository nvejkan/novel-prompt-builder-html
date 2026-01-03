/**
 * Storage Module - Multi-story localStorage operations
 */

const STORAGE_KEY = 'novel_stories';
const OLD_STORAGE_KEY = 'novel_memory';

const Storage = {
    /**
     * Initialize storage and handle migration
     */
    init() {
        // Check for old format and migrate
        const oldData = localStorage.getItem(OLD_STORAGE_KEY);
        const newData = localStorage.getItem(STORAGE_KEY);
        
        if (oldData && !newData) {
            // Migrate old format to new
            try {
                const oldMemory = JSON.parse(oldData);
                const storyId = this.generateId();
                const migrated = {
                    stories: {
                        [storyId]: {
                            id: storyId,
                            name: "My Story (Migrated)",
                            created: new Date().toISOString(),
                            updated: new Date().toISOString(),
                            memory: oldMemory
                        }
                    },
                    activeStoryId: storyId
                };
                localStorage.setItem(STORAGE_KEY, JSON.stringify(migrated));
                localStorage.removeItem(OLD_STORAGE_KEY);
                console.log('Migrated old data to new format');
            } catch (e) {
                console.error('Migration failed:', e);
            }
        }
        
        // Ensure default story exists
        const data = this.getAllData();
        if (!data.stories || Object.keys(data.stories).length === 0) {
            const storyId = this.generateId();
            data.stories = {
                [storyId]: {
                    id: storyId,
                    name: "Default Story",
                    created: new Date().toISOString(),
                    updated: new Date().toISOString(),
                    memory: {}
                }
            };
            data.activeStoryId = storyId;
            this.saveAllData(data);
        }
        
        // Ensure activeStoryId is valid
        if (!data.activeStoryId || !data.stories[data.activeStoryId]) {
            data.activeStoryId = Object.keys(data.stories)[0];
            this.saveAllData(data);
        }
    },

    /**
     * Generate unique ID
     */
    generateId() {
        return 'story_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    },

    /**
     * Get all data (all stories + activeStoryId)
     */
    getAllData() {
        try {
            const data = localStorage.getItem(STORAGE_KEY);
            return data ? JSON.parse(data) : { stories: {}, activeStoryId: null };
        } catch (e) {
            console.error('Error reading localStorage:', e);
            return { stories: {}, activeStoryId: null };
        }
    },

    /**
     * Save all data
     */
    saveAllData(data) {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
            return true;
        } catch (e) {
            console.error('Error saving to localStorage:', e);
            return false;
        }
    },

    // ============================================================
    // Story Management
    // ============================================================

    /**
     * Get all stories
     */
    getAllStories() {
        const data = this.getAllData();
        return data.stories || {};
    },

    /**
     * Get stories as sorted array
     */
    getStoriesArray() {
        const stories = this.getAllStories();
        return Object.values(stories).sort((a, b) => {
            return new Date(b.updated) - new Date(a.updated);
        });
    },

    /**
     * Get active story ID
     */
    getActiveStoryId() {
        const data = this.getAllData();
        return data.activeStoryId;
    },

    /**
     * Get active story
     */
    getActiveStory() {
        const data = this.getAllData();
        if (data.activeStoryId && data.stories[data.activeStoryId]) {
            return data.stories[data.activeStoryId];
        }
        return null;
    },

    /**
     * Set active story
     */
    setActiveStory(storyId) {
        const data = this.getAllData();
        if (data.stories[storyId]) {
            data.activeStoryId = storyId;
            this.saveAllData(data);
            return true;
        }
        return false;
    },

    /**
     * Create new story
     */
    createStory(name) {
        const data = this.getAllData();
        const storyId = this.generateId();
        
        data.stories[storyId] = {
            id: storyId,
            name: name || "Untitled Story",
            created: new Date().toISOString(),
            updated: new Date().toISOString(),
            memory: {}
        };
        data.activeStoryId = storyId;
        
        this.saveAllData(data);
        return storyId;
    },

    /**
     * Rename story
     */
    renameStory(storyId, newName) {
        const data = this.getAllData();
        if (data.stories[storyId]) {
            data.stories[storyId].name = newName;
            data.stories[storyId].updated = new Date().toISOString();
            this.saveAllData(data);
            return true;
        }
        return false;
    },

    /**
     * Delete story
     */
    deleteStory(storyId) {
        const data = this.getAllData();
        if (!data.stories[storyId]) return false;
        
        // Don't delete if it's the only story
        if (Object.keys(data.stories).length <= 1) {
            return false;
        }
        
        delete data.stories[storyId];
        
        // If deleted story was active, switch to another
        if (data.activeStoryId === storyId) {
            data.activeStoryId = Object.keys(data.stories)[0];
        }
        
        this.saveAllData(data);
        return true;
    },

    /**
     * Get story by ID
     */
    getStory(storyId) {
        const data = this.getAllData();
        return data.stories[storyId] || null;
    },

    /**
     * Get story count
     */
    getStoryCount() {
        return Object.keys(this.getAllStories()).length;
    },

    // ============================================================
    // Memory Management (for active story)
    // ============================================================

    /**
     * Get all memory entries for active story
     */
    getAll() {
        const story = this.getActiveStory();
        return story ? story.memory : {};
    },

    /**
     * Save all memory entries for active story
     */
    saveAll(memory) {
        const data = this.getAllData();
        if (data.activeStoryId && data.stories[data.activeStoryId]) {
            data.stories[data.activeStoryId].memory = memory;
            data.stories[data.activeStoryId].updated = new Date().toISOString();
            return this.saveAllData(data);
        }
        return false;
    },

    /**
     * Get a single entry by key
     */
    get(key) {
        const memory = this.getAll();
        return memory[key] || null;
    },

    /**
     * Add or update a single entry
     */
    set(key, type, desc) {
        const memory = this.getAll();
        memory[key] = { type, desc };
        return this.saveAll(memory);
    },

    /**
     * Delete a single entry
     */
    delete(key) {
        const memory = this.getAll();
        delete memory[key];
        return this.saveAll(memory);
    },

    /**
     * Get all unique types
     */
    getTypes() {
        const memory = this.getAll();
        const types = new Set();
        Object.values(memory).forEach(entry => {
            if (entry.type) {
                types.add(entry.type.toLowerCase());
            }
        });
        return Array.from(types).sort();
    },

    /**
     * Get entries grouped by type
     */
    getGroupedByType() {
        const memory = this.getAll();
        const grouped = {};
        
        Object.entries(memory).forEach(([key, value]) => {
            const type = (value.type || 'other').toLowerCase();
            if (!grouped[type]) {
                grouped[type] = [];
            }
            grouped[type].push({ key, ...value });
        });
        
        Object.keys(grouped).forEach(type => {
            grouped[type].sort((a, b) => a.key.localeCompare(b.key));
        });
        
        return grouped;
    },

    /**
     * Get all keys
     */
    getKeys() {
        return Object.keys(this.getAll());
    },

    /**
     * Clear all memory for active story
     */
    clear() {
        return this.saveAll({});
    },

    /**
     * Export active story memory as JSON string
     */
    export() {
        return JSON.stringify(this.getAll(), null, 2);
    },

    // ============================================================
    // Backup / Restore (All Stories)
    // ============================================================

    /**
     * Export all stories as backup
     */
    exportAllStories() {
        const data = this.getAllData();
        return JSON.stringify(data, null, 2);
    },

    /**
     * Import all stories from backup
     */
    importAllStories(jsonStr, replace = false) {
        try {
            const imported = JSON.parse(jsonStr);
            
            // Validate structure
            if (!imported.stories || typeof imported.stories !== 'object') {
                return { success: false, error: 'Invalid backup format. Missing "stories" object.' };
            }
            
            // Validate each story
            for (const [id, story] of Object.entries(imported.stories)) {
                if (!story.name || !story.memory || typeof story.memory !== 'object') {
                    return { success: false, error: `Invalid story "${id}". Missing name or memory.` };
                }
            }
            
            if (replace) {
                // Replace all
                this.saveAllData(imported);
            } else {
                // Merge with existing
                const current = this.getAllData();
                for (const [id, story] of Object.entries(imported.stories)) {
                    // Generate new ID to avoid conflicts
                    const newId = this.generateId();
                    story.id = newId;
                    story.name = story.name + ' (Imported)';
                    current.stories[newId] = story;
                }
                this.saveAllData(current);
            }
            
            return { success: true, count: Object.keys(imported.stories).length };
        } catch (e) {
            return { success: false, error: `JSON parse error: ${e.message}` };
        }
    },

    /**
     * Export single story
     */
    exportStory(storyId) {
        const story = this.getStory(storyId);
        if (!story) return null;
        
        return JSON.stringify({
            name: story.name,
            created: story.created,
            updated: story.updated,
            memory: story.memory
        }, null, 2);
    },

    /**
     * Import single story
     */
    importStory(jsonStr) {
        try {
            const imported = JSON.parse(jsonStr);
            
            if (!imported.name || !imported.memory || typeof imported.memory !== 'object') {
                return { success: false, error: 'Invalid story format. Missing name or memory.' };
            }
            
            const storyId = this.generateId();
            const data = this.getAllData();
            
            data.stories[storyId] = {
                id: storyId,
                name: imported.name + ' (Imported)',
                created: imported.created || new Date().toISOString(),
                updated: new Date().toISOString(),
                memory: imported.memory
            };
            data.activeStoryId = storyId;
            
            this.saveAllData(data);
            return { success: true, storyId };
        } catch (e) {
            return { success: false, error: `JSON parse error: ${e.message}` };
        }
    },

    // ============================================================
    // Stats
    // ============================================================

    /**
     * Get stats for a story
     */
    getStoryStats(storyId) {
        const story = this.getStory(storyId);
        if (!story) return null;
        
        const memory = story.memory || {};
        const types = new Set();
        Object.values(memory).forEach(entry => {
            if (entry.type) types.add(entry.type.toLowerCase());
        });
        
        return {
            entryCount: Object.keys(memory).length,
            types: Array.from(types).sort(),
            created: story.created,
            updated: story.updated
        };
    }
};

// Initialize on load
Storage.init();