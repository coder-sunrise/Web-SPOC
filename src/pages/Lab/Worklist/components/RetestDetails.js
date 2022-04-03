import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'dva'
import moment from 'moment'
import {
  Space,
  Collapse,
  Checkbox,
  InputNumber,
  Descriptions,
  Form,
  Input,
  Radio,
  Table,
} from 'antd'
import {
  dateFormatLongWithTimeNoSec,
  DatePicker,
  Select,
  CommonModal,
  NumberInput,
  TextField,
} from '@/components'
import { useCodeTable } from '@/utils/hooks'
import { Description } from '@material-ui/icons'
import { FlagIndicator } from '.'

export const RetestDetails = ({ open, id, onClose, onConfirm }) => {
  const [showModal, setShowModal] = useState(false)
  const ctspecimentype = useCodeTable('ctspecimentype')
  const cttestpanelitem = useCodeTable('cttestpanelitem')
  const [retestDetails, setRetestDetails] = useState({})
  const [isSelectedAnalyzerResult, setIsSelectedAnalyzerResult] = useState(null)
  const { entity: patient } = useSelector(s => s.patient)
  const dispatch = useDispatch()

  useEffect(() => {
    setShowModal(open)
    if (open && id) {
      dispatch({
        type: 'labWorklist/getRetestDetails',
        payload: { id },
      }).then(data => {
        if (data) {
          setRetestDetails(data)
        }
      })
    }

    return () => {
      setRetestDetails({})
      setIsSelectedAnalyzerResult(null)
    }
  }, [id])

  const columns = [
    {
      title: 'Test Panel Item',
      dataIndex: 'testPanelItemFK',
      key: 'testPanelItemFK',
      ellipsis: true,
      width: 150,
      render: (text, record) => {
        const testPanelItem = cttestpanelitem.find(
          item => item.id === record.testPanelItemFK,
        )?.displayValue
        return <span>{testPanelItem}</span>
      },
    },
    {
      title: 'Result',
      dataIndex: 'result',
      key: 'result',
      ellipsis: true,
      width: 150,
      render: (text, record, onSave) => {
        return record.shouldFlag ? (
          <React.Fragment>
            <span style={{ color: 'red' }}>{text}</span>
            <FlagIndicator />
          </React.Fragment>
        ) : (
          <span>{text}</span>
        )
      },
    },
    {
      title: 'Unit',
      dataIndex: 'unit',
      key: 'unit',
      ellipsis: true,
      width: 100,
    },
  ]

  const handleConfirm = () => {
    dispatch({
      type: 'labWorklist/selectRetestResult',
      payload: {
        ...retestDetails,
        isSelectedAnalyzerResult,
      },
    }).then(success => {
      if (success) {
        setShowModal(false)
        onConfirm && onConfirm(id)
      } else {
        setShowModal(false)
        onClose && onClose()
      }
    })
  }

  return (
    <CommonModal
      open={showModal}
      title='Retest Details'
      footProps={{
        confirmProps: {
          disabled: isSelectedAnalyzerResult === null,
        },
      }}
      cancelText='Cancel'
      onClose={() => {
        setShowModal(false)
        onClose && onClose()
      }}
      onConfirm={handleConfirm}
      showFooter={true}
      width='md'
    >
      <Space direction='vertical' size='large' style={{ margin: '0 30px' }}>
        <span style={{ fontWeight: 'normal' }}>
          Multiple results detected. Please select one of the results as final
          result.
        </span>
        <div style={{ display: 'flex', justifyContent: 'space-evenly' }}>
          <Space direction='vertical' size='large'>
            <Descriptions layout='horizontal' column={1} colon>
              <Descriptions.Item label='Patient Name'>
                {retestDetails?.patientName}
              </Descriptions.Item>
              <Descriptions.Item label='Patient Ref. No.'>
                {retestDetails?.patientReferenceNo}
              </Descriptions.Item>
            </Descriptions>
            <div>
              <Radio
                checked={isSelectedAnalyzerResult}
                onChange={e => {
                  setIsSelectedAnalyzerResult(e.target.checked)
                }}
              >
                Latest Result
              </Radio>
              <Table
                style={{ width: 300 }}
                bordered
                columns={columns}
                dataSource={retestDetails.latestAnalyzerResults}
                pagination={false}
              />
            </div>
          </Space>
          <Space direction='vertical' size='large'>
            <Descriptions layout='horizontal' column={1} colon>
              <Descriptions.Item label='Accession No.'>
                {retestDetails.accessionNo}
              </Descriptions.Item>
              <Descriptions.Item label='Specimen Type'>
                {
                  ctspecimentype.find(
                    item => item.id === retestDetails.specimenTypeFK,
                  )?.name
                }
              </Descriptions.Item>
            </Descriptions>
            <div>
              <Radio
                checked={isSelectedAnalyzerResult === false}
                onChange={e => {
                  setIsSelectedAnalyzerResult(!e.target.checked)
                }}
              >
                Previous Result
              </Radio>
              <Table
                style={{ width: 300 }}
                bordered
                dataSource={retestDetails.currentResults}
                columns={columns}
                pagination={false}
              />
            </div>
          </Space>
        </div>
      </Space>
    </CommonModal>
  )
}
