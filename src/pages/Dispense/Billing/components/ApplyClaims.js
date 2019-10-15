import React, { useEffect, useState } from 'react'
import * as Yup from 'yup'
// material ui
import { Paper, withStyles } from '@material-ui/core'
import Edit from '@material-ui/icons/Edit'
import Add from '@material-ui/icons/AddCircle'
import Reset from '@material-ui/icons/Cached'
// common components
import {
  Button,
  EditableTableGrid,
  CommonModal,
  GridContainer,
  GridItem,
  Select,
  Field,
  FastField,
  NumberInput,
  SizeContainer,
  TextField,
} from '@/components'
// sub components
import ApplicableClaims from '../modal/ApplicableClaims'
import TableData from '../../DispenseDetails/TableData'
import {
  ItemData,
  ItemTableColumn,
  ItemTableColumnExtensions,
} from '../variables'
// constants
import { INVOICE_PAYER_TYPE } from '@/utils/constants'
import { roundToTwoDecimals } from '@/utils/utils'

// const validationSchema = Yup.object().shape({
//   claimAmount: Yup.number().min(0.1, ''),
// })

const styles = (theme) => ({
  gridRow: {
    margin: theme.spacing.unit,
    paddingBottom: theme.spacing.unit * 2,
    paddingLeft: theme.spacing.unit * 2,
    paddingRight: theme.spacing.unit * 2,

    '& > h5': {
      paddingTop: theme.spacing.unit,
      paddingBottom: theme.spacing.unit,
    },
  },
  gridActionBtn: {
    textAlign: 'right',
    marginTop: theme.spacing(1),
  },
  rightEndBtn: {
    marginRight: 0,
  },
})

const invoiceItemColExtensions = [
  { columnName: 'itemCode', disabled: true },
  // { columnName: 'coverage', type: 'number', disabled: true },
  {
    columnName: 'totalAfterGst',
    type: 'currency',
    currency: true,
    disabled: true,
  },
  {
    columnName: 'claimAmount',
    type: 'currency',
    currency: true,
  },
]

const getInvoiceItemsColumnExtensions = (schemeConfig) => {
  if (!schemeConfig) return invoiceItemColExtensions
  const { overAllCoPaymentValueType = 'Percentage' } = schemeConfig

  return [
    ...invoiceItemColExtensions,
    {
      columnName: 'coverage',
      align: 'right',
      // type:
      //   overAllCoPaymentValueType.toLowerCase() === 'percentage'
      //     ? 'text'
      //     : 'currency',
      disabled: true,
    },
  ]
}

// const getValidationScheme = (claimSchemeCfg) => {
//   if (!claimSchemeCfg) return Yup.object().shape({})

//   const {
//     coverageMaxCap,
//     overAllCoPaymentValue,
//     overAllCoPaymentValueType,
//     isBalanceCheckRequired,
//     isCoverageMaxCapCheckRequired,
//     isMedicationCoverageMaxCapCheckRequired,
//     isPackageCoverageMaxCapCheckRequired,
//     isServiceCoverageMaxCapCheckRequired,
//     isVaccinationCoverageMaxCapCheckRequired,
//   } = claimSchemeCfg

//   let _validationSchema = Yup.object().shape({})

//   if (isCoverageMaxCapCheckRequired) {
//     _validationSchema = Yup.object().shape({
//       claimAmount: Yup.number().max(
//         Yup.ref('totalAfterGst'),
//         'Claim amount cannot exceed Payable Amount',
//       ),
//     })
//   }

//   return Yup.object().shape({
//     claimAmount: Yup.number().when(
//       [
//         'coverage',
//         'totalAfterGst',
//       ],
//       // (coverage, totalAfterGst, schema) => schema.max(4),
//       (coverage, totalAfterGst, schema) => {
//         const isPercentage = coverage.indexOf('%') > 0
//         let _absoluteValue = 0
//         if (isPercentage) {
//           const percentage = parseFloat(coverage.slice(0, -1))
//           _absoluteValue = totalAfterGst * percentage / 100
//         } else _absoluteValue = coverage.slice(1)
//         console.log({
//           coverage,
//           totalAfterGst,
//           _absoluteValue,
//           schema: schema.max(4),
//         })
//         return schema.min(0).max(4)
//       },
//     ),
//   })
// }

