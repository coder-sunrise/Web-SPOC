import React, { useState, useEffect, useContext } from 'react'
import { connect } from 'dva'
import { compose } from 'redux'
import _ from 'lodash'
import moment from 'moment'
// material ui
import Print from '@material-ui/icons/Print'
import Refresh from '@material-ui/icons/Refresh'
import Edit from '@material-ui/icons/Edit'
import { InputNumber, Table as AntdTable, Checkbox } from 'antd'
import {
  MenuList,
  ClickAwayListener,
  MenuItem,
  makeStyles,
  Paper,
  withStyles,
  Link,
} from '@material-ui/core'
import Delete from '@material-ui/icons/Delete'
import withWebSocket from '@/components/Decorator/withWebSocket'
import AttachMoney from '@material-ui/icons/AttachMoney'
import { formatMessage } from 'umi' // common component
import Warining from '@material-ui/icons/Error'
import { Table } from '@devexpress/dx-react-grid-material-ui'
import { sendQueueNotification } from '@/pages/Reception/Queue/utils'
import {
  Button,
  ProgressButton,
  GridItem,
  GridContainer,
  CommonTableGrid,
  TextField,
  CommonModal,
  NumberInput,
  Popper,
  notification,
} from '@/components'
import AmountSummary from '@/pages/Shared/AmountSummary'
import Authorized from '@/utils/Authorized'
import {
  VISIT_TYPE,
  NOTIFICATION_TYPE,
  NOTIFICATION_STATUS,
  DISPENSE_FROM,
} from '@/utils/constants'
import { sendNotification } from '@/utils/realtime'
import { VISIT_STATUS } from '@/pages/Reception/Queue/variables'
import { hasValue } from '@/pages/Widgets/PatientHistory/config'
// sub components
import TableData from './TableData'
import VisitOrderTemplateIndicateString from '@/pages/Widgets/Orders/VisitOrderTemplateIndicateString'

// variables
import {
  DispenseItemsColumns,
  getRowId,
  ServiceColumns1,
  OtherOrdersColumns1,
  DispenseItemsColumns1,
} from '../variables'

import CONSTANTS from './constants'
import customtyles from './Style.less'
import style from '@/components/CommonCard/style'

const styles = theme => ({
  paper: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(2),
  },
  actionButtons: {
    marginTop: theme.spacing(2),
  },
  gridContainer: {
    overflow: 'auto',
  },
  gridRow: {
    '&:not(:first-child)': {
      marginTop: theme.spacing(2),
    },
  },
  rightActionButtons: {
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginTop: theme.spacing(2),
    '& > button:last-child': {
      marginRight: '0px !important',
    },
  },
  subRow: {
    '& > td:first-child': {
      paddingLeft: theme.spacing(1),
    },
  },
  groupStyle: {
    padding: '3px 0px',
    backgroundColor: 'rgb(240, 248, 255)',
  },
  tableContainer: {
    margin: theme.spacing(1),
    '& > div:last-child': {
      marginBottom: theme.spacing(1.5),
    },
  },
})

