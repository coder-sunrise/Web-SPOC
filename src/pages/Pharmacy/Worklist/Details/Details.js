import React, { useEffect, useState, useContext } from 'react'
import { useSelector, useDispatch } from 'dva'
import { Typography, Input } from 'antd'
import { Alert } from 'antd'
import moment from 'moment'
import Warning from '@material-ui/icons/Error'
import {
  GridContainer,
  ProgressButton,
  GridItem,
  Button,
  CheckboxGroup,
  Switch,
  CommonTableGrid
} from '@/components'
import { VISIT_TYPE } from '@/utils/constants'
import Banner from '@/pages/PatientDashboard/Banner'
import { MenuOutlined } from '@ant-design/icons'
import { PharmacySteps } from '../../Components'
import Block from '@/pages/PatientDashboard/Banner/Block'

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
        <div style={{ marginLeft: 3 }}> {children}</div>
      </div>
    </GridItem>
  )
}

const Details = (props) => {
  const details = useSelector(state => state.pharmacyDetails)
  const patientBannerEntity = useSelector(state => state.patient)
  const workitem = details.entity || {}
  const statusHistory = [...(workitem.pharmarcyWorklistHistory || []),
  {
    statusFK: workitem.statusFK,
    actionDate: workitem.updateDate,
    actionByUser: workitem.updateByUser,
    actionByUserTitle: workitem.updateByUserTitle
  }]
  return <div>
    <div style={{ maxHeight: 800, overflowY: 'scroll', marginBottom: 10 }}>
      <Banner
        patientInfo={patientBannerEntity}
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
          <ContentGridItem title='Diagnosis:'>Asthma</ContentGridItem>
          <ContentGridItem title='Visit Type:'>{workitem.visitType}</ContentGridItem>
          <ContentGridItem title='Order By:'>{`${workitem.generateByUserTitle && workitem.generateByUserTitle.trim().length ? `${workitem.generateByUserTitle}. ` : ''}${workitem.generateByUser || ''}`}</ContentGridItem>
          <ContentGridItem title='Order Created Time:'>{moment(workitem.generateDate).format('HH:mm, DD MMM YYYY')}</ContentGridItem>
          <ContentGridItem title='Group:'>{workitem.visitGroup || ''}</ContentGridItem>
          <ContentGridItem title='Family History:'>{workitem.familyHistory || ''}</ContentGridItem>
          <ContentGridItem title='Social History:'>{workitem.socialHistory || ''}</ContentGridItem>
          <ContentGridItem title='Medical History:'>{workitem.medicalHistory || ''}</ContentGridItem>
          <GridItem md={8}>
            <Alert
              message="Doctor amended prescription at 10:40 PM"
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
          <GridItem md={4} style={{
            display: 'flex',
            justifyContent: 'flex-end',
          }}>

            <Typography.Text
              underline
              style={{
                cursor: 'pointer', color: '#1890f8', position: 'relative', top: '12px'
              }}
              onClick={() => {

              }}
            >
              Journal History
            </Typography.Text>

            <Switch
              style={{ width: 50, marginLeft: 8 }}
              checkedChildren='EN'
              checkedValue='EN'
              unCheckedChildren='JP'
              unCheckedValue='JP'
              label=''
            />
          </GridItem>
          <GridItem style={{ marginTop: 8 }}>
            <CommonTableGrid
              forceRender
              size='sm'
              FuncProps={{ pager: false }}
              rows={[{
                type: 'Medication',
                itemCode: 'Drug A',
                itemName: 'Drug A',
                dispenseUOM: 'tablets',
                orderQuantity: 1,
                stock: 2,
                batchNo: 'X12345',
                expiryDate: '31 Oct 2023',
                instruction: 'Take 5mg 3 times a day for 5 day(s)',
                drugInteraction: 'dairy products',
                drugContraindication: 'GL Bleeding',
                remarks: 'apply on left ears'
              }]}
              columns={[{ name: 'type', title: 'Type' },
              { name: 'itemCode', title: 'Code' },
              { name: 'itemName', title: 'Name' },
              { name: 'dispenseUOM', title: 'UOM' },
              { name: 'orderQuantity', title: 'Ordered' },
              { name: 'dispenseQuantity', title: 'Dispensed' },
              { name: 'stock', title: 'Bal. Qty.' },
              { name: 'batchNo', title: 'Batch No.' },
              { name: 'expiryDate', title: 'Expiry Date' },
              { name: 'instruction', title: 'Instruction' },
              { name: 'drugInteraction', title: 'Drug Interaction' },
                { name: 'drugContraindication', title: 'Contraindication' },
              { name: 'remarks', title: 'Remarks' },
              { name: 'action', title: 'Action' },
              ]}
              columnExtensions={[{
                columnName: 'type',
                width: 110,
                sortingEnabled: false
              },
              {
                columnName: 'itemCode',
                width: 100,
                sortingEnabled: false
              },
              {
                columnName: 'dispenseUOM',
                width: 80,
                sortingEnabled: false
              },
              {
                columnName: 'orderQuantity',
                width: 80,
                sortingEnabled: false
              },
              {
                columnName: 'dispenseQuantity',
                width: 80,
                sortingEnabled: false
              },
              {
                columnName: 'stock',
                width: 80,
                sortingEnabled: false
              },
              {
                columnName: 'batchNo',
                width: 80,
                sortingEnabled: false
              },
              {
                columnName: 'expiryDate',
                width: 100,
                sortingEnabled: false
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
            style={{ position: 'absolute', bottom: '-5px', marginLeft: '6px' }}
            options={[
              { value: 'EN', label: 'EN' },
              { value: 'JP', label: 'JP' },
            ]} />
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
        {workitem.visitPurposeFK == VISIT_TYPE.RETAIL ?
          <Button color='success' size='sm'>Add Order</Button>
          : <Button color='success' size='sm'>Edit Order</Button>}
        <Button color='primary' size='sm'>Prepared</Button>
      </GridItem>
    </GridContainer>
  </div >
}
export default Details