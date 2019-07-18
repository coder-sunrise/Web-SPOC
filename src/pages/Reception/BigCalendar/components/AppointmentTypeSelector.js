import React, { PureComponent } from 'react'
import classnames from 'classnames'
// material ui
import { withStyles } from '@material-ui/core'
import { Select as OriAntdSelect } from 'antd'
// custom components
import { Select } from '@/components'
import {
  AppointmentTypeOptions,
  getColorClassByAppointmentType,
  reduceToColorClass,
} from '../setting'

const styles = () => ({
  ...AppointmentTypeOptions.reduce(reduceToColorClass, {}),
  selectContainer: {
    width: '100%',
  },
  dropdownMenu: {
    zIndex: 1310,
  },
  colorDot: {
    height: '0.8rem',
    width: '1.5rem',
    borderRadius: '20%',
    display: 'inline-block',
    marginRight: 10,
  },
})

class AppointmentTypeSelector extends PureComponent {
  render () {
    const { label, classes, ...restProps } = this.props

    return (
      <Select
        label={label}
        options={AppointmentTypeOptions}
        renderDropdown={(option) => {
          return (
            <React.Fragment>
              {option.value !== 'all' && (
                <span
                  className={classnames([
                    classes.colorDot,
                    getColorClassByAppointmentType(option.value, classes),
                  ])}
                />
              )}
              <span>{option.name}</span>
            </React.Fragment>
          )
        }}
        {...restProps}
      />
    )
  }
}

export default withStyles(styles, { name: 'AppointmentTypeSelector' })(
  AppointmentTypeSelector,
)
