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

const NearAddODOS = ({ row, columnName, classes }) => {
  return (
    <GridContainer>
      <GridContainer style={{ whiteSpace: 'nowrap' }}>
        <GridItem xs={4}>
          <React.Fragment>
            <span className={classes.alignBottom}>D</span>
            <TextField
              value={row[`NearAddD${columnName}`]}
              maxLength={50}
              inputProps={inputProps}
              style={{
                verticalAlign: 'unset',
              }}
              disabled
            />
          </React.Fragment>
        </GridItem>
        <GridItem xs={1} />
        <GridItem xs={4}>
          <React.Fragment>
            <span className={classes.alignBottom}>PH</span>
            <TextField
              value={row[`NearAddPH${columnName}`]}
              maxLength={50}
              inputProps={inputProps}
              style={{
                verticalAlign: 'unset',
              }}
              disabled
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
              value={row[`NearAddN${columnName}`]}
              maxLength={50}
              inputProps={inputProps}
              disabled
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
              value={row[`NearAddcm${columnName}`]}
              maxLength={50}
              inputProps={inputProps}
              disabled
            />
            <span className={classes.alignBottom}> cm )</span>
          </React.Fragment>
        </GridItem>
      </GridContainer>
    </GridContainer>
  )
}
export default memo(withStyles(styles, { name: 'NearAddODOS' })(NearAddODOS))
