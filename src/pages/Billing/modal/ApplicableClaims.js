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

const _medisaveSchemesID = [
  12, // medisave 500
  13, // Flexi
  14, // outpatient
]

const checkCombination = (claimedMedisave, medisaveSchemeID) => {
  switch (medisaveSchemeID) {
    case 12:
      return claimedMedisave.includes(14)
    case 14:
      return claimedMedisave.includes(12)
    default:
      return false
  }
}

const constructSchemeList = (list, currentClaims = []) => {
  // const claimedMedisaveID = currentClaims.reduce(
  //   (claimed, item) =>
  //     _medisaveSchemesID.includes(item.id)
  //       ? [
  //           ...claimed,
  //           item.id,
  //         ]
  //       : [
  //           ...claimed,
  //         ],
  //   [],
  // )
  const result = list.reduce((_result, scheme, index) => {
    if (scheme[0].coPaymentSchemeName.includes('CHAS')) {
      const disabled =
        currentClaims.length > 0 || currentClaims.find((item) => item.id < 6)

      return [
        ..._result,
        {
          // claimableSchemesFK: s.id,
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
    // if (_medisaveSchemesID.includes(scheme[0].id)) {
    //   const flattenSchemePayers = scheme.reduce((flatten, s, nestedIndex) => {
    //     return [
    //       ...flatten,
    //       ...s.patientSchemePayer.map((p) => {
    //         const disabled =
    //           !!currentClaims.find((item) => item.schemePayerFK === p.id) ||
    //           checkCombination(claimedMedisaveID, s.id)
    //         return {
    //           schemeName: s.coPaymentSchemeName,
    //           claimableSchemesFK: s.id,
    //           claimableSchemesIndex: index,
    //           nestedIndex,
    //           disabled,
    //           schemePayerFK: p.id,
    //           ...p,
    //         }
    //       }),
    //     ]
    //   }, [])

    //   return [
    //     ..._result,
    //     ...flattenSchemePayers,
    //   ]
    // }
    return [
      ..._result,
      ...scheme.map((s, nestedIndex) => ({
        claimableSchemesFK: s.id,
        claimableSchemesIndex: index,
        nestedIndex,
        disabled: currentClaims.includes(s.id),
        schemeName: s.coPaymentSchemeName,
      })),
    ]
  }, [])
  return result
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
}) => {
  const schemesList = constructSchemeList(claimableSchemes, currentClaims)

  const _handleSelectClick = (scheme) => {
    handleSelectClick(
      scheme.claimableSchemesIndex,
      scheme.nestedIndex,
      scheme.schemePayerFK,
    )
  }
  return (
    <GridContainer>
      {schemesList.map((scheme, index) => {
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
      })}
      {/* claimableSchemes && claimableSchemes.length > 0 ? (
        claimableSchemes.map((schemes, index) => {
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
                  {schemes
                    .map((scheme) => scheme.coPaymentSchemeName)
                    .join(', ')}
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
        })
      ) : (
        <React.Fragment>
          <GridItem style={{ textAlign: 'center' }} md={12}>
            <div>No scheme to apply.</div>
          </GridItem>
        </React.Fragment>
      ) */}
    </GridContainer>
  )
}

export default withStyles(styles)(ApplicableClaims)
