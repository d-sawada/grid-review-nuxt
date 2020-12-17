<template>
  <div>
    <v-excel-editor
      class="my-vue-excel-editor"
      :data="data"
      :columns="columns"
      :settings="settings"
    />
  </div>
</template>

<script>
import VExcelEditor from '@/components/VExcelEditor'

export default {
  components: {
    VExcelEditor
  },

  data: () => ({
    data: [...Array(100)].map(() => ({
      name: 'name',
      phone: '000-0000-0000',
      age: 20,
      birth: '2000-01-01'
    }))
  }),

  computed: {
    columns: () => [
      { field: 'name', label: 'Name' },
      { field: 'phone', label: 'Contact' },
      { field: 'age', label: 'Age' },
      { field: 'birth', label: 'Date Of Birth' }
    ],
    settings: () => ({
      height: '600px',
      width: '300px'
    })
  }
}
</script>

<style>
.my-vue-excel-editor {
  width: 100%;
}
</style>
