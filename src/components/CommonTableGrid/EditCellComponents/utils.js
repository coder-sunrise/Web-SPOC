import React, { PureComponent } from 'react'

import { object } from 'prop-types'
import _ from 'lodash'

import {
  updateGlobalVariable,
  updateCellValue,
  difference,
} from '@/utils/utils'

const updateGlobalState = ({ gridId }) => {
  const { global } = window.g_app._store.getState()
  // console.log(Object.values(window.$tempGridRow[gridId]))
  const errorRows = Object.values(window.$tempGridRow[gridId]).filter(
    o => !o.isDeleted && o._errors && o._errors.length,
  )
  if (
    window.$tempGridRow[gridId] &&
    errorRows.length > 0
    // latestRow._errors &&
    // latestRow._errors.length
  ) {
    if (!global.disableSave)
      window.g_app._store.dispatch({
        type: 'global/updateState',
        payload: {
          disableSave: true,
        },
      })
  } else if (
    // (!latestRow._errors || !latestRow._errors.length) &&
    global.disableSave
  ) {
    window.g_app._store.dispatch({
      type: 'global/updateState',
      payload: {
        disableSave: false,
      },
    })
  }
}

function onComponentDidMount() {
  const {
    columnExtensions,
    value,
    row = {},
    column: { name: columnName },
  } = this.props
  // console.log('onComponentDidMount', columnName)
  const cfg =
    columnExtensions.find(
      ({ columnName: currentColumnName }) => currentColumnName === columnName,
    ) || {}
  const { gridId, getRowId } = cfg
  const latestRow = window.$tempGridRow[gridId]
    ? window.$tempGridRow[gridId][getRowId(row)] || row
    : row
  // console.log(latestRow[columnName], value)
  // if (latestRow[columnName] !== value) {
  //   setTimeout(() => {
  //     this.forceUpdate()
  //   }, 500)
  // }
  if (getRowId(latestRow)) {
    const errors = updateCellValue(this.props, null, latestRow[columnName])
    latestRow._errors = errors
    updateGlobalState({
      gridId,
    })
  }

  return {
    row,
    gridId,
    columnName,
  }
}
function onComponentChange(args, config) {
  // if (!config) {
  // }
  const {
    columnExtensions,
    column: { name: columnName },
    onValueChange,
    value,
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
    triggerOnError = true,
    ...restProps
  } = cfg
  if (value === Object.values(args)[0]) return
  let errors = updateCellValue(this.props, null, Object.values(args)[0])

  const latestRow = window.$tempGridRow[gridId]
    ? window.$tempGridRow[gridId][getRowId(row)] || row
    : row
  latestRow._errors = errors
  const errorObj = errors.find(
    o =>
      o.path === cfg.columnName || o.path.indexOf(`${cfg.columnName}[`) === 0,
  )
  const error = errorObj ? errorObj.message : ''
  // this.setState({
  //   row: latestRow,
  // })
  if (!error || triggerOnError) {
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

  // updateGlobalState({
  //   gridId,
  // })
}

function getCommonConfig() {
  const {
    columnExtensions,
    column: { name: columnName },
    row = {},
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
  const latestRow =
    window.$tempGridRow[gridId] && gridId.indexOf('edit') === 0
      ? window.$tempGridRow[gridId][getRowId(row)] || row
      : row || {}
  const errorObj = (latestRow._errors || []).find(
    o =>
      o.path === cfg.columnName || o.path.indexOf(`${cfg.columnName}[`) === 0,
  )
  const disabled = isDisabled(latestRow)
  const error = errorObj ? errorObj.message : ''
  // console.log(columnName, latestRow[columnName], this.props.value)
  const commonCfg = {
    editMode,
    simple: true,
    showErrorIcon: true,
    error,
    value: latestRow[columnName] || this.props.value,
    defaultValue: getInitialValue ? getInitialValue(row) : undefined,
    disabled,
    row: latestRow,
    text: text || !editMode,
    validSchema: _row => {
      if (validationSchema && getRowId(_row)) {
        try {
          validationSchema.validateSync(_row, {
            abortEarly: false,
          })
        } catch (er) {
          latestRow._errors = er.inner || []
        }
      }
    },
    ...restProps,
  }
  // if (editMode && disabled) {
  //   commonCfg.onMouseLeave = this.props.onBlur
  // }
  return commonCfg
}

function getCommonRender(cb) {
  const { value, editMode } = this.props
  const cfg = getCommonConfig.call(this)
  const { render, error, row, isReactComponent } = cfg
  // console.log(row, this.props.row)
  // console.log('getCommonRender', row, this.props.row)
  if (render) {
    if (isReactComponent) {
      const Cmpt = render
      return <Cmpt row={row} columnConfig={cfg} cellProps={this.props} />
    }
    if (!editMode && !error) {
      return <span>{render(row, { ...cfg }, this.props)}</span>
    }
  }
  if (typeof value === 'object' && React.isValidElement(value)) {
    return <span>{value}</span>
  }
  return cb(cfg)
}

export {
  onComponentDidMount,
  onComponentChange,
  getCommonConfig,
  getCommonRender,
  updateGlobalState,
}
