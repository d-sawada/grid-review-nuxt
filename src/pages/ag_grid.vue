<template>
  <div>
    <select v-model="theme">
      <option v-for="t in themes" :key="t" :value="t" v-text="t" />
    </select>
    <button @click="autoSizeAll">
      autoSizeAll
    </button>
    <div class="grid-wrapper">
      <ag-grid ref="grid" :theme="theme" />
    </div>
  </div>
</template>

<script>
import AgGrid from '@/components/AgGrid'

export default {
  components: {
    AgGrid
  },

  data: () => ({
    theme: 'alpine'
  }),

  computed: {
    themes: () => [
      'alpine-dark',
      'alpine',
      'balham-dark',
      'balham',
      'blue',
      'bootstrap',
      'dark',
      'fresh',
      'material'
    ]
  },

  methods: {
    autoSizeAll () {
      this.$refs.grid.autoSizeAll()
    }
  }
}
</script>

<style>
.grid-wrapper {
  padding: 8px;
}
</style>
