import { PageContainer } from '@/components'
import { ProTable, Select, Input } from '@medisys/component'
import patientService from '@/services/patient'
import { Button } from '@material-ui/core'

const { queryListV2, upsert, query, remove } = patientService
const api = {
  remove,
  create: upsert,
  update: upsert,
  queryList: queryListV2,
  query,
}

const defaultColumns = [
  {
    title: 'Ref. No.',
    dataIndex: 'patientReferenceNo',
    sorterBy: 'aa.patientReferenceNo',
    defaultSortOrder: 'ascend',
    width: '200px',
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
  },
  {
    title: 'Last Visit Date',
    dataIndex: 'lastVisitDate',
    search: false,
  },
  {
    title: 'Status',
    dataIndex: 'status',
    search: false,
  },
  { dataIndex: 'gender/age', title: 'Gender / Age', search: false },
  { dataIndex: 'dob', title: 'DOB', search: false },
  { dataIndex: 'race', title: 'Race', search: false },
  { dataIndex: 'nationality', title: 'Nationality', search: false },
  { dataIndex: 'mobileNo', title: 'Mobile No.', search: false },
  { dataIndex: 'homeNo', title: 'Home No.', search: false },
  { dataIndex: 'officeNo', title: 'Office No.', search: false },
  {
    dataIndex: 'outstandingBalance',
    title: 'Total O/S Balance',
    search: false,
  },

  { dataIndex: 'action', title: 'Action', search: false },
  {
    // title: 'Patient Name, Acc No., Patient Ref. No., Contact No.',
    hideInTable: true,
    dataIndex: 'search',
    renderFormItem: (item, { type, defaultRender, ...rest }, form) => {
      if (type === 'form') {
        return null
      }
      const stateType = form.getFieldValue('state')
      return (
        <Input placeholder='Patient Name, Acc No., Patient Ref. No., Contact No.' />
      )
    },
  },

  // {
  //   dataIndex: 'description',
  //   hideInForm: true,
  //   fieldProps: {
  //     rows: 1,
  //   },
  // },
  // {
  //   title: 'Status',
  //   dataIndex: 'isActive',
  //   valueType: 'text',
  //   renderFormItem: () => {
  //     return <Select code='status' />
  //   },
  //   render: (dom: React.ReactNode) => {
  //     return <Select code='status' value={dom as any} readonly />
  //   },
  // },
]

const PatientIndex = () => {
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
          return [<Button />]
        }}
        beforeSearchSubmit={values => {
          console.log(values)
          return {
            apiCriteria: {
              searchValue: values.search,
              includeinactive: true,
            },
          }
        }}
      />
    </PageContainer>
  )
}

export default PatientIndex