const DispenseDetails = ({
  classes,
  setFieldValue,
  setValues,
  values,
  dispatch,
  viewOnly = false,
  onPrint,
  sendingJob,
  onReloadClick,
  onSaveClick,
  onEditOrderClick,
  onFinalizeClick,
  codetable,
  dispense = {},
  history,
  clinicSettings,
  servingPersons = [],
  patient,
  user,
  visitRegistration,
  isIncludeExpiredItem = false,
}) => {
  const {
    dispenseItems = [],
    service,
    otherOrder,
    packageItem,
    invoice,
    visitPurposeFK,
    visitRemarks,
    defaultExpandedGroups,
    orderCreateTime,
    orderCreateBy,
    visitStatus,
    hasAnySpecimenCollected,
    id: visitId,
    isClinicSessionClosed,
  } = values || {
    invoice: { invoiceItem: [] },
  }
  const {
    invoiceItem = [],
    invoiceAdjustment = [],
    totalPayment,
    coPayer = [],
  } = invoice

  const { openFrom } = dispense
  const [popperOpen, setPopperOpen] = useState(false)
  const [patientLabelCopies, setPatientLabelCopies] = useState(1)
  const openPopper = () => setPopperOpen(true)
  const closePopper = () => setPopperOpen(false)
  const [selectedAll, setSelectedAll] = useState(false)
  const [selectedServiceAll, setSelectedServiceAll] = useState(false)

  const { settings = {} } = clinicSettings
  const discardCallback = r => {
    if (r) {
      const userProfile = user.data.clinicianProfile
      const userName = `${
        userProfile.title && userProfile.title.trim().length
          ? `${userProfile.title}. ${userProfile.name || ''}`
          : `${userProfile.name || ''}`
      }`
      const { entity } = visitRegistration
      const visitTypeName = JSON.parse(settings.visitTypeSetting).find(
        t => t.id === entity.visit.visitPurposeFK,
      ).displayValue
      notification.success({ message: `${visitTypeName} visit discarded.` })
      sendQueueNotification({
        message: `${visitTypeName} visit discarded.`,
        queueNo: entity.queueNo,
        visitID: entity.id,
      })
      history.push('/reception/queue')
    }
  }

  const discardAddOrderDetails = () => {
    const { id } = invoice
    dispatch({
      type: 'dispense/removeAddOrderDetails',
      payload: {
        id,
      },
    }).then(r => {
      if (r) {
        const { entity } = visitRegistration
        const visitTypeName = JSON.parse(settings.visitTypeSetting).find(
          t => t.id === entity.visit.visitPurposeFK,
        ).displayValue
      }
      sendNotification('EditedConsultation', {
        type: NOTIFICATION_TYPE.CONSULTAION,
        status: NOTIFICATION_STATUS.OK,
        message: 'Completed Consultation',
        visitID: values.id,
      })

      discardCallback(r)
    })
  }

  const discardBillOrder = () => {
    const { id } = invoice
    dispatch({
      type: 'dispense/discardBillOrder',
      payload: { id },
    }).then(discardCallback)
  }

  const discardDispense = () => {
    dispatch({
      type: 'global/updateAppState',
      payload: {
        openConfirm: true,
        openConfirmContent: `Discard dispense?`,
        onConfirmSave:
          visitPurposeFK === VISIT_TYPE.OTC
            ? discardAddOrderDetails
            : discardBillOrder,
      },
    })
  }

  const updateInvoiceData = v => {
    const newInvoice = {
      ...values.invoice,
      invoiceTotal: v.summary.total,
      invoiceTotalAftAdj: v.summary.totalAfterAdj,
      invoiceTotalAftGST: v.summary.totalWithGST,
      outstandingBalance: v.summary.totalWithGST - values.invoice.totalPayment,
      invoiceGSTAmt: Math.round(v.summary.gst * 100) / 100,
      invoiceGSTAdjustment: v.summary.gstAdj,
      invoiceAdjustment: v.adjustments,
      isGSTInclusive: !!v.summary.isGSTInclusive,
    }
    setValues({
      ...values,
      invoice: newInvoice,
    })
    dispatch({
      type: `dispense/updateState`,
      payload: {
        totalWithGST: v.summary.totalWithGST,
        isGSTInclusive: v.summary.isGSTInclusive,
      },
    })
  }

  const checkUpdatedAppliedInvoicePayerInfo = () => {
    let isUpdatedAppliedInvoicePayerInfo
    const activeInvoicePayer = coPayer.filter(tip => !tip.isCancelled)
    invoiceItem.forEach(item => {
      for (let index = 0; index < activeInvoicePayer.length; index++) {
        const { invoicePayerItem = [] } = activeInvoicePayer[index]
        const payerItem = invoicePayerItem.find(
          ipi => item.id === ipi.invoiceItemFK,
        )
        if (payerItem) {
          if (item.totalBeforeGst !== payerItem.payableBalance) {
            isUpdatedAppliedInvoicePayerInfo = true
          }
          break
        }
      }
    })
    return isUpdatedAppliedInvoicePayerInfo
  }

  const { clinicalObjectRecordFK } = values || {
    clinicalObjectRecordFK: undefined,
  }

  const isRetailVisit = visitPurposeFK === VISIT_TYPE.OTC
  const isBillFirstVisit =
    visitPurposeFK === VISIT_TYPE.BF || visitPurposeFK === VISIT_TYPE.MC
  const disableRefreshOrder = isBillFirstVisit && !clinicalObjectRecordFK
  const disableDiscard = totalPayment > 0 || !!clinicalObjectRecordFK
  const [showRemovePayment, setShowRemovePayment] = useState(false)

  const [voidReason, setVoidReason] = useState('')

  let coPayerPayments = []
  if (checkUpdatedAppliedInvoicePayerInfo()) {
    coPayer.forEach(ip => {
      const { invoicePayment = [], name } = ip
      coPayerPayments = coPayerPayments.concat(
        invoicePayment
          .filter(o => !o.isCancelled)
          .map(o => ({
            ...o,
            payerName: name,
          })),
      )
    })
  }

  const [expandedGroups, setExpandedGroups] = useState([])

  const handleExpandedGroupsChange = e => {
    setExpandedGroups(e)
  }

  useEffect(() => {
    if (packageItem) {
      const groups = packageItem.reduce(
        (distinct, data) =>
          distinct.includes(data.packageGlobalId)
            ? [...distinct]
            : [...distinct, data.packageGlobalId],
        [],
      )

      setExpandedGroups(groups)
    }
  }, [packageItem])

  const packageGroupCellContent = ({ row }) => {
    let label = 'Package'
    let totalPrice = 0
    if (!packageItem) return ''
    const data = packageItem.filter(item => item.packageGlobalId === row.value)
    if (data.length > 0) {
      totalPrice = _.sumBy(data, 'totalAfterItemAdjustment') || 0
      label = `${data[0].packageCode} - ${data[0].packageName} (Total: `
    }
    return (
      <span style={{ verticalAlign: 'middle', paddingRight: 8 }}>
        <strong>
          {label}
          <NumberInput text currency value={totalPrice} />)
        </strong>
      </span>
    )
  }

  const [selectedServiceRows, setSelectedServiceRows] = useState([])

  const handleReloadClick = () => {
    setSelectedServiceRows([])
    onReloadClick()
  }

  const handleSelectionChange = (type, value) => {
    switch (type) {
      case 'Service':
        setSelectedServiceRows(value)
        break
    }
  }

  const orderItemRow = p => {
    const { row, children, tableRow } = p
    let newchildren = []

    const startColIndex = 6
    let endColIndex = 10
    if (viewOnly) {
      endColIndex = endColIndex - 1
    }
    const batchColumns = children.slice(startColIndex, endColIndex)

    if (row.groupNumber === 1) {
      newchildren.push(
        children
          .filter((value, index) => index < 2)
          .map(item => ({
            ...item,
            props: {
              ...item.props,
              rowSpan: row.groupRowSpan,
            },
          })),
      )
    }

    if (row.countNumber === 1) {
      newchildren.push(
        children
          .filter((value, index) => index < startColIndex && index > 1)
          .map(item => ({
            ...item,
            props: {
              ...item.props,
              rowSpan: row.rowspan,
            },
          })),
      )
      newchildren.push(batchColumns)
      newchildren.push(
        children
          .filter((value, index) => index === endColIndex)
          .map(item => ({
            ...item,
            props: {
              ...item.props,
              rowSpan: row.rowspan,
            },
          })),
      )
    } else {
      newchildren.push(batchColumns)
    }

    if (row.groupNumber === 1) {
      newchildren.push(
        children
          .filter((value, index) => index > endColIndex)
          .map(item => ({
            ...item,
            props: {
              ...item.props,
              rowSpan: row.groupRowSpan,
            },
          })),
      )
    }

    if (row.countNumber === 1) {
      return <Table.Row {...p}>{newchildren}</Table.Row>
    }
    return (
      <Table.Row {...p} className={classes.subRow}>
        {newchildren}
      </Table.Row>
    )
  }

  let columns = DispenseItemsColumns
  if (viewOnly) {
    columns = columns.filter(c => c.name !== 'stock')
  }

  const commitChanges = ({ rows, changed }) => {
    if (changed) {
      const key = Object.keys(changed)[0]
      const editRow = rows.find(r => r.uid === key)
      let matchItems = []
      if (editRow.isDrugMixture) {
        matchItems = rows.filter(r => r.drugMixtureFK === editRow.drugMixtureFK)
      } else {
        matchItems = rows.filter(
          r => r.type === editRow.type && r.id === editRow.id,
        )
      }
      const balanceQty =
        editRow.quantity - _.sumBy(matchItems, r => r.dispenseQuantity || 0)
      matchItems.forEach(item => (item.stockBalance = balanceQty))
      updateSelectAll(rows)
      setFieldValue('dispenseItems', rows)
    }
  }

  const finalizeInvoice = () => {
    if (dispense && dispense.totalWithGST < 0) {
      window.g_app._store.dispatch({
        type: 'global/updateAppState',
        payload: {
          openConfirm: true,
          isInformType: true,
          customWidth: 'md',
          openConfirmContent: () => {
            return (
              <div>
                <Warining
                  style={{
                    width: '1.3rem',
                    height: '1.3rem',
                    marginLeft: '10px',
                    color: 'red',
                  }}
                />
                <h3
                  style={{
                    marginLeft: '10px',
                    display: 'inline-block',
                  }}
                >
                  Unable to finalize, total amount cannot be{' '}
                  <span style={{ fontWeight: 400 }}>negative</span>.
                </h3>
              </div>
            )
          },
          openConfirmText: 'OK',
          onConfirmClose: () => {
            window.g_app._store.dispatch({
              type: 'global/updateAppState',
              payload: {
                customWidth: undefined,
              },
            })
          },
        },
      })
    } else if (coPayerPayments.length > 0) {
      setShowRemovePayment(true)
    } else {
      onFinalizeClick()
    }
  }

  const onHandelFinalize = () => {
    finalizeInvoice()
  }

  const onDispenseItemsValueChange = (uid, valueField, value) => {
    const newItems = [...dispenseItems]
    const editRow = newItems.find(r => r.uid === uid)
    if (valueField === 'stockFK') {
      if (value) {
        editRow.stockFK = value.id
        editRow.batchNo = value.batchNo
        editRow.expiryDate = value.expiryDate
        editRow.isDefault = value.isDefault
        editRow.stock = value.stock
      } else {
        editRow.stockFK = undefined
        editRow.batchNo = undefined
        editRow.expiryDate = undefined
        editRow.isDefault = false
        editRow.stock = 0
        editRow.dispenseQuantity = 0
      }
    } else {
      editRow[valueField] = value
    }
    if (valueField === 'dispenseQuantity' || valueField === 'stockFK') {
      let matchItems = []
      if (editRow.isDrugMixture) {
        matchItems = newItems.filter(
          r => r.drugMixtureFK === editRow.drugMixtureFK,
        )
      } else {
        matchItems = newItems.filter(
          r => r.type === editRow.type && r.id === editRow.id,
        )
      }
      const balanceQty =
        editRow.quantity - _.sumBy(matchItems, r => r.dispenseQuantity || 0)
      matchItems.forEach(item => (item.stockBalance = balanceQty))
    }
    if (valueField === 'isCheckActualize') {
      if (editRow.isDrugMixture) {
        const drugMixtureIDs = newItems.filter(r => r.id === editRow.id)
        drugMixtureIDs.forEach(x => (x[valueField] = value))
      }
      updateSelectAll(newItems)
    }
    setFieldValue('dispenseItems', newItems)
  }

  const onServiceValueChange = (id, valueField, value) => {
    const newItems = [...service]
    const editRow = newItems.find(r => r.id === id)
    editRow[valueField] = value
    setFieldValue('service', newItems)
  }

  const getGroupDispenseItem = () => {
    const items = dispenseItems || []
    let newItem = []
    var groupId = _.uniqBy(items, 'dispenseGroupId')
    groupId.forEach(item => {
      newItem = newItem.concat({
        uid: item.dispenseGroupId,
        isGroup: true,
        groupName: item.isDrugMixture
          ? item.drugMixtureName
          : item.dispenseGroupId,
        groupNumber: 1,
        groupRowSpan: 1,
        countNumber: 1,
        rowspan: 1,
      })

      newItem = newItem.concat([
        ...items.filter(x => x.dispenseGroupId === item.dispenseGroupId),
      ])
    })

    return newItem
  }
  return (
    <React.Fragment>
      <GridContainer>
        <GridItem justify='flex-start' md={7} className={classes.actionButtons}>
          <div style={{ display: 'inline-block' }}>
            <span>
              <Popper
                open={popperOpen}
                style={{ marginTop: 10 }}
                placement='bottom-start'
                transition
                overlay={
                  <ClickAwayListener onClickAway={closePopper}>
                    <MenuList role='menu'>
                      <MenuItem>
                        <Button
                          color='primary'
                          size='sm'
                          style={{ width: 120 }}
                          onClick={() => {
                            onPrint({
                              type: CONSTANTS.PATIENT_LABEL,
                              undefined,
                              undefined,
                              undefined,
                              copies: patientLabelCopies,
                            })
                          }}
                          disabled={sendingJob}
                        >
                          Patient Label
                        </Button>
                        <InputNumber
                          size='small'
                          min={1}
                          max={10}
                          value={patientLabelCopies}
                          onChange={v => {
                            setPatientLabelCopies(v || 1)
                            console.log(v)
                          }}
                          className={classes.inputStyle}
                        />
                        <span className={classes.qtyFont}>&nbsp;Copies</span>
                      </MenuItem>
                    </MenuList>
                  </ClickAwayListener>
                }
              >
                <Button
                  color='primary'
                  onClick={openPopper}
                  size='sm'
                  style={{
                    height: 25,
                    marginTop:
                      orderCreateTime && invoice.finalizedDateTime ? -20 : 2,
                  }}
                >
                  <Print /> Label
                </Button>
              </Popper>
            </span>
            <span style={{ display: 'inline-block' }}>
              {orderCreateTime && (
                <span style={{ color: '#999999' }}>
                  Visit Doctor:
                  <span
                    style={{ fontWeight: 500 }}
                  >{` ${orderCreateBy}. `}</span>
                  <span style={{ color: '#999999' }}>
                    Order created at:
                    <span style={{ fontWeight: 500 }}>
                      {` ${orderCreateTime.format('DD MMM yyyy HH:mm')}`}.
                    </span>
                  </span>{' '}
                </span>
              )}
              {invoice.finalizedDateTime && (
                <div style={{ color: '#999999' }}>
                  Last Finalized by:
                  <span style={{ fontWeight: 500 }}>
                    {` ${invoice.finalizedBy} `}
                  </span>
                  <span style={{ color: '#999999' }}>
                    at:
                    <span style={{ fontWeight: 500 }}>
                      {` ${invoice.finalizedDateTime.format(
                        'DD MMM yyyy HH:mm',
                      )}`}
                      .
                    </span>
                  </span>{' '}
                </div>
              )}
            </span>
          </div>
        </GridItem>
        {!viewOnly && (
          <GridItem className={classes.rightActionButtons} md={5}>
            {(isRetailVisit || isBillFirstVisit) && (
              <ProgressButton
                color='danger'
                size='sm'
                icon={<Delete />}
                onClick={discardDispense}
                disabled={disableDiscard}
              >
                Discard
              </ProgressButton>
            )}
            {!isBillFirstVisit && (
              <Authorized authority='queue.dispense.savedispense'>
                <ProgressButton
                  color='success'
                  size='sm'
                  onClick={onSaveClick}
                  disabled={isIncludeExpiredItem}
                >
                  Save Dispense
                </ProgressButton>
              </Authorized>
            )}
            {isRetailVisit && (
              <ProgressButton
                color='primary'
                size='sm'
                icon={<Edit />}
                onClick={onEditOrderClick}
                disabled={!dispense.queryCodeTablesDone}
              >
                Add Order
              </ProgressButton>
            )}
            {!isRetailVisit && visitStatus !== VISIT_STATUS.PAUSED && (
              <Authorized authority='queue.dispense.editorder'>
                <ProgressButton
                  color='primary'
                  size='sm'
                  icon={<Edit />}
                  onClick={onEditOrderClick}
                >
                  Edit Order
                </ProgressButton>
              </Authorized>
            )}
            {visitStatus !== VISIT_STATUS.PAUSED && (
              <Authorized authority='queue.dispense.makepayment'>
                <ProgressButton
                  color='primary'
                  size='sm'
                  icon={<AttachMoney />}
                  disabled={isIncludeExpiredItem}
                  onClick={onHandelFinalize}
                >
                  Finalize
                </ProgressButton>
              </Authorized>
            )}
          </GridItem>
        )}
        <GridItem md={12}>
          <Paper className={classes.paper}>
            <div>
              <div className={classes.tableContainer}>
                <div>
                  <h5 style={{ display: 'inline-block' }}>Dispense Details</h5>
                </div>
                <div style={{ position: 'relative', overflowX: 'auto' }}>
                  <AntdTable
                    className={customtyles.table}
                    size='small'
                    bordered
                    pagination={false}
                    dataSource={getGroupDispenseItem()}
                    columns={DispenseItemsColumns1(
                      viewOnly,
                      onDispenseItemsValueChange,
                    )}
                  />
                </div>
              </div>
            </div>

            <div className={classes.tableContainer}>
              <div>
                <h5 style={{ display: 'inline-block' }}>Service</h5>
              </div>
              <div style={{ position: 'relative', overflowX: 'auto' }}>
                <AntdTable
                  className={customtyles.table}
                  size='small'
                  bordered
                  pagination={false}
                  dataSource={service || []}
                  columns={ServiceColumns1(
                    viewOnly,
                    onPrint,
                    dispatch,
                    history?.location?.query?.vid,
                    onServiceValueChange,
                  )}
                />
              </div>
            </div>

            <div className={classes.tableContainer}>
              <div>
                <h5>Other Orders</h5>
              </div>
              <div style={{ overflowX: 'auto' }}>
                <AntdTable
                  className={customtyles.table}
                  size='small'
                  bordered
                  pagination={false}
                  dataSource={otherOrder}
                  columns={OtherOrdersColumns1(onPrint)}
                />
              </div>
            </div>
          </Paper>
        </GridItem>
        <GridItem xs={7} md={7} style={{ marginTop: -14 }}>
          <TextField
            value={visitRemarks}
            disabled
            multiline
            label={formatMessage({
              id: 'reception.queue.visitRegistration.visitRemarks',
            })}
          />
          <VisitOrderTemplateIndicateString
            visitOrderTemplateDetails={
              dispense?.entity?.visitOrderTemplateDetails ||
              values?.visitOrderTemplateDetails
            }
          ></VisitOrderTemplateIndicateString>
        </GridItem>
        {!viewOnly && (
          <GridItem xs={5} md={5}>
            <div style={{ paddingRight: 90 }}>
              <AmountSummary
                isViewOnly={true}
                rows={invoiceItem}
                adjustments={invoiceAdjustment}
                config={{
                  isGSTInclusive: invoice.isGSTInclusive,
                  totalField: 'totalAfterItemAdjustment',
                  adjustedField: 'totalAfterOverallAdjustment',
                  gstField: 'totalAfterGST',
                  gstAmtField: 'gstAmount',
                  gstValue: invoice.gstValue,
                }}
                onValueChanged={updateInvoiceData}
              />
            </div>
          </GridItem>
        )}
      </GridContainer>
      <CommonModal
        title='Information'
        open={showRemovePayment}
        observe='DispenseDetails'
        onClose={() => {
          setShowRemovePayment(false)
        }}
      >
        <div
          style={{
            marginLeft: 20,
            marginRight: 20,
          }}
        >
          <GridContainer>
            <CommonTableGrid
              style={{
                marginBottom: 10,
              }}
              size='sm'
              rows={coPayerPayments}
              columns={[
                { name: 'payerName', title: 'Payer Name' },
                { name: 'paymentReceivedBy', title: 'Received By' },
                { name: 'receiptNo', title: 'Receipt No.' },
                { name: 'paymentReceivedDate', title: 'Payment Date' },
                { name: 'totalAmtPaid', title: 'Amount ($)' },
              ]}
              columnExtensions={[
                {
                  columnName: 'receiptNo',
                  width: 110,
                },
                {
                  columnName: 'totalAmtPaid',
                  type: 'number',
                  currency: true,
                  width: 110,
                },
                {
                  columnName: 'paymentReceivedDate',
                  type: 'date',
                  width: 110,
                },
              ]}
              FuncProps={{
                pager: false,
              }}
            />
            <TextField
              label='Void Reason'
              multiline
              rowsMax='5'
              value={voidReason}
              maxLegth={200}
              onChange={e => {
                setVoidReason(e.target.value)
              }}
            />

            <div>
              Note: There are existing payments with some co-payers, click
              "Void" to cancel all payments, or click "Skip" to remove co-payers
              & payments manually.
            </div>
          </GridContainer>
          <GridContainer
            style={{
              marginTop: 20,
              marginBottom: 20,
              display: 'flex',
              justifyContent: 'center',
            }}
          >
            <Button
              color='danger'
              icon={null}
              disabled={!voidReason}
              onClick={() => {
                onFinalizeClick(true, voidReason)
              }}
            >
              Void
            </Button>
            <Button
              color='primary'
              icon={null}
              onClick={() => {
                onFinalizeClick()
              }}
            >
              Skip
            </Button>
          </GridContainer>
        </div>
      </CommonModal>
    </React.Fragment>
  )
}

const _DispenseDetails = props => <DispenseDetails {...props}></DispenseDetails>

export default compose(
  withWebSocket(),
  withStyles(styles, { name: 'DispenseDetailsGrid' }),
  connect(
    ({
      codetable,
      visitRegistration,
      clinicSettings,
      dispense,
      patient,
      user,
    }) => ({
      codetable,
      clinicSettings,
      visitRegistration,
      servingPersons: dispense.servingPersons,
      patient: patient.entity || {},
      user,
    }),
  ),
)(_DispenseDetails)
