import React, { useState, useContext } from 'react'
import { connect } from 'dva'
import { Typography, Alert, Select } from 'antd'
import { compose } from 'redux'
import _ from 'lodash'
import numeral from 'numeral'
import moment from 'moment'
import { history } from 'umi'
import { withStyles } from '@material-ui/core'
import Warning from '@material-ui/icons/Error'
import Refresh from '@material-ui/icons/Refresh'
import {
  GridContainer,
  GridItem,
  Button,
  CheckboxGroup,
  CommonTableGrid,
  CommonModal,
  withFormikExtend,
  NumberInput,
  Tooltip,
  FastField,
  notification,
  TextField,
  DatePicker,
} from '@/components'
import { FileCopySharp } from '@material-ui/icons'
import { Table } from '@devexpress/dx-react-grid-material-ui'
import {
  navigateDirtyCheck,
  getTranslationValue,
  getUniqueId,
} from '@/utils/utils'
import Authorized from '@/utils/Authorized'
import { VISIT_TYPE, PHARMACY_STATUS, PHARMACY_ACTION } from '@/utils/constants'
import Banner from '@/pages/PatientDashboard/Banner'
import AddOrder from '@/pages/Dispense/DispenseDetails/AddOrder'
import { MenuOutlined } from '@ant-design/icons'
import { PharmacySteps } from '../../Components'
import RedispenseForm from '../../Components/RedispenseForm'

const styles = theme => ({
  wrapCellTextStyle: {
    wordWrap: 'break-word',
    whiteSpace: 'pre-wrap',
  },
  rightIcon: {
    position: 'absolute',
    bottom: 2,
    fontWeight: 600,
    color: 'white',
    fontSize: '0.7rem',
    padding: '2px 3px',
    height: 20,
    cursor: 'pointer',
  },
  subRow: {
    '& > td:first-child': {
      paddingLeft: theme.spacing(1),
    },
  },
  contentPanel: {
    maxHeight: 850,
    overflowY: 'scroll',
    marginBottom: 10,
  },
  alertStyle: {
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
    width: '100%',
    overflow: 'hidden',
    padding: '3px 6px',
    lineHeight: '25px',
    fontSize: '0.85rem',
  },
  refreshButton: {
    position: 'absolute',
    right: -40,
    top: 3,
    width: 26,
    height: 26,
  },
})

const ContentGridItem = ({ children, title }) => {
  return (
    <GridItem md={4} style={{ paddingLeft: 135, marginBottom: 8 }}>
      <div style={{ position: 'relative' }}>
        <div
          style={{
            width: 135,
            textAlign: 'right',
            position: 'absolute',
            left: '-135px',
            fontWeight: 600,
          }}
        >
          {title}
        </div>
        <div style={{ marginLeft: 6 }}> {children}</div>
      </div>
    </GridItem>
  )
}