const validationSchema = Yup.object().shape({
  claimAmount: Yup.number().when(
    'coverage',
    {
      is: (val) => true,
      then: Yup.number().max(4),
    },
    // [
    //   'coverage',
    //   'totalAfterGst',
    // ],
    // (coverage, totalAfterGst, schema) => schema.max(4),
    // (coverage, totalAfterGst, schema) => {
    //   const isPercentage = coverage.indexOf('%') > 0
    //   let _absoluteValue = 0
    //   if (isPercentage) {
    //     const percentage = parseFloat(coverage.slice(0, -1))
    //     _absoluteValue = totalAfterGst * percentage / 100
    //   } else _absoluteValue = coverage.slice(1)

    //   return Yup.number().max(4)
    // },
  ),
})

const flattenInvoicePayersInvoiceItemList = (
  preInvoicePayerInvoiceItems,
  preInvoicePayer,
) => [
  ...preInvoicePayerInvoiceItems,
  ...preInvoicePayer.invoicePayerItems,
]

const computeInvoiceItemSubtotal = (invoiceItems, item) => {
  const _existed = invoiceItems.find((_i) => _i.id === item.id)
  if (!_existed)
    return [
      ...invoiceItems,
      { ...item, _prevClaimedAmount: item.claimAmount },
    ]
  return [
    ...invoiceItems.filter((_i) => _i.id === item.id),
    {
      ..._existed,
      _prevClaimedAmount: _existed._prevClaimedAmount + item.claimAmount,
    },
  ]
}

