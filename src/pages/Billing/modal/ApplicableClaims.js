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

/* const _medisaveSchemesID = [ // by scheme category
  6, // medisave cdmp
  7, // Flexi
  8, // outpatient
  9, // medisave vaccination
] */
const checkCombination = (claimedMedisaveSchemeTypes, schemeTypeFK) => {
  console.log('checkCombination', claimedMedisaveSchemeTypes, schemeTypeFK)
  switch (schemeTypeFK) {
    case 12: // Medisave 500/700 Visit
      return claimedMedisaveSchemeTypes.includes(14)// Outpatient Scan
    case 14: // Outpatient Scan
      return claimedMedisaveSchemeTypes.includes(12)// Medisave 500/700 Visit
    default:
      return false
  }
}

const constructSchemeList = (
    list, 
    currentClaims = [], 
    payers = [], 
    ctschemetype = [], 
    ctcopaymentscheme = [], 
    invoiceItems = [],
    medisaveItems = [],
  ) => {

  const { medisaveMedications, medisaveVaccinations, healthScreenings } = medisaveItems
  console.log('constructSchemeList',list, currentClaims, invoiceItems)// , payers, ctschemetype, ctcopaymentscheme)
  /* const claimedMedisaveID = currentClaims.reduce(
    (claimed, item) =>
      _medisaveSchemesID.includes(item.id)
        ? [
            ...claimed,
            item.id,
          ]
        : [
            ...claimed,
          ],
    [],
  ) */
  
  const allItemsClaimed = invoiceItems.filter((v) => {
    return v._claimedAmount && v._claimedAmount < v.totalAfterGst
  }).length === 0

  const result = list
  /* .sort((a,b) => {
    if(a[0].schemeCategoryFK === 5) a[0].schemeCategoryFK = 99
    if(b[0].schemeCategoryFK === 5) b[0].schemeCategoryFK = 99
    return a[0].schemeCategoryFK - b[0].schemeCategoryFK
  }) */
  .reduce((_result, scheme, index) => {
    console.log('constructSchemeList',scheme)
    // chas
    if (scheme[0].coPaymentSchemeName.includes('CHAS')) {
      const disabled =
        // currentClaims.length > 0 || 
        currentClaims.filter((item) => item < 6).length > 0 || 
        allItemsClaimed

      return [
        ..._result,
        {
          claimableSchemesFK: scheme[0].id,
          claimableSchemesIndex: index,
          nestedIndex: 0,
          disabled,
          schemeName: 'CHAS',
        },
        // ...scheme.map((s, nestedIndex) => ({
        // })),
      ]
    }
    // medisave
    const medisavescheme = ctcopaymentscheme.find((p) => p.id === scheme[0].id)
    console.log('medisavescheme',medisavescheme)
    if (medisavescheme.schemeTypeName !== 'Corporate') {
      const schemeType = ctschemetype.find((item) => item.name === medisavescheme.schemeTypeName)
      const currentCopaymentSchemes = ctcopaymentscheme.filter(c1 => currentClaims.indexOf(c1.id) >= 0)
      console.log('currentCopaymentSchemes', currentCopaymentSchemes)
      const currentMediSchemes = currentCopaymentSchemes.filter(c2 => c2.coPayerName === 'MEDISAVE').map(c3 => c3.schemeTypeName)
      const currentMediSchemeTypes = ctschemetype.filter((item) => currentMediSchemes.indexOf(item.name) >= 0).map(c4 => c4.id)
      console.log('currentMediSchemeTypes', currentMediSchemeTypes)

      // const isMedisaveVisit = medisavescheme.schemeTypeName === 'Medisave 500/700 Visit' // medisaveSchemes.filter(ms => ms.name.includes('Visit') && ms.id === medisavescheme.id)// medisavescheme.name === 'Medisave 500/700 Visit'
      // console.log('currentVisitTypes', currentVisitTypes)
      const isClaimed = currentClaims.filter((item) => scheme[0].id === item).length > 0
      const isMedisaveConflict = checkCombination(currentMediSchemeTypes, schemeType.id)
      const isMedisaveClaimed = invoiceItems.filter((v) => {
        const fullyClaimed = v._claimedAmount && v._claimedAmount >= v.totalAfterGst
        if(medisavescheme.code === 'MEDISAVE500CDMP' || medisavescheme.code === 'MEDISAVE700CDMP')
          return v.invoiceItemTypeFK === 1 && !fullyClaimed && medisaveMedications.find(m => m.code === v.itemCode)
        if(medisavescheme.code === 'MEDISAVEVACC')
          return v.invoiceItemTypeFK === 3 && !fullyClaimed && medisaveVaccinations.find(m => m.code === v.itemCode)
        if(medisavescheme.code === 'MEDISAVEHS')
          return v.invoiceItemTypeFK === 4 && !fullyClaimed && healthScreenings.find(m => m.code === v.itemCode)
        
        return !fullyClaimed
      }).length === 0
      console.log('disabled', isClaimed, allItemsClaimed, isMedisaveConflict, isMedisaveClaimed)
      const disabled = isClaimed || allItemsClaimed || isMedisaveConflict || isMedisaveClaimed      
      // (!isMedisaveVisit && currentClaims.includes(scheme[0].id)) || payersList.length === 0 || 
      // (isMedisaveVisit && currentVisitTypes.length > 2)
      // console.log(medisavescheme, disabled)

      return [
        ..._result,
        {
          claimableSchemesFK: medisavescheme.id,
          claimableSchemesIndex: index,
          nestedIndex: 0,
          disabled,
          schemeName: scheme[0].coPaymentSchemeName,
        },
      ]
    }

    // console.log(scheme, payers)
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
  if (scheme.claimableSchemesFK >= 12 && scheme.claimableSchemesFK <= 14) {
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
  // const payers = patient.schemePayer
  console.log('medisaveItems',medisaveItems)
  const schemesList = constructSchemeList(
    claimableSchemes, 
    currentClaims, 
    schemePayer, 
    ctschemetype, 
    ctcopaymentscheme, 
    invoiceItems,
    medisaveItems,
  )

  console.log('constructSchemeList',schemesList)

  const _handleSelectClick = (scheme) => {
    handleSelectClick(
      scheme.claimableSchemesIndex,
      scheme.nestedIndex,
      scheme.claimableSchemesFK,
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
