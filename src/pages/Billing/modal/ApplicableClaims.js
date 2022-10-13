import React from 'react'
// material ui
import { withStyles } from '@material-ui/core'
// common component
import { Button, GridContainer, GridItem } from '@/components'

const styles = theme => ({
  row: {
    marginBottom: theme.spacing(1),
    // marginRight: theme.spacing(2),
  },
})

const constructSchemeList = (
  list,
  claims = [],
  payers = [],
  ctschemetype = [],
  ctcopaymentscheme = [],
  invoiceItems = [],
) => {
  const currentClaims = claims.map(c => {
    return {
      id: c.schemeConfig.id,
      payerFK: c.schemePayerFK,
    }
  })
  const allItemsClaimed =
    invoiceItems.filter(v => {
      if (!v._claimedAmount) return false
      return v._claimedAmount >= v.totalAfterGst
    }).length === invoiceItems.length

  const result = list.reduce((_result, scheme, index) => {
    return [
      ..._result,
      ...scheme.map((s, nestedIndex) => ({
        claimableSchemesFK: s.id,
        claimableSchemesIndex: index,
        nestedIndex,
        disabled:
          currentClaims.some(item => item.id === s.id) || allItemsClaimed,
        schemeName: s.coPaymentSchemeName,
      })),
    ]
  }, [])

  return result.sort(
    (a, b) => a.claimableSchemesIndex - b.claimableSchemesIndex,
  )
}

const constructLabel = scheme => {
  if ([12, 13, 14].indexOf(scheme.schemeTypeFK) >= 0) {
    return `${scheme.schemeName} - ${scheme.payerName}`
  }
  return scheme.schemeName
}

const ApplicableClaims = ({
  classes,
  currentClaims,
  claimableSchemes,
  handleSelectClick,
  schemePayer,
  ctschemetype,
  ctcopaymentscheme,
  invoiceItems,
}) => {
  const schemesList = constructSchemeList(
    claimableSchemes,
    currentClaims,
    schemePayer,
    ctschemetype,
    ctcopaymentscheme,
    invoiceItems,
  )

  const _handleSelectClick = scheme => {
    handleSelectClick(
      scheme.claimableSchemesIndex,
      scheme.nestedIndex,
      scheme.claimableSchemesFK,
      scheme.schemePayerFK,
    )
  }

  return (
    <GridContainer>
      {schemesList.length > 0 ? (
        schemesList.map((scheme, index) => {
          const nameLabel = constructLabel(scheme)
          const onClick = () => _handleSelectClick(scheme)
          return (
            <React.Fragment>
              <GridItem md={2}>
                <span>{index + 1}</span>
              </GridItem>
              <GridItem md={7}>
                <span>{nameLabel}</span>
              </GridItem>
              <GridItem md={3} className={classes.row}>
                <Button
                  color='primary'
                  size='sm'
                  disabled={scheme.disabled}
                  onClick={onClick}
                >
                  Add
                </Button>
              </GridItem>
            </React.Fragment>
          )
        })
      ) : (
        <GridItem style={{ textAlign: 'center' }} md={12}>
          <h4>No scheme to apply.</h4>
        </GridItem>
      )}
    </GridContainer>
  )
}

export default withStyles(styles)(ApplicableClaims)
