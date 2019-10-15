import React, { useEffect, useState } from 'react'
import * as Yup from 'yup'
// material ui
import { Paper, withStyles } from '@material-ui/core'
import Edit from '@material-ui/icons/Edit'
import Add from '@material-ui/icons/AddCircle'
import Reset from '@material-ui/icons/Cached'
import Delete from '@material-ui/icons/Delete'
// common components
import {
  Button,
  CommonTableGrid,
  EditableTableGrid,
  CommonModal,
  GridContainer,
  GridItem,
  Select,
  Field,
  FastField,
  NumberInput,
  Tooltip,
  SizeContainer,
  TextField,
} from '@/components'
// page modal
import ApplicableClaims from '../modal/ApplicableClaims'
import CoPayer from '../modal/CoPayer'
// sub components
import TableData from '../../DispenseDetails/TableData'
import {
  SchemeInvoicePayerColumn,
  CompanyInvoicePayerColumn,
} from '../variables'
// constants
import { INVOICE_PAYER_TYPE } from '@/utils/constants'
import { roundToTwoDecimals } from '@/utils/utils'

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
  {
    columnName: 'coverage',
    align: 'right',
    disabled: true,
  },
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

const validationSchema = Yup.object().shape({
  coverage: Yup.string(),
  totalAfterGst: Yup.number(),
  claimAmount: Yup.number().when(
    [
      'coverage',
      'totalAfterGst',
    ],
    // (coverage, totalAfterGst, schema) => schema.max(4),
    (coverage, totalAfterGst, schema) => {
      const isPercentage = coverage.indexOf('%') > 0
      let _absoluteValue = 0
      if (isPercentage) {
        const percentage = parseFloat(coverage.slice(0, -1))
        _absoluteValue = totalAfterGst * percentage / 100
      } else _absoluteValue = coverage.slice(1)
      const message =
        _absoluteValue === totalAfterGst
          ? 'Claim Amount cannot exceed Total Payable'
          : 'Claim Amount cannot exceed Coverage amount'
      return schema.min(0).max(_absoluteValue, message)
    },
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

const ApplyClaims = ({ classes, values, setFieldValue, handleIsEditing }) => {
  const { invoice, claimableSchemes } = values
  const [
    initialState,
    setInitialState,
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
    tempInvoicePayer,
    setTempInvoicePayer,
  ] = useState([])

  const [
    curEditInvoicePayerBackup,
    setCurEditInvoicePayerBackup,
  ] = useState(undefined)

  const hasEditing = () =>
    tempInvoicePayer.reduce(
      (disbleAddClaim, item) => (item._isEditing ? true : disbleAddClaim),
      false,
    )

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
      let schemeCoverageType = 'percentage'
      let schemeCoverage = 0
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
        schemeCoverage = itemCategory.itemGroupValue
        schemeCoverageType = itemCategory.groupValueType
      } else {
        schemeCoverageType = scheme.overAllCoPaymentValueType
        schemeCoverage = scheme.overAllCoPaymentValue
        coverage =
          scheme.overAllCoPaymentValueType.toLowerCase() === 'percentage'
            ? `${scheme.overAllCoPaymentValue}%`
            : `$${scheme.overAllCoPaymentValue}`
      }

      if (existed)
        return [
          ...newList,
          {
            ...existed,
            coverage,
            schemeCoverageType,
            schemeCoverage,
            itemName: existed.itemDescription,
          },
        ]

      return [
        ...newList,
        {
          ...item,
          coverage,
          schemeCoverageType,
          schemeCoverage,
          itemName: item.itemDescription,
        },
      ]
    }, [])

    return [
      ..._invoiceItems,
    ]
  }

  const updateOriginalInvoiceItemList = () => {
    const _resultInvoiceItems = invoice.invoiceItems.map((item) => {
      const _subtotal = tempInvoicePayer.reduce((subtotal, invoicePayer) => {
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
    const _invoicePayers = tempInvoicePayer
      .map(
        (item, oriIndex) =>
          index === oriIndex ? { ...updatedRow } : { ...item },
      )
      .filter((item) => !item._isDeleted)

    const _newTempInvoicePayer = _invoicePayers.reduce(
      (_newInvoicePayers, invoicePayer, curIndex) => {
        if (curIndex === 0) {
          return [
            ..._newInvoicePayers,
            {
              ...invoicePayer,
              invoicePayerItems: invoicePayer.invoicePayerItems.map((item) => {
                const original = invoice.invoiceItems.find(
                  (originalItem) => originalItem.id === item.id,
                )
                return { ...item, totalAfterGst: original.totalAfterGst }
              }),
            },
          ]
        }

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
    const currentEditingInvoicePayer = _newTempInvoicePayer.find(
      (invoicePayer) => invoicePayer._isEditing,
    )
    if (curEditInvoicePayerBackup === undefined)
      setCurEditInvoicePayerBackup(currentEditingInvoicePayer)
    if (currentEditingInvoicePayer === undefined)
      setCurEditInvoicePayerBackup(undefined)

    setTempInvoicePayer(_newTempInvoicePayer)
  }

  const _validateInvoicePayerItems = (index) => {
    const sum = tempInvoicePayer[index].invoicePayerItems.reduce(
      (totalClaim, item) => totalClaim + (item.claimAmount || 0),
      0,
    )
    return sum <= 0
  }

  const toggleCopayerModal = () => setShowCoPaymentModal(!showCoPaymentModal)

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
      setFieldValue('invoicePayers', tempInvoicePayer)
      handleIsEditing(hasEditing())
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
        setInitialState([
          _invoicePayer,
        ])
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
    // console.log({ newInvoiceItems })

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
        }
      }),
    }
    _updateTempInvoicePayer(index, updatedRow)
  }

  const handleCommitChanges = (index) => ({ rows }) => {
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

  const handleAppliedSchemeCancelClick = (index) => () => {
    const updatedRow = {
      ...tempInvoicePayer[index],
      ...curEditInvoicePayerBackup,
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
    const updatedRow = { ...tempInvoicePayer[index], _isDeleted: true }
    _updateTempInvoicePayer(index, updatedRow)
    // setTempInvoicePayer(
    //   tempInvoicePayer.filter((item, oriIndex) => index !== oriIndex),
    // )
  }

  const handleAddClaimClick = () => {
    setShowClaimableSchemesSelection(true)
  }

  const handleAddCoPayer = (invoicePayer) => {
    toggleCopayerModal()
    setTempInvoicePayer([
      ...tempInvoicePayer,
      invoicePayer,
    ])
  }

  const handleResetClick = () => {
    setTempInvoicePayer(initialState)
    setCurEditInvoicePayerBackup(undefined)
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

  const shouldDisableAddApplicableClaim = () => {
    const isEditing = hasEditing()
    const hasUnappliedScheme =
      tempInvoicePayer.filter(
        (invoicePayer) =>
          invoicePayer.payerTypeFK === INVOICE_PAYER_TYPE.SCHEME,
      ).length < invoice.claimableSchemes
    return isEditing || hasUnappliedScheme
  }

  console.log({ tempInvoicePayer, invoiceItems: invoice.invoiceItems })

  return (
    <React.Fragment>
      <GridItem md={2}>
        <h5 style={{ paddingLeft: 8 }}>Apply Claims</h5>
      </GridItem>
      <GridItem md={10} container justify='flex-end'>
        <Button
          color='primary'
          size='sm'
          disabled={shouldDisableAddApplicableClaim()}
          onClick={handleAddClaimClick}
        >
          <Add />
          Applicable Claim
        </Button>
        <Button
          color='primary'
          size='sm'
          onClick={toggleCopayerModal}
          disabled={hasEditing()}
        >
          <Add />
          Co-Payer
        </Button>
        <Button color='danger' size='sm' onClick={handleResetClick}>
          <Reset />
          Reset
        </Button>
      </GridItem>
      <GridItem md={12} style={{ maxHeight: '55vh', overflowY: 'auto' }}>
        {tempInvoicePayer.map((invoicePayer, index) => {
          if (invoicePayer._isDeleted) return null
          return (
            <Paper
              key={`invoicePayer-${index}`}
              className={classes.gridRow}
              elevation={4}
            >
              <GridContainer style={{ marginBottom: 16 }} alignItems='center'>
                <GridItem md={3} style={{ marginTop: 8, marginBottom: 16 }}>
                  {invoicePayer.payerTypeFK === INVOICE_PAYER_TYPE.SCHEME ? (
                    <Select
                      size='sm'
                      allowClear={false}
                      simple
                      valueField='id'
                      onChange={handleSchemeChange(index)}
                      value={invoicePayer.copaymentSchemeFK}
                      disabled={invoicePayer._isConfirmed}
                      options={[
                        ...invoicePayer.claimableSchemes.map((item) => ({
                          id: item.id,
                          name: item.coPaymentSchemeName,
                        })),
                      ]}
                    />
                  ) : (
                    <span>{invoicePayer.name}</span>
                  )}
                </GridItem>
                {/* <GridItem style={{ marginTop: 8, marginBottom: 8 }}>
                  <NumberInput
                    currency
                    text
                    prefix='Balance:'
                    value={invoicePayer._balance}
                  />
                </GridItem> */}
                <GridItem md={8} style={{ marginTop: 8, marginBottom: 8 }}>
                  {invoicePayer.payerTypeFK === INVOICE_PAYER_TYPE.SCHEME && (
                    <NumberInput
                      currency
                      text
                      prefix='Max Cap.:'
                      value={invoicePayer._coverageMaxCap}
                    />
                  )}
                </GridItem>
                <GridItem md={1} style={{ textAlign: 'right' }}>
                  <Tooltip title='Remove this scheme'>
                    <Button
                      size='sm'
                      color='danger'
                      justIcon
                      onClick={handleAppliedSchemeRemoveClick(index)}
                    >
                      <Delete />
                    </Button>
                  </Tooltip>
                </GridItem>
                <GridItem md={12}>
                  <EditableTableGrid
                    size='sm'
                    FuncProps={{ pager: false }}
                    EditingProps={{
                      showAddCommand: false,
                      showDeleteCommand: false,
                      showEditCommand: invoicePayer._isEditing,
                      onEditingRowIdsChange: handleEditingRowIdsChange(index),
                      onCommitChanges: handleCommitChanges(index),
                    }}
                    schema={validationSchema}
                    columns={
                      invoice.payerTypeFK === INVOICE_PAYER_TYPE.SCHEME ? (
                        SchemeInvoicePayerColumn
                      ) : (
                        CompanyInvoicePayerColumn
                      )
                    }
                    columnExtensions={invoiceItemColExtensions}
                    rows={invoicePayer.invoicePayerItems}
                  />
                </GridItem>
                <GridItem md={8} />
                <GridItem md={4} className={classes.gridActionBtn}>
                  {invoicePayer._isEditing && (
                    <React.Fragment>
                      <Button
                        size='sm'
                        color='danger'
                        onClick={handleAppliedSchemeCancelClick(index)}
                        disabled={invoicePayer.copaymentSchemeFK === undefined}
                      >
                        Cancel
                      </Button>
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
                    </React.Fragment>
                  )}
                  {invoicePayer._isConfirmed && (
                    <Button
                      size='sm'
                      color='primary'
                      className={classes.rightEndBtn}
                      onClick={handleAppliedSchemeEditClick(index)}
                      disabled={hasEditing()}
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
      {/* <GridItem md={12}>
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
          <TableData
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
          />
        </Paper>
      </GridItem> */}
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
      <CommonModal
        open={showCoPaymentModal}
        title='Add Copayer'
        onClose={toggleCopayerModal}
      >
        <CoPayer
          onAddCoPayerClick={handleAddCoPayer}
          invoiceItems={invoice.invoiceItems.map((invoiceItem) => ({
            ...invoiceItem,
            totalAfterGst: invoiceItem._claimedAmount
              ? invoiceItem.totalAfterGst - invoiceItem._claimedAmount
              : invoiceItem.totalAfterGst,
          }))}
        />
      </CommonModal>
    </React.Fragment>
  )
}

export default withStyles(styles, { name: 'ApplyClaims' })(ApplyClaims)
