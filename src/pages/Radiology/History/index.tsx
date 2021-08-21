import { PageContainer, Select, TextField, DatePicker } from '@/components'
import { ProTable, Input, Button, Select as MSelect } from '@medisys/component'
import service from './services'
import { connect, history } from 'umi'
import { formatMessage } from 'umi'
import { getAppendUrl } from '@/utils/utils'
import Authorized from '@/utils/Authorized'
import { RadiologyWorkitemStatus, VISIT_TYPE_NAME } from '@/utils/constants'
import { PrinterOutlined, UnorderedListOutlined } from '@ant-design/icons'
import { DoctorProfileSelect } from '@/components/_medisys'

import WorklistContext, {
  WorklistContextProvider,
} from '../Worklist/WorklistContext'
import { Fragment, useContext } from 'react'
import RadiologyDetails from '../Worklist/Details'

const { queryList, query } = service
const api = {
  remove: null,
  create: null,
  update: null,
  queryList,
  query,
}

const defaultColumns = [
  {
    key: 'accessionNo',
    title: 'Accession No.',
    dataIndex: 'accessionNo',
    sorter: true,
    search: false,
  },
  {
    key: 'patientName',
    title: 'Patient Name',
    dataIndex: 'patientName',
    sorter: true,
    search: false,
  },
  {
    key: 'patientReferenceNo',
    title: 'Ref. No.',
    dataIndex: 'patientReferenceNo',
    sorter: true,
    search: false,
  },
  {
    key: 'patientAccountNo',
    title: 'Acc. No.',
    dataIndex: 'patientAccountNo',
    sorter: true,
    search: false,
  },
  {
    key: 'orderTime',
    title: 'Order Time',
    dataIndex: 'orderTime',
    valueType: 'dateTime',
    render: (_dom: any, entity: any) =>
      entity.orderTime?.format('yyyy-MM-DD HH:mm:ss') || '-',
    sorter: true,
    search: false,
  },
  {
    key: 'orderedBy',
    title: 'Ordered By',
    dataIndex: 'orderedBy',
    sorter: false,
    search: false,
  },
  {
    key: 'radiographer',
    title: 'Radiographer',
    dataIndex: 'radiographer',
    sorter: false,
    search: false,
  },
  {
    key: 'priority',
    title: 'Priority',
    dataIndex: 'priority',
    sorter: false,
    search: false,
  },
  {
    key: 'drInstruction',
    title: 'Dr. Instruction',
    dataIndex: 'drInstruction',
    sorter: false,
    search: false,
  },
  {
    key: 'visitType',
    title: 'Visit Type',
    dataIndex: 'visitType',
    sorter: false,
    search: false,
  },
  {
    key: 'status',
    title: 'Status',
    dataIndex: 'status',
    sorter: false,
    search: false,
    renderText: (item, { type, defaultRender, ...rest }, form) =>
      Object.values(RadiologyWorkitemStatus)[item - 1],
  },
  // {
  //   key: 'action',
  //   title: 'Action',
  //   dataIndex: 'action',
  //   align: 'center',
  //   sorter: false,
  //   search: false,
  //   render: (item, { type, defaultRender, ...rest }, form) => {
  //     return (
  //       <Button
  //         onClick={() => {
  //         }}
  //         type='primary'
  //         icon={<UnorderedListOutlined />}
  //       />
  //     )
  //   },
  // },
  {
    hideInTable: true,
    title: '',
    dataIndex: 'searchAccessionNo',
    renderFormItem: (item, { type, defaultRender, ...rest }, form) => {
      return <TextField style={{ width: 250 }} label='Accession No' />
    },
  },
  {
    // search: OrderDateFrom,
    hideInTable: true,
    title: '',
    dataIndex: 'searchOrderDateForm',
    renderFormItem: (item, { type, defaultRender, ...rest }, form) => {
      return (
        <DatePicker
          style={{ width: 250 }}
          label='Order Date Form'
          placeholder=''
        />
      )
    },
  },
  {
    // title: OrderDateTo
    hideInTable: true,
    title: '',
    dataIndex: 'searchOrderDateTo',
    renderFormItem: (item, { type, defaultRender, ...rest }, form) => {
      return (
        <DatePicker
          style={{ width: 250 }}
          label='Order Date To'
          placeholder=''
        />
      )
    },
  },
  {
    // search: Patient Name/Acc. No./Ref. No.
    hideInTable: true,
    title: '',
    dataIndex: 'searchPatient',
    renderFormItem: (item, { type, defaultRender, ...rest }, form) => {
      if (type === 'form') {
        return null
      }
      return (
        <TextField
          style={{ width: 250 }}
          label={'Patient Name/Acc. No./Ref. No.'}
        />
      )
    },
  },
  {
    // title: Visit Type
    hideInTable: true,
    title: '',
    dataIndex: 'searchVisitType',
    renderFormItem: (item, { type, defaultRender, ...rest }, form) => {
      return (
        <Select
          label='Visit Type'
          options={Object.values(VISIT_TYPE_NAME).map(o => {
            return { value: o.visitPurposeFK, name: o.displayName }
          })}
          placeholder=''
          style={{ width: 250 }}
        />
      )
    },
  },
  {
    // title: Status
    hideInTable: true,
    title: '',
    dataIndex: 'searchStatus',
    renderFormItem: (item, { type, defaultRender, ...rest }, form) => {
      return (
        <Select
          label='Status'
          options={Object.entries(RadiologyWorkitemStatus).map(o => {
            return { value: o[0], name: o[1] }
          })}
          placeholder=''
          style={{ width: 250 }}
        />
      )
    },
  },
  {
    // search: Ordered By
    hideInTable: true,
    title: '',
    dataIndex: 'searchOrderedBy',
    valueType: 'select',
    renderFormItem: (item, { type, defaultRender, ...rest }, form) => {
      return (
        <DoctorProfileSelect
          style={{ width: 250 }}
          valueField='clinicianProfile.userProfileFK'
          remoteFilter={{
            'clinicianProfile.isActive': true,
          }}
          labelField='clinicianProfile.name'
          placeholder=''
          label='Ordered By'
        />
      )
    },
  },
  {
    // search: Priority
    hideInTable: true,
    title: '',
    dataIndex: 'searchPriority',
    renderFormItem: (item, { type, defaultRender, ...rest }, form) => {
      return (
        <Select
          label='Priority'
          options={[
            {
              value: 'Normal',
              name: 'Normal',
            },
            {
              value: 'Urgent',
              name: 'Urgent',
            },
          ]}
          placeholder=''
          style={{ width: 250 }}
        />
      )
    },
  },
  {
    // search: Radiographer
    hideInTable: true,
    title: '',
    dataIndex: 'searchRadiographer',
    renderFormItem: (item, { type, defaultRender, ...rest }, form) => {
      return (
        <DoctorProfileSelect
          style={{ width: 250 }}
          valueField='clinicianProfile.userProfileFK'
          remoteFilter={{
            'clinicianProfile.isActive': true,
          }}
          labelField='clinicianProfile.name'
          placeholder=''
          label='Radiographer'
        />
      )
    },
  },
  {
    // search: Modality
    hideInTable: true,
    title: '',
    dataIndex: 'searchModality',
    renderFormItem: (item, { type, defaultRender, ...rest }, form) => {
      return (
        <Select
          label='Modality'
          options={[]}
          placeholder=''
          style={{ width: 250 }}
        />
      )
    },
  },
]

