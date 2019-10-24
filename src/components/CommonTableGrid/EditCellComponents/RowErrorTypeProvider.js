import React, { PureComponent, useState } from 'react'
import PropTypes from 'prop-types'
// material ui
import { Popover, withStyles } from '@material-ui/core'
import Info from '@material-ui/icons/Info'
// devexpress react-grid
import { DataTypeProvider } from '@devexpress/dx-react-grid'
// common components
import { SizeContainer } from '@/components'
import { tooltip } from '@/assets/jss/index'

const RowErrorStyles = () => ({
  popover: {
    pointerEvents: 'none',
  },
  tooltip: {
    ...tooltip,
    padding: '10px 5px',
    background: '#4f4f4f',
    maxWidth: 400,
    textAlign: 'left',
    fontSize: '0.85rem',
  },
})

const replaceSubstr = (originalString, index, replacement) => {
  return (
    originalString.substr(0, index) +
    replacement +
    originalString.substr(index + replacement.length)
  )
}

const ListTypeError = ({ errors }) => {
  const regex = /(?=(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec|\d{4}(?=\b)|\d{1,2}(?=st|nd|rd|th|\b)))\w*\W*(\d{1,2}(?=st|nd|rd|th|\b)|jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)\D*(\d{4}(?=\b)|\d{1,2}(?=st|nd|rd|th|\b))/
  return (
    <ul>
      {errors.map((error, index) => {
        const matched = error.conflictContent.match(regex)
        let parsed = error.conflictContent
        if (matched) {
          const dateStr = matched && matched.length > 0 ? matched[1] : ''

          const dateAfterAddOne = parseInt(dateStr, 10) + 1
          const indexOfDate = error.conflictContent.indexOf(dateStr)
          parsed = replaceSubstr(
            error.conflictContent,
            indexOfDate,
            `${dateAfterAddOne}`,
          )
        }
        return <li key={`rowError-${index}`}>{parsed}</li>
      })}
    </ul>
  )
}

const RowErrorBase = ({ classes, ...props }) => {
  const [
    anchorEl,
    setAnchorEl,
  ] = useState(null)

  const handlePopoverOpen = (event) => {
    setAnchorEl(event.currentTarget)
  }

  const handlePopoverClose = () => {
    setAnchorEl(null)
  }

  const showPopup = Boolean(anchorEl)

  const { row } = props
  if (row.hasConflict || row.conflicts || row.error) {
    return (
      <div>
        <SizeContainer size='lg'>
          <Info
            color='error'
            onMouseEnter={handlePopoverOpen}
            onMouseLeave={handlePopoverClose}
          />
        </SizeContainer>
        <Popover
          id={`rowError${row.id}`}
          className={classes.popover}
          open={showPopup}
          anchorEl={anchorEl}
          onClose={handlePopoverClose}
          anchorOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
          transformOrigin={{
            vertical: 'bottom',
            horizontal: 'left',
          }}
          // disableRestoreFocus
        >
          <div className={classes.tooltip}>
            {Array.isArray(row.conflicts) ? (
              <ListTypeError errors={row.conflicts} />
            ) : (
              <span>{row.error}</span>
            )}
          </div>
        </Popover>
      </div>
    )
  }
  return null
}

const RowError = withStyles(RowErrorStyles, { name: 'RowError' })(RowErrorBase)

const filterRowErrorTypeOnly = (rowErrorColumns, column) =>
  column.type === 'error'
    ? [
        ...rowErrorColumns,
        column.columnName,
      ]
    : [
        ...rowErrorColumns,
      ]

class RowErrorTypeProvider extends PureComponent {
  static propTypes = {
    columnExtensions: PropTypes.array,
  }

  constructor (props) {
    super(props)
    const { columnExtensions } = this.props
    this.RowError = (editorProps) => {
      return (
        <React.Fragment>
          <RowError columnExtensions={columnExtensions} {...editorProps} />
        </React.Fragment>
      )
    }
  }

  render () {
    const { columnExtensions = [] } = this.props
    const columns = columnExtensions.reduce(filterRowErrorTypeOnly, [])

    return (
      <DataTypeProvider
        for={columns}
        formatterComponent={this.RowError}
        {...this.props}
      />
    )
  }
}

export default RowErrorTypeProvider
