import Handsontable from 'handsontable'

export class RecordEditor extends Handsontable.editors.SelectEditor {
  getValue () {
    return parseInt(this.select.value)
  }

  setValue (value) {
    this.select.value = parseInt(value)
  }
}
