<template>
  <hot-table
    :data="data"
    v-bind="tableSettings"
  />
</template>

<script>
import { HotTable } from '@handsontable/vue'

export default {
  components: {
    HotTable
  },

  props: {
    data: {
      type: Object,
      required: true
    },
    settings: {
      type: Object,
      default: () => ({})
    }
  },

  computed: {
    tableSettings () {
      return Object.assign({}, {
        licenseKey: 'non-commercial-and-evaluation'
      }, this.settings)
    }
  }
}
</script>
