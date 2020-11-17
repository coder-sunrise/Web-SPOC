import React, { Fragment, useState, useEffect, useCallback } from 'react'
import _ from 'lodash'
// material ui
import { withStyles } from '@material-ui/core'
import Add from '@material-ui/icons/AddCircle'
import Reset from '@material-ui/icons/Cached'
// common components
import {
  CommonModal,
  Button,
  GridItem,
  notification,
  WarningSnackbar,
} from '@/components'
// common utils
import { roundTo } from '@/utils/utils'
import { INVOICE_PAYER_TYPE, VISIT_TYPE, MEDISAVE_COPAYMENT_SCHEME } from '@/utils/constants'
// import MedisaveSchemes from './MedisaveSchemes'
import { AddPayment } from '@/components/_medisys'
import DeleteConfirmation from '@/pages/Finance/Invoice/components/modal/DeleteConfirmation'
import Scheme from './newScheme'
import ResetButton from './ResetButton'
import CoPayer from '../modal/CoPayer'
import ApplicableClaims from '../modal/ApplicableClaims'
// styles
import styles from './styles'
// utils
import {
  getInvoiceItemsWithClaimAmount,
  getCoverageAmountAndType,
  computeTotalForAllSavedClaim,
  updateOriginalInvoiceItemList,
  flattenInvoicePayersInvoiceItemList,
  validateInvoicePayerItems,
  validateClaimAmount,
  updateInvoicePayerPayableBalance,
  sortItemByID,
} from './applyClaimUtils'

const defaultInvoicePayer = {
  _indexInClaimableSchemes: 0,
  _isAppliedOnce: false,
  _isConfirmed: false,
  _isDeleted: false,
  _isEditing: true,
  _isValid: true,
  isDeleted: false,
  isCancelled: false,
  copaymentSchemeFK: undefined,
  name: '',
  payerDistributedAmt: 0,
  // claimableSchemes: claimableSchemes[0],
  invoicePayerItem: [],
  sequence: 0,
  invoicePayment: [],
  // payerTypeFK: INVOICE_PAYER_TYPE.SCHEME,
}

