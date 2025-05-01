<template>
  <div class="json-viewer-app" :data-theme="theme">
    <div class="toolbar">
      <div class="left-controls">
        <div class="logo">
          <LogoIcon />
          <div class="logo-text-container">
            <span class="logo-text">JSON Pilot</span>
            <span class="logo-subtitle">by <a href="https://7angle.com" target="_blank">7 Angle</a></span>
          </div>
        </div>
        <button @click="toggleExpandAll" class="icon-btn" :title="isExpanded ? 'Collapse All' : 'Expand All'">
          <CollapseIcon v-if="isExpanded" />
          <ExpandIcon v-else />
        </button>
      </div>
      <div class="right-controls">
        <div class="path-display" v-if="selectedPaths.length && formatSelectedPath">
          <span class="path-label">Path:</span>
          <span class="path-value">{{ formatSelectedPath }}</span>
          <button class="icon-btn small" @click="copyPath" title="Copy path">
            <CopyIcon :size="14" />
          </button>
        </div>
        <button @click="copySelected" :disabled="!selectedPaths.length" class="icon-btn" title="Copy Selected">
          <CopyIcon />
          <span>Copy</span>
        </button>
        <button @click="toggleTheme" class="icon-btn" :title="theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'">
          <SunIcon v-if="theme === 'dark'" />
          <MoonIcon v-else />
        </button>
        <a href="https://github.com/7angle/json-pilot" target="_blank" class="icon-btn" title="View on GitHub">
          <GitHubIcon />
        </a>
      </div>
    </div>

    <div class="main-container">
      <JsonNode
        v-if="jsonData"
        ref="rootNode"
        :value="jsonData"
        :selected-paths="selectedPaths"
        @select="handleNodeSelect"
      />
    </div>

    <!-- Copy Feedback Toast -->
    <div class="toast" :class="{ 'show': showToast }">
      {{ toastMessage }}
    </div>

    <!-- Hidden textarea for clipboard operations -->
    <textarea
      ref="clipboardTextArea"
      class="clipboard-textarea"
      :value="clipboardContent"
      @copy="handleCopy"
    ></textarea>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, nextTick } from 'vue'
import { useStorage } from '@vueuse/core'
import JsonNode from './components/JsonNode.vue'
import ExpandIcon from './components/icons/ExpandIcon.vue'
import CollapseIcon from './components/icons/CollapseIcon.vue'
import SunIcon from './components/icons/SunIcon.vue'
import MoonIcon from './components/icons/MoonIcon.vue'
import CopyIcon from './components/icons/CopyIcon.vue'
import LogoIcon from './components/icons/LogoIcon.vue'
import GitHubIcon from './components/icons/GitHubIcon.vue'

// State
const jsonData = ref(null)
const theme = useStorage('json-viewer-theme', 'light')
const selectedPaths = ref([])
const showToast = ref(false)
const toastMessage = ref('')
const clipboardTextArea = ref(null)
const clipboardContent = ref('')
const rootNode = ref(null)
const isExpanded = ref(true)

// Computed
const formatSelectedPath = computed(() => {
  if (!selectedPaths.value.length) return ''
  const currentPath = selectedPaths.value[selectedPaths.value.length - 1]
  // Return empty string if root is selected or path is empty
  if (!currentPath || currentPath.length === 0) return ''
  
  return currentPath.reduce((path, segment) => {
    if (typeof segment === 'number' || /^\d+$/.test(segment)) {
      return `${path}[${segment}]`
    }
    if (/[^a-zA-Z0-9_$]/.test(segment)) {
      return `${path}['${segment}']`
    }
    return path ? `${path}.${segment}` : segment
  }, '')
})

// Methods
const toggleExpandAll = () => {
  isExpanded.value = !isExpanded.value
  if (isExpanded.value) {
    if (rootNode.value?.expandAll) {
      rootNode.value.expandAll(true)
    }
  } else {
    if (rootNode.value?.collapseAll) {
      rootNode.value.collapseAll()
    }
  }
}

const toggleTheme = () => {
  theme.value = theme.value === 'dark' ? 'light' : 'dark'
}

const handleNodeSelect = async (paths) => {
  selectedPaths.value = paths
  
  if (paths.length) {
    const selectedData = paths.reduce((acc, pathSegments) => {
      let value = jsonData.value
      for (const key of pathSegments) {
        value = value[key]
      }
      
      let current = acc
      for (let i = 0; i < pathSegments.length - 1; i++) {
        const key = pathSegments[i]
        if (!current[key]) {
          current[key] = {}
        }
        current = current[key]
      }
      current[pathSegments[pathSegments.length - 1]] = value
      return acc
    }, {})

    clipboardContent.value = JSON.stringify(selectedData, null, 2)
  }
}

const copySelected = async () => {
  if (!selectedPaths.value.length || !clipboardContent.value) return
  
  try {
    if (clipboardTextArea.value) {
      clipboardTextArea.value.select()
      document.execCommand('copy')
      showToastMessage('Selected content copied!')
    }
  } catch (err) {
    console.error('Copy failed:', err)
    showToastMessage('Failed to copy content')
  }
}

