<template>
  <hot-table :settings="tableSettings" />
</template>

<script>
import 'handsontable/languages/ja-JP.js'
import moment from 'moment'
import { HotTable } from '@handsontable/vue'

moment.locale('ja')

export default {
  components: {
    HotTable
  },

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
    colHeaders () {
      return this.columns.map(column => column.header)
    },
    columnSettings () {
      return this.columns.map(column =>
        Object.assign({}, this.formatters[column.type], {
          data: column.field
        })
      )
    },
    tableSettings () {
      return Object.assign({}, {
        licenseKey: 'non-commercial-and-evaluation',
        language: 'ja-JP',
        manualColumnMove: true,
        columnSorting: true,
        sortEmptyCells: true,
        data: this.data,
        colHeaders: this.colHeaders,
        columns: this.columnSettings
      }, this.settings)
    },
    formatters: () => ({
      numeric: {
        type: 'numeric'
      },
      currensy: {
        type: 'numeric',
        numericFormat: {
          pattern: '¥0,0',
          culture: 'ja-JP'
        }
      },
      tenthousand: {
        type: 'numeric',
        numericFormat: {
          pattern: '¥0,0',
          culture: 'ja-JP'
        }
      },
      date: {
        type: 'date',
        dateFormat: 'YYYY/MM/DD',
        correctFormat: true,
        defaultDate: moment().format('YYYY/MM/DD'),
        datePickerConfig: {
          yearSuffix: '年',
          showMonthAfterYear: true,
          showDaysInNextAndPreviousMonths: true,
          i18n: {
            previousMonth: '前月',
            nextMonth: '次月',
            months: moment.localeData()._months,
            weekdays: moment.localeData()._weekdays,
            weekdaysShort: moment.localeData()._weekdaysShort
          }
        }
      }
    })
  }
}
</script>
