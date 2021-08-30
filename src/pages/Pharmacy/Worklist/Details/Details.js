import React, { useState, useContext } from 'react'
import { connect } from 'dva'
import { Typography, Alert, Select } from 'antd'
import { compose } from 'redux'
import numeral from 'numeral'
import moment from 'moment'
import { history } from 'umi'
import { withStyles } from '@material-ui/core'
import Warning from '@material-ui/icons/Error'
import {
  GridContainer,
  GridItem,
  Button,
  CheckboxGroup,
  CommonTableGrid,
  CommonModal,
  withFormikExtend,
  NumberInput,
  Tooltip
} from '@/components'
import { FileCopySharp } from '@material-ui/icons'
import { navigateDirtyCheck, getTranslationValue } from '@/utils/utils'
import { VISIT_TYPE, PHARMACY_STATUS, PHARMACY_ACTION } from '@/utils/constants'
import DrugMixtureInfo from '@/pages/Widgets/Orders/Detail/DrugMixtureInfo'
import Banner from '@/pages/PatientDashboard/Banner'
import { MenuOutlined } from '@ant-design/icons'
import { PharmacySteps } from '../../Components'
import AddOrder from '@/pages/Dispense/DispenseDetails/AddOrder'

const drugMixtureIndicator = (row, right) => {
  return (
    <DrugMixtureInfo values={row.prescriptionDrugMixture} right={right} />
  )
}

const styles = (theme) => ({
  wrapCellTextStyle: {
    wordWrap: 'break-word',
    whiteSpace: 'pre-wrap',
  },
  rightIcon: {
    position: 'absolute',
    bottom: 2,
    fontWeight: 500,
    color: 'white',
    fontSize: '0.7rem',
    padding: '2px 3px',
    height: 20,
    cursor: 'pointer'
  }
})

const ContentGridItem = ({ children, title }) => {
  return (
    <GridItem md={4} style={{ paddingLeft: 130, marginBottom: 8 }}>
      <div style={{ position: 'relative' }}>
        <div style={{
          width: 130,
          textAlign: 'right',
          position: 'absolute',
          left: '-130px',
          fontWeight: 500
        }}>{title}</div>
        <div style={{ marginLeft: 6 }}> {children}</div>
      </div>
    </GridItem>
  )
}

