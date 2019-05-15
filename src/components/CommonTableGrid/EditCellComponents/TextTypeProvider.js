import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { FastField } from 'formik'
import { withStyles } from '@material-ui/core'
import { DataTypeProvider } from '@devexpress/dx-react-grid'
import { TextField } from '@/components'

const styles = (theme) => ({})

const TextEditorBase = (props) => {
  const {
    column: { name: columnName },
    value,
    onValueChange,
    columnExtensions,
    classes,
  } = props
  // const { name, value: v, ...otherInputProps } = inputProps
  const disabled = columnExtensions.some(
    ({ editingEnabled, columnName: currentColumnName }) =>
      currentColumnName === columnName && editingEnabled === false,
  )

  if (columnName) {
    return (
      <FastField
        name={columnName}
        render={(args) => {
          // console.log(args)
          return (
            <TextField
              showErrorIcon
              noWrapper
              value={value}
              disabled={disabled}
              {...args}
              onChange={(e) => {
                args.field.onChange({
                  target: {
                    value: e.target.value,
                    name: args.field.name,
                  },
                })
                // if (otherInputProps.onChange) otherInputProps.onChange(e)
              }}
            />
          )
        }}
      />
    )
  }
  return <TextField value={value} noWrapper />
}

export const TextEditor = withStyles(styles)(TextEditorBase)

class TextTypeProvider extends PureComponent {
  static propTypes = {
    for: PropTypes.array.isRequired,
    columnExtensions: PropTypes.array,
  }

  constructor (props) {
    super(props)
    const { columnExtensions } = this.props
    this.TextEditor = (editorProps) => (
      <TextEditor columnExtensions={columnExtensions} {...editorProps} />
    )
  }

  render () {
    // console.log('texttypeprovider', this.props)
    const { for: dtpFor } = this.props
    return <DataTypeProvider for={dtpFor} editorComponent={this.TextEditor} />
  }
}

export default TextTypeProvider