const ApplyClaims = ({
  classes,
  values,
  setFieldValue,
  handleAddCopayerClick,
}) => {
  const { invoicePayers, invoice, claimableSchemes } = values
  const [
    showClaimableSchemesSelection,
    setShowClaimableSchemesSelection,
  ] = useState(false)

  const [
    tempInvoicePayer,
    setTempInvoicePayer,
  ] = useState([])

  const [
    tempInvoiceItems,
    setTempInvoiceItems,
  ] = useState([])

  const getInvoiceItems = (
    schemeID,
    oriInvoiceItems,
    curInvoiceItems,
    index,
  ) => {
    if (!schemeID && !oriInvoiceItems) return []
    const _invoiceItems = oriInvoiceItems.reduce((newList, item) => {
      if (item.notClaimableBySchemeIds.includes(schemeID))
        return [
          ...newList,
        ]
      const scheme = tempInvoicePayer[index].claimableSchemes.find(
        (selectedScheme) => selectedScheme.id === schemeID,
      )
      const existed = curInvoiceItems.find((curItem) => curItem.id === item.id)
      let coverage = 0
      if (scheme.coPaymentByItem.length > 0) {
        coverage = 0
      } else if (scheme.coPaymentByCategory.length > 0) {
        const itemCategory = scheme.coPaymentByCategory.find(
          (category) => category.itemTypeFk === item.invoiceItemTypeFk,
        )
        coverage =
          itemCategory.groupValueType.toLowerCase() === 'percentage'
            ? `${itemCategory.itemGroupValue}%`
            : `$${itemCategory.itemGroupValue}`
      } else {
        coverage =
          scheme.overAllCoPaymentValueType.toLowerCase() === 'percentage'
            ? `${scheme.overAllCoPaymentValue}%`
            : `$${scheme.overAllCoPaymentValue}`
      }
      // const totalAfterGst = item._claimedAmount
      //   ? item.totalAfterGst - item._claimedAmount
      //   : item.totalAfterGst
      if (existed)
        return [
          ...newList,
          {
            ...existed,
            coverage,
            // totalAfterGst,
          },
        ]

      return [
        ...newList,
        {
          ...item,
          coverage,
          // totalAfterGst,
        },
      ]
    }, [])

    return [
      ..._invoiceItems,
    ]
  }

  const updateOriginalInvoiceItemList = () => {
    const _resultInvoiceItems = values.invoice.invoiceItems.map((item) => {
      const _subtotal = tempInvoicePayer.reduce((subtotal, invoicePayer) => {
        const {
          claimableSchemes: invoicePayerSchemes,
          copaymentSchemeFK,
        } = invoicePayer

        if (!copaymentSchemeFK) return subtotal

        const _selectedScheme = invoicePayerSchemes.find(
          (scheme) => scheme.id === copaymentSchemeFK,
        )

        const _invoicePayerItem = invoicePayer.invoicePayerItems.find(
          (payerItem) => payerItem.id === item.id,
        )

        if (_invoicePayerItem)
          return roundToTwoDecimals(subtotal + _invoicePayerItem.claimAmount)

        return roundToTwoDecimals(subtotal)
      }, 0)

      return { ...item, _claimedAmount: _subtotal }
    })

    return _resultInvoiceItems
  }

  const _updateTempInvoicePayer = (index, updatedRow) => {
    const _invoicePayers = tempInvoicePayer.map(
      (item, oriIndex) =>
        index === oriIndex ? { ...updatedRow } : { ...item },
    )
    const _newTempInvoicePayer = _invoicePayers.reduce(
      (_newInvoicePayers, invoicePayer, curIndex) => {
        if (curIndex < index)
          return [
            ..._newInvoicePayers,
            invoicePayer,
          ]

        const previousIndexesInvoiceItems = _newInvoicePayers.reduce(
          flattenInvoicePayersInvoiceItemList,
          [],
        )
        const previousIndexesInvoiceItemsWithSubtotal = previousIndexesInvoiceItems.reduce(
          computeInvoiceItemSubtotal,
          [],
        )
        console.log({ previousIndexesInvoiceItemsWithSubtotal })
        const _newInvoicePayer = {
          ...invoicePayer,
          invoicePayerItems: invoicePayer.invoicePayerItems.map((ip) => {
            const _existed = previousIndexesInvoiceItemsWithSubtotal.find(
              (_i) => _i.id === ip.id,
            )

            if (!_existed) return { ...ip }
            return {
              ...ip,
              totalAfterGst:
                _existed.totalAfterGst - _existed._prevClaimedAmount,
            }
          }),
        }
        return [
          ..._newInvoicePayers,
          _newInvoicePayer,
        ]
      },
      [],
    )

    console.log({ _invoicePayers, _newTempInvoicePayer })

    setTempInvoicePayer(_newTempInvoicePayer)
    // setTempInvoicePayer(
    //   tempInvoicePayer.map(
    //     (item, oriIndex) =>
    //       index === oriIndex ? { ...updatedRow } : { ...item },
    //   ),
    // )
  }

  const _validateInvoicePayerItems = (index) => {
    const sum = tempInvoicePayer[index].invoicePayerItems.reduce(
      (totalClaim, item) => totalClaim + (item.claimAmount || 0),
      0,
    )
    return sum <= 0
  }

  useEffect(
    () => {
      const finalClaim = roundToTwoDecimals(
        tempInvoicePayer.reduce(
          (sum, payer) =>
            payer._isConfirmed
              ? sum +
                payer.invoicePayerItems.reduce(
                  (subtotal, item) =>
                    subtotal + (item.claimAmount ? item.claimAmount : 0),
                  0,
                )
              : sum,
          0,
        ),
      )

      const finalPayable = roundToTwoDecimals(invoice.totalAftGst - finalClaim)
      const updatedInvoiceItems = updateOriginalInvoiceItemList()

      setFieldValue('finalClaim', finalClaim)
      setFieldValue('finalPayable', finalPayable)
      setFieldValue('invoice.invoiceItems', updatedInvoiceItems)
    },
    [
      tempInvoicePayer,
    ],
  )

  useEffect(
    () => {
      if (claimableSchemes.length > 0) {
        const _invoicePayer = {
          _indexInClaimableSchemes: 0,
          _hasEditingRow: false,
          _isConfirmed: false,
          _isDeleted: false,
          _isEditing: true,
          _isValid: true,
          _coverageMaxCap: 0,
          _balance: null,
          copaymentSchemeFK: undefined,
          name: '',
          payerDistributedAmt: 0,
          claimableSchemes: claimableSchemes[0],
          invoicePayerItems: [],
          sequence: 0,
          payerTypeFK: INVOICE_PAYER_TYPE.SCHEME,
        }
        setTempInvoicePayer([
          _invoicePayer,
        ])
        setTempInvoiceItems(values.invoice.invoiceItems)
      }
    },
    [
      values.id,
    ],
  )

  const getApplicableClaimAmount = (
    invoicePayerItem,
    scheme,
    remainingCoverageMaxCap,
  ) => {
    const {
      coPaymentByCategory,
      coPaymentByItem,
      isCoverageMaxCapCheckRequired,
    } = scheme
    let returnClaimAmount = 0

    if (invoicePayerItem.totalAfterGst === 0)
      return [
        0,
        remainingCoverageMaxCap,
      ]

    if (coPaymentByItem.length > 0) {
      returnClaimAmount = 0
    } else if (coPaymentByCategory.length > 0) {
      const itemCategory = coPaymentByCategory.find(
        (category) =>
          category.itemTypeFk === invoicePayerItem.invoiceItemTypeFk,
      )
      const itemRemainingAmount = invoicePayerItem._claimedAmount
        ? invoicePayerItem.totalAfterGst - invoicePayerItem._claimedAmount
        : invoicePayerItem.totalAfterGst

      if (itemCategory.groupValueType.toLowerCase() === 'percentage') {
        returnClaimAmount =
          itemRemainingAmount * (itemCategory.itemGroupValue / 100)
      } else {
        returnClaimAmount =
          itemCategory.itemGroupValue > itemRemainingAmount
            ? itemRemainingAmount
            : itemCategory.itemGroupValue
      }
    } else {
      returnClaimAmount = invoicePayerItem._claimedAmount
        ? invoicePayerItem.totalAfterGst - invoicePayerItem._claimedAmount
        : invoicePayerItem.totalAfterGst
    }

    if (isCoverageMaxCapCheckRequired) {
      if (returnClaimAmount > remainingCoverageMaxCap) {
        returnClaimAmount = remainingCoverageMaxCap
        remainingCoverageMaxCap = 0
      } else if (returnClaimAmount < remainingCoverageMaxCap) {
        remainingCoverageMaxCap -= returnClaimAmount
      } else {
        returnClaimAmount = remainingCoverageMaxCap
      }
    }

    return [
      returnClaimAmount,
      remainingCoverageMaxCap,
    ]
  }

  const handleSchemeChange = (index) => (value) => {
    const flattenSchemes = claimableSchemes.reduce(
      (schemes, cs) => [
        ...schemes,
        ...cs.map((item) => ({ ...item })),
      ],
      [],
    )
    const schemeConfig = flattenSchemes.find((item) => item.id === value)
    const {
      balance = null,
      coverageMaxCap = 0,
      overAllCoPaymentValue = 0,
      overAllCoPaymentValueType = 'Percentage',
      coPaymentSchemeName = '',
      id,
    } = schemeConfig

    let remainingCoverageMaxCap = coverageMaxCap

    const newInvoiceItems = getInvoiceItems(
      id,
      values.invoice.invoiceItems,
      tempInvoicePayer[index].invoicePayerItems,
      index,
    )
    console.log({ newInvoiceItems })

    const updatedRow = {
      ...tempInvoicePayer[index],
      _coverageMaxCap: coverageMaxCap,
      _balance: balance,
      // payerDistributedAmt: overAllCoPaymentValue,
      name: coPaymentSchemeName,
      copaymentSchemeFK: id,
      invoicePayerItems: newInvoiceItems.map((item) => {
        let claimAmount = item.totalAfterGst
        let proceedForChecking = true

        if (item._claimedAmount === item.totalAfterGst) {
          proceedForChecking = false
          claimAmount = 0
        } else if (item._claimedAmount > 0) {
          claimAmount = item.totalAfterGst - item._claimedAmount
        }

        if (proceedForChecking)
          [
            claimAmount,
            remainingCoverageMaxCap,
          ] = getApplicableClaimAmount(
            item,
            schemeConfig,
            remainingCoverageMaxCap,
          )

        return {
          ...item,

          claimAmount: roundToTwoDecimals(claimAmount),

          // claimAmount:
          //   index === 0 ? item.totalAfterGst : getMaximumClaimable(item),
        }
      }),
    }
    _updateTempInvoicePayer(index, updatedRow)
  }

  const handleCommitChanges = (index) => async ({ rows }) => {
    const updatedRow = {
      ...tempInvoicePayer[index],
      invoicePayerItems: [
        ...rows,
      ],
    }
    _updateTempInvoicePayer(index, updatedRow)
  }

  const handleEditingRowIdsChange = (index) => (rows) => {
    const updatedRow = {
      ...tempInvoicePayer[index],
      _hasEditingRow: rows.length > 0,
    }

    _updateTempInvoicePayer(index, updatedRow)
    return rows
  }

  const handleAppliedSchemeSaveClick = (index) => () => {
    const updatedRow = {
      ...tempInvoicePayer[index],
      _isConfirmed: true,
      _isEditing: false,
      _isDeleted: false,
    }
    _updateTempInvoicePayer(index, updatedRow)
  }

  const handleAppliedSchemeEditClick = (index) => () => {
    const updatedRow = {
      ...tempInvoicePayer[index],
      _isConfirmed: false,
      _isEditing: true,
      _isDeleted: false,
    }
    _updateTempInvoicePayer(index, updatedRow)
  }

  const handleAppliedSchemeRemoveClick = (index) => () => {
    setTempInvoicePayer(
      tempInvoicePayer.filter((item, oriIndex) => index !== oriIndex),
    )
    // setNextIndex(index)
  }

  const handleAddClaimClick = () => {
    setShowClaimableSchemesSelection(true)
  }

  const handleSelectClaimClick = (index) => () => {
    const invoicePayer = {
      _indexInClaimableSchemes: index,
      _hasEditingRow: false,
      _isConfirmed: false,
      _isDeleted: false,
      _isEditing: true,
      _isValid: true,
      _coverageMaxCap: 0,
      copaymentSchemeFK: undefined,
      name: '',
      payerDistributedAmt: 0,
      claimableSchemes: claimableSchemes[index],
      invoicePayerItems: [],
      sequence: 0,
      payerTypeFK: INVOICE_PAYER_TYPE.SCHEME,
    }
    setTempInvoicePayer([
      ...tempInvoicePayer,
      invoicePayer,
    ])
    setShowClaimableSchemesSelection(false)
  }

  const shouldDisableAddCopayer = () => {
    if (tempInvoicePayer.length !== claimableSchemes.length) return true
    const notIsAllSaved = tempInvoicePayer.reduce(
      (isAllConfirmed, item) => item._isEditing || false,
      true,
    )
    return notIsAllSaved
  }

  const shouldDisableAddApplicableClaim = () => {
    return tempInvoicePayer.reduce(
      (disbleAddClaim, item) =>
        item._isEditing || item.copaymentSchemeFK === undefined
          ? true
          : disbleAddClaim,
      false,
    )
  }
  // console.log({
  //   tempInvoicePayer,
  // })
  return (
    <React.Fragment>
      <GridItem md={2}>
        <h5 style={{ paddingLeft: 8 }}>Apply Claims</h5>
      </GridItem>
      <GridItem md={10} container justify='flex-end'>
        {tempInvoicePayer.length !== claimableSchemes.length && (
          <Button
            color='primary'
            size='sm'
            disabled={shouldDisableAddApplicableClaim()}
            onClick={handleAddClaimClick}
          >
            <Add />
            Applicable Claim
          </Button>
        )}
        <Button
          color='primary'
          size='sm'
          onClick={handleAddCopayerClick}
          disabled={shouldDisableAddCopayer()}
        >
          <Add />
          Co-Payer
        </Button>
        <Button color='primary' size='sm' disabled>
          <Reset />
          Reset
        </Button>
      </GridItem>
      <GridItem md={12} style={{ maxHeight: '55vh', overflowY: 'auto' }}>
        {tempInvoicePayer.map((invoicePayer, index) => {
          if (invoicePayer._isDeleted) return null
          // const _validationSchema = getValidationScheme(
          //   invoicePayer.claimableSchemes.find(
          //     (item) => item.id === invoicePayer.copaymentSchemeFK,
          //   ),
          // )
          return (
            <Paper
              key={`invoicePayer-${index}`}
              className={classes.gridRow}
              elevation={4}
            >
              <GridContainer style={{ marginBottom: 16 }} alignItems='center'>
                <GridItem md={3} style={{ marginTop: 8, marginBottom: 16 }}>
                  <Select
                    size='sm'
                    allowClear={false}
                    simple
                    valueField='id'
                    onChange={handleSchemeChange(index)}
                    value={invoicePayer.copaymentSchemeFK}
                    options={[
                      ...invoicePayer.claimableSchemes.map((item) => ({
                        id: item.id,
                        name: item.coPaymentSchemeName,
                      })),
                    ]}
                  />
                </GridItem>
                {/* <GridItem style={{ marginTop: 8, marginBottom: 8 }}>
                  <NumberInput
                    currency
                    text
                    prefix='Balance:'
                    value={invoicePayer._balance}
                  />
                </GridItem> */}
                <GridItem style={{ marginTop: 8, marginBottom: 8 }}>
                  <NumberInput
                    currency
                    text
                    prefix='Max Cap.:'
                    value={invoicePayer._coverageMaxCap}
                  />
                </GridItem>
                <GridItem md={12}>
                  <EditableTableGrid
                    FuncProps={{ pager: false }}
                    EditingProps={{
                      showAddCommand: false,
                      showDeleteCommand: false,
                      showEditCommand: invoicePayer._isEditing,
                      onEditingRowIdsChange: handleEditingRowIdsChange(index),
                      onCommitChanges: handleCommitChanges(index),
                    }}
                    schema={validationSchema}
                    columns={ItemTableColumn}
                    columnExtensions={getInvoiceItemsColumnExtensions(
                      tempInvoicePayer[index].claimableSchemes.find(
                        (item) =>
                          item.id === tempInvoicePayer[index].copaymentSchemeFK,
                      ),
                    )}
                    rows={invoicePayer.invoicePayerItems}
                  />
                </GridItem>
                <GridItem md={8} />
                <GridItem md={4} className={classes.gridActionBtn}>
                  <Button
                    size='sm'
                    color='danger'
                    disabled={invoicePayer.copaymentSchemeFK === undefined}
                    onClick={handleAppliedSchemeRemoveClick(index)}
                  >
                    Remove
                  </Button>

                  {invoicePayer._isEditing && (
                    <Button
                      size='sm'
                      color='primary'
                      className={classes.rightEndBtn}
                      onClick={handleAppliedSchemeSaveClick(index)}
                      disabled={
                        invoicePayer._hasEditingRow ||
                        _validateInvoicePayerItems(index)
                      }
                    >
                      Save
                    </Button>
                  )}
                  {invoicePayer._isConfirmed && (
                    <Button
                      size='sm'
                      color='primary'
                      className={classes.rightEndBtn}
                      onClick={handleAppliedSchemeEditClick(index)}
                    >
                      Edit
                    </Button>
                  )}
                </GridItem>
              </GridContainer>
            </Paper>
          )
        })}
      </GridItem>
      <GridItem md={12}>
        <Paper className={classes.gridRow}>
          {invoicePayers.map((payer, index) => {
            return (
              <TableData
                height={150}
                columns={ItemTableColumn}
                columnExtensions={invoiceItemColExtensions}
                data={payer.invoicePayerItems}
                title={payer.name}
              />
            )
          })}
          {/* <TableData
            height={200}
            columns={ItemTableColumn}
            colExtensions={ItemTableColumnExtensions}
            data={ItemData}
            title='Corporate A'
          />
          <TableData
            height={200}
            columns={ItemTableColumn}
            colExtensions={ItemTableColumnExtensions}
            data={ItemData}
            title='Corporate B'
          /> */}
        </Paper>
      </GridItem>
      <CommonModal
        open={showClaimableSchemesSelection}
        title='Claimable Schemes'
        onClose={() =>
          setShowClaimableSchemesSelection(!showClaimableSchemesSelection)}
        maxWidth='sm'
      >
        <ApplicableClaims
          currentClaims={tempInvoicePayer}
          claimableSchemes={claimableSchemes}
          handleSelectClick={handleSelectClaimClick}
        />
      </CommonModal>
    </React.Fragment>
  )
}

export default withStyles(styles, { name: 'ApplyClaims' })(ApplyClaims)