const Details = props => {
  const {
    pharmacyDetails,
    patient,
    dispatch,
    classes,
    clinicSettings,
    codetable,
  } = props
  const { inventorymedication = [] } = codetable
  const {
    primaryPrintoutLanguage = 'EN',
    secondaryPrintoutLanguage = '',
    labelPrinterSize,
    isQueueNoDecimal,
    visitTypeSetting,
  } = clinicSettings
  const [showEditOrderModal, setShowEditOrderModal] = useState(false)
  const [showRedispenseFormModal, setShowRedispenseFormModal] = useState(false)
  const [printlanguage, setPrintlanguage] = useState([primaryPrintoutLanguage])
  const [showLanguage, setShowLanguage] = useState(primaryPrintoutLanguage)
  const workitem = pharmacyDetails.entity || {}
  const statusHistory = [
    ...(workitem.pharmarcyWorklistHistory || []),
    {
      statusFK: workitem.statusFK,
      actionDate: workitem.updateDate,
      actionByUser: workitem.updateByUser,
      actionByUserTitle: workitem.updateByUserTitle,
    },
  ]
  const { corDiagnosis = [], visitPurposeFK } = workitem

  const editOrder = e => {
    const _editOrder = () => {
      dispatch({
        type: 'dispense/query',
        payload: {
          id: workitem.visitFK,
          version: Date.now(),
        },
      }).then(r => {
        setShowEditOrderModal(true)
      })
    }
    if (visitPurposeFK === VISIT_TYPE.OTC) {
      navigateDirtyCheck({
        onProceed: _editOrder,
      })(e)
    } else {
    }
  }

  const getPaload = actionType => {
    const { id, concurrencyToken } = workitem

    const getTransaction = item => {
      const {
        stockFK,
        batchNo,
        expiryDate,
        dispenseQuantity,
        uomDisplayValue,
        secondUOMDisplayValue,
      } = item
      return {
        stockFK,
        batchNo,
        expiryDate,
        transactionQty: dispenseQuantity,
        uomDisplayValue,
        secondUOMDisplayValue,
      }
    }
    let newPharmacyOrderItem = []
    if (actionType === PHARMACY_ACTION.PREPARE) {
      const pharmacyOrderItem = pharmacyDetails.entity?.pharmacyOrderItem || []
      pharmacyOrderItem.forEach(item => {
        if (item.invoiceItemTypeFK === 1) {
          if (item.isDrugMixture) {
            let newPrescriptionDrugMixture = []
            item.prescriptionDrugMixture
              .filter(drugMixture => drugMixture.isDispensedByPharmacy)
              .forEach(drugMixture => {
                const orderItem = props.values.orderItems.filter(
                  oi =>
                    oi.dispenseQuantity > 0 &&
                    oi.drugMixtureFK === drugMixture.id,
                )
                if (orderItem.length) {
                  newPrescriptionDrugMixture.push({
                    id: drugMixture.id,
                    concurrencyToken: drugMixture.concurrencyToken,
                    inventoryMedicationFK: drugMixture.inventoryMedicationFK,
                    pharmacyOrderItemTransaction: orderItem.map(i =>
                      getTransaction(i),
                    ),
                  })
                }
              })
            newPharmacyOrderItem.push({
              id: item.id,
              isDrugMixture: item.isDrugMixture,
              concurrencyToken: item.concurrencyToken,
              invoiceItemTypeFK: item.invoiceItemTypeFK,
              inventoryFK: item.inventoryFK,
              prescriptionDrugMixture: newPrescriptionDrugMixture,
            })
          } else if (item.inventoryFK && !item.isExternalPrescription) {
            const orderItem = props.values.orderItems.filter(
              oi =>
                oi.invoiceItemTypeFK === item.invoiceItemTypeFK &&
                oi.id === item.id &&
                oi.dispenseQuantity > 0,
            )
            if (orderItem.length) {
              newPharmacyOrderItem.push({
                id: item.id,
                isDrugMixture: item.isDrugMixture,
                concurrencyToken: item.concurrencyToken,
                invoiceItemTypeFK: item.invoiceItemTypeFK,
                inventoryFK: item.inventoryFK,
                pharmacyOrderItemTransaction: orderItem.map(i =>
                  getTransaction(i),
                ),
              })
            }
          }
        } else {
          const orderItem = props.values.orderItems.filter(
            oi =>
              oi.invoiceItemTypeFK === item.invoiceItemTypeFK &&
              oi.id === item.id &&
              oi.dispenseQuantity > 0,
          )
          if (orderItem.length) {
            newPharmacyOrderItem.push({
              id: item.id,
              concurrencyToken: item.concurrencyToken,
              invoiceItemTypeFK: item.invoiceItemTypeFK,
              inventoryFK: item.inventoryFK,
              pharmacyOrderItemTransaction: orderItem.map(i =>
                getTransaction(i),
              ),
            })
          }
        }
      })
    }
    return { id, concurrencyToken, pharmacyOrderItem: newPharmacyOrderItem }
  }

  const updatePharmacy = (actionType, redispenseValues = {}) => {
    const { redispenseBy, redispenseReason } = redispenseValues
    dispatch({
      type: 'pharmacyDetails/upsert',
      payload: {
        ...getPaload(actionType),
        actionType,
        redispenseBy,
        redispenseReason,
      },
    }).then(r => {
      const { onConfirm } = props
      onConfirm()
    })
  }

  const reloadPharmacy = () => {
    dispatch({ type: 'pharmacyDetails/query', payload: { id: workitem.id } })
  }

  const getInstruction = row => {
    if (row.invoiceItemTypeFK !== 1) return ''
    return row.language.isShowFirstValue
      ? row.instruction
      : row.secondInstruction
  }

  const getDrugInteraction = row => {
    if (row.invoiceItemTypeFK !== 1) return ''
    var medication =
      inventorymedication.find(m => m.id === row.inventoryFK) || {}
    const { inventoryMedication_MedicationInteraction = [] } = medication
    if (!inventoryMedication_MedicationInteraction.length) return '-'
    return (
      <div>
        {inventoryMedication_MedicationInteraction.map(item => {
          return (
            <p>
              {getTranslationValue(
                item.translationData,
                row.language.value,
                'displayValue',
              )}
            </p>
          )
        })}
      </div>
    )
  }

  const getDrugContraIndication = row => {
    if (row.invoiceItemTypeFK !== 1) return ''
    var medication =
      inventorymedication.find(m => m.id === row.inventoryFK) || {}
    const { inventoryMedication_MedicationContraIndication = [] } = medication
    if (!inventoryMedication_MedicationContraIndication.length) return '-'
    return (
      <div>
        {inventoryMedication_MedicationContraIndication.map(item => {
          return (
            <p>
              {getTranslationValue(
                item.translationData,
                row.language.value,
                'displayValue',
              )}
            </p>
          )
        })}
      </div>
    )
  }

  const getDispenseUOM = row => {
    if (row.invoiceItemTypeFK === 1) {
      return row.language.value === primaryPrintoutLanguage
        ? row.uomDisplayValue
        : row.secondUOMDisplayValue
    } else {
      return row.uomDisplayValue
    }
  }

  const getUOM = row => {
    if (row.invoiceItemTypeFK !== 1) return row.dispenseUOM
    return row.language.isShowFirstValue
      ? row.dispenseUOM
      : row.secondDispenseUOM
  }

  const getType = row => {
    let type = 'Consumable'
    if (row.invoiceItemTypeFK === 1) {
      type = 'Medication'
      if (!row.isDrugMixture && !row.inventoryFK) {
        type = 'Open Prescription'
      } else if (row.isExternalPrescription) {
        type = 'Medication (Ext.)'
      }
    }
    return type
  }

  const showDrugLabelRemark = labelPrinterSize === '5.4cmx8.2cm'

  const orderItemRow = p => {
    const { classes } = props
    const { row, children, tableRow } = p
    let newchildren = []

    const batchColumns = children.slice(6, 11)

    if (row.countNumber === 1) {
      newchildren.push(
        children
          .filter((value, index) => index < 6)
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
          .filter((value, index) => index > 10)
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

    const selectedData = {
      ...tableRow.row,
      doctor: null,
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

  const onConfirmRedispense = redispenseValues => {
    updatePharmacy(PHARMACY_ACTION.REDISPENSE, redispenseValues)
    setShowRedispenseFormModal(false)
  }

  const closeRedispenseForm = () => {
    setShowRedispenseFormModal(false)
  }

  const onPrepare = () => {
    const { orderItems = [] } = props.values || {}

    const checkOverStock = () => {
      let isOverStock = false
      for (let index = 0; index < orderItems.length; index++) {
        if (orderItems[index].stockFK && !orderItems[index].isDefault) {
          var items = orderItems.filter(
            oi =>
              oi.invoiceItemTypeFK === orderItems[index].invoiceItemTypeFK &&
              oi.stockFK === orderItems[index].stockFK &&
              oi.inventoryFK === orderItems[index].inventoryFK,
          )
          if (orderItems[index].stock < _.sumBy(items, 'dispenseQuantity')) {
            isOverStock = true
            break
          }
        }
      }
      return isOverStock
    }

    const checkOverDispense = () => {
      let isOverDispense = false
      for (let index = 0; index < orderItems.length; index++) {
        if (orderItems[index].stockFK) {
          let items = []
          if (orderItems[index].isDrugMixture) {
            items = orderItems.filter(
              oi =>
                oi.isDrugMixture &&
                oi.drugMixtureFK === orderItems[index].drugMixtureFK &&
                oi.inventoryFK === orderItems[index].inventoryFK,
            )
          } else {
            items = orderItems.filter(
              oi =>
                !oi.isDrugMixture &&
                oi.invoiceItemTypeFK === orderItems[index].invoiceItemTypeFK &&
                oi.id === orderItems[index].id &&
                oi.inventoryFK === orderItems[index].inventoryFK,
            )
          }
          if (orderItems[index].quantity < _.sumBy(items, 'dispenseQuantity')) {
            isOverDispense = true
            break
          }
        }
      }
      return isOverDispense
    }

    const checkPartialPrepare = () => {
      let isPartialPrepare = false
      for (let index = 0; index < orderItems.length; index++) {
        if (orderItems[index].stockFK) {
          let items = []
          if (orderItems[index].isDrugMixture) {
            items = orderItems.filter(
              oi =>
                oi.isDrugMixture &&
                oi.drugMixtureFK === orderItems[index].drugMixtureFK &&
                oi.inventoryFK === orderItems[index].inventoryFK,
            )
          } else {
                   items = orderItems.filter(
                     oi =>
                       !oi.isDrugMixture &&
                       oi.invoiceItemTypeFK ===
                         orderItems[index].invoiceItemTypeFK &&
                       oi.id === orderItems[index].id &&
                       oi.inventoryFK === orderItems[index].inventoryFK,
                   )
                 }
          if (orderItems[index].quantity > _.sumBy(items, 'dispenseQuantity')) {
            isPartialPrepare = true
            break
          }
        }
      }
      return isPartialPrepare
    }
    if (checkOverDispense()) {
      notification.error({
        message: 'Dispense quantity more than ordered quantity',
      })
      return
    }
    if (checkOverStock()) {
      notification.error({
        message: 'Dispense quantity more than total stock.',
      })
      return
    }
    if (checkPartialPrepare()) {
      dispatch({
        type: 'global/updateAppState',
        payload: {
          openConfirm: true,
          openConfirmContent: () => {
            return (
              <div>
                <h3>There are partially prepared item.</h3>
                <h3>Confirm to proceed?</h3>
              </div>
            )
          },
          openConfirmText: 'Confirm',
          onConfirmSave: () => updatePharmacy(PHARMACY_ACTION.PREPARE),
        },
      })
    } else {
      updatePharmacy(PHARMACY_ACTION.PREPARE)
    }
  }

  const refreshClick = () => {
    dispatch({
      type: 'pharmacyDetails/query',
      payload: { id: workitem.id },
    })
  }

  const isOrderUpdate =
    workitem.isPharmacyOrderUpdate ||
    workitem.isPharmacyOrderDiscard ||
    workitem.isOrderUpdate
  const updateMessage = `${
    workitem.updateByUserTitle && workitem.updateByUserTitle.trim().length
      ? `${workitem.updateByUserTitle}. ${workitem.updateByUser || ''}`
      : `${workitem.updateByUser || ''}`
  } amended prescription at ${moment(workitem.updateDate).format('HH:mm')}`

  const currentMessage =
    workitem.isPharmacyOrderUpdate || workitem.isPharmacyOrderDiscard
      ? workitem.updateMessage
      : updateMessage

  const pharmacyOrderItemCount = (
    pharmacyDetails.entity?.pharmacyOrderItem || []
  ).length

  const queueNo =
    !workitem.queueNo || !workitem.queueNo.trim().length
      ? '-'
      : numeral(workitem.queueNo).format(isQueueNoDecimal ? '0.0' : '0')

  let visitTypeSettingsObj = []
  if (visitTypeSetting) {
    try {
      visitTypeSettingsObj = JSON.parse(visitTypeSetting)
    } catch {}
  }
  const visitType = (visitTypeSettingsObj || []).find(
    type => type.id === workitem.visitPurposeFK,
  )
  return (
    <div style={{ marginTop: -20 }}>
      <div className={classes.contentPanel}>
        <div style={{ padding: 8}}>
          <Banner from='Pharmacy' patientInfo={patient} />
        </div>
        <div style={{ marginTop: 16 }}>
          <GridContainer>
            <GridItem>
              <PharmacySteps
                statusHistory={statusHistory}
                currentStatusFK={workitem.statusFK}
              />
            </GridItem>
            <GridItem md={12}>
              <Typography.Title level={5}>Order Details</Typography.Title>
            </GridItem>
            <ContentGridItem title='Queue No.:'>{queueNo}</ContentGridItem>
            <ContentGridItem title='Diagnosis:'>
              {corDiagnosis.length
                ? workitem.corDiagnosis
                    .map(d => d.diagnosisDescription)
                    .join(', ')
                : '-'}
            </ContentGridItem>
            <ContentGridItem title='Visit Type:'>
              {visitType?.displayValue || '-'}
            </ContentGridItem>
            <ContentGridItem title='Order By:'>{`${
              workitem.generateByUserTitle &&
              workitem.generateByUserTitle.trim().length
                ? `${workitem.generateByUserTitle}. `
                : ''
            }${workitem.generateByUser || ''}`}</ContentGridItem>
            <ContentGridItem title='Order Created Time:'>
              {moment(workitem.generateDate).format('HH:mm, DD MMM YYYY')}
            </ContentGridItem>
            <ContentGridItem title='Group:'>
              {workitem.visitGroup && workitem.visitGroup.trim().length
                ? workitem.visitGroup
                : '-'}
            </ContentGridItem>
            <ContentGridItem title='Family History:'>
              {workitem.familyHistory && workitem.familyHistory.trim().length
                ? workitem.familyHistory
                : '-'}
            </ContentGridItem>
            <ContentGridItem title='Social History:'>
              {workitem.socialHistory && workitem.socialHistory.trim().length
                ? workitem.socialHistory
                : '-'}
            </ContentGridItem>
            <ContentGridItem title='Medical History:'>
              {workitem.medicalHistory && workitem.medicalHistory.trim().length
                ? workitem.medicalHistory
                : '-'}
            </ContentGridItem>
            <GridItem md={6} style={{ paddingRight: 40 }}>
              {isOrderUpdate && (
                <div style={{ position: 'relative' }}>
                  <Alert
                    message={currentMessage}
                    banner
                    className={classes.alertStyle}
                    icon={<Warning style={{ color: 'red' }} />}
                  />
                  {workitem.isPharmacyOrderUpdate &&
                    workitem.statusFK === PHARMACY_STATUS.NEW && (
                      <Button
                        color='primary'
                        justIcon
                        className={classes.refreshButton}
                        onClick={refreshClick}
                      >
                        <Refresh />
                      </Button>
                    )}
                </div>
              )}
            </GridItem>
            <GridItem
              md={6}
              style={{
                display: 'flex',
                justifyContent: 'flex-end',
              }}
            >
              <Typography.Text
                underline
                style={{
                  cursor: 'pointer',
                  color: '#1890f8',
                  position: 'relative',
                  top: '6px',
                }}
                onClick={() => {}}
              >
                Journal History
              </Typography.Text>

              {secondaryPrintoutLanguage !== '' && (
                <Select
                  style={{ marginLeft: 16 }}
                  value={showLanguage}
                  options={[
                    {
                      label: primaryPrintoutLanguage,
                      value: primaryPrintoutLanguage,
                    },
                    {
                      label: secondaryPrintoutLanguage,
                      value: secondaryPrintoutLanguage,
                    },
                  ]}
                  onChange={v => {
                    setShowLanguage(v)
                    const { setFieldValue } = props
                    setFieldValue(
                      'orderItems',
                      props.values.orderItems.map(item => {
                        return {
                          ...item,
                          language: {
                            value: v,
                            isShowFirstValue: v === primaryPrintoutLanguage,
                          },
                        }
                      }),
                    )
                  }}
                />
              )}
            </GridItem>
            <GridItem style={{ marginTop: 8 }}>
              <CommonTableGrid
                forceRender
                size='sm'
                FuncProps={{
                  pager: false,
                  grouping: true,
                  groupingConfig: {
                    state: {
                      grouping: [{ columnName: 'dispenseGroupId' }],
                      defaultExpandedGroups: props.values.defaultExpandedGroups,
                    },
                    row: {
                      contentComponent: group => {
                        const { row } = group
                        const groupRow = props.values.orderItems.find(
                          data => data.dispenseGroupId === row.value,
                        )
                        if (row.value === 'NormalDispense')
                          return (
                            <span style={{ fontWeight: 600 }}>
                              Normal Dispense Items
                            </span>
                          )
                        if (row.value === 'NoNeedToDispense')
                          return (
                            <span style={{ fontWeight: 600 }}>
                              No Need To Dispense Items
                            </span>
                          )
                        return (
                          <span>
                            <span style={{ fontWeight: 600 }}>
                              {'Drug Mixture: '}
                            </span>
                            {groupRow.drugMixtureName}
                          </span>
                        )
                      },
                    },
                  },
                }}
                rows={props.values.orderItems || []}
                getRowId={r => r.uid}
                columns={[
                  { name: 'dispenseGroupId', title: '' },
                  { name: 'invoiceItemTypeFK', title: 'Type' },
                  { name: 'itemCode', title: 'Code' },
                  { name: 'itemName', title: 'Name' },
                  { name: 'dispenseUOM', title: 'UOM' },
                  {
                    name: 'quantity',
                    title: (
                      <div>
                        <p style={{ height: 16 }}>Ordered</p>
                        <p style={{ height: 16 }}>Qty.</p>
                      </div>
                    ),
                  },
                  {
                    name: 'dispenseQuantity',
                    title: (
                      <div>
                        <p style={{ height: 16 }}>Dispensed</p>
                        <p style={{ height: 16 }}>Qty.</p>
                      </div>
                    ),
                  },
                  {
                    name: 'stock',
                    title: 'Stock Qty.',
                  },
                  {
                    name: 'stockBalance',
                    title: 'Balance Qty.',
                  },
                  { name: 'batchNo', title: 'Batch No.' },
                  { name: 'expiryDate', title: 'Expiry Date' },
                  {
                    name: 'instruction',
                    title: `Instruction${
                      secondaryPrintoutLanguage !== ''
                        ? `(${showLanguage})`
                        : ''
                    }`,
                  },
                  {
                    name: 'drugInteraction',
                    title: `Drug Interaction${
                      secondaryPrintoutLanguage !== ''
                        ? `(${showLanguage})`
                        : ''
                    }`,
                  },
                  {
                    name: 'drugContraindication',
                    title: `Contraindication${
                      secondaryPrintoutLanguage !== ''
                        ? `(${showLanguage})`
                        : ''
                    }`,
                  },
                  { name: 'remarks', title: 'Remarks' },
                  //{ name: 'action', title: 'Action' },
                ]}
                columnExtensions={[
                  {
                    columnName: 'invoiceItemTypeFK',
                    width: 110,
                    sortingEnabled: false,
                    render: row => {
                      const type = getType(row)
                      return (
                        <Tooltip title={type}>
                          <span>{type}</span>
                        </Tooltip>
                      )
                    },
                  },
                  {
                    columnName: 'itemCode',
                    width: 100,
                    sortingEnabled: false,
                  },
                  {
                    columnName: 'itemName',
                    width: 200,
                    sortingEnabled: false,
                    render: row => {
                      let paddingRight = 0
                      if (row.isExclusive) {
                        paddingRight = 24
                      }
                      return (
                        <div style={{ position: 'relative' }}>
                          <div
                            className={classes.wrapCellTextStyle}
                            style={{ paddingRight: paddingRight }}
                          >
                            {row.itemName}
                            <div style={{ position: 'relative', top: 2 }}>
                              {row.isExclusive && (
                                <Tooltip title='The item has no local stock, we will purchase on behalf and charge to patient in invoice'>
                                  <div
                                    className={classes.rightIcon}
                                    style={{
                                      right: -30,
                                      borderRadius: 4,
                                      backgroundColor: 'green',
                                    }}
                                  >
                                    Excl.
                                  </div>
                                </Tooltip>
                              )}
                            </div>
                          </div>
                        </div>
                      )
                    },
                  },
                  {
                    columnName: 'dispenseUOM',
                    width: 80,
                    sortingEnabled: false,
                    render: row => {
                      const uom = getUOM(row)
                      return (
                        <Tooltip title={uom}>
                          <span>{uom}</span>
                        </Tooltip>
                      )
                    },
                  },
                  {
                    columnName: 'quantity',
                    width: 80,
                    sortingEnabled: false,
                    render: row => {
                      const qty = numeral(row.quantity).format('0.0')
                      return (
                        <Tooltip title={qty}>
                          <span>{qty}</span>
                        </Tooltip>
                      )
                    },
                    align: 'right',
                  },
                  {
                    columnName: 'dispenseQuantity',
                    width: 80,
                    sortingEnabled: false,
                    render: row => {
                      if (
                        row.statusFK !== PHARMACY_STATUS.NEW ||
                        !row.stockFK
                      ) {
                        const dispenseQty = !row.stockFK
                          ? '-'
                          : `${numeral(row.dispenseQuantity).format('0.0')}`
                        return (
                          <Tooltip title={dispenseQty}>
                            <span>{dispenseQty}</span>
                          </Tooltip>
                        )
                      }
                      return (
                        <FastField
                          name={`orderItems[${row.rowIndex}]dispenseQuantity`}
                          render={args => {
                            return (
                              <NumberInput
                                label=''
                                step={1}
                                format='0.0'
                                max={row.isDefault ? undefined : row.stock}
                                min={0}
                                disabled={!row.isDispensedByPharmacy}
                                precision={1}
                                {...args}
                              />
                            )
                          }}
                        />
                      )
                    },
                    align: 'right',
                  },
                  {
                    columnName: 'stock',
                    width: 100,
                    sortingEnabled: false,
                    render: row => {
                      const stock = row.stock
                        ? `${numeral(row.stock).format('0.0')} ${getDispenseUOM(
                            row,
                          )}`
                        : '-'
                      return (
                        <Tooltip title={stock}>
                          <span>{stock}</span>
                        </Tooltip>
                      )
                    },
                    align: 'right',
                  },
                  {
                    columnName: 'stockBalance',
                    width: 100,
                    sortingEnabled: false,
                    render: row => {
                      const balStock = row.stock - row.dispenseQuantity
                      const stock =
                        balStock || balStock === 0
                          ? `${numeral(balStock).format(
                              '0.0',
                            )} ${getDispenseUOM(row)}`
                          : '-'
                      return (
                        <Tooltip title={stock}>
                          <span>{stock}</span>
                        </Tooltip>
                      )
                    },
                    align: 'right',
                  },
                  {
                    columnName: 'batchNo',
                    width: 100,
                    sortingEnabled: false,
                    render: row => {
                      if (
                        row.statusFK !== PHARMACY_STATUS.NEW ||
                        !row.isDefault
                      ) {
                        return (
                          <Tooltip title={row.batchNo}>
                            <span>{row.batchNo}</span>
                          </Tooltip>
                        )
                      }
                      return (
                        <FastField
                          name={`orderItems[${row.rowIndex}]batchNo`}
                          render={args => {
                            return (
                              <TextField maxLength={100} label='' {...args} />
                            )
                          }}
                        />
                      )
                    },
                  },
                  {
                    columnName: 'expiryDate',
                    width: 110,
                    sortingEnabled: false,
                    render: row => {
                      if (
                        row.statusFK !== PHARMACY_STATUS.NEW ||
                        !row.isDefault
                      ) {
                        const expiryDate = row.expiryDate
                          ? moment(row.expiryDate).format('DD MMM YYYY')
                          : '-'
                        return (
                          <Tooltip title={expiryDate}>
                            <span>{expiryDate}</span>
                          </Tooltip>
                        )
                      }
                      return (
                        <FastField
                          name={`orderItems[${row.rowIndex}]expiryDate`}
                          render={args => {
                            return (
                              <DatePicker
                                label=''
                                simple
                                disabledDate={d =>
                                  !d || d.isBefore(moment().add('days', -1))
                                }
                                {...args}
                              />
                            )
                          }}
                        />
                      )
                    },
                  },
                  {
                    columnName: 'instruction',
                    sortingEnabled: false,
                    render: row => {
                      const instruction = getInstruction(row)
                      return (
                        <Tooltip title={instruction}>
                          <span>{instruction}</span>
                        </Tooltip>
                      )
                    },
                  },
                  {
                    columnName: 'drugInteraction',
                    sortingEnabled: false,
                    render: row => {
                      const interaction = getDrugInteraction(row)
                      return (
                        <Tooltip title={interaction}>
                          <span>{interaction}</span>
                        </Tooltip>
                      )
                    },
                  },
                  {
                    columnName: 'drugContraindication',
                    sortingEnabled: false,
                    render: row => {
                      const contraIndication = getDrugContraIndication(row)
                      return (
                        <Tooltip title={contraIndication}>
                          <span>{contraIndication}</span>
                        </Tooltip>
                      )
                    },
                  },
                  {
                    columnName: 'remarks',
                    sortingEnabled: false,
                    render: row => {
                      const existsDrugLabelRemarks =
                        showDrugLabelRemark &&
                        row.drugLabelRemarks &&
                        row.drugLabelRemarks.trim() !== ''
                      return (
                        <div style={{ position: 'relative' }}>
                          <div
                            style={{
                              wordWrap: 'break-word',
                              whiteSpace: 'pre-wrap',
                              paddingRight: existsDrugLabelRemarks ? 10 : 0,
                            }}
                          >
                            {row.remarks || ' '}
                            <div style={{ position: 'relative', top: 2 }}>
                              {existsDrugLabelRemarks && (
                                <div
                                  style={{
                                    position: 'absolute',
                                    bottom: 2,
                                    right: -15,
                                  }}
                                >
                                  <Tooltip
                                    title={
                                      <div>
                                        <div style={{ fontWeight: 600 }}>
                                          Drug Label Remarks
                                        </div>
                                        <div>{row.drugLabelRemarks}</div>
                                      </div>
                                    }
                                  >
                                    <FileCopySharp
                                      style={{ color: '#4255bd' }}
                                    />
                                  </Tooltip>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      )
                    },
                  },
                  {
                    columnName: 'action',
                    width: 60,
                    sortingEnabled: false,
                    render: row => {
                      return (
                        <Button justIcon color='primary'>
                          <MenuOutlined />
                        </Button>
                      )
                    },
                  },
                ]}
                TableProps={{
                  rowComponent: orderItemRow,
                }}
              />
            </GridItem>
          </GridContainer>
        </div>
      </div>
      <GridContainer>
        <GridItem md={8}>
          <div style={{ position: 'relative' }}>
            <Button color='primary' size='sm' disabled={isOrderUpdate}>
              Print Prescription
            </Button>
            <Button color='primary' size='sm' disabled={isOrderUpdate}>
              Print leaflet/Drug Summary Label
            </Button>
            <Button color='primary' size='sm' disabled={isOrderUpdate}>
              Print Drug Label
            </Button>
            {secondaryPrintoutLanguage !== '' && (
              <CheckboxGroup
                value={printlanguage}
                style={{
                  position: 'absolute',
                  bottom: '-5px',
                  marginLeft: '6px',
                }}
                options={[
                  { value: 'EN', label: 'EN' },
                  { value: 'JP', label: 'JP' },
                ]}
                onChange={v => {
                  setPrintlanguage(v.target.value)
                }}
              />
            )}
          </div>
        </GridItem>
        <GridItem
          md={4}
          style={{
            display: 'flex',
            justifyContent: 'flex-end',
          }}
        >
          <Button
            color='danger'
            size='sm'
            onClick={() => {
              if (
                workitem.statusFK !== PHARMACY_STATUS.NEW &&
                !pharmacyOrderItemCount
              ) {
                updatePharmacy(PHARMACY_ACTION.CANCEL)
              } else {
                const { onClose } = props
                onClose()
              }
            }}
          >
            {workitem.statusFK !== PHARMACY_STATUS.NEW &&
            !pharmacyOrderItemCount
              ? 'Cancel'
              : 'Close'}
          </Button>
          {workitem.statusFK === PHARMACY_STATUS.NEW && (
            <Authorized authority={'pharmacyworklist.editorder'}>
              <Button
                color='success'
                size='sm'
                disabled={isOrderUpdate || !pharmacyOrderItemCount}
                onClick={editOrder}
              >
                {workitem.visitPurposeFK == VISIT_TYPE.OTC
                  ? 'Add Order'
                  : 'Edit Order'}
              </Button>
            </Authorized>
          )}
          {workitem.statusFK !== PHARMACY_STATUS.NEW && (
            <Authorized authority={'pharmacyworklist.redispenseorder'}>
              <Button
                color='primary'
                size='sm'
                onClick={() => {
                  setShowRedispenseFormModal(true)
                }}
                disabled={
                  !pharmacyOrderItemCount || workitem.isPharmacyOrderDiscard
                }
              >
                Re-dispense
              </Button>
            </Authorized>
          )}
          {workitem.statusFK === PHARMACY_STATUS.NEW && (
            <Authorized authority={'pharmacyworklist.prepareorder'}>
              <Button
                color='primary'
                size='sm'
                onClick={onPrepare}
                disabled={isOrderUpdate || !pharmacyOrderItemCount}
              >
                Prepare
              </Button>
            </Authorized>
          )}
          {workitem.statusFK === PHARMACY_STATUS.PREPARED && (
            <Authorized authority={'pharmacyworklist.verifyorder'}>
              <Button
                color='primary'
                size='sm'
                onClick={() => updatePharmacy(PHARMACY_ACTION.VERIFY)}
                disabled={isOrderUpdate || !pharmacyOrderItemCount}
              >
                Verify
              </Button>
            </Authorized>
          )}
          {workitem.statusFK === PHARMACY_STATUS.VERIFIED && (
            <Authorized authority={'pharmacyworklist.dispenseorder'}>
              <Button
                color='primary'
                size='sm'
                onClick={() => updatePharmacy(PHARMACY_ACTION.COMPLETE)}
                disabled={isOrderUpdate || !pharmacyOrderItemCount}
              >
                Complete
              </Button>
            </Authorized>
          )}
        </GridItem>
      </GridContainer>
      <CommonModal
        open={showEditOrderModal}
        title='Edit Order'
        showFooter={true}
        onClose={() => {
          dispatch({
            type: 'orders/reset',
          })
          setShowEditOrderModal(false)
        }}
        onConfirm={() => {
          dispatch({
            type: 'orders/reset',
          })
          setShowEditOrderModal(false)
        }}
        maxWidth='md'
        observe='OrderPage'
        showFooter={false}
      >
        <AddOrder
          visitType={visitPurposeFK}
          isFirstLoad={false}
          onReloadClick={reloadPharmacy}
          {...props}
          history={history}
        />
      </CommonModal>
      <CommonModal
        open={showRedispenseFormModal}
        title='Alert'
        onClose={closeRedispenseForm}
        maxWidth='sm'
        cancelText='Cancel'
        observe='RedispenseForm'
      >
        <RedispenseForm onConfirmRedispense={onConfirmRedispense} />
      </CommonModal>
    </div>
  )
}

export default compose(
  withStyles(styles),
  connect(({ pharmacyDetails, patient, clinicSettings, codetable }) => ({
    pharmacyDetails,
    patient,
    clinicSettings: clinicSettings.settings || clinicSettings.default,
    codetable,
  })),
  withFormikExtend({
    enableReinitialize: true,
    mapPropsToValues: ({ pharmacyDetails, clinicSettings, codetable }) => {
      if (!pharmacyDetails.entity) return { orderItems: [] }
      const {
        inventorymedication = [],
        inventoryconsumable = [],
        ctmedicationunitofmeasurement = [],
      } = codetable
      const {
        primaryPrintoutLanguage = 'EN',
        secondaryPrintoutLanguage = '',
      } = clinicSettings
      let orderItems = []

      const defaultItem = (item, groupName) => {
        return {
          ...item,
          language: {
            value: primaryPrintoutLanguage,
            isShowFirstValue: true,
          },
          statusFK: pharmacyDetails.entity?.statusFK,
          dispenseGroupId: groupName,
          countNumber: 1,
          rowspan: 1,
          uid: getUniqueId(),
        }
      }

      const generateFromDrugmixture = item => {
        const drugMixtures = _.orderBy(
          item.prescriptionDrugMixture,
          ['sequence'],
          ['asc'],
        )
        drugMixtures.forEach(drugMixture => {
          const detaultDrugMixture = {
            ...defaultItem(item, `DrugMixture-${item.id}`),
            drugMixtureFK: drugMixture.id,
            inventoryFK: drugMixture.inventoryMedicationFK,
            itemCode: drugMixture.drugCode,
            itemName: drugMixture.drugName,
            quantity: drugMixture.quantity,
            dispenseUOM: drugMixture.uomDisplayValue,
            secondDispenseUOM: drugMixture.secondUOMDisplayValue,
            isDispensedByPharmacy: drugMixture.isDispensedByPharmacy,
            drugMixtureName: item.itemName,
          }
          if (!drugMixture.isDispensedByPharmacy) {
            orderItems.push({
              ...detaultDrugMixture,
            })
          } else {
            if (pharmacyDetails.entity?.statusFK === PHARMACY_STATUS.NEW) {
              const inventoryItem = inventorymedication.find(
                drug => drug.id === drugMixture.inventoryMedicationFK,
              )
              const uom =
                ctmedicationunitofmeasurement.find(
                  m => m.id === inventoryItem?.dispensingUOM?.id,
                ) || {}
              const primaryUOMDisplayValue = getTranslationValue(
                uom.translationData,
                primaryPrintoutLanguage,
                'displayValue',
              )
              const secondUOMDisplayValue =
                secondaryPrintoutLanguage !== ''
                  ? getTranslationValue(
                      uom.translationData,
                      secondaryPrintoutLanguage,
                      'displayValue',
                    )
                  : ''
              const inventoryItemStock = _.orderBy(
                (inventoryItem?.medicationStock || []).filter(
                  s => s.isDefault || s.stock > 0,
                ),
                ['isDefault', 'expiryDate'],
                ['asc'],
              )
              let remainQty = drugMixture.quantity
              if (remainQty > 0 && inventoryItem && inventoryItemStock.length) {
                inventoryItemStock.forEach((itemStock, index) => {
                  const {
                    id,
                    batchNo,
                    expiryDate,
                    stock,
                    isDefault,
                  } = itemStock
                  if (remainQty > 0) {
                    let dispenseQuantity = 0
                    if (isDefault || remainQty <= stock) {
                      dispenseQuantity = remainQty
                      remainQty = -1
                    } else {
                      dispenseQuantity = stock
                      remainQty = remainQty - stock
                    }
                    orderItems.push({
                      ...detaultDrugMixture,
                      dispenseQuantity: dispenseQuantity,
                      batchNo,
                      expiryDate,
                      stock,
                      stockFK: id,
                      uomDisplayValue: primaryUOMDisplayValue,
                      secondUOMDisplayValue: secondUOMDisplayValue,
                      isDefault,
                      countNumber: index === 0 ? 1 : 0,
                      rowspan: 0,
                    })
                  }
                })
                const firstItem = orderItems.find(
                  i =>
                    i.drugMixtureFK === drugMixture.id && i.countNumber === 1,
                )
                firstItem.rowspan = orderItems.filter(
                  i => i.drugMixtureFK === drugMixture.id,
                ).length
              } else {
                orderItems.push({
                  ...detaultDrugMixture,
                })
              }
            } else {
              if ((drugMixture.pharmacyOrderItemTransaction || []).length) {
                drugMixture.pharmacyOrderItemTransaction.forEach(
                  (itemTransaction, index) => {
                    const {
                      stockFK,
                      batchNo,
                      expiryDate,
                      oldQty,
                      transactionQty,
                      uomDisplayValue,
                      secondUOMDisplayValue,
                    } = itemTransaction
                    orderItems.push({
                      ...detaultDrugMixture,
                      dispenseQuantity: transactionQty,
                      batchNo,
                      expiryDate,
                      stock: oldQty,
                      stockFK: stockFK,
                      uomDisplayValue,
                      secondUOMDisplayValue,
                      drugMixtureName: item.itemName,
                      countNumber: index === 0 ? 1 : 0,
                      rowspan:
                        index === 0
                          ? drugMixture.pharmacyOrderItemTransaction.length
                          : 0,
                    })
                  },
                )
              } else {
                orderItems.push({
                  ...detaultDrugMixture,
                })
              }
            }
          }
        })
      }

      const generateFromItemTransaction = (item, groupName) => {
        if ((item.pharmacyOrderItemTransaction || []).length) {
          item.pharmacyOrderItemTransaction.forEach(
            (itemTransaction, index) => {
              const {
                stockFK,
                batchNo,
                expiryDate,
                oldQty,
                transactionQty,
                uomDisplayValue,
                secondUOMDisplayValue,
              } = itemTransaction
              orderItems.push({
                ...defaultItem(item, groupName),
                dispenseQuantity: transactionQty,
                batchNo,
                expiryDate,
                stock: oldQty,
                stockFK: stockFK,
                uomDisplayValue,
                secondUOMDisplayValue,
                countNumber: index === 0 ? 1 : 0,
                rowspan:
                  index === 0 ? item.pharmacyOrderItemTransaction.length : 0,
              })
            },
          )
        } else {
          orderItems.push(defaultItem(item, groupName))
        }
      }

      const generateFromNormalMedication = item => {
        const groupName = 'NormalDispense'
        if (pharmacyDetails.entity?.statusFK === PHARMACY_STATUS.NEW) {
          const inventoryItem = inventorymedication.find(
            drug => drug.id === item.inventoryFK,
          )

          const uom =
            ctmedicationunitofmeasurement.find(
              m => m.id === inventoryItem?.dispensingUOM?.id,
            ) || {}
          const primaryUOMDisplayValue = getTranslationValue(
            uom.translationData,
            primaryPrintoutLanguage,
            'displayValue',
          )
          const secondUOMDisplayValue =
            secondaryPrintoutLanguage !== ''
              ? getTranslationValue(
                  uom.translationData,
                  secondaryPrintoutLanguage,
                  'displayValue',
                )
              : ''

          const inventoryItemStock = _.orderBy(
            (inventoryItem?.medicationStock || []).filter(
              s => s.isDefault || s.stock > 0,
            ),
            ['isDefault', 'expiryDate'],
            ['asc'],
          )
          let remainQty = item.quantity
          if (remainQty > 0 && inventoryItem && inventoryItemStock.length) {
            inventoryItemStock.forEach((itemStock, index) => {
              const { id, batchNo, expiryDate, stock, isDefault } = itemStock
              if (remainQty > 0) {
                let dispenseQuantity = 0
                if (isDefault || remainQty <= stock) {
                  dispenseQuantity = remainQty
                  remainQty = -1
                } else {
                  dispenseQuantity = stock
                  remainQty = remainQty - stock
                }
                orderItems.push({
                  ...defaultItem(item, groupName),
                  dispenseQuantity: dispenseQuantity,
                  batchNo,
                  expiryDate,
                  stock,
                  stockFK: id,
                  uomDisplayValue: primaryUOMDisplayValue,
                  secondUOMDisplayValue: secondUOMDisplayValue,
                  isDefault,
                  countNumber: index === 0 ? 1 : 0,
                  rowspan: 0,
                })
              }
            })
            const firstItem = orderItems.find(
              i =>
                i.invoiceItemTypeFK === item.invoiceItemTypeFK &&
                i.isDrugMixture === item.isDrugMixture &&
                i.id === item.id &&
                i.countNumber === 1,
            )
            firstItem.rowspan = orderItems.filter(
              i =>
                i.invoiceItemTypeFK === item.invoiceItemTypeFK &&
                i.isDrugMixture === item.isDrugMixture &&
                i.id === item.id,
            ).length
          } else {
            orderItems.push(defaultItem(item, groupName))
          }
        } else {
          generateFromItemTransaction(item, groupName)
        }
      }

      const generateFromNormalConsumable = item => {
        if (pharmacyDetails.entity?.statusFK === PHARMACY_STATUS.NEW) {
          const inventoryItem = inventoryconsumable.find(
            drug => drug.id === item.inventoryFK,
          )
          const inventoryItemStock = _.orderBy(
            (inventoryItem?.consumableStock || []).filter(
              s => s.isDefault || s.stock > 0,
            ),
            ['isDefault', 'expiryDate'],
            ['asc'],
          )
          let remainQty = item.quantity
          if (remainQty > 0 && inventoryItem && inventoryItemStock.length) {
            inventoryItemStock.forEach((itemStock, index) => {
              const { id, batchNo, expiryDate, stock, isDefault } = itemStock
              if (remainQty > 0) {
                let dispenseQuantity = 0
                if (isDefault || remainQty <= stock) {
                  dispenseQuantity = remainQty
                  remainQty = -1
                } else {
                  dispenseQuantity = stock
                  remainQty = remainQty - stock
                }
                orderItems.push({
                  ...defaultItem(item, 'NormalDispense'),
                  dispenseQuantity: dispenseQuantity,
                  batchNo,
                  expiryDate,
                  stock,
                  stockFK: id,
                  uomDisplayValue: inventoryItem?.uom?.name,
                  isDefault,
                  countNumber: index === 0 ? 1 : 0,
                  rowspan: 0,
                })
              }
              const firstItem = orderItems.find(
                i =>
                  i.invoiceItemTypeFK === item.invoiceItemTypeFK &&
                  i.isDrugMixture === item.isDrugMixture &&
                  i.id === item.id &&
                  i.countNumber === 1,
              )
              firstItem.rowspan = orderItems.filter(
                i =>
                  i.invoiceItemTypeFK === item.invoiceItemTypeFK &&
                  i.isDrugMixture === item.isDrugMixture &&
                  i.id === item.id,
              ).length
            })
          } else {
            orderItems.push(defaultItem(item, 'NormalDispense'))
          }
        } else {
          generateFromItemTransaction(item, 'NormalDispense')
        }
      }

      const pharmacyOrderItem = pharmacyDetails.entity?.pharmacyOrderItem || []
      const sortOrderItems = [
        ...pharmacyOrderItem.filter(
          item =>
            item.invoiceItemTypeFK === 1 &&
            item.inventoryFK &&
            !item.isExternalPrescription,
        ),
        ...pharmacyOrderItem.filter(item => item.invoiceItemTypeFK !== 1),
        ...pharmacyOrderItem.filter(
          item => item.invoiceItemTypeFK === 1 && item.isDrugMixture,
        ),
        ...pharmacyOrderItem.filter(
          item =>
            item.invoiceItemTypeFK === 1 &&
            (item.isExternalPrescription ||
              (!item.isDrugMixture && !item.inventoryFK)),
        ),
      ]
      sortOrderItems.forEach(item => {
        if (pharmacyDetails.entity?.statusFK === PHARMACY_STATUS.NEW) {
          if (item.invoiceItemTypeFK === 1) {
            if (item.isDrugMixture) {
              generateFromDrugmixture(item)
            } else if (!item.inventoryFK || item.isExternalPrescription) {
              orderItems.push(defaultItem(item, 'NoNeedToDispense'))
            } else {
              generateFromNormalMedication(item)
            }
          } else {
            generateFromNormalConsumable(item)
          }
        } else {
          if (item.invoiceItemTypeFK === 1) {
            if (item.isDrugMixture) {
              generateFromDrugmixture(item)
            } else if (!item.inventoryFK || item.isExternalPrescription) {
              orderItems.push(defaultItem(item, 'NoNeedToDispense'))
            } else {
              generateFromNormalMedication(item)
            }
          } else {
            generateFromNormalConsumable(item)
          }
        }
      })

      const defaultExpandedGroups = _.uniqBy(orderItems, 'dispenseGroupId').map(
        o => o.dispenseGroupId,
      )
      return {
        orderItems,
        defaultExpandedGroups,
      }
    },
    //validationSchema: Yup.object().shape({}),
    handleSubmit: () => {},
    displayName: 'PharmarcyWorklistDetail',
  }),
)(Details)
