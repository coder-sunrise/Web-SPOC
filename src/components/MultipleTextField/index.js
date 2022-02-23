import React, { PureComponent } from 'react'
import { InputAdornment, TextField, withStyles } from '@material-ui/core'
import { BaseInput, CustomInput } from '@/components'
import { control } from '@/components/Decorator'
import { Input } from 'antd'
const { TextArea } = Input

const styles = () => ({})

@control()
class MultipleTextField extends PureComponent {
  getComponent = ({ classes, ...restProps }) => {
    return <TextArea {...restProps.inputProps} {...restProps} />
  }

  render() {
    const { classes, ...restProps } = this.props

    return <CustomInput {...restProps}>{this.getComponent}</CustomInput>
  }
}

export default withStyles(styles)(MultipleTextField)
