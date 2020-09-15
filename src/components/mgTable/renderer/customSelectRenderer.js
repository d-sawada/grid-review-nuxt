export default function CustomSelectRenderer (hotInstance, TD, row, column, prop, value, cellProperties) {
  TD.innerHTML = cellProperties.selectOptions[value]
  return TD
}
