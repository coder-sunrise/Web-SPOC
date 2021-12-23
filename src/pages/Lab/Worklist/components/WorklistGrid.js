import React, { useContext, useEffect, useState } from 'react'
import ReactDOM from 'react-dom'
import { useDispatch, useSelector } from 'dva'
import _ from 'lodash'
import { formatMessage } from 'umi'
import { Table, Badge, Menu, Dropdown, Space, Typography, Card } from 'antd'
import {
  DownOutlined,
  RightOutlined,
  PlusCircleTwoTone,
  MinusCircleTwoTone,
  CoffeeOutlined,
  UnorderedListOutlined,
  DeleteOutlined,
} from '@ant-design/icons'
import Delete from '@material-ui/icons/Delete'
import { CommonModal, DatePicker, Select, Button } from '@/components'
import WorklistContext from '../WorklistContext'
import {
  StatusButtons,
  SpecimenCollection,
  SpecimenDiscarding,
  ExapandCollapseAllButton,
} from './index'
import { SpecimenDetails } from '../SpecimenDetails'
import styles from './WorklistGrid.less'

const MODALS = {
  NONE: '',
  SPECIMEN_COLLECTION: 'SPECIMEN_COLLECTION',
  SPECIMEN_DETAILS: 'SPECIMEN_DETAILS',
  SPECIMEN_DISCARDING: 'SPECIMEN_DISCARDING',
}

