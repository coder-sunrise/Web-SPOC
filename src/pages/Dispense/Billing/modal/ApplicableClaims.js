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
  const selectedSchemeIDs = currentClaims.map((item) => item.copaymentSchemeFK)
  const invoicePayersName = currentClaims.map((item) => item.name)

  return (
    <GridContainer>
      {claimableSchemes.map((schemes, index) => {
        const isCHAS = schemes[0].coPaymentSchemeName.startsWith('CHAS')

        let shouldDisable = false
        if (selectedClaims.includes(index)) {
          shouldDisable = true
        } else if (isCHAS && currentClaims.length > 0) {
          shouldDisable =
            invoicePayersName[index] &&
            invoicePayersName[index].startsWith('CHAS')
        } else {
          const { notClaimableWithSchemeIds } = schemes[0]
          shouldDisable = notClaimableWithSchemeIds.reduce(
            (notCompatible, id) =>
              selectedSchemeIDs.includes(id) ? true : notCompatible,
            false,
          )
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
