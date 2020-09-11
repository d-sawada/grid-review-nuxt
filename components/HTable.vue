<template>
  <hot-table ref="hotTable" :settings="tableSettings" />
</template>

<script>
import 'handsontable/languages/ja-JP.js'
import moment from 'moment'
import { HotTable } from '@handsontable/vue'
import Handsontable from 'handsontable'

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
    }),

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
        manualColumnResize: true,
        stretchH: 'all',
        columnSorting: true,
        sortEmptyCells: true,
        filters: true,
        afterGetColHeader: this._addInputAfterGetColHeader,
        beforeOnCellMouseDown: this._preventSelectColumnBeforeOnCellMouseDown,
        data: this.data,
        colHeaders: this.colHeaders,
        columns: this.columnSettings
      }, this.settings)
    }
  },

  methods: {
    hot () {
      return this.$refs.hotTable.hotInstance
    },

    _addInputAfterGetColHeader (col, TH) {
      if (typeof col !== 'number') {
        return col
      }

      if (col >= 0 && TH.childElementCount < 2) {
        const div = document.createElement('div')
        const input = document.createElement('input')
        div.className = 'filterHeader'
        input.style.width = '100%'

        const debounceFn = Handsontable.helper.debounce((event) => {
          const filtersPlugin = this.hot().getPlugin('filters')
          filtersPlugin.removeConditions(col)
          filtersPlugin.addCondition(col, 'contains', [event.target.value])
          filtersPlugin.filter()
        }, 200)
        input.addEventListener('keydown', debounceFn)

        div.appendChild(input)
        TH.appendChild(div)
      }
    },

    _preventSelectColumnBeforeOnCellMouseDown (event, coords) {
      if (coords.row === -1 && event.target.nodeName === 'INPUT') {
        event.stopImmediatePropagation()
        this.hot().deselectCell()
      }
    }
  }
}
</script>
