import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'

import {
  DatePicker,
  DateTypeProvider as DateTypeProviderOrg,
} from '@/components'

const DateEditorBase = (columnExtensions) =>
  React.memo(
    (props) => {
      // console.log(props)
      const { column = {}, value, onValueChange } = props
      const { name: columnName } = column
      const cfg = columnExtensions.find(
        ({ columnName: currentColumnName }) => currentColumnName === columnName,
      )
      // console.log(cfg, value, props)
      const { type, ...restProps } = cfg
      return (
        <DatePicker
          noWrapper
          timeFormat={false}
          defaultValue={value}
          onChange={onValueChange}
          {...restProps}
        />
      )
    },
    (prevProps, nextProps) => {
      console.log(prevProps === nextProps, prevProps.value === nextProps.value)
      return prevProps === nextProps || prevProps.value === nextProps.value
    },
  )

class DateTypeProvider extends React.Component {
  static propTypes = {
    columnExtensions: PropTypes.array,
  }

  render () {
    const { columnExtensions } = this.props
    return (
      <DateTypeProviderOrg
        for={columnExtensions
          .filter(
            (o) =>
              [
                'date',
              ].indexOf(o.type) >= 0,
          )
          .map((o) => o.columnName)}
        editorComponent={DateEditorBase(columnExtensions)}
        {...this.props}
      />
    )
  }
}

export default DateTypeProvider