const ApplyClaims = ({
  dispatch,
  classes,
  values,
  setValues,
  submitCount,
  commitCount = 1,
  handleIsEditing,
  patient,
  ctschemetype,
  ctcopaymentscheme,
  inventoryvaccination,
  inventorymedication,
  ctcopayer,
  ctservice,
  onPrinterClick,
  saveBilling,
  noExtraOptions = false,
  fromBilling = false,
  handleIsExistingOldPayerItem,
  clinicSettings = {},
}) => {
  const {
    invoice,
    invoicePayment,
    invoicePayer: payerList,
    claimableSchemes,
    visitPurposeFK = 1,
  } = values
  
  const [
    showErrorPrompt,
    setShowErrorPrompt,
  ] = useState(false)

  const [
    errorMessage,
    setErrorMessage,
  ] = useState([])

  const [
    showClaimableSchemesSelection,
    setShowClaimableSchemesSelection,
  ] = useState(false)

  const [
    showCoPaymentModal,
    setShowCoPaymentModal,
  ] = useState(false)

  const [
    initialState,
    setInitialState,
  ] = useState([])

  const [
    curEditInvoicePayerBackup,
    setCurEditInvoicePayerBackup,
  ] = useState(undefined)

  const [
    tempInvoicePayer,
    setTempInvoicePayer,
  ] = useState([])

  const [
    updatedInvoiceItems,
    setUpdatedInvoiceItems,
  ] = useState([
    ...invoice.invoiceItems,
  ])

  const medisaveCopayer = ctcopayer.find((row) => row.coPayerTypeFK === 2 && row.code === 'MEDISAVE') || []
  const medisaveSchemes = ctcopaymentscheme.filter((scheme) => 
    scheme.coPayerType === 'Government' && scheme.coPayerName === medisaveCopayer.displayValue
  ).map(mScheme => {
    return {
      id: mScheme.id,
      code: mScheme.code,
    }
  })
  // const medisaveSchemeIDs = medisaveSchemes.map((m) => m.id)

  const medisaveMedications = inventorymedication.filter(im => im.isMedisaveClaimable)
  const medisaveVaccinations = inventoryvaccination.filter(iv => iv.isMedisaveClaimable)
  const medisaveServices = ctservice.filter(iv => iv.isCdmpClaimable)
  const healthScreenings = medisaveServices.filter(cs => cs.isMedisaveHealthScreening)
  const outpatientScans = medisaveServices.filter(cs => cs.isOutpatientScan)

  const currentVisitTypes = tempInvoicePayer
  .filter((p) => p.medisaveVisitType && !p.isCancelled)
  .map((payer) => {
      return payer.medisaveVisitType
  })
  // console.log('currentVisitTypes',currentVisitTypes)

  const hasOtherEditing = tempInvoicePayer.reduce(
    (editing, payer) => payer._isEditing || editing,
    false,
  )
  const shouldDisableAddClaim =
    tempInvoicePayer.filter(
      (invoicePayer) => invoicePayer.payerTypeFK === INVOICE_PAYER_TYPE.SCHEME
                      || invoicePayer.payerTypeFK === INVOICE_PAYER_TYPE.PAYERACCOUNT,
    ).length < invoice.claimableSchemes ||
    hasOtherEditing ||
    visitPurposeFK === VISIT_TYPE.RETAIL

  const incrementCommitCount = () => {
    dispatch({
      type: 'global/updateState',
      payload: { commitCount: commitCount + 1 },
    })
  }

  const updateTempInvoicePayer = (
    updatedPayer,
    updatedIndex,
    invoicePayerList,
    autoApply = false,
    newInvoicePayers,
  ) => {
    const _list = invoicePayerList || tempInvoicePayer
    console.log('updateTempInvoicePayer1', _list)
    const invoicePayerWithUpdatedPayer = _list.map(
      (payer, index) => (updatedIndex === index ? updatedPayer : payer),
    )
    console.log('invoicePayerWithUpdatedPayer', invoicePayerWithUpdatedPayer)
    const newInvoicePayer = updateInvoicePayerPayableBalance(
      updatedInvoiceItems,
      invoicePayerWithUpdatedPayer,
      updatedIndex,
      autoApply,
    )

    
    const newInvoicePayerFilled = newInvoicePayers ? newInvoicePayer.filter((o) => o.copaymentSchemeFK) : []
    console.log('updateTempInvoicePayer2', newInvoicePayers)
    console.log('updateTempInvoicePayer2', newInvoicePayerFilled)
    let newInvoicePayerList = []
    if(newInvoicePayers)
    {
      let payerIDs = newInvoicePayers.map(o => o._indexInClaimableSchemes)
      console.log('payerIDs', payerIDs)
      newInvoicePayerFilled.forEach(n => { // insert if absent
        if(payerIDs.indexOf(n._indexInClaimableSchemes) >= 0)
          newInvoicePayerList = [
            ...newInvoicePayers,
          ]
        else
          newInvoicePayerList = [
            ...newInvoicePayers,
            ...newInvoicePayerFilled,
          ]
        console.log('updateTempInvoicePayer2-', newInvoicePayerList)
      })
    }

    const returnInvoicePayers = newInvoicePayers ? newInvoicePayerList : newInvoicePayer
    setTempInvoicePayer(returnInvoicePayers)
    incrementCommitCount()
    console.log('updateTempInvoicePayer3', returnInvoicePayers)
    return returnInvoicePayers
  }

  const handleSchemeChange = (
    value,
    index,
    invoicePayerList,
    invoiceItems,
    allSchemes,
    autoApply = false,
    newInvoicePayers,
  ) => {
    const flattenSchemes = allSchemes.reduce(
      (schemes, cs) => [
        ...schemes,
        ...cs.map((item) => ({ ...item })),
      ],
      [],
    )
    console.log('handleSchemeChange', invoicePayerList, index)

    const payer = invoicePayerList
      ? invoicePayerList[index]
      : tempInvoicePayer[index]

    const schemeConfig = flattenSchemes.find((item) => item.id === value && payer.schemePayerFK === item.schemePayerFK)
    console.log('schemeConfig', schemeConfig, value)
  
    console.log('handleSchemeChange-invoiceItems', invoiceItems)
    console.log('handleSchemeChange-updatedInvoiceItems', updatedInvoiceItems)
    
    let midPayer = {
      ...payer,
      schemeConfig,
      name: schemeConfig.coPaymentSchemeName,
      companyFK: schemeConfig.copayerFK,
      copaymentSchemeFK: payer.copaymentSchemeFK || schemeConfig.id,
      isModified: true,
    }

    // check for vaccination
    const tempInvoiceItems = invoiceItems || updatedInvoiceItems
    console.log('handleSchemeChange-tempInvoiceItems', tempInvoiceItems)
    let mediInvoiceItems = null
    const cdmpItems = tempInvoiceItems.filter((v) => {
      return (
        medisaveMedications.find(m => m.code === v.itemCode) || 
        medisaveVaccinations.find(m => m.code === v.itemCode) || 
        medisaveServices.find(m => m.code === v.itemCode)
        )
    })
    const cdmpVaccinations = tempInvoiceItems.filter((v) => {
      return v.invoiceItemTypeFK === 3 && medisaveVaccinations.find(m => m.code === v.itemCode)
    })
    const cdmpScreenings = tempInvoiceItems.filter((v) => {
      return v.invoiceItemTypeFK === 4 && healthScreenings.find(m => m.code === v.itemCode)
    })
    const cdmpScans = tempInvoiceItems.filter((v) => {
      return v.invoiceItemTypeFK === 4 && outpatientScans.find(m => m.code === v.itemCode)
    })
    let newVisitType = null
    const copaymentSchemeCode = ctcopaymentscheme.find(cps => cps.id === midPayer.copaymentSchemeFK).code
    console.log('copaymentSchemeCode',copaymentSchemeCode)
    if(cdmpVaccinations && (copaymentSchemeCode === MEDISAVE_COPAYMENT_SCHEME.MEDISAVE500VACC || copaymentSchemeCode === MEDISAVE_COPAYMENT_SCHEME.MEDISAVE700VACC)) 
    {
      newVisitType = 'Vaccination'
      mediInvoiceItems = cdmpVaccinations
      // first vaccination only? should allow flexibility
      // const [firstItem] = cdmpVaccinations
      // mediInvoiceItems = [firstItem]
    }
    if(cdmpScreenings && (copaymentSchemeCode === MEDISAVE_COPAYMENT_SCHEME.MEDISAVE500HS || copaymentSchemeCode === MEDISAVE_COPAYMENT_SCHEME.MEDISAVE700HS)) 
    {
      newVisitType = 'Health Screening'
      mediInvoiceItems = cdmpScreenings
      
    }
    if(cdmpItems && (copaymentSchemeCode === MEDISAVE_COPAYMENT_SCHEME.MEDISAVE500CDMP || copaymentSchemeCode === MEDISAVE_COPAYMENT_SCHEME.MEDISAVE700CDMP)) 
    { // 2nd condition can be removed
      newVisitType = 'CDMP'
      mediInvoiceItems = cdmpItems
    }
    if(cdmpScans && copaymentSchemeCode === MEDISAVE_COPAYMENT_SCHEME.MEDISAVEOPSCAN)
    {
      console.log('scan-detected','')
      newVisitType = ''
      mediInvoiceItems = cdmpScans
    }
    console.log('handleSchemeChange--', cdmpVaccinations, cdmpScreenings, cdmpScans)


    let payerInvoiceItems = getInvoiceItemsWithClaimAmount(
      { ...schemeConfig, claimType: payer.claimType },
      invoiceItems || updatedInvoiceItems,
      payer.invoicePayerItem,
      payer.id === undefined,
    )
    if(mediInvoiceItems)
    {
      console.log('mediInvoiceItems',mediInvoiceItems)
      payerInvoiceItems = getInvoiceItemsWithClaimAmount(
        { ...schemeConfig, claimType: payer.claimType },
        mediInvoiceItems,
        payer.invoicePayerItem,
        payer.id === undefined,
      )
    }

    console.log('handleSchemeChange-midPayer', midPayer, midPayer.name)
    console.log('handleSchemeChange-payerInvoiceItems', payerInvoiceItems)
    console.log('handleSchemeChange-payer', payer)

    // if(cdmpMedications.length === 0)
    // {
      let updatedPayer = {
        ...midPayer,
        schemeConfig,
        invoicePayerItem: payerInvoiceItems,
        medisaveVisitType: newVisitType || payer.medisaveVisitType,
      }
      console.log('handleSchemeChange-updatedPayer', updatedPayer) // , updatedPayer.copaymentSchemeFK)
      console.log('updatedPayer-isnull', updatedPayer.invoicePayerItem.length === 0)
      if(updatedPayer.invoicePayerItem.length === 0)// !== '' && !newVisitType) // if medivisit but not updated type
      {
        updatedPayer = null
      }
      else
      {
        const totalClaimed = updatedPayer.invoicePayerItem.reduce((oldTotal, newTotal) => {
          return oldTotal + newTotal.claimAmount
        }, 0)
        console.log('totalClaimed',totalClaimed)
        if(totalClaimed === 0) // items claimed total is 0
        {
          console.log('is0')
          updatedPayer = null
        }
      }
    // }
    
    console.log('handleSchemeChange-', updatedPayer === null)
    /* let newInvoicePayer
    updatedPayerList.forEach(element => {
      newInvoicePayer = updateTempInvoicePayer(
        updatedPayer,
        index,
        invoicePayerList || null,
        autoApply,
        newInvoicePayers,
      )
      
    })

    console.log('handleSchemeChange-updatedPayer', updatedPayer)
    */
   let newInvoicePayer = null
   if(updatedPayer)
   {
      console.log('handleSchemeChange-updateTempInvoicePayer', updatedPayer)
      newInvoicePayer = updateTempInvoicePayer(
        updatedPayer,
        index,
        invoicePayerList || null,
        autoApply,
        newInvoicePayers,
      )

   }
    
    return newInvoicePayer || newInvoicePayers
  }

  const getPayerList = (copaymentSchemeFK, newInvoicePayers) => {
    const payersList = (newInvoicePayers || tempInvoicePayer)
    // copayment scheme get scheme type fk, use it to find schemefk in schemepayer
    const scheme = ctcopaymentscheme.find((a) => a.id === copaymentSchemeFK)
    console.log(scheme)
    const schemeType = scheme ? ctschemetype.find((c) => c.name === scheme.schemeTypeName) : []
    
    console.log(scheme.id, schemeType.id)

    // const addedSchemes = payersList.filter((r) => r[0].id !== scheme.id)// .map((b) => {return b.id})
    
    // console.log('getPayerList', addedSchemes)

    console.log('getPayerList', copaymentSchemeFK, payersList, patient.schemePayer)
    return patient.schemePayer.filter((d) => d.schemeFK === schemeType.id)//  && addedSchemes.indexOf(copaymentSchemeFK) < 0)
    .map((p) => {
      return {
        payerName: p.payerName,
        id: p.id,
        balance: p.patientSchemeBalance[0].balance,
      }
    })
  }

  const handleSchemePayerChange = (
    value,
    index,
    invoicePayerList = null,
  ) => {
    const _list = invoicePayerList || tempInvoicePayer
    const payer = _list[index]
    console.log('handleSchemePayerChange',value, payer, claimableSchemes)
    const updatedPayer = {
      ...payer,
      schemePayerFK: value === 0 ? null : value,
      isModified: true,
    }

    updateTempInvoicePayer(
      updatedPayer,
      index,
      invoicePayerList || null,
    )
  }

  const handleMedisaveVaccinationChange = (
    value,
    index,
    invoicePayerList = null,
  ) => {
    console.log('handleMedisaveVaccinationChange',value, index, invoicePayerList)
    const _list = invoicePayerList || tempInvoicePayer
    const payer = _list[index]
    const updatedPayer = {
      ...payer,
      medisaveVaccinationFK: value,
      isModified: true,
    }

    updateTempInvoicePayer(
      updatedPayer,
      index,
      invoicePayerList || null,
    )
  }

  const handleMediVisitTypeChange = (
    value,
    index,
    invoicePayerList = null,
  ) => {
    // console.log('handleSchemePayerChange',value, index, invoicePayerList)
    const _list = invoicePayerList || tempInvoicePayer
    const payer = _list[index]
    const updatedPayer = {
      ...payer,
      medisaveVisitType: value,
      isModified: true,
    }

    updateTempInvoicePayer(
      updatedPayer,
      index,
      invoicePayerList || null,
    )
  }

  const toggleCopayerModal = () => setShowCoPaymentModal(!showCoPaymentModal)

  const toggleErrorPrompt = () => {
    if (showErrorPrompt) setErrorMessage([])
    setShowErrorPrompt(!showErrorPrompt)
  }

  const setMedisaveVisitType = (coPaymentSchemeFK) => {
    const scheme = medisaveSchemes.find((o) => o.id === coPaymentSchemeFK)
    console.log('setMedisaveVisitType',medisaveSchemes, scheme)
    if(!scheme) return ''
    if(scheme.code === MEDISAVE_COPAYMENT_SCHEME.MEDISAVE500HS) return 'Health Screening'
    if(scheme.code === MEDISAVE_COPAYMENT_SCHEME.MEDISAVE500VACC) return 'Vaccination'
    if(scheme.code === MEDISAVE_COPAYMENT_SCHEME.MEDISAVE500CDMP || 
      scheme.code === MEDISAVE_COPAYMENT_SCHEME.MEDISAVE700CDMP) return 'CDMP'

    return null
  }

  const getPayerType = (scheme) => {
    const isCorporate = scheme.schemeCategoryFK === 5
    if (isCorporate) return INVOICE_PAYER_TYPE.COMPANY
    return medisaveSchemes.find(m => m.id === scheme.id) ? INVOICE_PAYER_TYPE.PAYERACCOUNT : INVOICE_PAYER_TYPE.SCHEME        
  }

  const handleSelectClaimClick = (
    claimableSchemesIndex,
    nestedIndex,
    claimableSchemesFK,
    schemePayer,
  ) => {
    // console.log('handleSelectClaimClick',claimableSchemesIndex, nestedIndex, claimableSchemesFK)
    const schemePayers = getPayerList(claimableSchemesFK, claimableSchemes)
    const remainSchemePayers = schemePayers.filter(sp => tempInvoicePayer.some(t => t.schemePayerFK && t.schemePayerFK !== sp.id && !t.isCancelled)) // aleady claimed
    console.log('handleSelectClaimClick', tempInvoicePayer.filter(t => t.schemePayerFK && !t.isCancelled), remainSchemePayers)
    const scheme = ctcopaymentscheme.find(c => c.id === claimableSchemesFK)
    const invoicePayer = {
      ...defaultInvoicePayer,
      _indexInClaimableSchemes: claimableSchemesIndex,
      claimableSchemes: claimableSchemes[claimableSchemesIndex],
      payerTypeFK: getPayerType(scheme),
      schemePayerFK: schemePayer,// remainSchemePayers.length > 0 ? remainSchemePayers[0].id : null,
      // payerName: schemePayers.length > 0 ? schemePayers[0].payerName : '',
      medisaveVisitType: setMedisaveVisitType(claimableSchemesFK), // medisaveVisit && sortedClaimables[0][0].id === medisaveVisit.id ? 'CDMP' : '',
    }

    console.log('handleSelectClaimClick-invoicePayer', invoicePayer)
    setCurEditInvoicePayerBackup(invoicePayer)
    setShowClaimableSchemesSelection(false)
    const newTempInvoicePayer = [
      ...tempInvoicePayer,
      invoicePayer,
    ]
    if (
      claimableSchemes[claimableSchemesIndex].length === 1 ||
      nestedIndex !== undefined
    ) {
      return handleSchemeChange(
        invoicePayer.claimableSchemes[nestedIndex].id,
        newTempInvoicePayer.length - 1,
        newTempInvoicePayer,
        undefined,
        claimableSchemes,
      )
    }
    return setTempInvoicePayer(newTempInvoicePayer)
  }

  const checkExistingOldPayerItem = () => {
    const { invoiceItems = [] } = invoice

    let existingOldPayerItem = false
    tempInvoicePayer.filter((tip) => !tip.isCancelled).forEach((ip) => {
      const { invoicePayerItem = [] } = ip
      if (
        invoicePayerItem.find(
          (ipi) => !invoiceItems.find((ii) => ii.id === ipi.invoiceItemFK),
        )
      ) {
        existingOldPayerItem = true
      }
    })
    return existingOldPayerItem
  }

  const updateInvoiceItems = async (newInvoiceItemsCopy) => {
    await setUpdatedInvoiceItems(newInvoiceItemsCopy)

  }

  const updateValues = (newInvoicePayers) => {
    console.log('updateValues',newInvoicePayers)
    const temp = newInvoicePayers || tempInvoicePayer
    const finalClaim = roundTo(
      temp.reduce(computeTotalForAllSavedClaim, 0),
    )
    let finalPayable = roundTo(invoice.totalAftGst - finalClaim)
    const totalPaid = invoicePayment.reduce((totalAmtPaid, payment) => {
      if (!payment.isCancelled) return totalAmtPaid + payment.totalAmtPaid
      return totalAmtPaid
    }, 0)
    const newOutstandingBalance = roundTo(finalPayable - totalPaid)
    const newInvoiceItemsCopy = updateOriginalInvoiceItemList(
      invoice.invoiceItems,
      temp,
    )
    console.log('newInvoiceItemsCopy',newInvoiceItemsCopy)
    // setUpdatedInvoiceItems(newInvoiceItemsCopy)
    updateInvoiceItems(newInvoiceItemsCopy)
    console.log('newInvoiceItems',updatedInvoiceItems)

    const _values = {
      ...values,
      finalClaim,
      finalPayable,
      invoice: {
        ...values.invoice,
        outstandingBalance: newOutstandingBalance,
      },
      invoicePayer: temp,
    }

    handleIsEditing(hasOtherEditing)

    if (handleIsExistingOldPayerItem)
      handleIsExistingOldPayerItem(checkExistingOldPayerItem())

    setValues(_values)
    // return newInvoiceItemsCopy
  }

  const getInvoiceItemsForClaim = (newInvoicePayers) => {
    console.log('updateValues',newInvoicePayers)
    const temp = newInvoicePayers || tempInvoicePayer
    const finalClaim = roundTo(
      temp.reduce(computeTotalForAllSavedClaim, 0),
    )
    let finalPayable = roundTo(invoice.totalAftGst - finalClaim)
    const totalPaid = invoicePayment.reduce((totalAmtPaid, payment) => {
      if (!payment.isCancelled) return totalAmtPaid + payment.totalAmtPaid
      return totalAmtPaid
    }, 0)
    const newOutstandingBalance = roundTo(finalPayable - totalPaid)
    const newInvoiceItemsCopy = updateOriginalInvoiceItemList(
      invoice.invoiceItems,
      temp,
    )

    return newInvoiceItemsCopy
  }

  const processAvailableClaims = (newInvoicePayer, _invoicePayers) => {
    let newInvoicePayers = null
    if(_invoicePayers.length > 0)
    {
      // const schemePayers = getPayerList(remainClaimables[0][0].id, claimableSchemes)

      _invoicePayers.forEach((invoicePayer, index) => {
        // console.log('processAvailableClaims',newInvoicePayers)
        updateValues(newInvoicePayers)
        // console.log('processAvailableClaimsAft',newInvoicePayers)  

        const newItems = getInvoiceItemsForClaim(newInvoicePayers)
        const medisaveVisits = newInvoicePayers ? newInvoicePayers.filter(n => {
            return invoicePayer.claimableSchemes[0].schemeCategoryFK === 8 && setMedisaveVisitType(n.copaymentSchemeFK) !== ''
        }) : []
        // console.log('processAvailableClaims-newItems',newItems) 

        // if outpatient and detect medisave visit, skip
        if(medisaveVisits.length > 0) return true
        if(newItems && newItems.filter(item => {
          return item._claimedAmount >= item.totalAfterGst
        }).length >= newItems.length)
          return true
        console.log('processAvailableClaims-medisaveVisits',medisaveVisits) 
        // console.log('processAvailableClaims-fullyClaimedAllItems',fullyClaimedAllItems) 

        console.log('_invoicePayer1', invoicePayer)
        console.log('updatedInvoiceItems1', updatedInvoiceItems)
        setCurEditInvoicePayerBackup(invoicePayer)
        setInitialState([
          invoicePayer,
        ])
        newInvoicePayers = handleSchemeChange(
          invoicePayer.claimableSchemes[0].id,
          0,
          [
            invoicePayer,
          ],
          newItems, // invoice.invoiceItems,
          claimableSchemes,
          true,
          newInvoicePayers,
        )
        return false

      }) 
    }
    console.log('final',updatedInvoiceItems)
    return newInvoicePayers
  }

  const constructAvailableClaims = (claimableSchemesList) => { 
    console.log('constructAvailableClaims',claimableSchemesList) 
    let invoicePayerList = []
    const is700Visit = claimableSchemesList.some(c => c[0].coPaymentSchemeCode === MEDISAVE_COPAYMENT_SCHEME.MEDISAVE700CDMP)
    const cdmp500scheme = medisaveSchemes.find(m => m.code === MEDISAVE_COPAYMENT_SCHEME.MEDISAVE500CDMP)
    const cdmp700scheme = medisaveSchemes.find(m => m.code === MEDISAVE_COPAYMENT_SCHEME.MEDISAVE700CDMP)
    const vaccinationScheme = medisaveSchemes.find(m => m.code === MEDISAVE_COPAYMENT_SCHEME.MEDISAVE500VACC)
    const screeningScheme = medisaveSchemes.find(m => m.code === MEDISAVE_COPAYMENT_SCHEME.MEDISAVE500HS)
    // console.log('is700Visit', is700Visit, cdmp500scheme, cdmp700scheme, vaccinationScheme, screeningScheme)

    let schemeIndex = 0
    claimableSchemesList.forEach((s, index) => {

      const schemePayers = getPayerList(s[0].id, claimableSchemesList)
      const isPayerAccount = medisaveSchemes.find(m => m.id === s[0].id)
      const invoicePayer = {
        ...defaultInvoicePayer,
        claimableSchemes: [s[0]],
        payerTypeFK: getPayerType(s[0]),
        schemePayerFK: s[0].schemePayerFK,// schemePayers.length > 0 ? schemePayers[0].id : null, // if first payer means new ones put later?
        // payerName: schemePayers.length > 0 ? schemePayers[0].payerName : '',
        medisaveVisitType: setMedisaveVisitType(s[0].id), // medisaveVisit && sortedClaimables[0][0].id === medisaveVisit.id ? 'CDMP' : '',
      }

      console.log('constructAvailableClaims-invoicePayer',invoicePayer)
      console.log('schemePayers',schemePayers)
      /* if(schemePayers.length > 0)
      {
        schemePayers.forEach((sp, idx) => {

        })
      } */
      
      if(invoicePayer.medisaveVisitType === 'Vaccination')
      {
        invoicePayerList.push({
          ...invoicePayer,
          medisaveVisitType: 'Vaccination',
          _indexInClaimableSchemes: index,
          copaymentSchemeFK: vaccinationScheme.id,
          // schemePayerFK: schemePayers[idx].id,
        })
      }        
      else if(invoicePayer.medisaveVisitType === 'Health Screening')
      {
        invoicePayerList.push({
          ...invoicePayer,
          medisaveVisitType: 'Health Screening',
          _indexInClaimableSchemes: index,
          copaymentSchemeFK: screeningScheme.id,
          // schemePayerFK: schemePayers[idx].id,
        })
      }
      else if(invoicePayer.medisaveVisitType === 'CDMP')
      {
        invoicePayerList.push({
          ...invoicePayer,
          medisaveVisitType: 'CDMP',
          _indexInClaimableSchemes: index,
          copaymentSchemeFK: is700Visit ? cdmp700scheme.id : cdmp500scheme.id,
          // schemePayerFK: schemePayers[idx].id,
        })
      }
      else {
        invoicePayerList.push({
          ...invoicePayer,
          _indexInClaimableSchemes: index,
          // schemePayerFK: schemePayers[idx].id,
        })
      }

      schemeIndex += 1
    })
    console.log('invoicePayerList',invoicePayerList)

    return invoicePayerList
  }

  const syncWithQueried = () => {
    const hasAddedPayer = payerList.length > 0
    if (hasAddedPayer) {
      console.log('hasAddedPayer-payerList',payerList)
      const mapResponseToInvoicePayers = (_payer) => {
        if (_payer.payerTypeFK !== INVOICE_PAYER_TYPE.COMPANY) {
          const _claimableSchemesIndex = claimableSchemes.findIndex(
            (cs) =>
              cs.find((_cs) => _cs.id === _payer.copaymentSchemeFK) !==
              undefined,
          )

          if (claimableSchemes[_claimableSchemesIndex]) {
            const schemeConfig = claimableSchemes[_claimableSchemesIndex].find(
              (cs) => cs.id === _payer.copaymentSchemeFK,
            )
            
            console.log('hasAddedPayer-_payer',_payer)
            return {
              ..._payer,
              invoicePayerItem: _payer.invoicePayerItem
                .map((item) => {
                  const { coverage } = getCoverageAmountAndType(
                    schemeConfig,
                    item,
                  )
                  // const invoiceItemTypeFK = item.invoiceItemTypeFK
                  return { ...item, coverage }
                })
                .sort(sortItemByID),
              schemeConfig,
              _indexInClaimableSchemes: _claimableSchemesIndex,

              _isConfirmed: true,
              _isDeleted: false,
              _isEditing: false,
              _isValid: true,
              claimableSchemes: claimableSchemes[_claimableSchemesIndex],
            }
          }
        }

        console.log('hasAddedPayer',_payer)
        return {
          ..._payer,
          invoicePayerItem: _payer.invoicePayerItem.map((item) => {
            const { coverage } = getCoverageAmountAndType(null, item)
            return { ...item, coverage }
          }),
          _isConfirmed: true,
          _isDeleted: false,
          _isEditing: false,
          _isValid: true,
        }
      }
      const newInvoicePayer = payerList.map(mapResponseToInvoicePayers)
      setTempInvoicePayer(newInvoicePayer)
      setInitialState(newInvoicePayer)
    } else if (
      !invoice.isBillingSaved &&
      claimableSchemes.length > 0 &&
      invoicePayment.length === 0
    ) {
      console.log('syncWithQueried',claimableSchemes)

      if(claimableSchemes.length > 0)
      {
        const invoicePayerList = constructAvailableClaims(claimableSchemes.filter(c => !c[0].schemePayerFK))
        const newInvoicePayers = processAvailableClaims([], invoicePayerList)
        console.log('newInvoicePayers',newInvoicePayers)
      }    
    } else {
      setInitialState([])
      setTempInvoicePayer([])
      setCurEditInvoicePayerBackup(undefined)
      // refTempInvociePayer.current = []
    }
  }

  const resetClaims = useCallback(
    async () => {
      const response = await dispatch({
        type: 'billing/query',
        payload: { id: values.visitId },
      })

      // abort early if failed to reset bill
      if (!response) return

      const _newTempInvoicePayer = tempInvoicePayer.map((i) => ({
        ...i,
        _isDeleted: true,
        isCancelled: true,
        isModified: true,
        _isConfirmed: true,
        _isEditing: false,
      }))
      const { claimableSchemes: refreshedClaimableSchemes } = response      
      console.log('refreshedClaimableSchemes',refreshedClaimableSchemes)
      if (refreshedClaimableSchemes.length > 0)
      {
        const invoicePayerList = constructAvailableClaims(refreshedClaimableSchemes)
        const newInvoicePayers = processAvailableClaims([], invoicePayerList)
        console.log('newInvoicePayers',newInvoicePayers)

      } else {
        setCurEditInvoicePayerBackup(undefined)
        // setInitialState([])
        setTempInvoicePayer(_newTempInvoicePayer)
      }
    },
    [
      tempInvoicePayer,
      claimableSchemes,
      invoice.invoiceItems,
    ],
  )

  const restoreClaims = useCallback(
    () => {
      setTempInvoicePayer(initialState)
      setCurEditInvoicePayerBackup(undefined)
    },
    [
      initialState,
    ],
  )

  const handleRestoreClick = () => {
    dispatch({
      type: 'global/updateState',
      payload: {
        openConfirm: true,
        openConfirmContent:
          'Restore will restore back to last saved state. Continue?',
        openConfirmText: 'Continue',
        onConfirmSave: restoreClaims,
      },
    })
  }

  const handleResetClick = () => {
    dispatch({
      type: 'global/updateState',
      payload: {
        openConfirm: true,
        openConfirmContent:
          'Reset will revert all changes that had not been saved. Continue?',
        openConfirmText: 'Continue',
        onConfirmSave: resetClaims,
      },
    })
  }

  const handleCancelClick = useCallback(
    (index) => {
      // const isEditing = tempInvoicePayer[index].id === undefined
      const { _isAppliedOnce } = tempInvoicePayer[index]
      const isEditing = !_isAppliedOnce
      const updatedPayer = {
        ...tempInvoicePayer[index],
        ...curEditInvoicePayerBackup,
        _isConfirmed: !isEditing,
        _isEditing: isEditing,
        _isDeleted: false,
        isCancelled: false,
      }
      setCurEditInvoicePayerBackup(updatedPayer)
      updateTempInvoicePayer(updatedPayer, index)
    },
    [
      tempInvoicePayer,
    ],
  )

  const handleEditClick = useCallback(
    (index) => {
      const updatedPayer = {
        ...tempInvoicePayer[index],
        _isConfirmed: false,
        _isAppliedOnce: true,
        _isEditing: true,
        _isDeleted: false,
      }
      console.log('handleEditClick', updatedPayer, index)
      setCurEditInvoicePayerBackup(updatedPayer)
      updateTempInvoicePayer(updatedPayer, index)
    },
    [
      tempInvoicePayer,
    ],
  )
  const handleApplyClick = useCallback(
    (index) => {
      const invoiceItems = validateInvoicePayerItems(
        tempInvoicePayer[index].invoicePayerItem,
      )
      const hasInvalidRow = invoiceItems.reduce(
        (hasError, item) => (item.error ? true : hasError),
        false,
      )
      const updatedPayer = {
        ...tempInvoicePayer[index],
        payerDistributedAmt: roundTo(
          invoiceItems.reduce(
            (subtotal, item) => subtotal + item.claimAmount,
            0,
          ),
        ),
        payerOutstanding:
          roundTo(
            invoiceItems.reduce(
              (subtotal, item) => subtotal + item.claimAmount,
              0,
            ),
          ) -
          _.sumBy(
            (tempInvoicePayer[index].invoicePayment || [])
              .filter((p) => !p.isCancelled),
            'totalAmtPaid',
          ),
        isModified: true,
        invoicePayerItem: invoiceItems,
        _isConfirmed: !hasInvalidRow,
        _isEditing: hasInvalidRow,
        _isDeleted: false,
      }

      if (hasInvalidRow) {
        updateTempInvoicePayer(updatedPayer, index)
        incrementCommitCount()
        // setCommitCount(commitCount + 1)
        return false
      }
      const invalidMessages = validateClaimAmount(updatedPayer)

      if (invalidMessages.length <= 0) {
        setCurEditInvoicePayerBackup(undefined)
        updateTempInvoicePayer(updatedPayer, index)
      } else {
        setErrorMessage(invalidMessages)
        toggleErrorPrompt()
      }
      return true
    },
    [
      tempInvoicePayer,
    ],
  )

  const handleDeleteClick = useCallback(
    (index) => {
      const updatedPayer = {
        ...tempInvoicePayer[index],
        isModified: true,
        _isConfirmed: true,
        _isEditing: false,
        _isDeleted: true,
        isCancelled: true,
      }
      updateTempInvoicePayer(updatedPayer, index)
    },
    [
      tempInvoicePayer,
    ],
  )

  const handleCommitChanges = useCallback(
    ({ rows, changed }) => {
      const _id = Object.keys(changed)[0]
      let id = _id.includes('sys-gen') ? _id : parseInt(_id, 10)

      if (id === -99) return
      const index = tempInvoicePayer.findIndex((item) => item._isEditing)
      const payer = { ...tempInvoicePayer[index] }

      const changedItem = rows.find((i) => i.id === id)
      const originalItem = updatedInvoiceItems.find(
        (i) => i.id === changedItem.invoiceItemFK,
      )

      let eligibleAmount =
        originalItem.totalAfterGst - originalItem._claimedAmount
      if (eligibleAmount === 0) {
        const currentEditItemClaimedAmount = tempInvoicePayer
          .filter((_rest, i) => i !== index)
          .reduce(flattenInvoicePayersInvoiceItemList, [])
          .reduce((remainingClaimable, item) => {
            if (item.invoiceItemFK === changedItem.invoiceItemFK)
              return remainingClaimable + item.claimAmount

            return remainingClaimable
          }, 0)

        eligibleAmount =
          originalItem.totalAfterGst - currentEditItemClaimedAmount
      }

      let hasError = false
      const mapAndCompareCurrentChangesAmount = (item) => {
        if (item.id === id) {
          const currentChangesClaimAmount = changed[id].claimAmount
          if (currentChangesClaimAmount <= eligibleAmount) {
            return { ...item, error: undefined }
          }

          hasError = true
          return {
            ...item,
            error: `Cannot claim more than $${eligibleAmount.toFixed(2)}`,
          }
        }

        return { ...item, error: undefined }
      }
      const newRows = rows.map(mapAndCompareCurrentChangesAmount)
      const newInvoicePayer = {
        ...payer,
        invoicePayerItem: newRows,
        _hasError:
          rows.reduce(
            (error, row) => (row._errors && row._errors.length > 0) || error,
            false,
          ) || hasError,
        // _hasError: hasError,
      }
      updateTempInvoicePayer(newInvoicePayer, index)
      incrementCommitCount()
    },
    [
      tempInvoicePayer,
      updatedInvoiceItems,
    ],
  )

  const handleAddCoPayer = (invoicePayer) => {
    toggleCopayerModal()
    const newTempInvoicePayer = [
      ...tempInvoicePayer,
      invoicePayer,
    ]
    setTempInvoicePayer(newTempInvoicePayer)
  }


  const handleAddClaimClick = () => {
    setShowClaimableSchemesSelection(true)
  }

  const handleClaimTypeChange = (value, index) => {
    const claimType = value.toLowerCase()
    const updatedPayer = {
      ...tempInvoicePayer[index],
      claimType,
      invoicePayerItem: tempInvoicePayer[
        index
      ].invoicePayerItem.filter((item) => {
        if (claimType === 'vaccination' && item.invoiceItemTypeFK !== 3)
          return false
        if (claimType === 'cdmp' && item.invoiceItemTypeFK === 3) return false

        return true
      }),
    }

    updateTempInvoicePayer(updatedPayer, index)
  }

  useEffect(syncWithQueried, [
    values.id,
    submitCount,
  ])
  useEffect(updateValues, [
    tempInvoicePayer,
  ])
  const [
    showAddPaymentModal,
    setShowAddPaymentModal,
  ] = useState(false)

  const [
    selectInvoicePayer,
    setSelectInvoicePayer,
  ] = useState({})

  const [
    onVoid,
    setOnVoid,
  ] = useState({})

  const [
    showDeleteConfirmation,
    setShowDeleteConfirmation,
  ] = useState(false)

  const toggleAddPaymentModal = () => {
    setShowAddPaymentModal(!showAddPaymentModal)
  }

  const toggleDeleteConfirmation = () => {
    setShowDeleteConfirmation(!showDeleteConfirmation)
  }

  const onSubmitAddPayment = async (invoicePaymentList) => {
    toggleAddPaymentModal()
    let invoicePayer = tempInvoicePayer[selectInvoicePayer.index]
    if (invoicePayer.id && invoicePayer.id > 0) {
      invoicePayer.isModified = true
    }
    invoicePayer.invoicePayment = [
      ...(invoicePayer.invoicePayment || []),
      invoicePaymentList,
    ]
    await setTempInvoicePayer([
      ...tempInvoicePayer,
    ])
    saveBilling()
  }

  const onAddPaymentClick = async (index) => {
    let invoicePayer = tempInvoicePayer[index]
    const invoicePayerPayment = {
      ...invoice,
      payerTypeFK: invoicePayer.payerTypeFK,
      totalAftGst: invoicePayer.payerDistributedAmt,
      outstandingBalance: invoicePayer.payerOutstanding,
      finalPayable: invoicePayer.payerOutstanding,
      totalClaims: undefined,
    }

    let selectPayerName = ''
    if (invoicePayer.payerTypeFK === 1)
      selectPayerName = invoicePayer.patientName
    if (invoicePayer.payerTypeFK === 2) selectPayerName = 'Scheme'
    if (invoicePayer.payerTypeFK === 4) selectPayerName = invoicePayer.name
    await setSelectInvoicePayer({
      invoicePayerName: selectPayerName,
      index,
      invoicePayerPayment,
    })
    toggleAddPaymentModal()
  }

  const onSubmitVoid = async (cancelReason) => {
    toggleDeleteConfirmation()
    let invoicePayer = tempInvoicePayer[onVoid.payerIndex]
    invoicePayer.isModified = true
    if (onVoid.type === 'Payment') {
      let payment = invoicePayer.invoicePayment.find((o) => o.id === onVoid.id)
      payment.isCancelled = true
      payment.cancelReason = cancelReason
    }
    await setTempInvoicePayer([
      ...tempInvoicePayer,
    ])
    saveBilling()
  }
  const onPaymentVoidClick = (index, payment) => {
    setOnVoid({ payerIndex: index, ...payment })
    toggleDeleteConfirmation()
  }
  const { isEnableAddPaymentInBilling = false } = clinicSettings
  return (
    <Fragment>
      {isEnableAddPaymentInBilling &&
      checkExistingOldPayerItem() && (
        <GridItem md={12}>
          <div style={{ paddingLeft: 8, paddingBottom: 8 }}>
            <WarningSnackbar
              variant='warning'
              message='Invoice has been updated. Kindly remove if there is any payment(s) made for existing copayer/scheme and re-apply the copayer/scheme again!'
            />
          </div>
        </GridItem>
      )}
      <GridItem md={2}>
        <h5 style={{ paddingLeft: 8 }}>Apply Claims</h5>
      </GridItem>
      <GridItem md={10} container justify='flex-end'>
        <Button
          color='primary'
          size='sm'
          disabled={shouldDisableAddClaim}
          onClick={handleAddClaimClick}
        >
          <Add />
          Claimable Schemes
        </Button>
        <Button
          color='primary'
          size='sm'
          onClick={toggleCopayerModal}
          disabled={hasOtherEditing}
        >
          <Add />
          Co-Payer
        </Button>
        {/* <Button color='danger' size='sm' onClick={handleResetClick}>
          <Reset />
          Reset
        </Button> */}
        {!noExtraOptions && (
          <ResetButton
            disabled={
              visitPurposeFK === VISIT_TYPE.RETAIL ||
              tempInvoicePayer.find((payer) =>
                (payer.invoicePayment || [])
                  .find((payment) => !payment.isCancelled),
              )
            }
            handleResetClick={handleResetClick}
            handleRestoreClick={handleRestoreClick}
          />
        )}
      </GridItem>
      <GridItem md={12} style={{ maxHeight: '60vh', overflowY: 'auto' }}>
        {tempInvoicePayer.map((invoicePayer, index) => {
          if (invoicePayer.isCancelled) return null
          return (
            <Scheme
              key={`invoicePayer-${index}`}
              _key={`invoicePayer-${index}`}
              invoicePayer={invoicePayer}
              index={index}
              onSchemeChange={handleSchemeChange}
              onSchemePayerChange={handleSchemePayerChange}
              onMediVisitTypeChange={handleMediVisitTypeChange}
              onMediVaccinationChange={handleMedisaveVaccinationChange}
              onCommitChanges={handleCommitChanges}
              onCancelClick={handleCancelClick}
              onEditClick={handleEditClick}
              onApplyClick={handleApplyClick}
              onDeleteClick={handleDeleteClick}
              hasOtherEditing={hasOtherEditing}
              patient={patient}
              ctschemetype={ctschemetype}
              ctcopaymentscheme={ctcopaymentscheme}
              onPaymentVoidClick={onPaymentVoidClick}
              onPrinterClick={onPrinterClick}
              onAddPaymentClick={onAddPaymentClick}
              fromBilling={fromBilling}
              invoice={invoice}
              clinicSettings={clinicSettings}
              inventoryvaccination={inventoryvaccination}
              tempInvoicePayer={tempInvoicePayer}
            />
          )
        })}
      </GridItem>
      <CommonModal
        title='Claim Amount Check'
        open={showErrorPrompt}
        onClose={toggleErrorPrompt}
        maxWidth='sm'
      >
        <div className={classes.errorPromptContainer}>
          {errorMessage.map((message) => <p>{message}</p>)}
        </div>
      </CommonModal>
      <CommonModal
        title='Add Copayer'
        open={showCoPaymentModal}
        onClose={toggleCopayerModal}
      >
        <CoPayer
          onAddCoPayerClick={handleAddCoPayer}
          copayers={tempInvoicePayer
            .filter(
              (payer) =>
                !payer.isCancelled &&
                payer.payerTypeFK === INVOICE_PAYER_TYPE.COMPANY,
            )
            .map((i) => i.companyFK)}
          invoiceItems={updatedInvoiceItems.map((invoiceItem) => ({
            ...invoiceItem,
            itemName: invoiceItem.itemDescription,
            schemeCoverage: 100,
            schemeCoverageType: 'Percentage',
            payableBalance:
              invoiceItem.totalAfterGst - (invoiceItem._claimedAmount || 0),
          }))}
        />
      </CommonModal>
      <CommonModal
        open={showClaimableSchemesSelection}
        title='Claimable Schemes'
        onClose={() =>
          setShowClaimableSchemesSelection(!showClaimableSchemesSelection)}
        maxWidth='sm'
      >
        <ApplicableClaims
          currentClaims={tempInvoicePayer
            .filter(
              (invoicePayer) =>
                !invoicePayer.isCancelled &&
                // invoicePayer.payerTypeFK === INVOICE_PAYER_TYPE.SCHEME &&
                !_.isEmpty(invoicePayer.schemeConfig),
            )}
          claimableSchemes={claimableSchemes}
          handleSelectClick={handleSelectClaimClick}
          schemePayer={patient.schemePayer}
          ctschemetype={ctschemetype}
          ctcopaymentscheme={ctcopaymentscheme}
          currentVisitTypes={currentVisitTypes}
          medisaveSchemes={medisaveSchemes}
          invoiceItems={updatedInvoiceItems}
          medisaveItems={{
            medisaveMedications,
            medisaveVaccinations,
            medisaveServices,
            healthScreenings,
            outpatientScans,
          }}
        />
      </CommonModal>
      <CommonModal
        open={showAddPaymentModal}
        title='Add Payment'
        onClose={toggleAddPaymentModal}
        observe='AddPaymentForm'
        maxWidth='lg'
      >
        <AddPayment
          handleSubmit={onSubmitAddPayment}
          onClose={toggleAddPaymentModal}
          invoicePayerName={selectInvoicePayer.invoicePayerName}
          invoicePayment={[]}
          invoice={{
            ...selectInvoicePayer.invoicePayerPayment,
          }}
        />
      </CommonModal>
      <CommonModal
        open={showDeleteConfirmation}
        title={`Void ${onVoid.type}`}
        onConfirm={toggleDeleteConfirmation}
        onClose={toggleDeleteConfirmation}
        maxWidth='sm'
      >
        <DeleteConfirmation handleSubmit={onSubmitVoid} {...onVoid} />
      </CommonModal>
    </Fragment>
  )
}

export default withStyles(styles, { name: 'NewApplyClaims' })(ApplyClaims)
