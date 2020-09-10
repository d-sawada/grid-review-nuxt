<template>
  <hot-table
    :data="data"
    :settings="tableSettings"
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
        licenseKey: 'non-commercial-and-evaluation',
        colHeader: true,
        manualColumnMove: true
      }, this.settings)
    }
  }
}
</script>
