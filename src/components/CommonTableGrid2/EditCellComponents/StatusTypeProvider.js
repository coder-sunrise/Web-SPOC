import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { withStyles, Typography } from '@material-ui/core'
import { DataTypeProvider } from '@devexpress/dx-react-grid'

import {
  Badge,
  TextField,
  TextTypeProvider as TextTypeProviderOrg,
  Primary,
} from '@/components'

const styles = (theme) => ({})

const StatusTypeBase = (props) => {
  console.log('statustypebase', props)
  const {
    column: { name: columnName },
    value,
    onValueChange,
    columnExtensions,
  } = props
  // const { name, value: v, ...otherInputProps } = inputProps
  // console.log(props)
  const cfg = columnExtensions.find(
    ({ columnName: currentColumnName }) => currentColumnName === columnName,
  )
  let color

  switch (value) {
    case 'REGISTERED':
      color = 'primary'
      break
    case 'INVOICED':
      color = 'rose'
      break
    case 'CANCELLED':
      color = 'danger'
      break
    case 'PLANNED':
      color = 'gray'
      break
    default:
      color = 'primary'
  }

  return <Badge color={color}>{value}</Badge>
}

export const StatusType = withStyles(styles)(StatusTypeBase)

class StatusTypeProvider extends PureComponent {
  static propTypes = {
    columnExtensions: PropTypes.array,
  }

  constructor (props) {
    super(props)
    const { columnExtensions } = this.props
    this.StatusType = (editorProps) => {
      return <StatusType columnExtensions={columnExtensions} {...editorProps} />
    }
  }

  filterTypeStatusOnly = (statusColumns, column) =>
    column.type === 'status'
      ? [
          ...statusColumns,
          column.columnName,
        ]
      : [
          ...statusColumns,
        ]

  render () {
    const { columnExtensions } = this.props
    const columns = columnExtensions.reduce(this.filterTypeStatusOnly, [])

    return (
      <DataTypeProvider
        for={columns}
        formatterComponent={this.StatusType}
        {...this.props}
      />
    )
  }
}

export default StatusTypeProvider
