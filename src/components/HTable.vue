<template>
  <hot-table ref="hotTable" :settings="tableSettings" />
</template>

<script>
import 'handsontable/dist/handsontable.full.css'
import 'handsontable/languages/ja-JP.js'
import moment from 'moment'
import { HotTable } from '@handsontable/vue'
import Handsontable from 'handsontable'

moment.locale('ja')

function TenthousandRenderer (hotInstance, TD, row, column, prop, value, cellProperties) {
  TD.innerHTML = (Number(value) / 1000).toLocaleString()
  TD.style.textAlign = 'right'
  return TD
}

function CustomSelectRenderer (hotInstance, TD, row, column, prop, value, cellProperties) {
  TD.innerHTML = cellProperties.selectOptions[value]
  return TD
}

class TenthousandEditor extends Handsontable.editors.TextEditor {
  beginEditing (newInitialValue, event) {
    super.beginEditing(newInitialValue, event)
    this.TEXTAREA.value = this.originalValue / 1000
  }

  getValue () {
    return this.TEXTAREA.value * 1000
  }
}

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
      text: {
        type: 'text'
      },
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
        },
        renderer: 'mg.tenthousand',
        editor: TenthousandEditor,
        filterConfig: {
          setCondition: (regist, value) => regist('contains', [value * 1000])
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
      },
      select: {
        editor: 'select',
        filterConfig: {
          type: 'select'
        }
      },
      customSelect: {
        editor: 'select',
        renderer: 'mg.customSelect',
        filterConfig: {
          type: 'select'
        }
      },
      customSelectWithInputFilter: {
        editor: 'select',
        renderer: 'mg.customSelect',
        filterConfig: {
          setCondition: (regist, value, options) => {
            const matchKeys = []
            Object.keys(options).forEach((key) => {
              if (options[key].includes(value)) {
                matchKeys.push(key)
              }
            })
            regist('by_value', [matchKeys])
          }
        }
      }
    }),

    defaultFilterConfig: () => ({
      type: 'input',
      setCondition: (regist, value) => regist('contains', [value])
    }),

    colHeaders () {
      return this.columns.map(column => column.header)
    },

    columnSettings () {
      return this.columns.map((column) => {
        return Object.assign(
          {},
          this.formatters[column.type],
          {
            data: column.field,
            selectOptions: column.selectOptions
          }
        )
      })
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

  created () {
    Handsontable.renderers.registerRenderer('mg.tenthousand', TenthousandRenderer)
    Handsontable.renderers.registerRenderer('mg.customSelect', CustomSelectRenderer)
  },

  methods: {
    hot () {
      return this.$refs.hotTable.hotInstance
    },

    _createFilterInput (col, TH, filterConfig, options) {
      const DIV = document.createElement('div')
      const INPUT = document.createElement('input')
      DIV.className = 'filterHeader'
      INPUT.style.width = '100%'

      INPUT.addEventListener('keydown', Handsontable.helper.debounce((event) => {
        const filtersPlugin = this.hot().getPlugin('filters')
        const regist = (op, args) => filtersPlugin.addCondition(col, op, args)

        filtersPlugin.removeConditions(col)
        if (event.target.value !== undefined && event.target.value !== '') {
          filterConfig.setCondition(regist, event.target.value, options)
        }
        filtersPlugin.filter()
      }, 200))

      DIV.appendChild(INPUT)
      TH.appendChild(DIV)
    },

    _createFilterSelect (col, TH, filterConfig, options) {
      const DIV = document.createElement('div')
      const SELECT = document.createElement('select')
      SELECT.style.width = '100%'

      SELECT.appendChild(document.createElement('option'))
      Object.keys(options).forEach((key) => {
        const OPTION = document.createElement('option')
        OPTION.value = key
        OPTION.innerHTML = options[key]
        SELECT.appendChild(OPTION)
      })

      SELECT.addEventListener('change', Handsontable.helper.debounce((event) => {
        const filtersPlugin = this.hot().getPlugin('filters')
        const regist = (op, args) => filtersPlugin.addCondition(col, op, args)
        filtersPlugin.removeConditions(col)
        filterConfig.setCondition(regist, event.target.value)
        filtersPlugin.filter()
      }, 200))

      DIV.appendChild(SELECT)
      TH.appendChild(DIV)
    },

    _addInputAfterGetColHeader (col, TH) {
      if (typeof col !== 'number') {
        return col
      }
      if (col < 0 || TH.childElementCount >= 2) {
        return
      }

      const column = this.columns[col]
      const filterConfig = Object.assign(
        {},
        this.defaultFilterConfig,
        this.formatters[column.type].filterConfig
      )

      if (column.type === 'customSelectWithInputFilter') {
        this._createFilterInput(col, TH, filterConfig, column.selectOptions)
      } else if (filterConfig.type === 'input') {
        this._createFilterInput(col, TH, filterConfig)
      } else if (filterConfig.type === 'select') {
        let options = column.selectOptions
        if (Array.isArray(options)) {
          options = {}
          column.selectOptions.forEach((option, index) => {
            options[index] = option
          })
        }
        this._createFilterSelect(col, TH, filterConfig, options)
      } else if (filterConfig.type === 'customSelect') {
        this._createFilterSelect(col, TH, filterConfig, column.selectOptions)
      }
    },

    _preventSelectColumnBeforeOnCellMouseDown (event, coords) {
      if (
        coords.row === -1 &&
        (event.target.nodeName === 'INPUT' || event.target.nodeName === 'SELECT')
      ) {
        event.stopImmediatePropagation()
        this.hot().deselectCell()
      }
    }
  }
}
</script>
