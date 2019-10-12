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

const validationSchema = Yup.object().shape({
  claimAmount: Yup.number().min(0.1, ''),
})

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

const getInvoiceItems = (schemeID, oriInvoiceItems, curInvoiceItems) => {
  if (!schemeID && !oriInvoiceItems) return []
  const _invoiceItems = oriInvoiceItems.reduce((newList, item) => {
    if (item.notClaimableBySchemeIds.includes(schemeID))
      return [
        ...newList,
      ]

    const existed = curInvoiceItems.find((curItem) => curItem.id === item.id)

    if (existed)
      return [
        ...newList,
        { ...existed },
      ]

    return [
      ...newList,
      { ...item },
    ]
  }, [])

  return [
    ..._invoiceItems,
  ]
}

const invoiceItemColExtensions = [
  { columnName: 'itemCode', disabled: true },
  { columnName: 'coverage', type: 'number', disabled: true },
  {
    columnName: 'totalAftGst',
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

  const _updateTempInvoicePayer = (index, updatedRow) => {
    setTempInvoicePayer(
      tempInvoicePayer.map(
        (item, oriIndex) =>
          index === oriIndex ? { ...updatedRow } : { ...item },
      ),
    )
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
      const finalClaim =
        Math.round(
          tempInvoicePayer.reduce(
            (sum, payer) =>
              sum +
              payer.invoicePayerItems.reduce(
                (subtotal, item) =>
                  subtotal + (item.claimAmount ? item.claimAmount : 0),
                0,
              ),
            0,
          ) * 100,
        ) / 100

      const finalPayable = invoice.totalAftGst - finalClaim
      setFieldValue('finalClaim', finalClaim)
      setFieldValue('finalPayable', finalPayable)
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
          _coverageMaxCap: 0,
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
      }
    },
    [
      values.id,
    ],
  )

  const onSchemeChange = (index) => (value) => {
    const flattenSchemes = claimableSchemes.reduce(
      (schemes, cs) => [
        ...schemes,
        ...cs.map((item) => ({ ...item })),
      ],
      [],
    )
    const {
      coverageMaxCap = 0,
      overAllCoPaymentValue = 0,
      coPaymentSchemeName = '',
      id,
    } = flattenSchemes.find((item) => item.id === value)

    const newInvoiceItems = getInvoiceItems(
      id,
      values.invoice.invoiceItems,
      tempInvoicePayer[index].invoicePayerItems,
    )

    const updatedRow = {
      ...tempInvoicePayer[index],
      _coverageMaxCap: coverageMaxCap,
      payerDistributedAmt: overAllCoPaymentValue,
      name: coPaymentSchemeName,
      copaymentSchemeFK: id,
      invoicePayerItems: [
        ...newInvoiceItems,
      ],
    }

    setTempInvoicePayer(
      tempInvoicePayer.map(
        (item, oriIndex) =>
          index === oriIndex ? { ...updatedRow } : { ...item },
      ),
    )
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
    // const passValidation = _validateInvoicePayerItems(
    //   index
    // )
    // let newInvoicePayer = [
    //   ...tempInvoicePayer,
    // ]
    const updatedRow = {
      ...tempInvoicePayer[index],
      _isConfirmed: true,
      _isEditing: false,
      _isDeleted: false,
    }
    _updateTempInvoicePayer(index, updatedRow)

    // newInvoicePayer = tempInvoicePayer.map(
    //   (item, oriIndex) =>
    //     index === oriIndex ? { ...updatedRow } : { ...item },
    // )

    // const hasUnappliedSchemes =
    //   tempInvoicePayer.length !== claimableSchemes.length

    // if (hasUnappliedSchemes && nextIndex < claimableSchemes.length) {
    //   const invoicePayer = {
    //     _indexInClaimableSchemes: nextIndex,
    //     _hasEditingRow: false,
    //     _isConfirmed: false,
    //     _isDeleted: false,
    //     _isEditing: true,
    //     _coverageMaxCap: 0,
    //     copaymentSchemeFK: undefined,
    //     name: '',
    //     payerDistributedAmt: 0,
    //     claimableSchemes: claimableSchemes[nextIndex],
    //     invoicePayerItems: [],
    //     sequence: 0,
    //     payerTypeFK: INVOICE_PAYER_TYPE.SCHEME,
    //   }
    //   newInvoicePayer = [
    //     ...newInvoicePayer,
    //     invoicePayer,
    //   ]
    // }
    // console.log({ newInvoicePayer })
    // setTempInvoicePayer(newInvoicePayer)
    // setNextIndex(nextIndex + 1)
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
  //   shouldDisableAddApplicableClaim: shouldDisableAddApplicableClaim(),
  // })
  return (
    <React.Fragment>
      <GridItem md={2}>
        <h5>Apply Claims</h5>
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

          return (
            <Paper className={classes.gridRow}>
              <GridContainer style={{ marginBottom: 16 }}>
                <GridItem md={3}>
                  <Select
                    allowClear={false}
                    simple
                    valueField='id'
                    onChange={onSchemeChange(index)}
                    value={invoicePayer.copaymentSchemeFK}
                    options={[
                      ...invoicePayer.claimableSchemes.map((item) => ({
                        id: item.id,
                        name: item.coPaymentSchemeName,
                      })),
                    ]}
                  />
                </GridItem>
                <GridItem>
                  <NumberInput
                    currency
                    text
                    prefix='Balance:'
                    value={invoicePayer.payerDistributedAmt}
                  />
                </GridItem>
                <GridItem>
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
                    columnExtensions={invoiceItemColExtensions}
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
