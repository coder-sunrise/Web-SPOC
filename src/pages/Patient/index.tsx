import { PageContainer } from '@/components'
import { ProTable, Select } from '@medisys/component'
import patientService from '@/services/patient'

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
    sorter: true,
    defaultSortOrder: 'ascend',
    width: '200px',
  },
  {
    title: 'Acc. No.',
    dataIndex: 'patientAccountNo',
    sorter: true,
  },
  {
    title: 'Patient Name',
    dataIndex: 'name',
    sorter: true,
  },
  {
    title: 'Last Visit Date',
    dataIndex: 'lastVisitDate',
  },
  {
    title: 'Status',
    dataIndex: 'status',
  },
  { dataIndex: 'gender/age', title: 'Gender / Age' },
  { dataIndex: 'dob', title: 'DOB' },
  { dataIndex: 'race', title: 'Race' },
  { dataIndex: 'nationality', title: 'Nationality' },
  { dataIndex: 'mobileNo', title: 'Mobile No.' },
  { dataIndex: 'homeNo', title: 'Home No.' },
  { dataIndex: 'officeNo', title: 'Office No.' },
  { dataIndex: 'outstandingBalance', title: 'Total O/S Balance' },
  { dataIndex: 'action', title: 'Action' },

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
      <ProTable columns={defaultColumns} api={api} />
    </PageContainer>
  )
}

export default PatientIndex
