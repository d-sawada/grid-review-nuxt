export function TenthousandRenderer (hotInstance, TD, row, column, prop, value, cellProperties) {
  TD.innerHTML = (Number(value) / 1000).toLocaleString()
  TD.style.textAlign = 'right'
  return TD
}
