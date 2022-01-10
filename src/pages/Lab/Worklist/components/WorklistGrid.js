import React, { useContext, useEffect, useState } from 'react'
import ReactDOM from 'react-dom'
import { useDispatch, useSelector } from 'dva'
import _ from 'lodash'
import { formatMessage } from 'umi'
import {
  Table,
  Badge,
  Menu,
  Dropdown,
  Space,
  Typography,
  Card,
  Tag,
  Tooltip,
} from 'antd'
import {
  DownOutlined,
  RightOutlined,
  PlusCircleTwoTone,
  MinusCircleTwoTone,
  CoffeeOutlined,
  UnorderedListOutlined,
} from '@ant-design/icons'
import Delete from '@material-ui/icons/Delete'
import {
  LAB_SPECIMEN_STATUS,
  LAB_SPECIMEN_STATUS_COLORS,
  LAB_SPECIMEN_STATUS_LABELS,
  LAB_SPECIMEN_STATUS_DESCRIPTION,
  PRIORITY_OPTIONS,
  PRIORITY_VALUES,
} from '@/utils/constants'
import { useCodeTable, useVisitTypes } from '@/utils/hooks'
import {
  CommonModal,
  DatePicker,
  Select,
  Button,
  dateFormatLongWithTimeNoSec,
  Icon,
} from '@/components'
import { VisitTypeTag } from '@/components/_medisys'
import WorklistContext from '../WorklistContext'
import {
  StatusFilter,
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

const allSpecimenStatuses = Object.values(LAB_SPECIMEN_STATUS)

const SpecimenStatusTag = ({ statusId }) => (
  <Tooltip title={LAB_SPECIMEN_STATUS_DESCRIPTION[`${statusId}`]}>
    <Tag
      color={LAB_SPECIMEN_STATUS_COLORS[`${statusId}`]}
      style={{ width: 80, textAlign: 'center' }}
    >
      {LAB_SPECIMEN_STATUS_LABELS[`${statusId}`]}
    </Tag>
  </Tooltip>
)

export const WorklistGrid = ({ labWorklist, clinicSettings }) => {
  const { list: originalWorklist = [] } = labWorklist
  const [visits, setVisits] = useState([])
  const [collapsedKeys, setCollapsedKeys] = useState([])
  const [filteredStatuses, setFilteredStatuses] = useState(allSpecimenStatuses)
  const [filteredWorklist, setFilteredWorklist] = useState([])
  const cttestpanel = useCodeTable('cttestpanel')
  const cttestcategory = useCodeTable('cttestcategory')
  const ctspecimentype = useCodeTable('ctspecimentype')
  const dispatch = useDispatch()
  const visitTypes = useVisitTypes()
  const [currentModal, setCurrentModal] = useState({
    modal: MODALS.NONE,
    para: undefined,
  })

  useEffect(() => {
    if (originalWorklist) {
      const currentFilteredWorklist = _(
        originalWorklist.filter(item =>
          filteredStatuses.includes(item.specimenStatusId),
        ),
      )
        .orderBy('firstOrderDate')
        .value()

      const uniqeVisits = _(
        currentFilteredWorklist.map(item => ({
          key: item.visitId,
          patientName: item.patientName,
          patientReferenceNo: item.patientReferenceNo,
          visitId: item.visitId,
          visitPurposeId: item.visitPurposeId,
          doctor:
            (item.doctorTitle ? `${item.doctorTitle} ` : '') + item.doctorName,
          firstOrderDate: _(currentFilteredWorklist)
            .filter(inner => inner.visitId === item.visitId)
            .minBy(inner => inner.generateDate).generateDate,
          workitems: currentFilteredWorklist
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
        .orderBy('firstOrderDate')
        .reverse()
        .value()

      setFilteredWorklist(currentFilteredWorklist)
      setVisits(uniqeVisits)
    }
  }, [originalWorklist, filteredStatuses])

  const getSpecimenCountByCategory = visitId => {
    if (!visitId || !cttestcategory) return ''
    const specimenCountByCategory = cttestcategory.map(item => ({
      name: item.name,
      incompleteWorkitemCount: _(originalWorklist)
        .filter(
          w =>
            w.visitId === visitId &&
            w.testCategoryId === item.id &&
            (w.specimenStatusId !== LAB_SPECIMEN_STATUS.COMPLETED ||
              w.specimenStatusId !== LAB_SPECIMEN_STATUS.DISCARDED),
        )
        .uniqBy(w => w.labSpecimenId)
        .value().length,
    }))
    console.log('lab-module logs: visitId', visitId)
    console.log(
      'lab-module logs: testCategories',
      originalWorklist,
      specimenCountByCategory,
      cttestcategory,
    )

    return specimenCountByCategory
      .filter(item => item.incompleteWorkitemCount > 0)
      .reduce(
        (prev, current) =>
          `${prev !== '' ? prev + ', ' : ''}${current.name}: ${
            current.incompleteWorkitemCount
          } `,
        '',
      )
  }

  const expandedRowRender = (record, index, indent, expanded) => {
    const groupedTestPanels = _.uniqBy(
      filteredWorklist
        .filter(item => item.visitId === record.visitId)
        .map(item => ({
          visitId: item.visitId,
          labSpecimenId: item.labSpecimenId,
          patientReferenceNo: item.patientReferenceNo,
          firstOrderDate: _(filteredWorklist)
            .filter(innerItem => innerItem.labSpecimenId === item.labSpecimenId)
            .minBy(innerItem => innerItem.generateDate).generateDate,
          testPanels: _.uniq(
            filteredWorklist
              .filter(
                innerItem => innerItem.labSpecimenId === item.labSpecimenId,
              )
              .map(innerItem => ({
                testpanelId: innerItem.testPanelId,
                testPanelName: cttestpanel.find(
                  item => item.id === innerItem.testPanelId,
                )?.name,
                priority: innerItem.priority,
              })),
          ),
          ...item,
        })),
      'labSpecimenId',
    )

    const columns = [
      {
        title: 'Category',
        dataIndex: 'testCategoryId',
        key: 'testCategoryId',
        ellipsis: true,
        width: 160,
        render: (text, record, index) => {
          const testCategory = cttestcategory.find(
            item => item.id === record.testCategoryId,
          )
          return testCategory ? testCategory.name : ''
        },
      },
      {
        title: 'Test',
        dataIndex: 'testPanels',
        key: 'testPanels',
        width: 350,
        render: (text, record, index) => {
          console.log('lab-module logs: testPanels - ', record.testPanels)
          const testPanelHtml = record.testPanels
            //Sort by Priority then by the alphabetical order
            .sort((a, b) =>
              a.priority === b.priority
                ? a.testPanelName < b.testPanelName
                  ? -1
                  : 1
                : a.priority === PRIORITY_VALUES.URGENT
                ? -1
                : 1,
            )
            .map(item =>
              item.priority === PRIORITY_VALUES.URGENT
                ? `<span style="color:red;"> ${item.testPanelName}</span>`
                : `${item.testPanelName}`,
            )
            .join(', ')

          return (
            <p
              style={{
                width: 334, //Column width - 16 (left and righ 8 px padding)
                display: '-webkit-box',
                WebkitBoxOrient: 'vertical',
                WebkitLineClamp: 2,
                overflow: 'hidden',
              }}
              dangerouslySetInnerHTML={{
                __html: testPanelHtml,
              }}
            ></p>
          )
        },
      },
      {
        title: 'Specimen Type',
        width: 150,
        dataIndex: 'specimenTypeId',
        key: 'specimenTypeId',
        ellipsis: true,
        render: (text, record, index) => {
          const speicmenType = ctspecimentype.find(
            item => record.specimenTypeId === item.id,
          )

          return speicmenType ? speicmenType.name : ''
        },
      },
      {
        title: 'Accession No',
        dataIndex: 'accessionNo',
        key: 'accessionNo',
        width: 150,
      },
      {
        title: 'First Order Date',
        dataIndex: 'firstOrderDate',
        key: 'firstOrderDate',
        ellipsis: true,
        render: (text, record, index) =>
          record.firstOrderDate?.format(dateFormatLongWithTimeNoSec),
      },
      {
        title: 'Date Collected',
        dataIndex: 'specimenCollectionDate',
        key: 'specimenCollectionDate',
        render: (text, record, index) =>
          record.specimenCollectionDate?.format(dateFormatLongWithTimeNoSec),
      },
      {
        title: 'First Verifier',
        dataIndex: 'firstVerifier',
        key: 'firstVerifier',
        ellipsis: true,
      },
      {
        title: 'Second Verifier',
        dataIndex: 'secondVerifier',
        key: 'secondVerifier',
        ellipsis: true,
      },
      {
        title: 'Status',
        width: 100,
        dataIndex: 'specimenStatusId',
        key: 'specimenStatusId',
        render: (text, record, index) => <SpecimenStatusTag statusId={text} />,
      },
      {
        title: 'Action',
        width: 85,
        dataIndex: 'operation',
        key: 'operation',
        align: 'left',
        render: (text, record, index) => (
          <Space size='small' align='center'>
            {record.dateReceived &&
              record.specimenStatusId !== LAB_SPECIMEN_STATUS.DISCARDED && (
                <Tooltip title='Open Specimen Details'>
                  <Button
                    onClick={() => {
                      if (currentModal.modal === MODALS.NONE)
                        setCurrentModal({
                          modal: MODALS.SPECIMEN_DETAILS,
                          para: record.labSpecimenId,
                        })
                    }}
                    justIcon
                    color='primary'
                    size='sm'
                  >
                    <UnorderedListOutlined />
                  </Button>
                </Tooltip>
              )}
            {!record.dateReceived && (
              <Tooltip title='Receive Specimen'>
                <Button
                  onClick={() => {
                    if (currentModal.modal === MODALS.NONE)
                      setCurrentModal({
                        modal: MODALS.SPECIMEN_DETAILS,
                        para: record.labSpecimenId,
                      })
                  }}
                  justIcon
                  color='primary'
                  size='sm'
                >
                  <Icon type='flask-empty' />
                </Button>
              </Tooltip>
            )}
            {record.dateReceived &&
              record.specimenStatusId === LAB_SPECIMEN_STATUS.NEW && (
                <Tooltip title='Discard Specimen'>
                  <Button
                    onClick={() => {
                      if (currentModal.modal === MODALS.NONE)
                        setCurrentModal({
                          modal: MODALS.SPECIMEN_DETAILS,
                          para: record.labSpecimenId,
                        })
                    }}
                    justIcon
                    color='danger'
                    size='sm'
                  >
                    <Icon type='flask-empty' />
                  </Button>
                </Tooltip>
              )}
          </Space>
        ),
      },
    ]

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
            <Space style={{ flexGrow: 1 }}>
              <Typography.Text strong>
                {record.patientName} ({record.patientReferenceNo})
              </Typography.Text>
              <Typography.Text type='secondary'>
                {record.doctor}
              </Typography.Text>
              <VisitTypeTag type={record.visitPurposeId} />
            </Space>
            <span>{getSpecimenCountByCategory(record.visitId)}</span>
          </div>
        )
      },
    },
  ]

  return (
    <Card>
      <div style={{ display: 'flex', alignItems: 'start' }}>
        <ExapandCollapseAllButton
          onExpandAllClick={() => setCollapsedKeys([])}
          onCollapseAllClick={() =>
            setCollapsedKeys(visits.map(v => v.visitId))
          }
        />
        <StatusFilter
          defaultSelection={allSpecimenStatuses}
          counts={_(originalWorklist)
            .groupBy('specimenStatusId')
            .map(function(items, specimenStatusId) {
              return {
                status: parseInt(specimenStatusId),
                count: _.uniqBy(items, 'labSpecimenId').length,
              }
            })
            .value()}
          style={{
            flexGrow: 1,
            justifyContent: 'end',
            marginBottom: 10,
          }}
          onFilterChange={selected => setFilteredStatuses(selected)}
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
