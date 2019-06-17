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
  // console.log('statustypebase', props)
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
  let color = 'primary'

  // WAITING, TO DISPENSE, IN CONS, PAUSED, OVERPAID, COMPLETED
  switch (value.toUpperCase()) {
    case 'WAITING':
      color = 'primary'
      break
    case 'IN CONS':
      color = 'info'
      break
    case 'TO DISPENSE':
      color = 'rose'
      break
    case 'PAUSED':
      color = 'warning'
      break
    case 'OVERPAID':
      color = 'danger'
      break
    case 'COMPLETED':
      color = 'success'
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