const copyPath = () => {
  if (!formatSelectedPath.value) return
  
  clipboardContent.value = formatSelectedPath.value
  
  try {
    if (clipboardTextArea.value) {
      nextTick(() => {
        clipboardTextArea.value.select()
        document.execCommand('copy')
        showToastMessage('Path copied!')
      })
    }
  } catch (err) {
    console.error('Copy path failed:', err)
    showToastMessage('Failed to copy path')
  }
}

const showToastMessage = (message) => {
  toastMessage.value = message
  showToast.value = true
  setTimeout(() => {
    showToast.value = false
  }, 2000)
}

// Initialize
onMounted(() => {
  window.addEventListener('message', (event) => {
    if (event.data.type === 'json-data') {
      try {
        jsonData.value = JSON.parse(event.data.content)
        // Always expand on initial load
        setTimeout(() => {
          if (!rootNode.value?.expandAll) return
          rootNode.value.expandAll(true)
        }, 0)
      } catch (e) {
        console.error('Failed to parse JSON:', e)
      }
    }
  })

  window.parent.postMessage('viewer-ready', '*')
})
</script>

<style lang="scss">
html, body {
  margin: 0;
  padding: 0;
  overflow: hidden;
}

:root {
  --text-color: #2c3e50;
  --key-color: #2e86de;
  --string-color: #10ac84;
  --number-color: #ee5253;
  --boolean-color: #ff9f43;
  --null-color: #8395a7;
  --hover-bg: rgba(0, 0, 0, 0.05);
  --toolbar-bg: #f8f9fa;
  --border-color: #e9ecef;
  --button-hover: #e9ecef;
}

.json-viewer-app {
  height: 100vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  
  &[data-theme="dark"] {
    --logo-red: #E5251D;
    --text-color: #f1f2f6;
    --key-color: #70a1ff;
    --string-color: #2ed573;
    --number-color: #ff6b81;
    --boolean-color: #ffa502;
    --null-color: #a4b0be;
    --hover-bg: rgba(255, 255, 255, 0.1);
    --toolbar-bg: #1e272e;
    --border-color: #4b4b4b;
    --button-hover: #2d3436;
    
    background-color: #2f3542;
    color: var(--text-color);
  }
}

.toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 6px 12px;
  background-color: var(--toolbar-bg);
  border-bottom: 1px solid var(--border-color);
  position: sticky;
  top: 0;
  z-index: 100;
  gap: 12px;
  
  .left-controls {
    display: flex;
    align-items: center;
    gap: 12px;

    .logo {
      display: flex;
      align-items: center;
      gap: 8px;
      color: var(--text-color);
      
      img {
        width: 24px;
        height: 24px;
        object-fit: contain;
      }
      
      .logo-text-container {
        display: flex;
        flex-direction: column;
        gap: 2px;
      }

      .logo-text {
        font-weight: 600;
        font-size: 14px;
        color: var(--logo-red);
        line-height: 1;
      }

      .logo-subtitle {
        font-size: 11px;
        opacity: 0.8;
        line-height: 1;
        
        a {
          color: var(--key-color);
          text-decoration: none;
          transition: opacity 0.2s;
          
          &:hover {
            opacity: 0.8;
            text-decoration: underline;
          }
        }
      }
    }
  }

  .right-controls {
    display: flex;
    gap: 8px;
    align-items: center;
    
    .path-display {
      display: flex;
      align-items: center;
      gap: 8px;
      font-family: monospace;
      font-size: 0.9em;
      background-color: var(--hover-bg);
      padding: 4px 8px;
      border-radius: 4px;
      white-space: nowrap;
      max-width: 300px;
      overflow: hidden;
      
      .path-label {
        opacity: 0.7;
      }
      
      .path-value {
        color: var(--key-color);
        overflow: hidden;
        text-overflow: ellipsis;
      }
    }
  }
}

.main-container {
  flex: 1;
  overflow: auto;
  padding: 0;
  
  &::-webkit-scrollbar {
    width: 6px;
    height: 6px;
  }
  
  &::-webkit-scrollbar-track {
    background: transparent;
  }
  
  &::-webkit-scrollbar-thumb {
    background: var(--border-color);
    border-radius: 3px;
    
    &:hover {
      background: var(--key-color);
    }
  }
}

.icon-btn {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 4px 8px;
  border: 1px solid var(--border-color);
  border-radius: 4px;
  background-color: transparent;
  color: var(--text-color);
  cursor: pointer;
  transition: all 0.2s;
  font-size: 13px;
  
  svg {
    color: currentColor;
  }
  
  &:hover:not(:disabled) {
    background-color: var(--button-hover);
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
  
  &.small {
    padding: 2px 4px;
    font-size: 12px;
  }
}

.toast {
  position: fixed;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%) translateY(100%);
  background-color: var(--toolbar-bg);
  color: var(--text-color);
  padding: 8px 16px;
  border-radius: 4px;
  border: 1px solid var(--border-color);
  transition: transform 0.3s ease-in-out;
  z-index: 1000;
  font-size: 13px;
  
  &.show {
    transform: translateX(-50%) translateY(0);
  }
}

.clipboard-textarea {
  position: absolute;
  left: -9999px;
  top: 0;
  width: 1px;
  height: 1px;
  opacity: 0;
}

:deep(.json-node) {
  padding-right: 16px;
}

.center-controls {
  display: none;
}
</style> 