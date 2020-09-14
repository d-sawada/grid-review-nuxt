<template>
  <ag-grid-vue
    ref="grid"
    class="my-ag-grid"
    :class="agGridClass"
    :default-col-def="defaultColDef"
    :column-defs="columnDefs"
    :row-data="rowData"
  />
</template>

<script>
import { AgGridVue } from 'ag-grid-vue'

export default {
  components: {
    AgGridVue
  },

  props: {
    theme: {
      type: String,
      required: true
    }
  },

  computed: {
    defaultColDef: () => ({
      filter: true,
      sortable: true,
      editable: true,
      resizable: true
    }),
    columnDefs: () => [
      { headerName: 'Make', field: 'make' },
      { headerName: 'Model', field: 'model' },
      { headerName: 'Price', field: 'price' }
    ],
    rowData: () => [
      { make: 'Toyota', model: 'Celica', price: 35000 },
      { make: 'Ford', model: 'Mondeo', price: 32000 },
      { make: 'Porsche', model: 'Boxter', price: 72000 }
    ],
    agGridClass () {
      return `ag-theme-${this.theme}`
    }
  },

  mounted () {
    this.sizeColumnsToFit()
  },

  methods: {
    sizeColumnsToFit () {
      this.$refs.grid.gridOptions.api.sizeColumnsToFit()
    },
    autoSizeAll () {
      const allColumnIds = []
      this.$refs.grid.gridOptions.columnApi.getAllColumns().forEach((column) => {
        allColumnIds.push(column.colId)
      })
      this.$refs.grid.gridOptions.columnApi.autoSizeColumns(allColumnIds)
      this.sizeColumnsToFit()
    }
  }
}
</script>

<style>
.my-ag-grid {
  width: 100%;
  height: 500px;
}
</style>
