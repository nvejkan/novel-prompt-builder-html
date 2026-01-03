# 📚 Novel Memory - Prompt Builder for Novel Writing

A lightweight, mobile-friendly web application for building augmented prompts with memory context for novel writing. Works with Gemini or any LLM - no API costs!

**🌐 Live Demo:** [https://nvejkan.github.io/novel-prompt-builder-html](https://nvejkan.github.io/novel-prompt-builder-html)

## ✨ Features

### 📖 Multiple Stories
- Create unlimited stories, each with its own memory bank
- Switch between stories instantly
- Rename, export, or delete stories
- Backup and restore all stories at once

### 📝 Prompt Builder
- Auto-detect entities from your story text
- Manually select additional memory entries
- Customize AI instructions
- One-click copy augmented prompts

### 🔍 Extract
- Generate extraction prompts for comprehensive entity descriptions
- Supports characters, locations, items, events, and custom types
- Multi-language output (matches input language)

### 💾 Memory Management
- Smart merge with preview (new, update, skip)
- Checkbox control for selective import
- Manual add/edit/delete entries
- Export memory as JSON

## 🚀 Quick Start

### Option 1: GitHub Pages (Recommended)

1. Fork this repository
2. Go to Settings → Pages
3. Select "Deploy from a branch" → main → / (root)
4. Access at `https://yourusername.github.io/novel-prompt-builder-html`

### Option 2: Local

1. Clone the repository
2. Open `index.html` in your browser

## 📖 Usage

1. **Create a Story**: Go to Stories page and create your first story
2. **Add Memory**: Go to Memory page to add characters, locations, etc.
3. **Write**: Go to Prompt Builder and write your story
4. **Copy Prompt**: Copy the augmented prompt to Gemini
5. **Extract**: Use Extract page to pull new entities from AI responses
6. **Import**: Import extracted JSON back to Memory
7. **Repeat!**

## 💾 Data Storage

- All data stored in browser localStorage
- Each story has separate memory
- Export all stories for backup
- Import to restore from backup

## 📁 Project Structure