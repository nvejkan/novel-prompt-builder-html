/**
 * Storage Module - localStorage operations
 */

const STORAGE_KEY = 'novel_memory';

const Storage = {
    /**
     * Get all memory data
     */
    getAll() {
        try {
            const data = localStorage.getItem(STORAGE_KEY);
            return data ? JSON.parse(data) : {};
        } catch (e) {
            console.error('Error reading localStorage:', e);
            return {};
        }
    },

    /**
     * Save all memory data
     */
    saveAll(data) {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
            return true;
        } catch (e) {
            console.error('Error saving to localStorage:', e);
            return false;
        }
    },

    /**
     * Get a single entry by key
     */
    get(key) {
        const data = this.getAll();
        return data[key] || null;
    },

    /**
     * Add or update a single entry
     */
    set(key, type, desc) {
        const data = this.getAll();
        data[key] = { type, desc };
        return this.saveAll(data);
    },

    /**
     * Delete a single entry
     */
    delete(key) {
        const data = this.getAll();
        delete data[key];
        return this.saveAll(data);
    },

    /**
     * Get all unique types
     */
    getTypes() {
        const data = this.getAll();
        const types = new Set();
        Object.values(data).forEach(entry => {
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
        const data = this.getAll();
        const grouped = {};
        
        Object.entries(data).forEach(([key, value]) => {
            const type = (value.type || 'other').toLowerCase();
            if (!grouped[type]) {
                grouped[type] = [];
            }
            grouped[type].push({ key, ...value });
        });
        
        // Sort keys within each group
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
     * Clear all data
     */
    clear() {
        localStorage.removeItem(STORAGE_KEY);
    },

    /**
     * Export data as JSON string
     */
    export() {
        return JSON.stringify(this.getAll(), null, 2);
    }
};