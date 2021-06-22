
import { Breadcrumb } from 'antd'
import React, { useState, useRef, useEffect } from 'react'
import { useIntl, Link } from 'umi'
import { Theme } from '@material-ui/core/styles/createMuiTheme'
import { withStyles } from '@material-ui/styles'
import { connect } from 'dva'
import moment from 'moment'
import { currencySymbol } from '@/utils/config'
import _ from 'lodash'
import Loadable from 'react-loadable'
import Add from '@material-ui/icons/Add'
import {
  FastEditableTableGrid,
  Button,
  CommonModal,
  notification,
  Tooltip,
} from '@/components'
import Loading from '@/components/PageLoading/index'
import service from '@/services/patient'
import { getUniqueId } from '@/utils/utils'
import { preOrderItemCategory } from '@/utils/codes'
import { VISIT_TYPE_NAME } from '@/utils/constants'


// interface IPendingPreOrderProps {
// }

// const styles = (theme: Theme) => ({
//   breadcrumbtext: {
//     fontSize: '18px',
//     color: 'black',
//   },
//   breadcrumblink: {
//     fontSize: '18px',
//     color: 'black',
//     '&:hover': {
//       color: '#4255bd',
//     },
//   },
// })


const PendingPreOrder: React.FC = (props: any) => {
  const { values, schema, user: { data: { clinicianProfile } } } = props
  const { formatMessage } = useIntl()
  const [medications, setMedications] = useState()
  const [vaccinations, setVaccinations] = useState()

  const commitChanges = ({ rows }) => {
    const { setFieldValue, values } = props
    // console.log(rows)
    setFieldValue('preOrderList', rows)
  }

  const fetchCodeTable = async (ctname: 'ctservice' | 'inventoryvaccination' | 'inventorymedication') => {
    return props.dispatch({
      type: 'codetable/fetchCodes',
      payload: {
        code: ctname,
      },
    })
  }

  const initMedicationVaccintionsOptions = () => {
    const itemWrapper = (p: any, c: any) => {
      const { code, displayValue, sellingPrice = 0, dispensingUOM = {} } = c
      const { name: uomName = '' } = dispensingUOM
      let opt = {
        ...c,
        combinDisplayValue: `${displayValue} - ${code} (${currencySymbol}${sellingPrice.toFixed(
          2,
        )} / ${uomName})`,
      }
      return [...p, opt]
    }

    if (!medications) {
      const { codetable: { inventorymedication } } = props
      if (inventorymedication && inventorymedication.length > 0) {
        const retResponse = inventorymedication.reduce(itemWrapper, [])
        setMedications(retResponse)
      } else {
        fetchCodeTable('inventorymedication').then((response) => {
          const retResponse = response.reduce(itemWrapper, [])
          setMedications(retResponse)
        })
      }
    }
    if (!vaccinations) {
      const { codetable: { inventoryvaccination } } = props
      if (inventoryvaccination && inventoryvaccination.length >= 0) {
        const combinRespons = inventoryvaccination.reduce(itemWrapper, [])
        setVaccinations(combinRespons)
      } else {
        fetchCodeTable('inventoryvaccination').then((response) => {
          const combinRespons = response.reduce(itemWrapper, [])
          setVaccinations(combinRespons)
        })
      }
    }
  }

  const generateItemDataSource = (row: any) => {
    const { sourceCategory } = row
    if (sourceCategory) {
      if (sourceCategory === preOrderItemCategory.Medication) {
        return medications
      }
      if (sourceCategory === preOrderItemCategory.Vaccination) {
        return vaccinations
      }
    }
  }

  const handleCategoryChanged = (e: any) => {
    // console.log('handleCategoryChanged', e)
    if (!e.option) {
      return
    }

    const { option, row } = e
    row.quantity = undefined
    row.amount = undefined
  }
  const handleItemChanged = (e: any) => {
    const { row, value } = e
    row.quantity = undefined
    row.amount = undefined
    row.remarks = undefined
  }

  const handelQuantityChanged = (e) => {
    const { row, value } = e
    const { sourceCategory } = row
    if (!sourceCategory) {
      return
    }

    if (medications && sourceCategory === preOrderItemCategory.Medication) {
      const item = medications.find((m) => m.id === row.sourceRecordFK)
      if (item) {
        const { sellingPrice } = item
        row.amount = sellingPrice * value
      }
    }
  }

  useEffect(() => {
    initMedicationVaccintionsOptions()
  }, [])

  const tableParas = {
    columns: [
      { name: 'sourceCategory', title: 'Category' },
      { name: 'sourceRecordFK', title: 'Name' },
      { name: 'quantity', title: 'Quantity' },
      { name: 'visitPurposeFK', title: 'Visit Type' },
      { name: 'orderedByUserName', title: 'Order By' },
      { name: 'orderedDateTime', title: 'Order Time' },
      { name: 'remarks', title: 'Remarks' },
      { name: 'amount', title: 'Amount' },
    ],
    columnExtensions: [
      {
        columnName: 'sourceCategory',
        type: 'select',
        labelField: 'name',
        valueField: 'name',
        width: 180,
        options: () => Object.keys(preOrderItemCategory).map((k) => ({ name: preOrderItemCategory[k] })),
        onChange: handleCategoryChanged,
      },
      {
        columnName: 'sourceRecordFK',
        type: 'select',
        labelField: 'combinDisplayValue',
        valueField: 'id',
        options: generateItemDataSource,
        onChange: handleItemChanged,
      },
      {
        columnName: 'quantity',
        type: 'number',
        precision: 2,
        width: 100,
        onChange: handelQuantityChanged,
      },
      {
        columnName: 'visitPurposeFK',
        type: 'select',
        width: 120,
        labelField: 'displayName',
        valueField: 'visitPurposeFK',
        options: () => VISIT_TYPE_NAME,
        isDisabled: () => true,
        sortingEnabled: false,
      },
      {
        columnName: 'orderedByUserName',
        width: 150,
        isDisabled: () => true,
      },
      {
        columnName: 'orderedDateTime',
        type: 'date',
        width: 100,
        isDisabled: () => true,
      },
      {
        columnName: 'remarks',
        maxLength: 100,
        sortingEnabled: false,
      },
      {
        columnName: 'amount',
        width: 100,
        type: 'currency',
      },
    ],
  }


  if (!medications || !vaccinations) {
    return <Loading />
  }

  return <>
    <FastEditableTableGrid
      rows={values.preOrderList}
      schema={schema}
      EditingProps={{
        showAddCommand: true,
        onCommitChanges: commitChanges,
        onAddedRowsChange: (rows: any) => {
          return rows.map(o => {
            return {
              orderedDateTime: moment(),
              orderedByUserName: clinicianProfile?.name,
              ...o,
            }
          })
        },
      }}
      {...tableParas}
    />
  </>
}

export default connect(({ codetable, user }) => ({ codetable, user }))(PendingPreOrder)
// export default withStyles(styles)(PreOrder)