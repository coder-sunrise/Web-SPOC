import { PageContainer, Icon } from '@/components'
import { ProTable, Select, Input, Button } from '@medisys/component'
import service from '@/pages/Inventory/Master/Medication/services'
import { connect, history } from 'umi'
import { getAppendUrl } from '@/utils/utils'
import Authorized from '@/utils/Authorized'
import { status } from '@/utils/codes'

const { queryList, upsert, query, remove } = service
const api = {
  remove,
  create: upsert,
  update: upsert,
  queryList,
  query,
}

const defaultColumns = [
  {
    dataIndex: 'code',
    defaultSortOrder: 'ascend',
    width: 100,
    sorter: true,
  },
  {
    title: 'Name',
    dataIndex: 'displayValue',
    sorter: true,
  },
  {
    title: 'Supplier',
    dataIndex: 'favouriteSupplier',
    sortBy: 'FavouriteSupplierFkNavigation.displayValue',
    sorter: true,
    width: 200,
    render: (_dom: any, entity: any) => (
      <Select
        readonly
        code='ctSupplier'
        value={entity?.favouriteSupplier?.id}
        displayField='displayValue'
        valueField='id'
      />
    ),
  },
  {
    title: 'Disp. UOM',
    dataIndex: 'dispensingUOM',
    sortBy: 'DispensingUOMFkNavigation.DisplayValue',
    render: (_dom: any, entity: any) => (
      <Select
        readonly
        code='ctmedicationunitofmeasurement'
        value={entity?.dispensingUOM?.id}
        displayField='name'
        valueField='id'
      />
    ),
    search: false,
  },
  {
    dataIndex: 'stock',
    valueType: 'digit',
    search: false,
  },
  {
    dataIndex: 'averageCostPrice',
    title: 'Avg Cost Price',
    valueType: 'money',
    search: false,
  },
  {
    dataIndex: 'sellingPrice',
    title: 'Selling Price',
    valueType: 'money',
    search: false,
  },
  {
    dataIndex: 'isActive',
    title: 'Status',
    render: (_dom: any, entity: any) => (
      <Select
        readonly
        dataSource={status}
        value={_dom}
        displayField='name'
        valueField='value'
      />
    ),
    renderFormItem: () => (
      <Select dataSource={status} displayField='name' valueField='value' />
    ),
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
const showPatient = row => {
  console.log(row)
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
          code: 'edit',
          render: row => {
            return (
              <Button
                onClick={() => {
                  showPatient(row)
                }}
                type='primary'
                icon={<Icon type='edit' />}
              />
            )
          },
        },
      ]}
      scroll={{ x: 1100 }}
    />
  )
}

// @ts-ignore
export default connect(({ patient }) => {
  return {
    patient,
  }
})(PatientIndex)
