import React, { useState, useEffect } from 'react'
import { connect } from 'dva'
import { compose } from 'redux'
import _ from 'lodash'
import moment from 'moment'
// material ui
import { Paper, withStyles, Link } from '@material-ui/core'
import Print from '@material-ui/icons/Print'
import Refresh from '@material-ui/icons/Refresh'
import Edit from '@material-ui/icons/Edit'
import Delete from '@material-ui/icons/Delete'
import AttachMoney from '@material-ui/icons/AttachMoney'
import { formatMessage } from 'umi' // common component
import Warining from '@material-ui/icons/Error'
import { Table } from '@devexpress/dx-react-grid-material-ui'
import {
  Button,
  ProgressButton,
  GridItem,
  GridContainer,
  CommonTableGrid,
  TextField,
  CommonModal,
  NumberInput,
  notification,
} from '@/components'
import AmountSummary from '@/pages/Shared/AmountSummary'
import Authorized from '@/utils/Authorized'
import {
  VISIT_TYPE,
  NOTIFICATION_TYPE,
  NOTIFICATION_STATUS,
  NURSE_WORKITEM_STATUS,
} from '@/utils/constants'
import { sendNotification } from '@/utils/realtime'
// sub components
import TableData from './TableData'
import DrugLabelSelection from './DrugLabelSelection'
import NurseActualization from './NurseActualization'

// variables
import {
  DispenseItemsColumns,
  DispenseItemsColumnExtensions,
  ServiceColumns,
  OtherOrdersColumns,
  OtherOrdersColumnExtensions,
  PackageColumns,
  PackageColumnExtensions,
  actualizeTableConfig,
  getRowId,
  isActualizable,
} from '../variables'

