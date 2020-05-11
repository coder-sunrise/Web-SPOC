import React, { memo, useState, useEffect } from 'react'
import moment from 'moment'
import _ from 'lodash'
import { TextField, withStyles } from '@material-ui/core'

import { GridContainer, GridItem } from '@/components'

const inputProps = { style: { textAlign: 'center' } }

const styles = () => ({
  alignBottom: {
    marginTop: '8px',
    padding: '0px',
    maxWidth: '5px',
  },
})

const NearAddODOS = ({ row, columnConfig, cellProps, classes }) => {
  const {
    value,
    control,
    validSchema,
    columnName,
    editingEnabled,
    ...restProps
  } = columnConfig
  const { onBlur, onFocus, autoFocus, ...props } = cellProps
  const [
    blur,
    setBlur,
  ] = useState(false)
  const debounceBlur = _.debounce(setBlur, 100, {
    leading: false,
    trailing: true,
  })
  useEffect(
    () => {
      if (blur) {
        if (onBlur) onBlur()
      }
    },
    [
      blur,
    ],
  )

  const onValuesChange = (field, val) => {
    const fieldName = field + columnName
    const { commitChanges } = control
    row[fieldName] = val
    validSchema(row)
    commitChanges({
      changed: {
        [row.id]: {
          [fieldName]: row[fieldName],
        },
      },
    })
  }

  return (
    <GridContainer>
      <GridContainer style={{ whiteSpace: 'nowrap' }}>
        <GridItem xs={4}>
          <React.Fragment>
            <span className={classes.alignBottom}>D</span>
            <TextField
              {...restProps}
              value={row[`NearAddD${columnName}`]}
              maxLength={50}
              inputProps={inputProps}
              style={{
                verticalAlign: 'unset',
              }}
              onChange={(e) => {
                onValuesChange('NearAddD', e.target.value)
              }}
              onBlur={() => {
                debounceBlur(true)
              }}
              onFocus={() => {
                debounceBlur(false)
              }}
              disabled={!editingEnabled}
            />
          </React.Fragment>
        </GridItem>
        <GridItem xs={1} />
        <GridItem xs={4}>
          <React.Fragment>
            <span className={classes.alignBottom}>PH</span>
            <TextField
              {...restProps}
              value={row[`NearAddPH${columnName}`]}
              maxLength={50}
              inputProps={inputProps}
              style={{
                verticalAlign: 'unset',
              }}
              onChange={(e) => {
                onValuesChange('NearAddPH', e.target.value)
              }}
              onBlur={() => {
                debounceBlur(true)
              }}
              onFocus={() => {
                debounceBlur(false)
              }}
              disabled={!editingEnabled}
            />
          </React.Fragment>
        </GridItem>
      </GridContainer>
      <GridContainer style={{ whiteSpace: 'nowrap' }}>
        <GridItem xs={4}>
          <React.Fragment>
            <span className={classes.alignBottom}>( N </span>
            <TextField
              style={{
                verticalAlign: 'unset',
              }}
              {...restProps}
              value={row[`NearAddN${columnName}`]}
              maxLength={50}
              inputProps={inputProps}
              onChange={(e) => {
                onValuesChange('NearAddN', e.target.value)
              }}
              onBlur={() => {
                debounceBlur(true)
              }}
              onFocus={() => {
                debounceBlur(false)
              }}
              disabled={!editingEnabled}
            />
          </React.Fragment>
        </GridItem>
        <GridItem
          xs={1}
          style={{ marginTop: '8px', marginLeft: '8px', textAlign: 'center' }}
        >
          <React.Fragment>
            <span>@</span>
          </React.Fragment>
        </GridItem>
        <GridItem xs={4}>
          <React.Fragment>
            <TextField
              style={{
                verticalAlign: 'unset',
              }}
              {...restProps}
              value={row[`NearAddcm${columnName}`]}
              maxLength={50}
              inputProps={inputProps}
              onChange={(e) => {
                onValuesChange('NearAddcm', e.target.value)
              }}
              onBlur={() => {
                debounceBlur(true)
              }}
              onFocus={() => {
                debounceBlur(false)
              }}
              disabled={!editingEnabled}
            />
            <span className={classes.alignBottom}> cm )</span>
          </React.Fragment>
        </GridItem>
      </GridContainer>
    </GridContainer>
  )
}
export default memo(withStyles(styles, { name: 'NearAddODOS' })(NearAddODOS))
