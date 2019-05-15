import React from 'react'
import classnames from 'classnames'
// material ui
import {
  Chip,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  withStyles,
} from '@material-ui/core'
// custom components

// color mapping
import {
  colorNameOptions,
  colorOptions,
  getColorClassByColorName,
  getColorMapping,
  reduceColorToClass,
} from '../Calendar/ColorMapping'

const styles = (theme) => ({
  emptySelected: { paddingTop: 5 },
  colorSelector: {
    display: 'inline',
    marginLeft: theme.spacing.unit * 2,
    width: '100%',
  },
  colorSelectorItem: {
    display: 'flex',
    alignItems: 'center',
  },
  select: {
    minWidth: 300,
  },
  chips: {
    display: 'flex',
    overflowX: 'auto',
    width: '100%',
  },
  bullet: {
    borderRadius: '50%',
    width: theme.spacing.unit * 2,
    height: theme.spacing.unit * 2,
    marginRight: theme.spacing.unit * 2,
    display: 'inline-block',
  },
  chip: {
    margin: theme.spacing.unit / 4,
    // color: '#26c6da',
  },
  ...getColorMapping().reduce(reduceColorToClass, {}),
})

const capitalizeFirstCharacter = (string) =>
  string !== undefined ? string.charAt(0).toUpperCase() + string.slice(1) : ''

const ColorSelectorChipBase = ({ classes, value }) => {
  return (
    <Chip
      color='primary'
      key={value}
      label={capitalizeFirstCharacter(value)}
      className={classnames([
        classes.chip,
        getColorClassByColorName(value, classes),
      ])}
    />
  )
}

const ColorSelectorChip = withStyles(styles, { name: 'DoctorSelectorChip' })(
  ColorSelectorChipBase,
)

const ColorSelectorItemBase = ({ classes, value, label }) => {
  return (
    <div className={classnames(classes.colorSelectorItem)}>
      <span
        className={classnames([
          classes.bullet,
          getColorClassByColorName(value, classes),
        ])}
      />
      {label}
    </div>
  )
}

const ColorSelectorItem = withStyles(styles, { name: 'ColorSelectorItem' })(
  ColorSelectorItemBase,
)

const ColorSelector = ({
  classes,
  label = 'Filter by Color Tag',
  selected,
  handleChange,
  multiple = false,
}) => {
  return (
    <FormControl
      className={classnames([
        classes.colorSelector,
        selected.length === 0 ? classes.emptySelected : null,
      ])}
    >
      <InputLabel>{label}</InputLabel>
      <Select
        className={classes.select}
        multiple={multiple}
        displayEmpty
        value={selected}
        onChange={handleChange}
        renderValue={(values) => {
          return (
            <div className={classnames(classes.chips)}>
              {values.map((value) => (
                <ColorSelectorChip key={`chip-${value}`} value={value} />
              ))}
            </div>
          )
        }}
      >
        <MenuItem disabled value=''>
          <span>Color</span>
        </MenuItem>
        {colorNameOptions.map((option) => (
          <MenuItem value={option.value} key={option.value}>
            <ColorSelectorItem label={option.name} value={option.value} />
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  )
}

export default withStyles(styles, { name: 'ColorSelectorComponent' })(
  ColorSelector,
)
