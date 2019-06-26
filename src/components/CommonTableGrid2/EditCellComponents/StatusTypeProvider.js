import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { withStyles, Chip } from '@material-ui/core'
import { DataTypeProvider } from '@devexpress/dx-react-grid'
import { Badge } from '@/components'

const styles = (theme) => ({
  badge: {
    padding: theme.spacing.unit,
    fontSize: '.875rem',
  },
})

const StatusTypeBase = (props) => {
  // console.log('statustypebase', props)
  const {
    column: { name: columnName },
    value,
    onValueChange,
    columnExtensions,
    classes,
  } = props
  // const { name, value: v, ...otherInputProps } = inputProps
  // console.log(props)
  const cfg = columnExtensions.find(
    ({ columnName: currentColumnName }) => currentColumnName === columnName,
  )
  let color = 'primary'

  // WAITING, TO DISPENSE, IN CONS, PAUSED, PAID, OVERPAID, COMPLETED
  const hasBadge = [
    'WAITING',
    'IN CONS',
    'PAUSED',
    'TO DISPENSE',
    'PAID',
    'OVERPAID',
  ]
  switch (value.toUpperCase()) {
    case 'WAITING':
      color = 'primary'
      break
    case 'TO DISPENSE':
      color = 'success'
      break
    case 'IN CONS':
    case 'PAUSED':
      color = 'danger'
      break
    case 'PAID':
    case 'OVERPAID':
      color = 'gray'
      break
    // case 'APPOINTMENT':
    //   color = 'rose'
    //   break
    default:
      color = 'gray'
      break
  }

  return hasBadge.includes(value.toUpperCase()) ? (
    <Badge className={classes.badge} color={color}>
      {value}
    </Badge>
  ) : (
    <span className={classes.badge}>{value}</span>
  )
  // return <Chip label={value} variant='outlined' color={color} />
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
