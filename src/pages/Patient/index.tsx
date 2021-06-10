import { PageContainer, Icon } from '@/components'
import { ProTable, Select, Input, Button } from '@medisys/component'
import patientService from '@/services/patient'
import { connect, history } from 'umi'
import { getAppendUrl } from '@/utils/utils'
import Authorized from '@/utils/Authorized'

const { queryList, upsert, query, remove } = patientService
const api = {
  remove,
  create: upsert,
  update: upsert,
  queryList,
  query,
}

const defaultColumns = [
  {
    title: 'Ref. No.',
    dataIndex: 'patientReferenceNo',
    sorterBy: 'aa.patientReferenceNo',
    defaultSortOrder: 'ascend',
    width: 100,
    sorter: true,
    search: false,
  },
  {
    title: 'Acc. No.',
    dataIndex: 'patientAccountNo',
    sorter: true,
    search: false,
  },
  {
    title: 'Patient Name',
    dataIndex: 'name',
    sorter: true,
    search: false,
    width: 200,
  },
  {
    title: 'Last Visit Date',
    dataIndex: 'lastVisitDate',
    valueType: 'dateTime',
    render: (_dom: any, entity: any) =>
      entity.lastVisitDate?.format('L') || '-',
    width: 120,
    search: false,
  },
  {
    title: 'Status',
    dataIndex: 'status',
    search: false,
  },
  {
    dataIndex: 'gender/age',
    title: 'Gender / Age',
    render: (_dom: any, entity: any) =>
      `${entity.gender?.substring(0, 1)}/${Math.floor(
        entity.dob?.toDate()?.duration('year'),
      )}`,
    search: false,
  },
  {
    dataIndex: 'dob',
    title: 'DOB',
    render: (_dom: any, entity: any) => entity.dob?.format('L') || '-',
    width: 100,
    search: false,
  },
  { dataIndex: 'race', title: 'Race', search: false },
  { dataIndex: 'nationality', title: 'Nationality', search: false },
  { dataIndex: 'mobileNo', title: 'Mobile No.', search: false },
  { dataIndex: 'homeNo', title: 'Home No.', search: false },
  { dataIndex: 'officeNo', title: 'Office No.', search: false },
  {
    dataIndex: 'outstandingBalance',
    title: 'Total O/S Balance',
    valueType: 'money',
    search: false,
    align: 'right',
  },

  // { dataIndex: 'action', title: 'Action', search: false },
  {
    // title: 'Patient Name, Acc No., Patient Ref. No., Contact No.',
    hideInTable: true,
    dataIndex: 'search',
    renderFormItem: (item, { type, defaultRender, ...rest }, form) => {
      if (type === 'form') {
        return null
      }
      return (
        <Input placeholder='Patient Name, Acc No., Patient Ref. No., Contact No.' />
      )
    },
  },
]
const showPatient = row => {
  const viewPatProfileAccessRight = Authorized.check(
    'patientdatabase.patientprofiledetails',
  )
  const disableRights = ['disable', 'hidden']
  if (
    viewPatProfileAccessRight &&
    disableRights.includes(viewPatProfileAccessRight.rights)
  )
    return

  history.push(
    getAppendUrl({
      md: 'pt',
      cmt: '1',
      pid: row.id,
      v: Date.now(),
    }),
  )
}
const PatientIndex = ({ dispatch }) => {
  return (
    <PageContainer>
      <ProTable
        columns={defaultColumns}
        api={api}
        // search={{
        //   optionRender: (searchConfig, formProps, dom) => {
        //     return [dom, <Button></Button>]
        //   },
        // }}
        toolBarRender={() => {
          return [
            <Button
              type='primary'
              icon={<Icon type='adduser' />}
              color='primary'
              onClick={() => {
                dispatch({
                  type: 'patient/updateState',
                  payload: {
                    entity: undefined,
                    version: undefined,
                  },
                })
                dispatch({
                  type: 'patient/openPatientModal',
                })
              }}
            >
              Register New Patient
            </Button>,
          ]
        }}
        onRowDblClick={showPatient}
        defaultColumns={['options']}
        features={[
          {
            code: 'myedit',
            render: row => {
              return (
                <Button
                  onClick={() => {
                    showPatient(row)
                  }}
                  type='primary'
                  icon={<Icon type='user' />}
                />
              )
            },
          },
        ]}
        beforeSearchSubmit={({ search, ...values }) => {
          return {
            ...values,
            apiCriteria: {
              searchValue: search,
              includeinactive: true,
            },
          }
        }}
        scroll={{ x: 1100 }}
      />
    </PageContainer>
  )
}

// @ts-ignore
export default connect(({ patient }) => {
  return {
    patient,
  }
})(PatientIndex)
