import { useState, useRef } from 'react'
import { PageContainer, Icon, notification } from '@/components'
import { ProTable, Select, Input, Button } from '@medisys/component'
import service from '@/pages/Inventory/Master/Medication/services'
import { connect, history } from 'umi'
import Authorized from '@/utils/Authorized'
import { status } from '@/utils/codes'
import { downloadFile } from '@/services/file'
import { convertToBase64 } from '@/utils/utils'

const { queryList, upsert, query, remove } = service
const api = {
  remove,
  create: upsert,
  update: upsert,
  queryList,
  query,
}
const clearValue = e => {
  e.target.value = null
}
const mapToFileDto = async file => {
  const base64 = await convertToBase64(file)
  const originalFile = {
    content: base64,
  }

  return originalFile
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
]
const allowedFiles = '.xlsx'

const goDetailPage = row => {
  history.push(`/inventory/master/medication/${row.id}`)
}
const MedicationIndex = ({ dispatch }) => {
  const [exporting, setExporting] = useState(false)
  const inputEl = useRef(null)
  const { actionRef } = PageContainer.Context.useContainer()
  const [loadingText, setLoadingText] = useState('')

  const onFileChange = async event => {
    try {
      const { files } = event.target

      const selectedFiles = await Promise.all(
        Object.keys(files).map(key => mapToFileDto(files[key])),
      )

      if (selectedFiles.length > 0) {
        setExporting(true)
        setLoadingText('Importing...')

        dispatch({
          type: 'medication/import',
          payload: {
            ...selectedFiles[0],
          },
        }).then(result => {
          if (result && result.byteLength === 0) {
            notification.success({
              message: 'Import success',
            })

            // onSearchClick()
          } else if (result && result.byteLength > 0) {
            notification.warning({
              message:
                'File is not valid, please download the validation file and check the issues',
            })
            downloadFile(result, 'Validation.xlsx')
          } else {
            notification.error({
              message: 'Import failed',
            })
          }

          setExporting(false)
        })
      }
    } catch (error) {
      console.log({ error })
    }
  }
  return (
    <ProTable
      // actionRef={a.actionRef}
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
            icon={<Icon type='plus' />}
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
            Add New
          </Button>,

          <Authorized authority='inventorymaster.newinventoryitem'>
            <input
              style={{ display: 'none' }}
              type='file'
              accept={allowedFiles}
              id='importMedicationFile'
              ref={inputEl}
              multiple={false}
              onChange={onFileChange}
              onClick={clearValue}
            />

            <Button
              type='primary'
              icon={<Icon type='attachment' />}
              onClick={() => {
                console.log(actionRef?.current?.getRecords())
              }}
            >
              Import
            </Button>
          </Authorized>,
          <Button
            type='primary'
            icon={<Icon type='file-excel' />}
            loading={exporting}
            onClick={async () => {
              setExporting(true)
              setLoadingText('Exporting...')
              dispatch({
                type: 'medication/export',
              }).then(result => {
                if (result) {
                  downloadFile(result, 'Medication.xlsx')
                }
                setExporting(false)
              })
            }}
          >
            Export
          </Button>,
        ]
      }}
      onRowDblClick={goDetailPage}
      defaultColumns={['options']}
      features={[
        {
          code: 'edit',
          render: row => {
            return (
              <Button
                onClick={() => {
                  goDetailPage(row)
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
})(MedicationIndex)
