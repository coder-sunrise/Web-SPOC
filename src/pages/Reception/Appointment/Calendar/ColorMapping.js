// material ui
import { lighten } from '@material-ui/core/styles/colorManipulator'

const doctors = [
  // { value: 'all', name: 'All Doctor' },
  { value: 'bao', name: 'Bao' },
  { value: 'cheah', name: 'Cheah' },
  { value: 'tan', name: 'Tan' },
  { value: 'tan1', name: 'Tan1' },
  { value: 'tan2', name: 'Tan2' },
  { value: 'tan3', name: 'Tan3' },
  { value: 'tan4', name: 'Tan4' },
  { value: 'tan5', name: 'Tan5' },
]

export const defaultColor = '#5e35b1'

export const defaultColorOpts = {
  name: 'Purple',
  value: '#ab47bc',
  active: '#8e24aa',
}

export const colorNameOptions = [
  { name: 'Default', value: 'default' },
  { name: 'Red', value: 'red' },
  { name: 'Green', value: 'green' },
  { name: 'Blue', value: 'blue' },
  { name: 'Cyan', value: 'cyan' },
  { name: 'Pink', value: 'pink' },
  { name: 'Indigo', value: 'indigo' },
  { name: 'Teal', value: 'teal' },
  { name: 'Brown', value: 'brown' },
]

export const colorOptions = [
  defaultColorOpts,
  { name: 'Red', value: '#ef5350', active: '#e53935' },
  { name: 'Green', value: '#66bb6a', active: '#43a047' },
  { name: 'Blue', value: '#42a5f5', active: '#1976d2' },
  { name: 'Cyan', value: '#26c6da', active: '#00acc1' },
  { name: 'Pink', value: '#ec407a', active: '#d81b60' },
  { name: 'Indigo', value: '#5c6bc0', active: '#3949ab' },
  { name: 'Teal', value: '#26a69a', active: '#00897b' },
  { name: 'Brown', value: '#8d6e63', active: '#6d4c41' },
]

export const getColorClassByColorName = (
  colorTag,
  classes,
  { hover } = { hover: true },
) => {
  const result = [
    classes[`${colorTag}Background`],
  ]

  if (hover) result.push(classes[`${colorTag}Hover`])

  return result.join(' ')
}

export const reduceColorToClass = (acc, { colorName, color, activeColor }) => {
  acc[`${colorName}Background`] = {
    backgroundColor: color,
    '& button.edit-button': { backgroundColor: color },
  }
  acc[`${colorName}Hover`] = { '&:hover': { backgroundColor: activeColor } }
  acc[`${colorName}Span`] = { color: activeColor }
  return acc
}

export const getColorMapping = () => {
  return colorNameOptions.map((color, index) => ({
    colorName: color.value,
    color: colorOptions[index].value,
    activeColor: colorOptions[index].active,
  }))
}
