import moment from 'moment'
import TenthousandEditor from '@/components/mgTable/editors/tenthousandEditor'
import RecordEditor from '@/components/mgTable/editors/recordEditor'

export default {
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
  },
  record: {
    editor: RecordEditor,
    renderer: 'mg.customSelect',
    filterConfig: {
      type: 'select'
    }
  },
  recordWithInputFilter: {
    editor: RecordEditor,
    renderer: 'mg.customSelect',
    filterConfig: {
      setCondition: (regist, value, options) => {
        const matchKeys = []
        Object.keys(options).forEach((key) => {
          if (options[key].includes(value)) {
            matchKeys.push(parseInt(key))
          }
        })
        regist('by_value', [matchKeys])
      }
    }
  }
}
