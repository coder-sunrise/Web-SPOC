import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { withStyles, Chip } from '@material-ui/core'
import { DataTypeProvider } from '@devexpress/dx-react-grid'
import { Badge } from '@/components'
import { VISIT_STATUS } from '@/pages/Reception/Queue/variables'

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
  // const hasBadge = [
  //   'WAITING',
  //   'IN CONS',
  //   'PAUSED',
  //   'DISPENSE',
  //   'BILLING',
  //   'ORDER UPDATED',
  //   'COMPLETED',
  //   'UPCOMING APPT.',
  // ]
  const hasBadge = Object.keys(VISIT_STATUS).map((key) => VISIT_STATUS[key])
  switch (value.toUpperCase()) {
    case VISIT_STATUS.WAITING:
      color = 'primary'
      break
    case VISIT_STATUS.DISPENSE:
    case VISIT_STATUS.BILLING:
    case VISIT_STATUS.ORDER_UPDATED:
      color = 'success'
      break
    case VISIT_STATUS.IN_CONS:
    case VISIT_STATUS.PAUSED:
      color = 'danger'
      break
    case VISIT_STATUS.UPCOMING_APPT:
      color = 'gray'
      break
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
