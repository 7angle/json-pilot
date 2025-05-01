<template>
  <div 
    class="json-node" 
    :class="{ 'selected': isSelected }"
  >
    <div class="node-content" @click.stop="toggleSelect">
      <div class="tree-line"></div>
      <span 
        v-if="isExpandable" 
        class="toggle" 
        :class="{ 'expanded': isExpanded }"
        @click.stop="toggleExpand"
      >
        <CollapseIcon v-if="isExpanded" :size="12" />
        <ExpandIcon v-else :size="12" />
      </span>

      <template v-if="isObject">
        <span class="key" v-if="nodeKey">
          "{{ nodeKey }}":
        </span>
        <span class="bracket">{{ isArray ? '[' : '{' }}</span>
        <span class="preview" v-if="!isExpanded">
          {{ getPreview() }}
        </span>
        <span class="bracket" v-if="!isExpanded">{{ isArray ? ']' : '}' }}</span>
      </template>

      <template v-else>
        <span class="key" v-if="nodeKey">
          "{{ nodeKey }}":
        </span>
        <span :class="valueClass">
          {{ formatValue(value) }}
        </span>
      </template>
    </div>

    <div v-if="isExpandable && isExpanded" class="children">
      <div class="tree-line-vertical"></div>
      <JsonNode
        v-for="(childValue, childKey, index) in value"
        :key="childKey"
        :value="childValue"
        :node-key="isArray ? null : childKey"
        :depth="depth + 1"
        :path="getChildPath(childKey)"
        :selected-paths="selectedPaths"
        :is-last="index === Object.keys(value).length - 1"
        @select="handleSelect"
        ref="childNodes"
      />
      <div 
        class="bracket-closing" 
      >
        {{ isArray ? ']' : '}' }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, watch } from 'vue'
import ExpandIcon from './icons/ExpandIcon.vue'
import CollapseIcon from './icons/CollapseIcon.vue'

const props = defineProps({
  value: {
    type: [Object, Array, String, Number, Boolean],
    required: true
  },
  nodeKey: {
    type: [String, Number],
    default: null
  },
  depth: {
    type: Number,
    default: 0
  },
  path: {
    type: Array,
    default: () => []
  },
  selectedPaths: {
    type: Array,
    default: () => []
  },
  isLast: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['select'])
const childNodes = ref([])
const isExpanded = ref(true)

const isObject = computed(() => {
  return typeof props.value === 'object' && props.value !== null
})

const isArray = computed(() => Array.isArray(props.value))

const isExpandable = computed(() => {
  return isObject.value && Object.keys(props.value).length > 0
})

const valueClass = computed(() => {
  if (props.value === null) return 'null'
  if (typeof props.value === 'boolean') return 'boolean'
  if (typeof props.value === 'number') return 'number'
  return 'string'
})

const isSelected = computed(() => {
  if (!props.selectedPaths.length) return false
  return props.selectedPaths.some(path => 
    path.length === props.path.length && 
    path.every((segment, i) => segment === props.path[i])
  )
})

const getChildPath = (key) => {
  return [...props.path, key]
}

const getAllChildPaths = (value, currentPath) => {
  const paths = []
  
  if (typeof value === 'object' && value !== null) {
    Object.keys(value).forEach(key => {
      const childPath = [...currentPath, key]
      paths.push(childPath)
      if (typeof value[key] === 'object' && value[key] !== null) {
        paths.push(...getAllChildPaths(value[key], childPath))
      }
    })
  }
  
  return paths
}

const toggleExpand = (event) => {
  event.stopPropagation()
  isExpanded.value = !isExpanded.value
}

const toggleSelect = () => {
  const newPaths = []
  
  if (!isSelected.value) {
    newPaths.push(props.path)
  }
  
  emit('select', newPaths)
}

const handleSelect = (paths) => {
  emit('select', paths)
}

const formatValue = (val) => {
  if (val === null) return 'null'
  if (typeof val === 'string') return `"${val}"`
  return String(val)
}

const getPreview = () => {
  if (isArray.value) {
    return `${props.value.length} items`
  }
  return `${Object.keys(props.value).length} properties`
}

const expandAll = (deep = true) => {
  isExpanded.value = true
  if (deep && childNodes.value) {
    childNodes.value.forEach(node => {
      if (node.expandAll) {
        node.expandAll(deep)
      }
    })
  }
}

const collapseAll = () => {
  isExpanded.value = false
  if (childNodes.value) {
    childNodes.value.forEach(node => {
      if (node.collapseAll) {
        node.collapseAll()
      }
    })
  }
}

// Expose methods to parent
defineExpose({
  expandAll,
  collapseAll,
  props
})
</script>

<style lang="scss" scoped>
.json-node {
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', 'Consolas', monospace;
  font-size: 14px;
  line-height: 1.5;
  position: relative;
  padding-left: 16px;
  
  &.selected {
    > .node-content {
      background-color: rgba(#70a1ff, 0.2);
    }
  }
}

.node-content {
  padding: 2px 8px;
  cursor: pointer;
  border-radius: 2px;
  display: flex;
  align-items: center;
  position: relative;
  
  &:hover {
    background-color: var(--hover-bg);
  }
}

.tree-line {
  position: absolute;
  left: -12px;
  top: 50%;
  width: 12px;
  height: 1px;
  background-color: var(--border-color);
}

.tree-line-vertical {
  position: absolute;
  left: 4px;
  top: 0;
  bottom: 0;
  width: 1px;
  background-color: var(--border-color);
}

.children {
  position: relative;
  margin-left: 4px;
}

.toggle {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 16px;
  height: 16px;
  cursor: pointer;
  color: var(--text-color);
  opacity: 0.7;
  margin-right: 2px;
  
  &:hover {
    opacity: 1;
  }
  
  svg {
    transition: transform 0.2s;
  }
  
  &.expanded svg {
    transform: rotate(90deg);
  }
}

.key {
  color: var(--key-color);
  margin-right: 4px;
}

.string {
  color: var(--string-color);
}

.number {
  color: var(--number-color);
}

.boolean {
  color: var(--boolean-color);
}

.null {
  color: var(--null-color);
}

.bracket {
  color: var(--text-color);
  opacity: 0.7;
}

.preview {
  color: var(--text-color);
  opacity: 0.5;
  margin: 0 4px;
}

.bracket-closing {
  color: var(--text-color);
  opacity: 0.7;
  padding: 2px 8px;
}
</style> 