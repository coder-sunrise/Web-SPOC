import React, { PureComponent } from 'react'
import { InputAdornment, TextField, withStyles } from '@material-ui/core'
import { BaseInput, CustomInput } from '@/components'
import { control } from '@/components/Decorator'

const styles = () => ({})

@control()
class OutlinedTextField extends PureComponent {
  getComponent = ({ classes, ...restProps }) => {
    return (
      <TextField variant='outlined' {...restProps.inputProps} {...restProps} />
    )
  }

  render () {
    const { classes, ...restProps } = this.props

    return (
      <CustomInput showLabel={false} {...restProps}>
        {this.getComponent}
      </CustomInput>
    )
  }
}

export default withStyles(styles)(OutlinedTextField)
