import { object } from 'prop-types'
import _ from 'lodash'

import {
  updateGlobalVariable,
  updateCellValue,
  difference,
} from '@/utils/utils'

function onComponentDidMount () {
  const { columnExtensions, row, column: { name: columnName } } = this.props
  const cfg =
    columnExtensions.find(
      ({ columnName: currentColumnName }) => currentColumnName === columnName,
    ) || {}
  const { gridId, getRowId } = cfg
  const latestRow = window.$tempGridRow[gridId]
    ? window.$tempGridRow[gridId][getRowId(row)] || row
    : row
  const errors = updateCellValue(this.props, null, latestRow[columnName])

  latestRow._errors = errors
  return {
    row,
    gridId,
    columnName,
  }
}
function onComponentChange (args) {
  const {
    columnExtensions,
    column: { name: columnName },
    value,
    onValueChange,
    row,
  } = this.props
  const cfg =
    columnExtensions.find(
      ({ columnName: currentColumnName }) => currentColumnName === columnName,
    ) || {}
  const {
    type,
    code,
    validationSchema,
    isDisabled = () => false,
    onChange,
    gridId,
    getRowId,
    ...restProps
  } = cfg
  let errors = updateCellValue(this.props, null, Object.values(args)[0])

  const latestRow = window.$tempGridRow[gridId]
    ? window.$tempGridRow[gridId][getRowId(row)] || row
    : row
  latestRow._errors = errors
  const errorObj = errors.find(
    (o) =>
      o.path === cfg.columnName || o.path.indexOf(`${cfg.columnName}[`) === 0,
  )
  const error = errorObj ? errorObj.message : ''
  this.setState({
    row: latestRow,
  })
  if (!error) {
    if (onChange) {
      onChange({
        row: latestRow,
        onValueChange,
        error,
        ...args,
      })

      // incase other row value has been change, re-valid
      errors = updateCellValue(this.props, null, latestRow[cfg.columnName])
      latestRow._errors = errors
    }
  }
}

function getCommonConfig () {
  const {
    columnExtensions,
    column: { name: columnName },
    row,
    text,
    editMode,
  } = this.props

  const cfg =
    columnExtensions.find(
      ({ columnName: currentColumnName }) => currentColumnName === columnName,
    ) || {}
  const {
    validationSchema,
    isDisabled = () => false,
    onChange,
    gridId,
    getRowId,
    getInitialValue,
    ...restProps
  } = cfg
  const latestRow = window.$tempGridRow[gridId]
    ? window.$tempGridRow[gridId][getRowId(row)] || row
    : row
  // console.log(latestRow)
  const errorObj = (latestRow._errors || [])
    .find(
      (o) =>
        o.path === cfg.columnName || o.path.indexOf(`${cfg.columnName}[`) === 0,
    )
  const disabled = isDisabled(latestRow)
  const error = errorObj ? errorObj.message : ''

  const commonCfg = {
    editMode,
    simple: true,
    showErrorIcon: true,
    error,
    value: latestRow[columnName],
    defaultValue: getInitialValue ? getInitialValue(row) : undefined,
    disabled,
    row: latestRow,
    text: text || !editMode,
    ...restProps,
  }
  if (editMode && disabled) {
    commonCfg.onMouseLeave = this.props.onBlur
  }
  return commonCfg
}

module.exports = {
  ...module.exports,
  onComponentDidMount,
  onComponentChange,
  getCommonConfig,
}
