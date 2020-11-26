import React from 'react'
// material ui
import { withStyles } from '@material-ui/core'
// common component
import { Button, GridContainer, GridItem } from '@/components'
import { MEDISAVE_COPAYMENT_SCHEME } from '@/utils/constants'

const styles = (theme) => ({
  row: {
    marginBottom: theme.spacing(1),
    // marginRight: theme.spacing(2),
  },
})

const checkCombination = (claimedMedisaveSchemeTypes, schemeTypeFK) => {
  switch (schemeTypeFK) {
    case 12: // Medisave 500/700 Visit
      return claimedMedisaveSchemeTypes.includes(14)
      || claimedMedisaveSchemeTypes.includes(12) // Only one visit type
    case 14: // Outpatient Scan
      return claimedMedisaveSchemeTypes.includes(12)
    default:
      return false
  }
}

const checkCombinationByPayer = (currentMediSchemeTypes, schemeTypeFK, schemePayerFK) => {
  const payerSchemes = currentMediSchemeTypes.filter(p => p.schemePayerFK === schemePayerFK)
  if(payerSchemes)
    return checkCombination(payerSchemes.map(f => f.id), schemeTypeFK)
  return false
}

const constructSchemeList = (
    list, 
    claims = [], 
    payers = [], 
    ctschemetype = [], 
    ctcopaymentscheme = [], 
    invoiceItems = [],
    medisaveItems = [],
  ) => {

  const {medisaveVaccinations, healthScreenings, outpatientScans } = medisaveItems
  const currentClaims = claims.map(c => {
    return {
      id: c.schemeConfig.id,
      payerFK: c.schemePayerFK,
    }
  })
  const allItemsClaimed = invoiceItems.filter((v) => {
    if(!v._claimedAmount) return false
    return v._claimedAmount >= v.totalAfterGst
  }).length === invoiceItems.length

  const result = list
  .reduce((_result, scheme, index) => {
    // chas
    if (scheme[0].coPaymentSchemeName.includes('CHAS')) {
      const disabled =
        allItemsClaimed || 
        currentClaims.filter((item) => item.id < 6).length > 0

      return [
        ..._result,
        {
          claimableSchemesFK: scheme[0].id,
          claimableSchemesIndex: index,
          nestedIndex: 0,
          disabled,
          schemeName: 'CHAS',
        },
      ]
    }
    // medisave
    const medisavescheme = ctcopaymentscheme.find((p) => p.id === scheme[0].id)
    if (medisavescheme.coPayerType === 'Government') {
      const schemeType = ctschemetype.find((item) => item.name === medisavescheme.schemeTypeName)
      const currentMediSchemeTypes = currentClaims.map(cc => {
        const mScheme = ctcopaymentscheme.find(c1 => cc.id === c1.id && c1.coPayerName === 'MEDISAVE')
        if(!mScheme) return {}
        const mType = ctschemetype.find((item) => item.name === mScheme.schemeTypeName)
        if(mType)
          return {
            id: mType.id,
            schemePayerFK: cc.payerFK,
          }
        return {}
      })
      const isClaimedScheme = currentClaims.filter((item) => scheme[0].id === item.id && scheme[0].schemePayerFK === item.payerFK).length > 0// && scheme[0].schemePayerFK === item.payerFK).length > 0
      const isMedisaveConflict = checkCombinationByPayer(currentMediSchemeTypes, schemeType.id, scheme[0].schemePayerFK)
      const isMedisaveItemFullyClaimed = invoiceItems.filter((v) => {
        const fullyClaimed = v._claimedAmount && v._claimedAmount >= v.totalAfterGst
        /* if(medisavescheme.code === MEDISAVE_COPAYMENT_SCHEME.MEDISAVE500CDMP || medisavescheme.code === MEDISAVE_COPAYMENT_SCHEME.MEDISAVE700CDMP)
          // return v.invoiceItemTypeFK === 1 && 
          return !fullyClaimed && // medisaveMedications.find(m => m.code === v.itemCode)
          (
            medisaveMedications.find(m => m.code === v.itemCode) || 
            medisaveVaccinations.find(m => m.code === v.itemCode) || 
            medisaveServices.find(m => m.code === v.itemCode)
          ) */
        if(medisavescheme.code === MEDISAVE_COPAYMENT_SCHEME.MEDISAVE500VACC)
          return v.invoiceItemTypeFK === 3 && !fullyClaimed && medisaveVaccinations.find(m => m.code === v.itemCode)
        if(medisavescheme.code === MEDISAVE_COPAYMENT_SCHEME.MEDISAVE500HS)
          return v.invoiceItemTypeFK === 4 && !fullyClaimed && healthScreenings.find(m => m.code === v.itemCode)
        if(medisavescheme.code === MEDISAVE_COPAYMENT_SCHEME.MEDISAVEOPSCAN)
          return v.invoiceItemTypeFK === 4 && !fullyClaimed && outpatientScans.find(m => m.code === v.itemCode)
        return !fullyClaimed
      }).length === 0
      const disabled = allItemsClaimed || isClaimedScheme || isMedisaveConflict || isMedisaveItemFullyClaimed

      const newPayer = payers.find(p => p.id === scheme[0].schemePayerFK)
      return [
        ..._result,
        {
          claimableSchemesFK: medisavescheme.id,
          claimableSchemesIndex: index,
          nestedIndex: 0,
          disabled,
          schemeName: scheme[0].coPaymentSchemeName,
          schemePayerFK: scheme[0].schemePayerFK,
          payerName: newPayer ? newPayer.payerName : '',
          schemeTypeFK: schemeType.id,
        },
      ]
    }

    return [
      ..._result,
      ...scheme.map((s, nestedIndex) => ({
        claimableSchemesFK: s.id,
        claimableSchemesIndex: index,
        nestedIndex,
        disabled: currentClaims.includes(s.id) || allItemsClaimed,
        schemeName: s.coPaymentSchemeName,
      })),
    ]
  }, [])

  return result.sort((a,b) => a.claimableSchemesIndex - b.claimableSchemesIndex)
}

const constructLabel = (scheme) => {
  if ([12,13,14].indexOf(scheme.schemeTypeFK) >= 0) {
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

  const hasMedisave = schemePayer.length > 0

  const _handleSelectClick = (scheme) => {
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
              <GridItem md={hasMedisave ? 1 : 2}>
                <span>{index + 1}</span>
              </GridItem>
              <GridItem md={hasMedisave ? 8 : 7}>
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
