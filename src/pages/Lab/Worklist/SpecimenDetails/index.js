import React, { useState, useEffect, useRef } from 'react'
import {
  Space,
  Collapse,
  InputNumber,
  Typography,
  Table,
  Checkbox,
  Input,
  Form,
  Button,
  Tooltip,
} from 'antd'
import Banner from '@/pages/PatientDashboard/Banner'
import { useSelector, useDispatch } from 'dva'
import {
  Icon,
  dateFormatLongWithTimeNoSec,
  DatePicker,
  Select,
  CommonModal,
  NumberInput,
  GridContainer,
  GridItem,
  ProgressButton,
} from '@/components'
import { VisitTypeTag } from '@/components/_medisys'
import { TestPanelColumn } from '../components/TestPanelColumn'
import { RetestSpecimen } from './components/RetestSpecimen'
import { SpecimenDetailsStep } from './components'
import { useCodeTable } from '@/utils/hooks'
import { LabResultTable } from './components/LabResultTable'
import { HeaderInfo } from './components/HeaderInfo'
import {
  LAB_SPECIMEN_STATUS,
  LAB_SPECIMEN_STATUS_COLORS,
} from '@/utils/constants'
import { RetestHistory } from './components/RetestHistory'

const { Panel } = Collapse
const { TextArea } = Input

const ActionButtons = ({ specimenStatusFK, onStart, onRetest, onVerify }) => {
  return (
    <React.Fragment>
      {specimenStatusFK === LAB_SPECIMEN_STATUS.NEW && (
        <ProgressButton color='success' onClick={onStart}>
          Start
        </ProgressButton>
      )}
      {(specimenStatusFK === LAB_SPECIMEN_STATUS.PENDINGFIRSTVERIFIER ||
        specimenStatusFK === LAB_SPECIMEN_STATUS.PENDINGSECONDVERIFIER) && (
        <ProgressButton color='warning' onClick={onRetest}>
          Retest
        </ProgressButton>
      )}
      {(specimenStatusFK === LAB_SPECIMEN_STATUS.INPROGRESS ||
        specimenStatusFK === LAB_SPECIMEN_STATUS.FORRETEST ||
        specimenStatusFK === LAB_SPECIMEN_STATUS.PENDINGFIRSTVERIFIER ||
        specimenStatusFK === LAB_SPECIMEN_STATUS.PENDINGSECONDVERIFIER) && (
        <ProgressButton color='success' onClick={onVerify}>
          Verify
        </ProgressButton>
      )}
    </React.Fragment>
  )
}

