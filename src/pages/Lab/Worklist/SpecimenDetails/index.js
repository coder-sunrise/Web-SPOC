import React, { useState, useEffect, useRef } from 'react'
import {
  Space,
  Collapse,
  InputNumber,
  Typography,
  Table,
  Checkbox,
  Form,
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
import { SpecimenStatusTag } from '../components/SpecimenStatusTag'
import { TestPanelColumn } from '../components/TestPanelColumn'
import { SpecimenDetailsStep } from './components'
import { useCodeTable } from '@/utils/hooks'
import { EditableTable } from './components/LabResultTable'
import { HeaderInfo } from './components/HeaderInfo'
import {
  LAB_SPECIMEN_STATUS,
  LAB_SPECIMEN_STATUS_COLORS,
} from '@/utils/constants'

const { Panel } = Collapse

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

export const SpecimenDetails = ({ id, onClose, onConfirm }) => {
  const dispatch = useDispatch()
  const [isOpenModal, setIsOpenModal] = useState(false)
  const cttestcategory = useCodeTable('cttestcategory')
  const ctspecimentype = useCodeTable('ctspecimentype')
  const cttestpanel = useCodeTable('cttestpanel')
  const { entity } = useSelector(s => s.worklistSpecimenDetails)
  const [isResultFullScreen, setIsResultFullScreen] = useState(false)
  const currentStatus = entity.specimenStatusFK
  const [form] = Form.useForm()

  // const data = [
  //   { testPanel: 'CRE', rawData: '100', unit: 'mmHg', referenceRange: 0 - 10 },
  //   { testPanel: 'BUN', rawData: '100', unit: 'mmHg', referenceRange: 0 - 10 },
  //   { testPanel: 'GOT', rawData: '100', unit: 'mmHg', referenceRange: 0 - 10 },
  // ]

  useEffect(() => {
    if (id) {
      dispatch({
        type: 'worklistSpecimenDetails/query',
        payload: { id },
      }).then(val => {
        if (val) {
          setIsOpenModal(true)
        }
      })
    }

    return () => {
      form.resetFields()
      setIsResultFullScreen(false)
      setIsOpenModal(false)
      dispatch({
        type: 'worklistSpecimenDetails/updateState',
        payload: { entity: {} },
      })
    }
  }, [id])

  useEffect(() => {
    form.setFieldsValue({ ...entity })
  }, [entity])

  const handleStart = () => {
    if (currentStatus === LAB_SPECIMEN_STATUS.NEW) {
      dispatch({
        type: 'worklistSpecimenDetails/startLabTest',
        payload: entity,
      }).then(result => {
        if (result) {
          setIsOpenModal(false)
          onConfirm && onConfirm()
        }
      })
    }
  }

  const handleVerify = () => {
    if (
      currentStatus !== LAB_SPECIMEN_STATUS.NEW &&
      currentStatus !== LAB_SPECIMEN_STATUS.DISCARDED &&
      currentStatus !== LAB_SPECIMEN_STATUS.COMPLETED
    ) {
      dispatch({
        type: 'worklistSpecimenDetails/verifyLabTest',
        payload: entity,
      }).then(result => {
        if (result) {
          setIsOpenModal(false)
          onConfirm && onConfirm()
        }
      })
    }
  }

  const handleSave = async () => {
    try {
      const values = await form.validateFields()
      dispatch({
        type: 'worklistSpecimenDetails/saveLabTest',
        payload: { ...entity, ...values },
      }).then(result => {
        if (result) {
          setIsOpenModal(false)
          onConfirm && onConfirm()
        }
      })
    } catch (errInfo) {
      console.log('Save failed:', errInfo)
    }
  }

  return (
    <CommonModal
      open={isOpenModal}
      title='Lab Test Specimen Details'
      onClose={() => {
        setIsOpenModal(false)
        onClose && onClose()
      }}
      footProps={{
        extraButtons: [
          <ActionButtons
            specimenStatusFK={entity.specimenStatusFK}
            onStart={handleStart}
            onVerify={handleVerify}
          />,
        ],
        onConfirm:
          entity.specimenStatusFK !== LAB_SPECIMEN_STATUS.COMPLETED
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
                <SpecimenDetailsStep />
              </GridItem>
              <GridItem md={12}>
                <HeaderInfo entity={entity} />
              </GridItem>
            </React.Fragment>
          )}
          {entity.specimenStatusFK !== LAB_SPECIMEN_STATUS.NEW && (
            <GridItem md={12}>
              <Form form={form} initialValues={{ ...entity }}>
                <GridContainer>
                  <GridItem md={12} style={{ paddingTop: 16, display: 'flex' }}>
                    <Space>
                      <Typography.Text strong style={{ flexGrow: 1 }}>
                        Final Result:
                      </Typography.Text>

                      <Checkbox onChange={e => console.log} />
                      <span>Display Raw Data</span>
                    </Space>
                    <div style={{ flexGrow: 1, textAlign: 'right' }}>
                      <Icon
                        type={
                          isResultFullScreen ? 'fullscreen-exit' : 'fullscreen'
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
                      <EditableTable />
                    </Form.Item>
                  </GridItem>
                </GridContainer>
              </Form>
            </GridItem>
          )}
        </GridContainer>
      </div>
    </CommonModal>
  )
}
