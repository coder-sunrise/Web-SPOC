/* eslint-disable react/no-multi-comp */
import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { FastField } from 'formik'
import { withStyles } from '@material-ui/core'
import { DataTypeProvider } from '@devexpress/dx-react-grid'
import debounce from 'lodash/debounce'
import { TextField, OutlinedTextField, Tooltip } from '@/components'
import { updateGlobalVariable, updateCellValue } from '@/utils/utils'

import {
  onComponentDidMount,
  onComponentChange,
  getCommonRender,
} from './utils'

const styles = (theme) => ({})

class Control extends PureComponent {
  state = {}

  componentDidMount () {
    onComponentDidMount.call(this)
  }

  renderComponent = ({
    type,
    render,
    onClick,
    row,
    link,
    editMode,
    getLinkText,
    ...commonCfg
  }) => {
    return <div />
  }

  render () {
    return getCommonRender.bind(this)()
  }
}

class CustomTypeProvider extends React.Component {
  static propTypes = {
    for: PropTypes.array, // .isRequired,
    columnExtensions: PropTypes.array,
  }

  constructor (props) {
    super(props)
    this.Control = (columns, text) => (editorProps) => {
      return (
        <Control editMode={!text} columnExtensions={columns} {...editorProps} />
      )
    }
    const { columnExtensions } = props
    const cols = columnExtensions.filter(
      (o) =>
        [
          'custom',
        ].indexOf(o.type) >= 0,
    )
    this.state = {
      for: cols,
    }
  }

  render () {
    const { columnExtensions } = this.props

    return (
      <DataTypeProvider
        for={this.state.for.map((o) => o.columnName)}
        formatterComponent={this.Control(columnExtensions, true)}
      />
    )
  }
}

export default CustomTypeProvider
