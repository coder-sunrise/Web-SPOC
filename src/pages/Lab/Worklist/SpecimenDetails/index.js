import React, { useState, useEffect } from 'react'
import { Space, Collapse, Checkbox, InputNumber, Typography, Table } from 'antd'
import Banner from '@/pages/PatientDashboard/Banner'
import { useSelector, useDispatch } from 'dva'
import {
  dateFormatLongWithTimeNoSec,
  DatePicker,
  Select,
  CommonModal,
  NumberInput,
  GridContainer,
  GridItem,
} from '@/components'
import { VisitTypeTag } from '@/components/_medisys'
import { SpecimenStatusTag } from '../components/SpecimenStatusTag'
import { TestPanelColumn } from '../components/TestPanelColumn'
import { SpecimenDetailsStep } from './components'
import { useCodeTable } from '@/utils/hooks'

const { Panel } = Collapse

export const SpecimenDetails = ({ id, onClose, onConfirm }) => {
  const dispatch = useDispatch()
  const cttestcategory = useCodeTable('cttestcategory')
  const ctspecimentype = useCodeTable('ctspecimentype')
  const cttestpanel = useCodeTable('cttestpanel')
  const { entity } = useSelector(s => s.worklistSpecimenDetails)
  console.log(
    'lab-module logs: entity.specimenOrders',
    entity,
    entity.specimenOrders,
  )
  useEffect(() => {
    if (id) {
      dispatch({
        type: 'worklistSpecimenDetails/query',
        payload: { id },
      }).then(val => {
        if (val) console.log('lab-module logs: SpecimenDetails', val)
      })
    }

    return () => {
      dispatch({
        type: 'worklistSpecimenDetails/updateState',
        payload: { entity: {} },
      })
    }
  }, [id])

  const specimenInfoColumns = [
    {
      title: 'Accession No.',
      dataIndex: 'accessionNo',
      key: 'accessionNo',
      width: 160,
    },
    {
      title: 'Category',
      dataIndex: 'testCategoryFK',
      key: 'testCategoryFK',
      ellipsis: true,
      width: 160,
      render: (text, record, index) => {
        const testCategory = cttestcategory.find(
          item => item.id === record.testCategoryFK,
        )
        return testCategory ? testCategory.name : ''
      },
    },
    {
      title: 'Specimen Type',
      width: 150,
      dataIndex: 'specimenTypeFK',
      key: 'specimenTypeFK',
      ellipsis: true,
      render: (text, record, index) => {
        const speicmenType = ctspecimentype.find(
          item => record.specimenTypeFK === item.id,
        )

        return speicmenType ? speicmenType.name : ''
      },
    },
    {
      title: 'Remarks',
      dataIndex: 'specimenCollectionRemarks',
      key: 'specimenCollectionRemarks',
      width: 300,
    },
    {
      title: 'Status',
      dataIndex: 'specimenStatusFK',
      key: 'specimenStatusFK',
      width: 100,
      align: 'center',
      render: (text, record, index) => <SpecimenStatusTag statusId={text} />,
    },
    {
      title: 'Action',
      width: 85,
      dataIndex: 'operation',
      key: 'operation',
      align: 'left',
      render: (text, record, index) => <span>hello</span>,
    },
  ]

  const orderInfoColumns = [
    {
      title: 'Service',
      dataIndex: 'serviceName',
      key: 'serviceName',
      width: 160,
    },

    {
      title: 'Test Panel',
      dataIndex: 'testPanel',
      key: 'testPanel',
      width: 200,
      render: (text, record, index) => {
        const testPanels = record.labWorkitems.map(item => ({
          priority: item.priority,
          testPanelName: cttestpanel.find(
            testPanel => testPanel.id === item.testPanelFK,
          )?.name,
        }))

        return <TestPanelColumn testPanels={testPanels} />
      },
    },
    {
      title: 'Priority',
      dataIndex: 'priority',
      key: 'priority',
      width: 120,
    },
    {
      title: 'Ordered Date',
      dataIndex: 'orderedDate',
      key: 'orderedDate',
      width: 150,
      render: (text, record, index) => text.format(dateFormatLongWithTimeNoSec),
    },

    {
      title: 'Instructions',
      dataIndex: 'instruction',
      key: 'instruction',
      width: 120,
    },
    {
      title: 'Remarks',
      dataIndex: 'remarks',
      key: 'remarks',
      width: 120,
    },
  ]

  return (
    <CommonModal
      open={id && id > 0}
      title='Lab Test Specimen Details'
      onClose={onClose}
      showFooter={true}
      maxWidth='lg'
    >
      <GridContainer>
        <GridItem md={12}>
          <div style={{ padding: 8 }}>
            <Banner />
          </div>
        </GridItem>
        <GridItem md={12}>
          <SpecimenDetailsStep />
        </GridItem>
        <GridItem md={12}>
          <GridContainer>
            <GridItem md={8} style={{ paddingTop: 16 }}>
              <Typography.Text strong>Specimen Details: </Typography.Text>
            </GridItem>
            <GridItem md={4} style={{ padding: 8, textAlign: 'right' }}>
              <VisitTypeTag type={entity.visitPurposeFK} />
            </GridItem>
            <GridItem md={12} style={{ padding: 8 }}>
              <Table
                bordered
                columns={specimenInfoColumns}
                dataSource={[entity]}
                pagination={false}
                size='small'
              />
            </GridItem>
            <GridItem md={12} style={{ paddingTop: 16 }}>
              <Typography.Text strong>Order Details: </Typography.Text>
            </GridItem>
            <GridItem md={12} style={{ padding: 8 }}>
              <Table
                bordered
                columns={orderInfoColumns}
                dataSource={[...(entity.specimenOrders ?? [])].sort(
                  item => item.serviceName,
                )}
                pagination={false}
                size='small'
              />
            </GridItem>
          </GridContainer>
        </GridItem>
      </GridContainer>
    </CommonModal>
  )
}