export const SpecimenDetails = ({
  open,
  id,
  onClose,
  onConfirm,
  isReadonly = false,
}) => {
  const dispatch = useDispatch()
  const cttestcategory = useCodeTable('cttestcategory')
  const ctspecimentype = useCodeTable('ctspecimentype')
  const cttestpanel = useCodeTable('cttestpanel')
  const { entity } = useSelector(s => s.worklistSpecimenDetails)
  const [isResultFullScreen, setIsResultFullScreen] = useState(false)
  const [formValues, setFormValues] = useState({})
  const [showReportRemarks, setShowReportRemarks] = useState(false)
  const [retestSpecimenPara, setRetestSpecimenPara] = useState({
    open: false,
    id: undefined,
  })
  const [retestHistoryPara, setRetestHistoryPara] = useState({
    open: false,
    id: undefined,
  })
  const [showConfirmEmptyResult, setShowConfirmEmptyResult] = useState(false)
  const [showRawData, setShowRawData] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const currentStatus = entity.specimenStatusFK
  const [form] = Form.useForm()

  const querySpecimenDetails = () => {
    dispatch({
      type: 'worklistSpecimenDetails/query',
      payload: { id },
    })
  }

  const cleanUp = () => {
    form.setFieldsValue({})
    form.resetFields()
    setFormValues({})
    setIsResultFullScreen(false)
    setShowModal(false)
    setShowReportRemarks(false)
    setRetestSpecimenPara({
      open: false,
      id: undefined,
    })
    dispatch({
      type: 'worklistSpecimenDetails/updateState',
      payload: { entity: {} },
    })
  }

  useEffect(() => {
    setShowModal(open)
    if (open && id) {
      querySpecimenDetails()
    }
  }, [id])

  useEffect(() => {
    if (!showModal) cleanUp()
  }, [showModal])

  useEffect(() => {
    form.resetFields() //to ensure to reset fields from previous item.
    form.setFieldsValue(entity)
    setFormValues(entity) //https://github.com/ant-design/ant-design/issues/21829

    if (entity.reportRemarks && entity.reportRemarks.trim().length > 0) {
      setShowReportRemarks(true)
    }
  }, [entity])

  const handleStart = () => {
    if (currentStatus === LAB_SPECIMEN_STATUS.NEW) {
      dispatch({
        type: 'worklistSpecimenDetails/startLabTest',
        payload: entity,
      }).then(result => {
        if (result) {
          setShowModal(false)
          onConfirm && onConfirm()
        }
      })
    }
  }

  const handleRetest = () => {
    setRetestSpecimenPara({
      open: true,
      id: entity.id,
    })
  }

  const closeRetestSpecimen = () => {
    setRetestSpecimenPara({
      open: false,
      id: undefined,
    })
    querySpecimenDetails()
  }

  const closeRetestHistory = () => {
    setRetestHistoryPara({
      open: false,
      id: undefined,
    })
  }

  const getChangedResults = values =>
    entity.labWorkitemResults.filter(
      x =>
        values.labWorkitemResults.findIndex(
          y =>
            x.id === y.id &&
            x.finalResult?.toString() != y.finalResult?.toString(),
        ) != -1,
    )

  const handleVerify = async () => {
    try {
      if (
        currentStatus !== LAB_SPECIMEN_STATUS.NEW &&
        currentStatus !== LAB_SPECIMEN_STATUS.DISCARDED &&
        currentStatus !== LAB_SPECIMEN_STATUS.COMPLETED
      ) {
        const values = await form.validateFields()

        if (
          values.labWorkitemResults.filter(
            x =>
              x.finalResult === null ||
              x.finalResult === undefined ||
              x.finalResult === '',
          ).length > 0
        ) {
          setShowConfirmEmptyResult(true)
          return
        }

        saveVerify()
      }
    } catch (errInfo) {
      console.log('Save failed:', errInfo)
    }
  }

  const saveVerify = async () => {
    const values = await form.validateFields()

    dispatch({
      type: 'worklistSpecimenDetails/verifyLabTest',
      payload: { ...entity, ...values },
    }).then(result => {
      if (result) {
        setShowModal(false)
        onConfirm && onConfirm()
      }
    })
  }

  const handleSave = async () => {
    try {
      const values = await form.validateFields()
      dispatch({
        type: 'worklistSpecimenDetails/saveLabTest',
        payload: { ...entity, ...values },
      }).then(result => {
        if (result) {
          setShowModal(false)
          onConfirm && onConfirm()
        }
      })
    } catch (errInfo) {
      console.log('Save failed:', errInfo)
    }
  }

  const renderRemarks = () => {
    if (currentStatus === LAB_SPECIMEN_STATUS.COMPLETED || isReadonly)
      return (
        <React.Fragment>
          {formValues.reportRemarks &&
            formValues.reportRemarks.trim().length > 0 && (
              <GridItem md={12}>
                <Typography.Text strong>Report Remarks: </Typography.Text>
                <span>{formValues.reportRemarks}</span>
              </GridItem>
            )}
          {formValues.internalRemarks &&
            formValues.internalRemarks.trim().length > 0 && (
              <GridItem md={12}>
                <Typography.Text strong>Internal Remarks: </Typography.Text>
                <span>{formValues.internalRemarks}</span>
              </GridItem>
            )}
        </React.Fragment>
      )

    return (
      <React.Fragment>
        {showReportRemarks ? (
          <GridItem md={12}>
            <Typography.Text strong>Report Remarks</Typography.Text>
            <Form.Item name='reportRemarks'>
              <TextArea rows={4} maxLength={2000} />
            </Form.Item>
          </GridItem>
        ) : (
          <GridItem md={12}>
            <Typography.Link
              underline
              onClick={() => setShowReportRemarks(true)}
            >
              Add Report Remarks
            </Typography.Link>
          </GridItem>
        )}
        <GridItem md={12}>
          <Typography.Text strong>Internal Remarks</Typography.Text>
          <Form.Item name='internalRemarks'>
            <TextArea rows={4} maxLength={2000} />
          </Form.Item>
        </GridItem>
      </React.Fragment>
    )
  }

  const resendOrder = () => {
    dispatch({
      type: 'worklistSpecimenDetails/resendOrder',
      payload: { id },
    })
  }

  console.log('form initial values')

  return (
    <React.Fragment>
      <CommonModal
        open={showModal}
        title='Lab Test Specimen Details'
        onClose={() => {
          setShowModal(false)
          onClose && onClose()
        }}
        footProps={{
          extraButtons: !isReadonly
            ? [
                <ActionButtons
                  specimenStatusFK={entity.specimenStatusFK}
                  onStart={handleStart}
                  onVerify={handleVerify}
                  onRetest={handleRetest}
                />,
              ]
            : [],
          onConfirm:
            entity.specimenStatusFK !== LAB_SPECIMEN_STATUS.COMPLETED &&
            !isReadonly
              ? () => {
                  handleSave()
                }
              : undefined,
        }}
        confirmText='Save'
        showFooter={true}
        maxWidth='lg'
      >
        <div>
          <Form
            form={form}
            initialValues={{ ...entity }}
            onValuesChange={(_, values) => setFormValues(values)}
          >
            <GridContainer
              style={{ height: 700, alignItems: 'start', overflowY: 'scroll' }}
            >
              {!isResultFullScreen && (
                <React.Fragment>
                  <GridItem md={12}>
                    <div style={{ padding: 8 }}>
                      <Banner />
                    </div>
                  </GridItem>
                  <GridItem md={12}>
                    <SpecimenDetailsStep timeline={entity.timeline} />
                  </GridItem>
                  <GridItem md={12}>
                    <HeaderInfo entity={entity} />
                  </GridItem>
                </React.Fragment>
              )}
              {entity.specimenStatusFK !== LAB_SPECIMEN_STATUS.NEW && (
                <GridItem md={12}>
                  <GridContainer>
                    <GridItem
                      md={12}
                      style={{ paddingTop: 16, display: 'flex' }}
                    >
                      <Space>
                        <Typography.Text strong style={{ flexGrow: 1 }}>
                          Final Result
                        </Typography.Text>
                        {entity.hasAnyRetest && (
                          <Tooltip title='Final Result History'>
                            <span
                              className='material-icons'
                              style={{ color: 'gray', cursor: 'pointer' }}
                              onClick={event => {
                                setRetestHistoryPara({
                                  open: true,
                                  dataSource: entity.labRetestHistories,
                                })
                              }}
                            >
                              history
                            </span>
                          </Tooltip>
                        )}

                        <Checkbox
                          onChange={e => setShowRawData(e.target.checked)}
                        />
                        <span>Display Raw Data</span>
                      </Space>
                      <div style={{ flexGrow: 1, textAlign: 'right' }}>
                        <Button type='link' onClick={resendOrder}>
                          Resend Order
                        </Button>
                        <Icon
                          type={
                            isResultFullScreen
                              ? 'fullscreen-exit'
                              : 'fullscreen'
                          }
                          style={{ border: '1px solid', fontSize: '1rem' }}
                          onClick={() =>
                            setIsResultFullScreen(!isResultFullScreen)
                          }
                        />
                      </div>
                    </GridItem>
                    <GridItem md={12} style={{ paddingTop: 8 }}>
                      <Form.Item name='labWorkitemResults'>
                        <LabResultTable
                          showRawData={showRawData}
                          isReadonly={
                            isReadonly ||
                            entity.specimenStatusFK ===
                              LAB_SPECIMEN_STATUS.COMPLETED
                          }
                        />
                      </Form.Item>
                    </GridItem>
                    {renderRemarks()}
                  </GridContainer>
                </GridItem>
              )}
            </GridContainer>
          </Form>
        </div>
      </CommonModal>
      <RetestSpecimen
        {...retestSpecimenPara}
        onClose={() => {
          closeRetestSpecimen()
        }}
        onConfirm={() => {
          closeRetestSpecimen()
        }}
      />
      <RetestHistory
        {...retestHistoryPara}
        onClose={() => {
          closeRetestHistory()
        }}
        onConfirm={() => {
          closeRetestHisotry()
        }}
      />
      <CommonModal
        open={showConfirmEmptyResult}
        onClose={() => {
          setShowConfirmEmptyResult(false)
        }}
        onConfirm={() => {
          saveVerify()
          setShowConfirmEmptyResult(false)
        }}
        showFooter={true}
        cancelText='Cancel'
        maxWidth='xs'
      >
        <div>Some final result fields are empty. Confirm to proceed?</div>
      </CommonModal>
    </React.Fragment>
  )
}
