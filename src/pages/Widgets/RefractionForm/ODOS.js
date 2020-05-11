import React, { memo, useState, useEffect } from 'react'
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

const ODOS = ({ row, columnConfig, cellProps, classes }) => {
  const {
    value,
    control,
    validSchema,
    columnName,
    editingEnabled,
    ...restProps
  } = columnConfig
  const { onBlur, onFocus, autoFocus } = cellProps
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
      <GridItem xs={2}>
        <TextField
          {...restProps}
          value={row[`Sphere${columnName}`]}
          maxLength={50}
          inputProps={inputProps}
          onChange={(e) => {
            onValuesChange('Sphere', e.target.value)
          }}
          onBlur={() => {
            debounceBlur(true)
          }}
          onFocus={() => {
            debounceBlur(false)
          }}
          disabled={!editingEnabled}
        />
      </GridItem>
      <GridItem xs={1} className={classes.alignBottom}>
        <React.Fragment>
          <span>/</span>
        </React.Fragment>
      </GridItem>
      <GridItem xs={2}>
        <TextField
          {...restProps}
          value={row[`Cylinder${columnName}`]}
          maxLength={50}
          inputProps={inputProps}
          onChange={(e) => {
            onValuesChange('Cylinder', e.target.value)
          }}
          onBlur={() => {
            debounceBlur(true)
          }}
          onFocus={() => {
            debounceBlur(false)
          }}
          disabled={!editingEnabled}
        />
      </GridItem>
      <GridItem xs={1} className={classes.alignBottom}>
        <React.Fragment>
          <span>x</span>
        </React.Fragment>
      </GridItem>
      <GridItem xs={2}>
        <TextField
          {...restProps}
          value={row[`Axis${columnName}`]}
          maxLength={50}
          inputProps={inputProps}
          onChange={(e) => {
            onValuesChange('Axis', e.target.value)
          }}
          onBlur={() => {
            debounceBlur(true)
          }}
          onFocus={() => {
            debounceBlur(false)
          }}
          disabled={!editingEnabled}
        />
      </GridItem>
      <GridItem xs={4}>
        <React.Fragment>
          <div style={{ whiteSpace: 'nowrap' }}>
            <span className={classes.alignBottom}>(</span>
            <TextField
              style={{
                verticalAlign: 'unset',
              }}
              {...restProps}
              value={row[`Va${columnName}`]}
              maxLength={50}
              inputProps={inputProps}
              onChange={(e) => {
                onValuesChange('Va', e.target.value)
              }}
              onBlur={() => {
                debounceBlur(true)
              }}
              onFocus={() => {
                debounceBlur(false)
              }}
              disabled={!editingEnabled}
            />
            <span className={classes.alignBottom}>)</span>
          </div>
        </React.Fragment>
      </GridItem>
    </GridContainer>
  )
}
export default memo(withStyles(styles, { name: 'ODOS' })(ODOS))
