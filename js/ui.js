/**
 * UI Module - Common UI utilities
 */

const UI = {
    /**
     * Show toast notification
     */
    toast(message, isError = false) {
        document.querySelectorAll('.toast').forEach(t => t.remove());
        
        const toast = document.createElement('div');
        toast.className = `toast${isError ? ' error' : ''}`;
        toast.textContent = message;
        document.body.appendChild(toast);
        
        setTimeout(() => {
            toast.remove();
        }, 3000);
    },

    /**
     * Copy text to clipboard
     */
    async copyToClipboard(text) {
        try {
            await navigator.clipboard.writeText(text);
            this.toast('Copied to clipboard!');
        } catch (e) {
            const textarea = document.createElement('textarea');
            textarea.value = text;
            textarea.style.position = 'fixed';
            textarea.style.opacity = '0';
            document.body.appendChild(textarea);
            textarea.select();
            document.execCommand('copy');
            document.body.removeChild(textarea);
            this.toast('Copied to clipboard!');
        }
    },

    /**
     * Escape HTML to prevent XSS
     */
    escapeHtml(str) {
        if (!str) return '';
        const div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
    },

    /**
     * Format date
     */
    formatDate(dateStr) {
        if (!dateStr) return 'Unknown';
        const date = new Date(dateStr);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    },

    /**
     * Render story selector dropdown
     */
    renderStorySelector(containerId) {
        const container = document.getElementById(containerId);
        if (!container) return;
        
        const stories = Storage.getStoriesArray();
        const activeId = Storage.getActiveStoryId();
        const activeStory = Storage.getActiveStory();
        
        let html = `
            <div class="story-selector">
                <button class="story-selector-btn" onclick="UI.toggleStoryDropdown()">
                    <span class="story-selector-label">📖 ${this.escapeHtml(activeStory?.name || 'Select Story')}</span>
                    <span class="story-selector-arrow">▼</span>
                </button>
                <div class="story-dropdown" id="storyDropdown">
                    <div class="story-dropdown-header">Switch Story</div>
        `;
        
        stories.forEach(story => {
            const isActive = story.id === activeId;
            const stats = Storage.getStoryStats(story.id);
            html += `
                <div class="story-dropdown-item ${isActive ? 'active' : ''}" 
                     onclick="UI.selectStory('${story.id}')">
                    <div class="story-dropdown-item-name">
                        ${isActive ? '★ ' : ''}${this.escapeHtml(story.name)}
                    </div>
                    <div class="story-dropdown-item-meta">
                        ${stats.entryCount} entries
                    </div>
                </div>
            `;
        });
        
        html += `
                    <div class="story-dropdown-divider"></div>
                    <div class="story-dropdown-item create-new" onclick="UI.createNewStory()">
                        ➕ Create New Story
                    </div>
                    <div class="story-dropdown-item manage" onclick="window.location.href='stories.html'">
                        ⚙️ Manage Stories
                    </div>
                </div>
            </div>
        `;
        
        container.innerHTML = html;
    },

    /**
     * Toggle story dropdown
     */
    toggleStoryDropdown() {
        const dropdown = document.getElementById('storyDropdown');
        if (dropdown) {
            dropdown.classList.toggle('show');
        }
    },

    /**
     * Close story dropdown
     */
    closeStoryDropdown() {
        const dropdown = document.getElementById('storyDropdown');
        if (dropdown) {
            dropdown.classList.remove('show');
        }
    },

    /**
     * Select a story
     */
    selectStory(storyId) {
        Storage.setActiveStory(storyId);
        this.closeStoryDropdown();
        window.location.reload();
    },

    /**
     * Create new story
     */
    createNewStory() {
        const name = prompt('Enter story name:', 'New Story');
        if (name && name.trim()) {
            Storage.createStory(name.trim());
            this.closeStoryDropdown();
            window.location.reload();
        }
    }
};

// Close dropdown when clicking outside
document.addEventListener('click', (e) => {
    if (!e.target.closest('.story-selector')) {
        UI.closeStoryDropdown();
    }
});