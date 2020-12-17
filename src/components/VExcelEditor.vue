<template>
  <vue-excel-editor
    v-model="data"
    v-bind="gridSettings"
  >
    <vue-excel-column
      v-for="(column, index) in columns"
      :key="index"
      v-bind="column"
    />
  </vue-excel-editor>
</template>

<script>
export default {
  props: {
    data: {
      type: Array,
      required: true
    },
    columns: {
      type: Array,
      required: true
    },
    settings: {
      type: Object,
      default: () => ({})
    }
  },

  computed: {
    gridSettings () {
      return Object.assign({}, {
        filterRow: true,
        noPaging: true,
        noFooter: true,
        noHeaderEdit: true
      }, this.settings)
    }
  }
}
</script>