export const WorklistGrid = ({ labWorklist, codetable, clinicSettings }) => {
  const { list = [] } = labWorklist
  const { getVisitTypes } = useContext(WorklistContext)
  const dispatch = useDispatch()
  const [currentModal, setCurrentModal] = useState({
    modal: MODALS.NONE,
    para: undefined,
  })
  const [expandingKeys, setExpandingKeys] = useState([])

  useEffect(() => {
    dispatch({
      type: 'codetable/fetchCodes',
      payload: { code: 'cttestcategory' },
    })

    dispatch({
      type: 'codetable/fetchCodes',
      payload: { code: 'cttestpanel' },
    })
  }, [])

  useEffect(() => {
    if (labWorklist && labWorklist.list) {
      expandAllRows()
    }
  }, [labWorklist])

  const expandAllRows = () =>
    setExpandingKeys(
      _.uniq(labWorklist.list.map(item => item.patientReferenceNo)),
    )

  const patients = _.uniqBy(
    list.map(item => ({
      patientName: item.patientName,
      key: item.patientReferenceNo,
      summary:
        'Biochemistry: 2, Serology/Immunology: 0, Hematology: 1, Urinalysisi: 0, Swab: 1, Faeces: 0',
    })),
    'key',
  )

  const visitTypes = getVisitTypes()

  const expandedRowRender = (record, index, indent, expanded) => {
    const columns = [
      {
        title: 'Ref. No',
        dataIndex: 'patientReferenceNo',
        key: 'patientReferenceNo',
        ellipsis: true,
      },
      {
        title: 'Doctor',
        dataIndex: 'doctor',
        key: 'doctor',
        ellipsis: true,
      },
      {
        title: 'Visit Type',
        wdith: 100,
        dataIndex: 'visitPurposeId',
        key: 'visitPurposeId',
        render: (text, record, index) => {
          const visitType = visitTypes.find(
            item => item.id === record.visitPurposeId,
          )
          return visitType ? visitType.name : ''
        },
      },
      {
        title: 'Category',
        dataIndex: 'testCategoryId',
        key: 'testCategoryId',
        render: (text, record, index) => {
          const testCategories = codetable.cttestcategory ?? []

          const testCategory = testCategories.find(
            item => item.id === record.testCategoryId,
          )
          return testCategory ? testCategory.name : ''
        },
      },
      {
        title: 'Test',
        dataIndex: 'testPanels',
        key: 'testPanels',
        width: 200,
        render: (text, record, index) => {
          const testPanels = codetable.cttestpanel ?? []

          const currentTestPanels = testPanels.filter(
            item =>
              record.testPanels.findIndex(
                currentTestPanel => currentTestPanel === item.id,
              ) !== -1,
          )
          console.log('currentTestPanels', currentTestPanels)
          return currentTestPanels
            .map(item => item.name)
            .sort()
            .join(', ')
        },
      },
      {
        title: 'Specimen Type',
        width: 150,
        dataIndex: 'specimenTypeId',
        key: 'specimenTypeId',
        ellipsis: true,
      },
      {
        title: 'Specimen ID',
        dataIndex: 'specimenId',
        key: 'specimenId',
        ellipsis: true,
      },
      {
        title: 'Collection By',
        dataIndex: 'collectionBy',
        key: 'collectionBy',
        ellipsis: true,
      },
      {
        title: '1st Order Date',
        dataIndex: 'firstOrderDate',
        key: 'firstOrderDate',
        ellipsis: true,
      },
      {
        title: '1st Verifier',
        dataIndex: 'firstOrderDate',
        key: 'firstOrderDate',
        ellipsis: true,
      },
      {
        title: '2nd Verifier',
        dataIndex: 'firstOrderDate',
        key: 'firstOrderDate',
        ellipsis: true,
      },
      {
        title: 'Status',
        width: 100,
        dataIndex: 'firstOrderDate',
        key: 'firstOrderDate',
        ellipsis: true,
      },
      {
        title: 'Action',
        width: 85,
        dataIndex: 'operation',
        key: 'operation',
        align: 'center',
        render: () => (
          <Space size='small'>
            <Button
              onClick={() => {
                if (currentModal.modal === MODALS.NONE)
                  setCurrentModal({
                    modal: MODALS.SPECIMEN_DETAILS,
                    para: record.specimenId,
                  })
              }}
              justIcon
              color='primary'
              size='sm'
            >
              <UnorderedListOutlined />
            </Button>
            <Button
              onClick={() => {
                if (currentModal.modal === MODALS.NONE)
                  setCurrentModal({
                    modal: MODALS.SPECIMEN_DISCARDING,
                    para: record.specimenId,
                  })
              }}
              justIcon
              color='danger'
              size='sm'
            >
              <Delete />
            </Button>
          </Space>
        ),
      },
    ]

    const groupedTestPanels = _.uniqBy(
      list
        .filter(item => item.patientReferenceNo === record.key)
        .map(item => ({
          key: item.patientReferenceNo,
          patientReferenceNo: item.patientReferenceNo,
          doctor:
            (item.doctorTitle ? `${item.doctorTitle} ` : '') + item.doctorName,
          testPanels: _.uniq(
            list
              .filter(
                innerItem =>
                  innerItem.patientReferenceNo === record.key &&
                  innerItem.testCategoryId === item.testCategoryId,
              )
              .map(innerItem => innerItem.testPanelId),
          ),
          ...item,
        })),
      'testCategoryId',
    )

    return (
      <Table
        bordered
        columns={columns}
        dataSource={groupedTestPanels}
        pagination={false}
      />
    )
  }
  console.log('expandingKeys', expandingKeys)
  const columns = [
    {
      title: 'Name',
      dataIndex: 'patientName',
      key: 'patientName',
      render: (text, record) => {
        return (
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <Typography.Text strong style={{ flexGrow: 1 }}>
              Patient: {record.patientName}
            </Typography.Text>
            <Button
              size='sm'
              underline
              color='info'
              noUnderline={false}
              link
              onClick={() => {
                if (currentModal.modal === MODALS.NONE)
                  setCurrentModal({
                    modal: MODALS.SPECIMEN_COLLECTION,
                    para: record.patientReferenceNo,
                  })
              }}
            >
              Collect Specimen
            </Button>
            <span>{record.summary}</span>
          </div>
        )
      },
    },
  ]

  return (
    <Card>
      <div style={{ display: 'flex', alignItems: 'start' }}>
        <ExapandCollapseAllButton
          onExpandAllClick={() => expandAllRows()}
          onCollapseAllClick={() => setExpandingKeys([])}
        />
        <StatusButtons
          style={{
            flexGrow: 1,
            justifyContent: 'end',
            marginBottom: 10,
          }}
        />
      </div>
      <Table
        className={styles.table}
        size='small'
        columns={columns}
        rowClassName={styles.expandableRow}
        expandable={{
          expandedRowRender,
          onExpand: (expanded, record) => {
            expanded
              ? setExpandingKeys([...expandingKeys, record.key])
              : setExpandingKeys(
                  expandingKeys.filter(item => item !== record.key),
                )
          },
        }}
        expandedRowKeys={expandingKeys}
        showHeader={false}
        dataSource={patients}
        pagination={false}
        expandIcon={({ expanded, onExpand, record }) =>
          expanded ? (
            <DownOutlined onClick={e => onExpand(record, e)} />
          ) : (
            <RightOutlined onClick={e => onExpand(record, e)} />
          )
        }
      />

      <SpecimenCollection
        open={currentModal.modal === MODALS.SPECIMEN_COLLECTION}
        onClose={() => {
          console.log('closed me!!!')
          setCurrentModal({ modal: MODALS.NONE })
        }}
      ></SpecimenCollection>
      <SpecimenDetails
        open={currentModal.modal === MODALS.SPECIMEN_DETAILS}
        onClose={() => {
          console.log('closed me!!!')
          setCurrentModal({ modal: MODALS.NONE })
        }}
      />
      <SpecimenDiscarding
        open={currentModal.modal === MODALS.SPECIMEN_DISCARDING}
        onClose={() => {
          console.log('closed me!!!')
          setCurrentModal({ modal: MODALS.NONE })
        }}
      />
    </Card>
  )
}