const Details = (props) => {
  const { pharmacyDetails, patient, dispatch, classes, clinicSettings, codetable } = props
  const {
    inventorymedication = [],
    ctmedicationunitofmeasurement = [],
  } = codetable
  const { primaryPrintoutLanguage = 'EN', secondaryPrintoutLanguage = '', labelPrinterSize } = clinicSettings
  const [showEditOrderModal, setShowEditOrderModal] = useState(false)
  const [printlanguage, setPrintlanguage] = useState([primaryPrintoutLanguage])
  const [showLanguage, setShowLanguage] = useState(primaryPrintoutLanguage)
  const workitem = pharmacyDetails.entity || {}
  const statusHistory = [...(workitem.pharmarcyWorklistHistory || []),
  {
    statusFK: workitem.statusFK,
    actionDate: workitem.updateDate,
    actionByUser: workitem.updateByUser,
    actionByUserTitle: workitem.updateByUserTitle
  }]
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
    if (visitPurposeFK === VISIT_TYPE.RETAIL) {
      _editOrder()
    } else {
      navigateDirtyCheck({
        onProceed: _editOrder,
      })(e)
    }
  }

  const updatePharmacy = (actionType) => {
    dispatch({ type: 'pharmacyDetails/upsert', payload: { ...workitem, actionType } }).then(
      r => {
        const { onConfirm } = props
        onConfirm()
      }
    )
  }

  const reloadPharmacy = () => {
    dispatch({ type: 'pharmacyDetails/query', payload: { id: workitem.id } })
    setShowEditOrderModal(false)
  }

  const getInstruction = (row) => {
    if (row.invoiceItemTypeFK !== 1) return ''
    return row.language.isShowFirstValue ? row.instruction : row.secondInstruction
  }

  const getDrugInteraction = (row) => {
    if (row.invoiceItemTypeFK !== 1) return ''
    var medication = inventorymedication.find(m => m.id === row.inventoryFK) || {}
    const {
      inventoryMedication_MedicationInteraction = []
    } = medication
    if (!inventoryMedication_MedicationInteraction.length) return '-'
    return (
      <div>
        {inventoryMedication_MedicationInteraction.map(item => {
          return <p> {getTranslationValue(
            item.translationData,
            row.language.value,
            'displayValue',
          )}
          </p>
        })}
      </div>
    )
  }

  const getDrugContraIndication = (row) => {
    if (row.invoiceItemTypeFK !== 1) return ''
    var medication = inventorymedication.find(m => m.id === row.inventoryFK) || {}
    const {
      inventoryMedication_MedicationContraIndication = [],
    } = medication
    if (!inventoryMedication_MedicationContraIndication.length) return '-'
    return (
      <div>
        {inventoryMedication_MedicationContraIndication.map(item => {
          return <p> {getTranslationValue(
            item.translationData,
            row.language.value,
            'displayValue',
          )}
          </p>
        })}
      </div>
    )
  }

  const getDispenseUOM = (row) => {
    if (row.invoiceItemTypeFK !== 1) return ''
    var medication = inventorymedication.find(m => m.id === row.inventoryFK) || {}
    var uom = ctmedicationunitofmeasurement.find(m => m.id === medication?.dispensingUOM?.id) || {}
    return getTranslationValue(
      uom.translationData,
      row.language.value,
      'displayValue',
    )
  }

  const getUOM = (row) => {
    if (row.invoiceItemTypeFK !== 1) return row.dispenseUOM
    return row.language.isShowFirstValue ? row.dispenseUOM : row.secondDispenseUOM
  }

  const showDrugLabelRemark = labelPrinterSize === '5.4cmx8.2cm'
  return <div>
    <div style={{ maxHeight: 800, overflowY: 'scroll', marginBottom: 10 }}>
      <Banner
        patientInfo={patient}
        style={{ position: 'relative' }}
      />
      <div style={{ marginTop: 16 }}>
        <GridContainer>
          <GridItem>
            <PharmacySteps statusHistory={statusHistory} currentStatusFK={workitem.statusFK} />
          </GridItem>
          <GridItem md={12}>
            <Typography.Title level={5}>Order Details</Typography.Title>
          </GridItem>
          <ContentGridItem title='Queue No.:'>{workitem.queueNo}</ContentGridItem>
          <ContentGridItem title='Diagnosis:'>{corDiagnosis.length ? workitem.corDiagnosis.map(d => d.diagnosisDescription).join(', ') : '-'}</ContentGridItem>
          <ContentGridItem title='Visit Type:'>{workitem.visitType}</ContentGridItem>
          <ContentGridItem title='Order By:'>{`${workitem.generateByUserTitle && workitem.generateByUserTitle.trim().length ? `${workitem.generateByUserTitle}. ` : ''}${workitem.generateByUser || ''}`}</ContentGridItem>
          <ContentGridItem title='Order Created Time:'>{moment(workitem.generateDate).format('HH:mm, DD MMM YYYY')}</ContentGridItem>
          <ContentGridItem title='Group:'>{(workitem.visitGroup && workitem.visitGroup.trim().length) ? workitem.visitGroup : '-'}</ContentGridItem>
          <ContentGridItem title='Family History:'>{(workitem.familyHistory && workitem.familyHistory.trim().length) ? workitem.familyHistory : '-'}</ContentGridItem>
          <ContentGridItem title='Social History:'>{(workitem.socialHistory && workitem.socialHistory.trim().length) ? workitem.socialHistory : '-'}</ContentGridItem>
          <ContentGridItem title='Medical History:'>{(workitem.medicalHistory && workitem.medicalHistory.trim().length) ? workitem.medicalHistory : '-'}</ContentGridItem>
          <GridItem md={6}>
            <Alert
              message={`${workitem.latestOrderUpdateUser} amended prescription at ${moment(workitem.latestOrderUpdateDate).format("HH:mm")}`}
              banner
              style={{
                whiteSpace: 'nowrap',
                textOverflow: 'ellipsis',
                width: '100%',
                overflow: 'hidden',
                padding: '3px 6px',
                lineHeight: '25px',
                fontSize: '0.85rem',
              }}
              icon={<Warning style={{ color: 'red' }} />}
            />
          </GridItem>
          <GridItem md={6} style={{
            display: 'flex',
            justifyContent: 'flex-end',
          }}>

            <Typography.Text
              underline
              style={{
                cursor: 'pointer', color: '#1890f8', position: 'relative', top: '6px'
              }}
              onClick={() => {

              }}
            >
              Journal History
            </Typography.Text>

            {secondaryPrintoutLanguage !== '' &&
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
              onChange={(v) => {
                setShowLanguage(v)
                const { setFieldValue } = props
                setFieldValue('orderItems', props.values.orderItems.map(item => {
                  return {
                    ...item,
                    language: {
                      value: v,
                      isShowFirstValue: v === primaryPrintoutLanguage
                    }
                  }
                }))
              }}
            />
            }
          </GridItem>
          <GridItem style={{ marginTop: 8 }}>
            <CommonTableGrid
              forceRender
              size='sm'
              FuncProps={{ pager: false }}
              rows={props.values?.orderItems || []}
              columns={[
                { name: 'invoiceItemTypeFK', title: 'Type' },
                { name: 'itemCode', title: 'Code' },
                { name: 'itemName', title: 'Name' },
                { name: 'dispenseUOM', title: 'UOM' },
                { name: 'quantity', title: 'Ordered' },
                { name: 'dispenseQuantity', title: 'Dispensed' },
                { name: 'stock', title: 'Bal. Qty.' },
                { name: 'batchNo', title: 'Batch No.' },
                { name: 'expiryDate', title: 'Expiry Date' },
                { name: 'instruction', title: `Instruction${secondaryPrintoutLanguage !== '' ? `(${showLanguage})` : ''}` },
                { name: 'drugInteraction', title: `Drug Interaction${secondaryPrintoutLanguage !== '' ? `(${showLanguage})` : ''}` },
                { name: 'drugContraindication', title: `Contraindication${secondaryPrintoutLanguage !== '' ? `(${showLanguage})` : ''}` },
                { name: 'remarks', title: 'Remarks' },
                { name: 'action', title: 'Action' },
              ]}
              columnExtensions={[
                {
                  columnName: 'invoiceItemTypeFK',
                  width: 110,
                  sortingEnabled: false,
                  render: (row) => {
                    let type = 'Consumable'
                    if (row.invoiceItemTypeFK == 1) {
                      if (row.isDrugMixture)
                        type = 'Drug Mixture'
                      else if (!row.inventoryMedicationFK) {
                        type = 'Open Prescription'
                      }
                      else { type = 'Medication' }
                    }
                    return <Tooltip title={type}><span>{type}</span></Tooltip>
                  }
                },
                {
                  columnName: 'itemCode',
                  width: 100,
                  sortingEnabled: false
                },
                {
                  columnName: 'itemName',
                  width: 200,
                  sortingEnabled: false,
                  render: (row) => {
                    let paddingRight = 0
                    if (row.isExclusive) {
                      paddingRight = 24
                    }
                    if (row.isDrugMixture) {
                      paddingRight = 10
                    }
                    return (
                      <div style={{ position: 'relative' }}>
                        <div className={classes.wrapCellTextStyle}
                          style={{ paddingRight: paddingRight }}>
                          {row.itemName}
                          <div style={{ position: 'relative', top: 2 }}>
                            {row.isDrugMixture && drugMixtureIndicator(row, -20)}
                            {row.isExclusive && (
                              <Tooltip title='Exclusive Drug'>
                                <div
                                  className={classes.rightIcon}
                                  style={{
                                    right: -30,
                                    borderRadius: 4,
                                    backgroundColor: 'green',
                                  }}
                                >Excl.</div>
                              </Tooltip>
                            )}
                          </div>
                        </div>
                      </div>
                    )
                  }
                },
                {
                  columnName: 'dispenseUOM',
                  width: 80,
                  sortingEnabled: false,
                  render: (row) => getUOM(row)
                },
                {
                  columnName: 'quantity',
                  width: 80,
                  sortingEnabled: false,
                  render: (row) => {
                    const qty = numeral(row.quantity).format('0.0')
                    return (
                      <Tooltip title={qty}><span>{qty}</span></Tooltip>
                    )
                  }
                },
                {
                  columnName: 'dispenseQuantity',
                  width: 80,
                  sortingEnabled: false,
                  render: (row) => {
                    if (row.statusFK !== PHARMACY_STATUS.NEW || row.isExternalPrescription) {
                      const dispenseQty = `${numeral(row.dispenseQuantity).format('0.0')}`
                      return (
                        <Tooltip title={dispenseQty}><span>{dispenseQty}</span></Tooltip>
                      )
                    }
                    return <NumberInput
                      label=''
                      step={1}
                      min={0}
                      max={row.stock}
                      precision={1}
                      value={row.dispenseQuantity}
                      onChange={v => {
                        const { setFieldValue } = props
                        setFieldValue('prescription[${row.rowIndex}]dispenseQuantity', v.target.value)
                      }}
                    />
                  }
                },
                {
                  columnName: 'stock',
                  width: 100,
                  sortingEnabled: false,
                  render: (row) => {
                    const stock = `${numeral(row.stock).format('0.0')} ${getDispenseUOM(row)}`
                    return (
                      <Tooltip title={stock}><span>{stock}</span></Tooltip>
                    )
                  }
                },
                {
                  columnName: 'batchNo',
                  width: 100,
                  sortingEnabled: false
                },
                {
                  columnName: 'expiryDate',
                  width: 100,
                  sortingEnabled: false
                },
                {
                  columnName: 'instruction',
                  sortingEnabled: false,
                  render: (row) => {
                    const instruction = getInstruction(row)
                    return (
                      <Tooltip title={instruction}><span>{instruction}</span></Tooltip>
                    )
                  }
                },
                {
                  columnName: 'drugInteraction',
                  sortingEnabled: false,
                  render: (row) => {
                    const interaction = getDrugInteraction(row)
                    return (
                      <Tooltip title={interaction}><span>{interaction}</span></Tooltip>
                    )
                  }
                },
                {
                  columnName: 'drugContraindication',
                  sortingEnabled: false,
                  render: (row) => {
                    const contraIndication = getDrugContraIndication(row)
                    return (
                      <Tooltip title={contraIndication}><span>{contraIndication}</span></Tooltip>
                    )
                  }
                },
                {
                  columnName: 'remarks',
                  sortingEnabled: false,
                  render: (row) => {
                    const existsDrugLabelRemarks = showDrugLabelRemark && row.drugLabelRemarks && row.drugLabelRemarks.trim() !== ''
                    return <div style={{ position: 'relative' }} >
                      <div
                        style={{
                          wordWrap: 'break-word',
                          whiteSpace: 'pre-wrap',
                          paddingRight: existsDrugLabelRemarks ? 10 : 0
                        }}
                      >
                        {row.remarks || ' '}
                        <div style={{ position: 'relative', top: 2 }}>
                          {existsDrugLabelRemarks &&
                            <div style={{
                              position: 'absolute',
                              bottom: 2,
                              right: -15,
                            }}>
                              <Tooltip title={
                                <div>
                                  <div style={{ fontWeight: 500 }}>Drug Label Remarks</div>
                                  <div>{row.drugLabelRemarks}
                                  </div>
                                </div>
                              }>
                                <FileCopySharp style={{ color: '#4255bd' }} />
                              </Tooltip>
                            </div>
                          }
                        </div>
                      </div>
                    </div >
                  }
                },
                {
                  columnName: 'action',
                  width: 60,
                  sortingEnabled: false,
                  render: (row) => {
                    return <Button justIcon color='primary'><MenuOutlined /></Button>
                  }
                },]}>
            </CommonTableGrid>
          </GridItem>
        </GridContainer>
      </div>
    </div>
    <GridContainer>
      <GridItem md={8} >
        <div style={{ position: 'relative' }}>
          <Button color='primary' size='sm'>Print Prescription</Button>
          <Button color='primary' size='sm'>Print leaflet/Drug Summary Label</Button>
          <Button color='primary' size='sm'>Print Drug Label</Button>
          <CheckboxGroup
            value={printlanguage}
            style={{ position: 'absolute', bottom: '-5px', marginLeft: '6px' }}
            options={[
              { value: 'EN', label: 'EN' },
              { value: 'JP', label: 'JP' },
            ]}
            onChange={v => {
              setPrintlanguage(v.target.value)
            }} />
        </div>
      </GridItem>
      <GridItem md={4} style={{
        display: 'flex',
        justifyContent: 'flex-end',
      }} >
        <Button color='danger' size='sm' onClick={() => {
          const { onClose } = props
          onClose()
        }}>Cancel</Button>
        {workitem.statusFK === PHARMACY_STATUS.NEW && (workitem.visitPurposeFK == VISIT_TYPE.RETAIL ?
          <Button color='success' size='sm' onClick={editOrder}>Add Order</Button>
          : <Button color='success' size='sm' onClick={editOrder}>Edit Order</Button>)}
        {workitem.statusFK !== PHARMACY_STATUS.NEW && <Button color='primary' size='sm' onClick={() => updatePharmacy(PHARMACY_ACTION.BACKTONEW)}>Back To New</Button>}
        {workitem.statusFK === PHARMACY_STATUS.NEW && <Button color='primary' size='sm' onClick={() => updatePharmacy(PHARMACY_ACTION.PREPARE)}>Prepared</Button>}
        {workitem.statusFK === PHARMACY_STATUS.PREPARED && <Button color='primary' size='sm' onClick={() => updatePharmacy(PHARMACY_ACTION.VERIFY)}>Verify</Button>}
        {workitem.statusFK === PHARMACY_STATUS.VERIFIED && <Button color='primary' size='sm' onClick={() => updatePharmacy(PHARMACY_ACTION.COMPLETE)}>Complete</Button>}
      </GridItem>
    </GridContainer>
    <CommonModal
      open={showEditOrderModal}
      title='Edit Order'
      showFooter={true}
      onClose={() => {
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
  </div >
}

export default compose(
  withStyles(styles),
  connect(({ pharmacyDetails, patient, clinicSettings, codetable }) => ({
    pharmacyDetails,
    patient,
    clinicSettings: clinicSettings.settings || clinicSettings.default,
    codetable
  })),
  withFormikExtend({
    enableReinitialize: true,
    mapPropsToValues: ({ pharmacyDetails, clinicSettings }) => {
      const { primaryPrintoutLanguage = 'EN' } = clinicSettings
      return {
        orderItems: (pharmacyDetails.entity?.pharmacyOrderItem || []).map(item => {
          return {
            ...item,
            language: {
              value: primaryPrintoutLanguage,
              isShowFirstValue: true,
            },
            statusFK: pharmacyDetails.entity?.statusFK
          }
        })
      }
    },
    //validationSchema: Yup.object().shape({}),
    handleSubmit: () => { },
    displayName: 'PharmarcyWorklistDetail',
  })
)(Details)