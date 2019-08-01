import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { MenuItem, Select, withStyles } from '@material-ui/core'
import { CustomInputWrapper } from '@/components'
import extendedFormsStyle from 'mui-pro-jss/material-dashboard-pro-react/views/extendedFormsStyle.jsx'

class SelectCell extends PureComponent {
  static propTypes = {
    options: PropTypes.array.isRequired,
    name: PropTypes.string.isRequired,
    onValueChange: PropTypes.func.isRequired,
    value: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number,
    ]),
    label: PropTypes.string,
  }

  render () {
    const {
      classes,
      label,
      options,
      value,
      name,
      onValueChange,
      ...restProps
    } = this.props
    console.log('selectcell')
    return (
      <CustomInputWrapper {...restProps}>
        <Select
          MenuProps={{ className: classes.selectMenu }}
          classes={{
            select: classes.select,
          }}
          name={name}
          value={value}
          onChange={(event) => {
            onValueChange(event.target.value)
          }}
        >
          <MenuItem disabled classes={{ root: classes.selectMenuItem }}>
            {label}
          </MenuItem>
          {options.map((option) => (
            <MenuItem
              key={option.name}
              classes={{
                root: classes.selectMenuItem,
                selected: classes.selectMenuItemSelected,
              }}
              {...option}
            >
              {option.name}
            </MenuItem>
          ))}
        </Select>
      </CustomInputWrapper>
    )
  }
}

export default withStyles(extendedFormsStyle)(SelectCell)
