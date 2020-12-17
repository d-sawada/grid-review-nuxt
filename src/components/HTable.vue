<template>
  <hot-table ref="hotTable" :settings="tableSettings" />
</template>

<script>
import 'handsontable/dist/handsontable.full.css'
import 'handsontable/languages/ja-JP.js'
import moment from 'moment'
import Handsontable from 'handsontable'
import { HotTable } from '@handsontable/vue'
import formatters from '@/components/mgTable/formatters'
import CustomSelectRenderer from '@/components/mgTable/renderer/customSelectRenderer'
import TenthousandRenderer from '@/components/mgTable/renderer/tenthousandRenderer'

moment.locale('ja')

Handsontable.renderers.registerRenderer('mg.tenthousand', TenthousandRenderer)
Handsontable.renderers.registerRenderer('mg.customSelect', CustomSelectRenderer)

const defaultFilterConfig = {
  type: 'input',
  setCondition: (regist, value) => regist('contains', [value])
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
    colHeaders () {
      return this.columns.map(column => column.header)
    },

    columnSettings () {
      return this.columns.map((column) => {
        return Object.assign(
          {},
          formatters[column.type],
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
        defaultFilterConfig,
        formatters[column.type].filterConfig
      )

      if (filterConfig.type === 'input') {
        this._createFilterInput(col, TH, filterConfig, column.selectOptions)
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
