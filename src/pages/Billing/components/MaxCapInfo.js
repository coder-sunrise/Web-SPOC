import React, { useState } from 'react'
// material ui
import { Divider, Popover, withStyles } from '@material-ui/core'
import Info from '@material-ui/icons/Info'
// common components
import { GridContainer, GridItem } from '@/components'

const styles = (theme) => ({
  popover: {
    pointerEvents: 'none',
  },
  blueText: {
    color: 'darkblue',
    fontWeight: 500,
  },
  container: {
    padding: theme.spacing(1),
    width: 300,
  },
  noPaddingLeft: {
    paddingLeft: '0px !important',
  },
})

const parseToPercentOrDollar = (type, value) => {
  if (type === 'ExactAmount') return `$${value}`

  return `${value}%`
}

const MaxCapInfo = ({ classes, claimableSchemes = [], copaymentSchemeFK }) => {
  const [
    anchorEl,
    setAnchorEl,
  ] = useState(null)

  const handlePopoverOpen = (event) => setAnchorEl(event.currentTarget)

  const handlePopoverClose = () => setAnchorEl(null)

  const open = Boolean(anchorEl)

  const scheme = claimableSchemes.find((item) => item.id === copaymentSchemeFK)

  let patientMinPayable
  let categoriesMaxCap = []

  if (scheme) {
    const {
      patientMinCoPaymentAmount,
      patientMinCoPaymentAmountType,

      isMedicationCoverageMaxCapCheckRequired,
      isConsumableCoverageMaxCapCheckRequired,
      isPackageCoverageMaxCapCheckRequired,
      isServiceCoverageMaxCapCheckRequired,
      isVaccinationCoverageMaxCapCheckRequired,

      medicationCoverageMaxCap,
      consumableCoverageMaxCap,
      serviceCoverageMaxCap,
      packageCoverageMaxCap,
      vaccinationCoverageMaxCap,
    } = scheme

    if (isMedicationCoverageMaxCapCheckRequired)
      categoriesMaxCap.push({
        type: 'Medication',
        value: medicationCoverageMaxCap,
      })

    if (isConsumableCoverageMaxCapCheckRequired)
      categoriesMaxCap.push({
        type: 'Consumable',
        value: consumableCoverageMaxCap,
      })

    if (isServiceCoverageMaxCapCheckRequired)
      categoriesMaxCap.push({
        type: 'Service',
        value: serviceCoverageMaxCap,
      })

    if (isPackageCoverageMaxCapCheckRequired)
      categoriesMaxCap.push({
        type: 'Package',
        value: packageCoverageMaxCap,
      })

    if (isVaccinationCoverageMaxCapCheckRequired)
      categoriesMaxCap.push({
        type: 'Vaccination',
        value: vaccinationCoverageMaxCap,
      })
    patientMinPayable = parseToPercentOrDollar(
      patientMinCoPaymentAmountType,
      patientMinCoPaymentAmount,
    )
  }

  return (
    <div>
      <Info
        onMouseEnter={handlePopoverOpen}
        onMouseLeave={handlePopoverClose}
      />
      <Popover
        id='max-cap-info'
        disableRestoreFocus
        className={classes.popover}
        open={open}
        anchorEl={anchorEl}
        onClose={handlePopoverClose}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
      >
        <div className={classes.container}>
          <GridContainer>
            <GridItem md={10} className={classes.noPaddingLeft}>
              Patient Min. Payable Amount:
            </GridItem>
            <GridItem md={2}>
              <span className={classes.blueText}>{patientMinPayable}</span>
            </GridItem>
            <GridItem md={12} className={classes.noPaddingLeft}>
              <Divider />
            </GridItem>
          </GridContainer>
          <GridContainer>
            {categoriesMaxCap.map((categoryMaxCap) => (
              <React.Fragment>
                <GridItem md={10} className={classes.noPaddingLeft}>
                  <span>{categoryMaxCap.type} Max. Cap:</span>
                </GridItem>
                <GridItem md={2} className={classes.rightAlign}>
                  <span className={classes.blueText}>
                    ${categoryMaxCap.value}
                  </span>
                </GridItem>
                <GridItem md={12} className={classes.noPaddingLeft}>
                  <Divider />
                </GridItem>
              </React.Fragment>
            ))}
          </GridContainer>
        </div>
      </Popover>
    </div>
  )
}

export default withStyles(styles, { name: 'MaxCapInfo' })(MaxCapInfo)
