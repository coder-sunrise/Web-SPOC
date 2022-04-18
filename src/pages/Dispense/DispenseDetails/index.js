import React, { useState, useEffect, useContext } from 'react'
import { connect } from 'dva'
import { compose } from 'redux'
import _ from 'lodash'
import moment from 'moment'
// material ui
import Print from '@material-ui/icons/Print'
import Refresh from '@material-ui/icons/Refresh'
import Edit from '@material-ui/icons/Edit'
import { InputNumber } from 'antd'
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
  Checkbox,
} from '@/components'
import AmountSummary from '@/pages/Shared/AmountSummary'
import Authorized from '@/utils/Authorized'
import {
  VISIT_TYPE,
  NOTIFICATION_TYPE,
  NOTIFICATION_STATUS,
  NURSE_WORKITEM_STATUS,
  RADIOLOGY_WORKITEM_STATUS,
  DISPENSE_FROM,
} from '@/utils/constants'
import { sendNotification } from '@/utils/realtime'
import { VISIT_STATUS } from '@/pages/Reception/Queue/variables'
import { hasValue } from '@/pages/Widgets/PatientHistory/config'
// sub components
import TableData from './TableData'
import DrugLabelSelection from './DrugLabelSelection'
import NurseActualization from './NurseActualization'
import VisitOrderTemplateIndicateString from '@/pages/Widgets/Orders/VisitOrderTemplateIndicateString'

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
import RadiologyDetails from '@/pages/Radiology/Worklist/Details'
import WorklistContext, {
  WorklistContextProvider,
} from '@/pages/Radiology/Worklist/WorklistContext'
import DispenseDetailsSpecimenCollection from '@/pages/Lab/SpecimenCollection/components/DispenseDetailsSpecimenCollection'

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
  handlePrint,
  history,
  onDrugLabelClick,
  showDrugLabelSelection,
  onDrugLabelSelectionClose,
  selectedDrugs,
  currentDrugToPrint,
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
  const isFromMedicalCheckup = openFrom === DISPENSE_FROM.MEDICALCHECKUP
  const [popperOpen, setPopperOpen] = useState(false)
  const [patientLabelCopies, setPatientLabelCopies] = useState(1)
  const [labLabelCopies, setLabLabelCopies] = useState(1)
  const openPopper = () => setPopperOpen(true)
  const closePopper = () => setPopperOpen(false)
  const [selectedAll, setSelectedAll] = useState(false)

  const { inventorymedication, inventoryvaccination } = codetable
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
  const [selectedActualizeRows, setSelectedActualizeRows] = useState([])
  const [showActualization, setShowActualization] = useState(false)
  const [actualizationStatus, setActualizationStatus] = useState(-1)

  const handleReloadClick = () => {
    setSelectedServiceRows([])
    setSelectedActualizeRows([])
    setShowActualization(false)
    setActualizationStatus(-1)
    onReloadClick()
  }

  const isShowActualizeSelection = (records = []) => {
    if (viewOnly) {
      return false
    }
    let actualizeOrderItemsRight = Authorized.check(
      'dispense.actualizeorderitems',
    )
    let viewable =
      actualizeOrderItemsRight && actualizeOrderItemsRight.rights !== 'hidden'
    return viewable && records.filter(x => isActualizable(x)).length > 0
  }

  const handleSelectionChange = (type, value) => {
    switch (type) {
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

  const { detailsId, setDetailsId } = useContext(WorklistContext)
  const onRadiologyBtnClick = radiologyWorkitemID => {
    setDetailsId(radiologyWorkitemID, true)
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
        selectedRecords = [
          ...records.filter(x => x.isCheckActualize && !x.isDrugMixture),
          ..._.uniqBy(
            records.filter(x => x.isCheckActualize && x.isDrugMixture),
            'id',
          ),
        ]
      } else {
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
  const showDrugLabelRemark = labelPrinterSize === '8.0cmx4.5cm_V2'

  const isShowDispenseActualie =
    !viewOnly && isShowActualizeSelection(dispenseItems)
  const orderItemRow = p => {
    const { row, children, tableRow } = p
    let newchildren = []

    const startColIndex = isShowDispenseActualie ? 7 : 6
    let endColIndex = isShowDispenseActualie ? 11 : 10
    if (viewOnly) {
      endColIndex = endColIndex - 1
    }
    const batchColumns = children.slice(startColIndex, endColIndex)

    if (row.groupNumber === 1) {
      newchildren.push(
        children
          .filter((value, index) => index < (isShowDispenseActualie ? 3 : 2))
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
          .filter(
            (value, index) =>
              index < startColIndex && index > (isShowDispenseActualie ? 2 : 1),
          )
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
  if (!isShowDispenseActualie || viewOnly) {
    columns = columns.filter(c => c.name !== 'isCheckActualize')
  }
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
        editRow.quantity - _.sumBy(matchItems, 'dispenseQuantity')
      matchItems.forEach(item => (item.stockBalance = balanceQty))
      updateSelectAll(rows)
      setFieldValue('dispenseItems', rows)
    }
  }
  const printDrugLabel = () => {
    setPopperOpen(false)
    onDrugLabelClick()
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
      if (
        (dispense.entity?.visitPurposeFK !== VISIT_TYPE.MC ||
          dispense.entity?.isForInvoiceReplacement) &&
        (dispenseItems?.filter(x => isActualizable(x)).length > 0 ||
          service?.filter(x => isActualizable(x)).length > 0)
      )
        notification.error({
          message: 'Actualize all nursing work items before finalize.',
        })
      else onFinalizeClick()
    }
  }

  const existsCanceledRadiology = () => {
    const { entity = {} } = dispense
    const { service = [] } = entity
    if (
      service.find(s => {
        const { workitem = {} } = s
        const { radiologyWorkitem = {} } = workitem
        return (
          radiologyWorkitem.statusFK === RADIOLOGY_WORKITEM_STATUS.CANCELLED
        )
      })
    ) {
      return true
    }
    return false
  }

  const isMandatoryWaistCircumference = () => {
    const { entity = {} } = visitRegistration
    const { visit = {} } = entity
    const {
      visitPurposeFK,
      visitBasicExaminations = [],
      corBasicExaminations = [],
    } = visit
    if (
      visitPurposeFK === VISIT_TYPE.MC &&
      !dispense.entity?.isForInvoiceReplacement
    ) {
      const basicExamination = corBasicExaminations.length
        ? corBasicExaminations
        : visitBasicExaminations
      if (
        !basicExamination[0].isChild &&
        !basicExamination[0].isPregnancy &&
        !hasValue(basicExamination[0].waistCircumference)
      ) {
        return true
      }
    }
    return false
  }

  const onHandelFinalize = () => {
    if (isMandatoryWaistCircumference()) {
      dispatch({
        type: 'global/updateAppState',
        payload: {
          openConfirm: true,
          isInformType: true,
          openConfirmContent:
            'Please fill in Waist Circumference before finalize.',
          openConfirmText: 'OK',
        },
      })
      return
    }
    if (existsCanceledRadiology()) {
      dispatch({
        type: 'global/updateAppState',
        payload: {
          openConfirm: true,
          openConfirmContent: 'Confirm to finalize with cancelled item?',
          onConfirmSave: finalizeInvoice,
          openConfirmText: 'Yes',
          cancelText: 'No',
        },
      })
    } else {
      finalizeInvoice()
    }
  }
  const onChangeSelectAll = value => {
    let newItems = [...dispenseItems]
    newItems.forEach(item => {
      if (isActualizable(item) && item.isCheckActualize !== value) {
        item.isCheckActualize = value
      }
    })
    setFieldValue('dispenseItems', newItems)
  }

  const updateSelectAll = newItems => {
    var enableItems = newItems.filter(item => isActualizable(item))
    if (
      enableItems.filter(item => item.isCheckActualize).length ===
      enableItems.length
    ) {
      if (!selectedAll) {
        setSelectedAll(true)
      }
    } else {
      if (selectedAll) {
        setSelectedAll(false)
      }
    }
  }

  const hasAnyLabWorkitems = (() => {
    if (!service) return false

    return (
      service.filter(
        svc =>
          svc.workitem &&
          svc.workitem.labWorkitems &&
          svc.workitem.labWorkitems.length > 0,
      ).length > 0
    )
  })()
  return (
    <React.Fragment>
      <GridContainer>
        <GridItem justify='flex-start' md={7} className={classes.actionButtons}>
          <div style={{ display: 'inline-block' }}>
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
                    <MenuItem>
                      <Button
                        color='primary'
                        size='sm'
                        style={{ width: 120 }}
                        onClick={() => {
                          onPrint({
                            type: CONSTANTS.LAB_LABEL,
                            undefined,
                            undefined,
                            undefined,
                            copies: labLabelCopies,
                          })
                        }}
                        disabled={sendingJob}
                      >
                        Lab Label
                      </Button>
                      <InputNumber
                        size='small'
                        min={1}
                        max={10}
                        value={labLabelCopies}
                        onChange={v => {
                          setLabLabelCopies(v || 1)
                          console.log(v)
                        }}
                        className={classes.inputStyle}
                      />
                      <span className={classes.qtyFont}>&nbsp;Copies</span>
                    </MenuItem>
                    <MenuItem>
                      <Button
                        color='primary'
                        size='sm'
                        onClick={printDrugLabel}
                        disabled={sendingJob}
                        style={{ width: 120 }}
                      >
                        Drug Label
                      </Button>
                    </MenuItem>
                  </MenuList>
                </ClickAwayListener>
              }
            >
              <Button
                color='primary'
                onClick={openPopper}
                size='sm'
                style={{ height: 25, marginTop: 2 }}
              >
                <Print /> Label
              </Button>
            </Popper>
          </div>
          {orderCreateTime && (
            <span style={{ color: '#999999' }}>
              Order created by
              <span style={{ fontWeight: 500 }}>
                {` ${orderCreateBy} `}
                at {orderCreateTime.format('DD MMM yyyy HH:mm')}
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
            {!isFromMedicalCheckup && (isRetailVisit || isBillFirstVisit) && (
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
            {!isFromMedicalCheckup && !isBillFirstVisit && (
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
            {
              <Authorized authority='queue.servepatient'>
                <ServePatientButton
                  patientName={patient.name}
                  justIcon={false}
                  servingPersons={servingPersons}
                  onConfirm={() => {
                    dispatch({
                      type: 'dispense/setServingPerson',
                      payload: { visitFK: values?.id },
                    })
                  }}
                />
              </Authorized>
            }
            {!isFromMedicalCheckup &&
              !isRetailVisit &&
              visitStatus !== VISIT_STATUS.PAUSED && (
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
            {!isFromMedicalCheckup && visitStatus !== VISIT_STATUS.PAUSED && (
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
            <div style={{ position: 'relative' }}>
              <div style={{ position: 'absolute', left: 26, top: 40 }}>
                {isShowDispenseActualie && !viewOnly && (
                  <Checkbox
                    checked={selectedAll}
                    onChange={e => {
                      setSelectedAll(e.target.value)
                      onChangeSelectAll(e.target.value)
                    }}
                  />
                )}
              </div>
              <TableData
                oddEven={false}
                title='Dispense Details'
                titleExtend={
                  viewOnly
                    ? null
                    : actualizeSelectedItemButton(
                        'DispenseItems',
                        dispenseItems,
                      )
                }
                EditingProps={{
                  showCommandColumn: false,
                  onCommitChanges: commitChanges,
                }}
                FuncProps={{
                  pager: false,
                  grouping: true,
                  groupingConfig: {
                    isDisableExpandedGroups: true,
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
                              <span style={{ fontWeight: 600 }}>
                                Normal Dispense Items
                              </span>
                            </div>
                          )
                        if (row.value === 'NoNeedToDispense')
                          return (
                            <div className={classes.groupStyle}>
                              <span style={{ fontWeight: 600 }}>
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
                    backgroundColor: 'rgb(240, 248, 255)',
                  },
                }}
                forceRender
                columns={columns}
                colExtensions={DispenseItemsColumnExtensions(
                  viewOnly,
                  onDrugLabelClick,
                  onActualizeBtnClick,
                  showDrugLabelRemark,
                  isFromMedicalCheckup,
                )}
                data={dispenseItems}
                TableProps={{
                  rowComponent: orderItemRow,
                }}
                getRowId={r => r.uid}
              />
            </div>

            <TableData
              title='Service'
              forceRender
              oddEven={false}
              titleExtend={
                viewOnly
                  ? null
                  : actualizeSelectedItemButton('Service', service)
              }
              selection={selectedServiceRows}
              onSelectionChange={value => {
                handleSelectionChange('Service', value)
              }}
              {...actualizeTableConfig(
                !viewOnly && isShowActualizeSelection(service),
              )}
              idPrefix='Service'
              columns={ServiceColumns}
              colExtensions={OtherOrdersColumnExtensions(
                viewOnly,
                onPrint,
                onActualizeBtnClick,
                onRadiologyBtnClick,
                dispatch,
                history?.location?.query?.vid,
              )}
              data={service}
            />

            {(hasAnySpecimenCollected || hasAnyLabWorkitems) && (
              <DispenseDetailsSpecimenCollection
                handlePrint={handlePrint}
                patient={patient}
                visitId={visitId}
              />
            )}

            <TableData
              oddEven={false}
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
                oddEven={false}
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
        maxWidth='sm'
        title='Print Drug Labels'
        open={showDrugLabelSelection}
        observe='DispenseDetails'
        onClose={() => {
          onDrugLabelSelectionClose()
        }}
      >
        <DrugLabelSelection
          handlePrint={handlePrint}
          values={values}
          currentDrugToPrint={currentDrugToPrint}
          dispatch={dispatch}
          patient={patient}
          source='dispense'
          visitid={values?.id}
          handleSubmit={() => {
            onDrugLabelSelectionClose()
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
            })
          }}
        />
      </CommonModal>
      <RadiologyDetails />
    </React.Fragment>
  )
}

const _DispenseDetails = props => (
  <WorklistContextProvider>
    <DispenseDetails {...props}></DispenseDetails>
  </WorklistContextProvider>
)

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