const RadiologyWorklistHistoryIndex = ({ dispatch, radiologyHisotry }) => {
  const { setDetailsId } = useContext(WorklistContext)

  return (
    <Fragment>
      <PageContainer pageHeaderRender={false}>
        <ProTable
          form={{ span: 4 }}
          rowSelection={false}
          columns={defaultColumns}
          api={api}
          search={{
            searchText: 'SEARCH',
            resetText: 'RESET',
            optionRender: (searchConfig, formProps, dom) => {
              return (
                <div
                  style={{
                    display: 'inline',
                    float: 'right',
                    width: 200,
                    //marginTop: 15,
                  }}
                >
                  {dom[1]} {dom[0]}
                </div>
              )
            },
          }}
          options={{ density: false, reload: false }}
          toolBarRender={() => {
            return [
              <Button type='primary' icon={<PrinterOutlined />} color='primary'>
                PRINT
              </Button>,
            ]
          }}
          onRowDblClick={row => {
            setDetailsId(row.id)
          }}
          defaultColumns={['options']}
          features={[
            {
              code: 'details',
              render: row => {
                return (
                  <Button
                    onClick={() => {
                      setDetailsId(row.id)
                    }}
                    type='primary'
                    icon={<UnorderedListOutlined />}
                  />
                )
              },
            },
          ]}
          beforeSearchSubmit={({
            searchAccessionNo,
            searchOrderDateForm,
            searchOrderDateTo,
            searchPatient,
            searchVisitType,
            searchStatus,
            searchOrderedBy,
            searchPriority,
            searchRadiographer,
            searchModality,
            ...values
          }) => {
            return {
              ...values,
              apiCriteria: {
                accessionNo: searchAccessionNo,
                orderDateForm: searchOrderDateForm,
                orderDateTo: searchOrderDateTo,
                searchValue: searchPatient,
                visitType: searchVisitType,
                status: searchStatus,
                orderedBy: searchOrderedBy,
                priority: searchPriority,
                radiographer: searchRadiographer,
                modality: searchModality,
              },
            }
          }}
          scroll={{ x: 1100 }}
        />
      </PageContainer>
      <RadiologyDetails />
    </Fragment>
  )
}

// @ts-ignore
connect(({ radiologyHisotry }) => {
  return {
    radiologyHisotry,
  }
})(RadiologyWorklistHistoryIndex)

const HistoryIndex = props => (
  <WorklistContextProvider>
    <RadiologyWorklistHistoryIndex {...props}></RadiologyWorklistHistoryIndex>
  </WorklistContextProvider>
)

export default HistoryIndex
