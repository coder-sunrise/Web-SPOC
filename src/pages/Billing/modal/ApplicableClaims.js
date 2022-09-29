import React from 'react'
// material ui
import { withStyles } from '@material-ui/core'
// common component
import { Button, GridContainer, GridItem } from '@/components'
import { MEDISAVE_COPAYMENT_SCHEME } from '@/utils/constants'
import { getMedisaveVisitClaimableAmount } from '../refactored/applyClaimUtils'

const styles = theme => ({
  row: {
    marginBottom: theme.spacing(1),
    // marginRight: theme.spacing(2),
  },
})

const isMedisave = schemeTypeFK => {
  if (schemeTypeFK) return [12, 13, 14].indexOf(schemeTypeFK) >= 0
  return false
}

const checkSchemeTypeCombination = (
  claimedMedisaveSchemeTypes,
  schemeTypeFK,
) => {
  switch (
    schemeTypeFK // schemes cannot conflict on scheme type
  ) {
    // case 12: // Medisave 500/700 Visit
    //   return claimedMedisaveSchemeTypes.includes(14)
    //   || claimedMedisaveSchemeTypes.includes(12) // Only one visit type
    case 14: // Outpatient Scan
      return claimedMedisaveSchemeTypes.includes(12)
    default:
      return false
  }
}

const checkMedisaveVisitCombination = (codesList, currentScheme) => {
  // for any vacc or hs is applied cdmp is still not disabled
  // for cdmp applied
  console.log('currentMediSchemeCodes', codesList, currentScheme)
  switch (currentScheme) {
    case 'MEDISAVE500HS':
    case 'MEDISAVE500VACC':
      return true // cdmp will be enabled
    case 'MEDISAVE500CDMP':
    case 'MEDISAVE700CDMP':
      return (
        !codesList.includes('MEDISAVE500HS') ||
        !codesList.includes('MEDISAVE500VACC')
      ) // will be enabled, but hidden
    default:
      return false
  }
}

const checkCombinationByPayer = (
  currentMediSchemeTypes,
  schemeTypeFK,
  schemePayerFK,
) => {
  // payers cannot conflict on same scheme type
  const payerSchemes = currentMediSchemeTypes.filter(
    p => p.schemePayerFK === schemePayerFK,
  )
  if (payerSchemes.length > 0)
    return checkSchemeTypeCombination(
      payerSchemes.map(f => f.schemeTypeId),
      schemeTypeFK,
    )
  return false
}

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
  medisaveItems,
}) => {
  const schemesList = constructSchemeList(
    claimableSchemes,
    currentClaims,
    schemePayer,
    ctschemetype,
    ctcopaymentscheme,
    invoiceItems,
    medisaveItems,
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
