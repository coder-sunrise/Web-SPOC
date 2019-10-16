import React from 'react'
// material ui
import { withStyles } from '@material-ui/core'
// common component
import { Button, GridContainer, GridItem } from '@/components'

const styles = (theme) => ({
  row: {
    marginBottom: theme.spacing(1),
    // marginRight: theme.spacing(2),
  },
})

const ApplicableClaims = ({
  classes,
  currentClaims,
  claimableSchemes,
  handleSelectClick,
}) => {
  const selectedClaims = currentClaims.map(
    (item) => item._indexInClaimableSchemes,
  )
  const selectableList = claimableSchemes.reduce(
    (schemes, item, index) =>
      selectedClaims.includes(index)
        ? [
            ...schemes,
          ]
        : [
            ...schemes,
            item,
          ],
    [],
  )
  return (
    <GridContainer>
      {claimableSchemes.map((schemes, index) => (
        <React.Fragment>
          <GridItem md={2}>
            <span>{index + 1}</span>
          </GridItem>
          <GridItem md={7}>
            <span>
              {schemes.map((scheme) => scheme.coPaymentSchemeName).join(', ')}
            </span>
          </GridItem>
          <GridItem md={3} className={classes.row}>
            <Button
              color='primary'
              size='sm'
              disabled={selectedClaims.includes(index)}
              onClick={handleSelectClick(index)}
            >
              Add
            </Button>
          </GridItem>
        </React.Fragment>
      ))}
    </GridContainer>
  )
}

export default withStyles(styles)(ApplicableClaims)
