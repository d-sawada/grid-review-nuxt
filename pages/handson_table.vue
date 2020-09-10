<template>
  <div>
    <h-table :data="data" :settings="settings" />
  </div>
</template>

<script>
import HTable from '@/components/HTable'

export default {
  components: {
    HTable
  },

  data: () => ({
    data: [
      ['', 'Ford', 'Volvo', 'Toyota', 'Honda'],
      ['2016', 10, 11, 12, 13],
      ['2017', 20, 11, 14, 13],
      ['2018', 30, 15, 12, 13]
    ]
  }),

  computed: {
    settings: () => ({})
  }
}
</script>