import CONSTANTS from './constants'
import { ServePatientButton } from '@/components/_medisys'

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
    margin: '3px 0px',
  }
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
  dispense,
  history,
  onDrugLabelClick,
  showDrugLabelSelection,
  onDrugLabelSelectionClose,
  onDrugLabelSelected,
  onDrugLabelNoChanged,
  selectedDrugs,
  clinicSettings,
  servingPersons = [],
  visit,
  doctorprofile = [],
  patient,
  user,
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
  } = values || {
    invoice: { invoiceItem: [] },
  }
  const {
    invoiceItem = [],
    invoiceAdjustment = [],
    totalPayment,
    coPayer = [],
  } = invoice

  const { inventorymedication, inventoryvaccination } = codetable
  const { settings = {} } = clinicSettings
  const currentDoc = doctorprofile.filter(
    x => x.id === visit.doctorProfileFK,
  )
  const docInfo =
    currentDoc && currentDoc.length > 0
      ? currentDoc[0].clinicianProfile
      : {}

  const discardCallback = r => {
    if (r) {
      const userProfile = user.data.clinicianProfile
      const userName = `${userProfile.title && userProfile.title.trim().length
        ? `${userProfile.title}. ${userProfile.name || ''}`
        : `${userProfile.name || ''}`
        }`
      const message = `${userName} discard prescription at ${moment().format(
        'HH:mm',
      )}`
      sendNotification('PharmacyOrderDiscard', {
        type: NOTIFICATION_TYPE.CONSULTAION,
        status: NOTIFICATION_STATUS.OK,
        message,
        visitID: values.id,
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
      outstandingBalance:
        v.summary.totalWithGST - values.invoice.totalPayment,
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
          if (item.totalAfterGST !== payerItem.payableBalance) {
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
  const isBillFirstVisit = visitPurposeFK === VISIT_TYPE.BF
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
    const data = packageItem.filter(
      item => item.packageGlobalId === row.value,
    )
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

  const [
    selectedDispenseItemsRows,
    setSelectedDispenseItemsRows,
  ] = useState([])
  const [selectedServiceRows, setSelectedServiceRows] = useState([])
  const [selectedActualizeRows, setSelectedActualizeRows] = useState([])
  const [showActualization, setShowActualization] = useState(false)
  const [actualizationStatus, setActualizationStatus] = useState(-1)

  const handleReloadClick = () => {
    setSelectedDispenseItemsRows([])
    setSelectedServiceRows([])
    setSelectedActualizeRows([])
    setShowActualization(false)
    setActualizationStatus(-1)
    onReloadClick()
  }

  const isShowActualizeSelection = (records = []) => {
    let actualizeOrderItemsRight = Authorized.check(
      'dispense.actualizeorderitems',
    )
    let viewable =
      actualizeOrderItemsRight &&
      actualizeOrderItemsRight.rights !== 'hidden'
    return viewable && records.filter(x => isActualizable(x)).length > 0
  }

  const handleSelectionChange = (type, value) => {
    switch (type) {
      case 'DispenseItems':
        setSelectedDispenseItemsRows(value)
        break
      case 'Service':
        setSelectedServiceRows(value)
        break
    }
  }

  const onActualizeBtnClick = (row, status) => {
    setSelectedActualizeRows([row])
    setActualizationStatus(status)
    setShowActualization(true)
  }

  const handleMultiActualizationClick = type => {
    let selectedRows = []
    let records = []
    switch (type) {
      case 'DispenseItems':
        selectedRows = dispenseItems.filter(x => x.isCheckActualize)
        records = dispenseItems
        break
      case 'Service':
        selectedRows = selectedServiceRows
        records = service
        break
    }
    if (selectedRows.length > 0) {
      let selectedRecords = []
      if (type === 'DispenseItems') {
        selectedRecords = records.filter(x => x.isCheckActualize)
      }
      else {
        selectedRecords = records.filter(
          x => selectedRows.indexOf(getRowId(x, type)) > -1,
        )
      }
      setSelectedActualizeRows(selectedRecords)
      setActualizationStatus(NURSE_WORKITEM_STATUS.NEW)
      setShowActualization(true)
    } else {
      notification.error({
        message: 'Please select at least one order item to actualize.',
      })
    }
  }

  const actualizeSelectedItemButton = (type, records = []) => {
    if (records.filter(x => isActualizable(x)).length > 0) {
      return (
        <Authorized authority='dispense.actualizeorderitems'>
          <Link
            component='button'
            style={{ marginLeft: 10, textDecoration: 'underline' }}
            onClick={() => {
              handleMultiActualizationClick(type)
            }}
          >
            Actualize Selected Item
          </Link>
        </Authorized>
      )
    }
    return null
  }

  const onNurseActualizationClose = () => {
    setShowActualization(false)
  }

  const { labelPrinterSize } = settings
  const showDrugLabelRemark = labelPrinterSize === '5.4cmx8.2cm'

  const isShowDispenseActualie = isShowActualizeSelection(dispenseItems)
  const orderItemRow = p => {
    const { row, children, tableRow } = p
    let newchildren = []

    const startColIndex = isShowDispenseActualie ? 7 : 6
    const endColIndex = isShowDispenseActualie ? 12 : 11
    const batchColumns = children.slice(startColIndex, endColIndex)

    if (row.countNumber === 1) {
      newchildren.push(
        children
          .filter((value, index) => index < startColIndex)
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
          .filter((value, index) => index > endColIndex - 1)
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

    if (row.countNumber === 1) {
      return <Table.Row {...p}>{newchildren}</Table.Row>
    }
    return (
      <Table.Row {...p} className={classes.subRow}>
        {newchildren}
      </Table.Row>
    )
  }

  return (
    <React.Fragment>
      <GridContainer>
        <GridItem
          justify='flex-start'
          md={7}
          className={classes.actionButtons}
        >
          {!viewOnly && !isRetailVisit && (
            <Button
              color='info'
              size='sm'
              onClick={handleReloadClick}
              disabled={disableRefreshOrder}
            >
              <Refresh />
              Refresh Order
            </Button>
          )}
          <Button
            color='primary'
            size='sm'
            onClick={onDrugLabelClick}
            disabled={sendingJob}
          >
            {sendingJob ? <Refresh className='spin-custom' /> : <Print />}
            Drug Label
          </Button>
          <Button
            color='primary'
            size='sm'
            onClick={() => {
              onPrint({ type: CONSTANTS.PATIENT_LABEL })
            }}
            disabled={sendingJob}
          >
            {sendingJob ? <Refresh className='spin-custom' /> : <Print />}
            Patient Label
          </Button>
          {visit.orderCreateTime && (
            <span style={{ color: '#999999' }}>
              Order created by{' '}
              <span style={{ fontWeight: 500 }}>
                {`${docInfo.title ? `${docInfo.title}.` : null}${docInfo.name
                  }`}{' '}
                at {visit.orderCreateTime.format('DD MMM yyyy HH:mm')}
              </span>{' '}
            </span>
          )}
          {servingPersons.length > 0 && (
            <span>
              Served by{' '}
              <span style={{ fontWeight: 500 }}>{`${servingPersons
                .map(x => x.servingBy)
                .join(', ')}.`}</span>
            </span>
          )}
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
            {!isRetailVisit && (
              <Authorized authority='queue.servepatient'>
                <ServePatientButton
                  patientName={patient.name}
                  justIcon={false}
                  servingPersons={servingPersons}
                  onConfirm={() => {
                    dispatch({
                      type: 'dispense/setServingPerson',
                      payload: { visitFK: visit.id },
                    })
                  }}
                />
              </Authorized>
            )}
            {!isRetailVisit && (
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
            <Authorized authority='queue.dispense.makepayment'>
              <ProgressButton
                color='primary'
                size='sm'
                icon={<AttachMoney />}
                onClick={() => {
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
                                <span style={{ fontWeight: 400 }}>
                                  negative
                                </span>
                                .
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
                }}
              >
                Finalize
              </ProgressButton>
            </Authorized>
          </GridItem>
        )}
        <GridItem md={12}>
          <Paper className={classes.paper}>
            <TableData
              title='Dispense Details'
              titleExtend={actualizeSelectedItemButton(
                'DispenseItems',
                dispenseItems,
              )}
              FuncProps={{
                pager: false,
                grouping: true,
                groupingConfig: {
                  state: {
                    grouping: [{ columnName: 'dispenseGroupId' }],
                    expandedGroups: defaultExpandedGroups,
                  },
                  row: {
                    indentColumnWidth: 0,
                    iconComponent: icon => <span></span>,
                    contentComponent: group => {
                      const { row } = group
                      const groupRow = dispenseItems.find(
                        data => data.dispenseGroupId === row.value,
                      )
                      if (row.value === 'NormalDispense')
                        return (
                          <div className={classes.groupStyle}>
                            <span style={{ fontWeight: 600 }}>Normal Dispense Items</span>
                          </div>
                        )
                      if (row.value === 'NoNeedToDispense')
                        return (
                          <div className={classes.groupStyle}><span style={{ fontWeight: 600 }}>
                            No Need To Dispense Items
                          </span>
                          </div>
                        )
                      return (
                        <div className={classes.groupStyle}>
                          <span style={{ fontWeight: 600 }}>
                            {'Drug Mixture: '}
                          </span>
                          {groupRow.drugMixtureName}
                        </div>
                      )
                    },
                  },
                },
              }}
              forceRender
              columns={isShowDispenseActualie ? DispenseItemsColumns : DispenseItemsColumns.filter(c => c.name !== 'isCheckActualize')}
              colExtensions={DispenseItemsColumnExtensions(
                viewOnly,
                onPrint,
                onActualizeBtnClick,
                showDrugLabelRemark,
              )}
              data={dispenseItems}
              TableProps={{
                rowComponent: orderItemRow,
              }}
              getRowId={r => r.uid}
            />

            <TableData
              title='Service'
              titleExtend={actualizeSelectedItemButton(
                'Service',
                service,
              )}
              selection={selectedServiceRows}
              onSelectionChange={value => {
                handleSelectionChange('Service', value)
              }}
              {...actualizeTableConfig(isShowActualizeSelection(service))}
              idPrefix='Service'
              columns={ServiceColumns}
              colExtensions={OtherOrdersColumnExtensions(
                viewOnly,
                onPrint,
                onActualizeBtnClick,
              )}
              data={service}
            />

            <TableData
              title='Other Orders'
              idPrefix='OtherOrders'
              columns={OtherOrdersColumns}
              colExtensions={OtherOrdersColumnExtensions(
                viewOnly,
                onPrint,
                onActualizeBtnClick,
              )}
              data={otherOrder}
            />

            {settings.isEnablePackage && visitPurposeFK !== VISIT_TYPE.OTC && (
              <TableData
                title='Package'
                idPrefix='package'
                columns={PackageColumns}
                colExtensions={PackageColumnExtensions(
                  onPrint,
                  showDrugLabelRemark,
                )}
                data={packageItem}
                FuncProps={{
                  pager: false,
                  grouping: true,
                  groupingConfig: {
                    state: {
                      grouping: [{ columnName: 'packageGlobalId' }],
                      expandedGroups: [...expandedGroups],
                      onExpandedGroupsChange: handleExpandedGroupsChange,
                    },
                    row: {
                      contentComponent: packageGroupCellContent,
                    },
                  },
                }}
              />
            )}
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
        </GridItem>
        {!viewOnly && (
          <GridItem xs={5} md={5}>
            <div style={{ paddingRight: 90 }}>
              <AmountSummary
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
        title='Print Drug Labels'
        open={showDrugLabelSelection}
        observe='DispenseDetails'
        onClose={() => {
          onDrugLabelSelectionClose()
        }}
      >
        <DrugLabelSelection
          prescription={selectedDrugs}
          codetable={codetable}
          handleDrugLabelSelected={onDrugLabelSelected}
          handleDrugLabelNoChanged={onDrugLabelNoChanged}
          handleSubmit={() => {
            onDrugLabelSelectionClose()
            onPrint({ type: CONSTANTS.ALL_DRUG_LABEL })
          }}
        />
      </CommonModal>
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
              "Void" to cancel all payments, or click "Skip" to remove
              co-payers & payments manually.
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
              void
            </Button>
            <Button
              color='primary'
              icon={null}
              onClick={() => {
                onFinalizeClick()
              }}
            >
              skip
            </Button>
          </GridContainer>
        </div>
      </CommonModal>
      <CommonModal
        maxWidth='xl'
        title='Actualization'
        open={showActualization}
        observe='DispenseDetails'
        onClose={onNurseActualizationClose}
      >
        <NurseActualization
          status={actualizationStatus}
          nurseWorkitemIds={selectedActualizeRows
            .map(x => x.workitem?.nurseWorkitem?.id)
            .filter(x => x)
            .join(',')}
          dispatch={dispatch}
          handleSubmit={() => {
            onNurseActualizationClose()
            const version = Date.now()
            dispatch({
              type: 'dispense/query',
              payload: {
                id: values.id,
                version: version,
              },
            }).then(r => {
              dispatch({
                type: 'dispense/updateState',
                payload: {
                  entity: r,
                  version: version,
                },
              })
            })
          }}
        />
      </CommonModal>
    </React.Fragment>
  )
}

export default compose(
  withStyles(styles, { name: 'DispenseDetailsGrid' }),
  connect(
    ({
      codetable,
      clinicSettings,
      dispense,
      visitRegistration,
      patient,
      user,
    }) => ({
      codetable,
      clinicSettings,
      servingPersons: dispense.servingPersons,
      visit: visitRegistration?.entity?.visit || {},
      doctorprofile: codetable.doctorprofile || [],
      patient: patient.entity || {},
      user,
    }),
  ),
)(DispenseDetails)
