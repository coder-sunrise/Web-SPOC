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
import { LAB_WORKITEM_STATUS } from '@/utils/constants'
import { useVisitTypes } from '@/utils/hooks'
import { CommonModal, DatePicker, Select, Button } from '@/components'
import WorklistContext from '../WorklistContext'
import {
  StatusButtons,
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
  const [visits, setVisits] = useState([])
  const [collapsedKeys, setCollapsedKeys] = useState([])

  const dispatch = useDispatch()
  const visitTypes = useVisitTypes()
  const [currentModal, setCurrentModal] = useState({
    modal: MODALS.NONE,
    para: undefined,
  })

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
      const uniqueVisits = _(
        list.map(item => ({
          key: item.visitId,
          patientName: item.patientName,
          patientReferenceNo: item.patientReferenceNo,
          visitId: item.visitId,
          workitems: list
            .filter(inner => inner.visitId === item.visitId)
            .map(inner => ({
              testCategoryId: inner.testCategoryId,
              workitemStatusId: inner.workitemStatusId,
              workitemId: inner.workitemId,
              visitId: inner.visitId,
            })),
        })),
      )
        .uniqBy('visitId')
        .value()

      setVisits(uniqueVisits)
    }
  }, [labWorklist])

  const getTestCategorySummary = visit => {
    if (!visit || !codetable.cttestcategory) return ''
    const testCategories = codetable.cttestcategory.map(item => ({
      name: item.displayValue,
      incompleteWorkitemCount: visit.workitems.filter(
        w =>
          w.testCategoryId === item.id &&
          w.workitemStatusId !== LAB_WORKITEM_STATUS.COMPLETED,
      ).length,
    }))

    console.log(
      'WorklistGrid - codetable.cttestcategory',
      codetable.cttestcategory,
    )
    console.log('WorklistGrid - testCategories', testCategories)

    return 'test'
  }

  const expandedRowRender = (record, index, indent, expanded) => {
    const columns = [
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
        title: 'Visit Doctor',
        dataIndex: 'doctor',
        key: 'doctor',
        ellipsis: true,
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
        dataIndex: 'generateDate',
        key: 'generateDate',
        ellipsis: true,
      },
      {
        title: '1st Verifier',
        dataIndex: 'generateDate',
        key: 'generateDate',
        ellipsis: true,
      },
      {
        title: '2nd Verifier',
        dataIndex: 'generateDate',
        key: 'generateDate',
        ellipsis: true,
      },
      {
        title: 'Status',
        width: 100,
        dataIndex: 'generateDate',
        key: 'generateDate',
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
        .filter(item => item.visitId === record.visitId)
        .map(item => ({
          visitId: item.visitId,
          patientReferenceNo: item.patientReferenceNo,
          doctor:
            (item.doctorTitle ? `${item.doctorTitle} ` : '') + item.doctorName,
          testPanels: _.uniq(
            list
              .filter(
                innerItem =>
                  innerItem.visitId === record.visitId &&
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
  const columns = [
    {
      title: 'Name',
      dataIndex: 'patientName',
      key: 'patientName',
      render: (text, record) => {
        console.log('WorklistGrid - Top Level Records : ', record)
        return (
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <Typography.Text strong style={{ flexGrow: 1 }}>
              {record.patientName} ({record.patientReferenceNo})
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
                    para: record.visitId,
                  })
              }}
            >
              Collect Specimen
            </Button>
            <span>{getTestCategorySummary(record)}</span>
          </div>
        )
      },
    },
  ]
  console.log('WorklistGrid - collapsedKeys', collapsedKeys)
  console.log('WorklistGrid - visits', visits)
  console.log(
    'WorklistGrid - expanded',
    visits.filter(v => !collapsedKeys.includes(v.visitId)).map(v => v.visitId),
  )

  return (
    <Card>
      <div style={{ display: 'flex', alignItems: 'start' }}>
        <ExapandCollapseAllButton
          onExpandAllClick={() => setCollapsedKeys([])}
          onCollapseAllClick={() =>
            setCollapsedKeys(visits.map(v => v.visitId))
          }
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
              ? setCollapsedKeys(
                  collapsedKeys.filter(item => item !== record.visitId),
                )
              : setCollapsedKeys([...collapsedKeys, record.visitId])
          },
        }}
        expandedRowKeys={visits
          .filter(v => !collapsedKeys.includes(v.visitId))
          .map(v => v.visitId)}
        showHeader={false}
        dataSource={visits}
        pagination={false}
        expandIcon={({ expanded, onExpand, record }) =>
          expanded ? (
            <DownOutlined onClick={e => onExpand(record, e)} />
          ) : (
            <RightOutlined onClick={e => onExpand(record, e)} />
          )
        }
      />
      <section style={{ margin: 10, fontStyle: 'italic' }}>
        Note: test panel in{' '}
        <span style={{ color: 'red' }}>red color = urgent </span>; test panel in
        black color = normal
      </section>

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
