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
  const invoicePayersName = currentClaims.map((item) => item.name)
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
      {claimableSchemes.map((schemes, index) => {
        const isCHAS = schemes[0].coPaymentSchemeName.startsWith('CHAS')
        let shouldDisable = selectedClaims.includes(index)
        console.log({ selectedClaims, index, invoicePayersName })
        if (isCHAS && currentClaims.length > 0) {
          shouldDisable = invoicePayersName[index].startsWith('CHAS')
        }

        return (
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
                disabled={shouldDisable}
                onClick={handleSelectClick(index)}
              >
                Add
              </Button>
            </GridItem>
          </React.Fragment>
        )
      })}
    </GridContainer>
  )
}

export default withStyles(styles)(ApplicableClaims)
