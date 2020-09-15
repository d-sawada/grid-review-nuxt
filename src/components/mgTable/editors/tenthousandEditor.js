import Handsontable from 'handsontable'

export class TenthousandEditor extends Handsontable.editors.TextEditor {
  beginEditing (newInitialValue, event) {
    super.beginEditing(newInitialValue, event)
    this.TEXTAREA.value = this.originalValue / 1000
  }

  getValue () {
    return this.TEXTAREA.value * 1000
  }
}
