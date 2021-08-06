import React, { useState, useEffect } from 'react'
import { connect } from 'dva'
import { compose } from 'redux'
import _ from 'lodash'
// material ui
import { Paper, withStyles, Link } from '@material-ui/core'
import Print from '@material-ui/icons/Print'
import Refresh from '@material-ui/icons/Refresh'
import Edit from '@material-ui/icons/Edit'
import Delete from '@material-ui/icons/Delete'
import AttachMoney from '@material-ui/icons/AttachMoney'
import { formatMessage } from 'umi' // common component
import Warining from '@material-ui/icons/Error'
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
import VaccinationGrid from './VaccinationGrid'
import DrugLabelSelection from './DrugLabelSelection'
import NurseActualization from './NurseActualization'

// variables
import {
  PrescriptionColumns,
  PrescriptionColumnExtensions,
  VaccinationColumn,
  VaccinationColumnExtensions,
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
  servingPersons=[],
  visit,
  doctorprofile=[],
  patient,
}) => {
  const {
    prescription,
    vaccination,
    otherOrder,
    packageItem,
    invoice,
    visitPurposeFK,
    visitRemarks,
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
  const { settings = [] } = clinicSettings
  const currentDoc = doctorprofile.filter(x=>x.id === visit.doctorProfileFK)
  const docInfo = currentDoc && currentDoc.length > 0 ? currentDoc[0].clinicianProfile : {}

  const handleSelectedBatch = (e, op = {}, row) => {
    if (op && op.length > 0) {
      const { expiryDate } = op[0]
      setFieldValue(`prescription[${row.rowIndex}]expiryDate`, expiryDate)
    } else {
      setFieldValue(`prescription[${row.rowIndex}]expiryDate`, undefined)
    }
  }

  const handleSelectVaccinationBatch = (e, op = {}, row) => {
    if (op && op.length > 0) {
      const { expiryDate } = op[0]
      setFieldValue(`vaccination[${row.rowIndex}]expiryDate`, expiryDate)
    } else {
      setFieldValue(`vaccination[${row.rowIndex}]expiryDate`, undefined)
    }
  }

  const discardCallback = r => {
    if (r) {
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
          visitPurposeFK === VISIT_TYPE.RETAIL
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

  const isRetailVisit = visitPurposeFK === VISIT_TYPE.RETAIL
  const isBillFirstVisit = visitPurposeFK === VISIT_TYPE.BILL_FIRST
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

  const [selectedPrescriptionRows, setSelectedPrescriptionRows] = useState([])
  const [selectedVaccinationRows, setSelectedVaccinationRows] = useState([])
  const [selectedOtherOrderRows, setSelectedOtherOrderRows] = useState([])
  const [selectedActualizeRows, setSelectedActualizeRows] = useState([])
  const [showActualization, setShowActualization] = useState(false)
  const [actualizationStatus, setActualizationStatus] = useState(-1)

  const isShowActualizeSelection = (records = []) => {
    let actualizeOrderItemsRight = Authorized.check('dispense.actualizeorderitems')
    let viewable = actualizeOrderItemsRight && actualizeOrderItemsRight.right !== 'hidden'

    return viewable && records.filter(x => isActualizable(x)).length > 0
  }

  const handleSelectionChange = (type, value) => {
    switch (type) {
      case 'Prescription':
        setSelectedPrescriptionRows(value)
        break
      case 'Vaccination':
        setSelectedVaccinationRows(value)
        break
      case 'OtherOrders':
        setSelectedOtherOrderRows(value)
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
      case 'Prescription':
        selectedRows = selectedPrescriptionRows
        records = prescription
        break
      case 'Vaccination':
        selectedRows = selectedVaccinationRows
        records = vaccination
        break
      case 'OtherOrders':
        selectedRows = selectedOtherOrderRows
        records = otherOrder
        break
    }
    if (selectedRows.length > 0) {
      let selectedRecords = records.filter(
        x => selectedRows.indexOf(getRowId(x, type)) > -1,
      )
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

  return (
    <React.Fragment>
      <GridContainer>
        <GridItem justify='flex-start' md={7} className={classes.actionButtons}>
          {!viewOnly && !isRetailVisit && (
            <Button
              color='info'
              size='sm'
              onClick={onReloadClick}
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
          {visit.orderCreateTime && (<span style={{color:'#999999'}}>Order created by <span style={{fontWeight:500}}>{`${docInfo.title ? `${docInfo.title}.` : null}${docInfo.name}`} at {visit.orderCreateTime.format('DD MMM yyyy HH:mm')}</span> </span>)}
          {servingPersons.length > 0 && (<span>Served by <span style={{fontWeight:500}}>{`${servingPersons.map(x=>x.servingBy).join(', ')}.`}</span></span>)}
        </GridItem>
        {!viewOnly && (
          <GridItem className={classes.rightActionButtons} md={5}>
            {/* isBillFirstVisit && (
              <div
                style={{
                  marginRight: 8,
                  marginTop: 8,
                  display: 'inline-block',
                  color: dangerColor,
                }}
              >
                <SizeContainer size='lg'>
                  <AddAlert />
                </SizeContainer>
              </div>
            ) */}
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
                <ProgressButton color='success' size='sm' onClick={onSaveClick}>
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
                    patientName={patient.callingName}
                    justIcon={false}
                    servingPersons={servingPersons}
                    onConfirm={()=>{
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
              title='Prescription'
              titleExtend={actualizeSelectedItemButton('Prescription',prescription)}
              selection={selectedPrescriptionRows}
              onSelectionChange={(value)=>{ handleSelectionChange('Prescription',value) }}
              {...actualizeTableConfig(isShowActualizeSelection(prescription))}
              idPrefix='Prescription'
              forceRender
              columns={PrescriptionColumns}
              colExtensions={PrescriptionColumnExtensions(
                viewOnly,
                onPrint,
                inventorymedication,
                handleSelectedBatch,
                onActualizeBtnClick,
              )}
              data={prescription}
            />
            <VaccinationGrid
              title='Vaccination'
              titleExtend={actualizeSelectedItemButton('Vaccination',vaccination)}
              selection={selectedVaccinationRows}
              onSelectionChange={(value)=>{ handleSelectionChange('Vaccination',value) }}
              {...actualizeTableConfig(isShowActualizeSelection(vaccination))}
              idPrefix='Vaccination'
              columns={VaccinationColumn}
              colExtensions={VaccinationColumnExtensions(
                viewOnly,
                inventoryvaccination,
                handleSelectVaccinationBatch,
                onActualizeBtnClick,
              )}
              data={vaccination}
              visitPurposeFK={visitPurposeFK}
            />

            <TableData
              title='Other Orders'
              titleExtend={actualizeSelectedItemButton('OtherOrders',otherOrder)}
              selection={selectedOtherOrderRows}
              onSelectionChange={(value)=>{ handleSelectionChange('OtherOrders',value) }}
              {...actualizeTableConfig(isShowActualizeSelection(otherOrder))}
              idPrefix='OtherOrders'
              columns={OtherOrdersColumns}
              colExtensions={OtherOrdersColumnExtensions(viewOnly, onPrint, onActualizeBtnClick)}
              data={otherOrder}
            />

            {settings.isEnablePackage && visitPurposeFK !== VISIT_TYPE.RETAIL && (
              <TableData
                title='Package'
                idPrefix='package'
                columns={PackageColumns}
                colExtensions={PackageColumnExtensions(onPrint)}
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
          nurseWorkitemIds={selectedActualizeRows.map(x => x.workitem?.nurseWorkitem?.id).join(',')}
          dispatch={dispatch}
          handleSubmit={()=>{
            onNurseActualizationClose()
            const version = Date.now()
            dispatch({
              type: 'dispense/query',
              payload: {
                id: values.id,
                version: version,
              },
            }).then((r)=>{
              console.log('query dispense',r)
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
  connect(({ codetable, clinicSettings, dispense, visitRegistration, patient }) => ({
    codetable,
    clinicSettings,
    servingPersons: dispense.servingPersons,
    visit: visitRegistration?.entity?.visit || {},
    doctorprofile: codetable.doctorprofile || [],
    patient: patient.entity || {},
  })),
)(DispenseDetails)
