import React, { memo } from 'react'
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

const ODOS = ({ row, columnName, classes }) => {
  return (
    <GridContainer>
      <GridItem xs={2}>
        <TextField
          value={row[`Sphere${columnName}`]}
          maxLength={50}
          inputProps={inputProps}
          disabled
        />
      </GridItem>
      <GridItem xs={1} className={classes.alignBottom}>
        <React.Fragment>
          <span>/</span>
        </React.Fragment>
      </GridItem>
      <GridItem xs={2}>
        <TextField
          value={row[`Cylinder${columnName}`]}
          maxLength={50}
          inputProps={inputProps}
          disabled
        />
      </GridItem>
      <GridItem xs={1} className={classes.alignBottom}>
        <React.Fragment>
          <span>x</span>
        </React.Fragment>
      </GridItem>
      <GridItem xs={2}>
        <TextField
          value={row[`Axis${columnName}`]}
          maxLength={50}
          inputProps={inputProps}
          disabled
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
              value={row[`Va${columnName}`]}
              maxLength={50}
              inputProps={inputProps}
              disabled
            />
            <span className={classes.alignBottom}>)</span>
          </div>
        </React.Fragment>
      </GridItem>
    </GridContainer>
  )
}
export default memo(withStyles(styles, { name: 'ODOS' })(ODOS))
