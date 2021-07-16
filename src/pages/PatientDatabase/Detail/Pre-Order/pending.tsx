
import React, { useState, useRef, useEffect } from 'react'
import { useIntl, Link } from 'umi'
import { connect } from 'dva'
import moment from 'moment'
import { currencySymbol } from '@/utils/config'
import _ from 'lodash'
import Authorized from '@/utils/Authorized'
import {
  FastEditableTableGrid,
} from '@/components'
import Loading from '@/components/PageLoading/index'
import service from '@/services/patient'
import { getUniqueId } from '@/utils/utils'
import { preOrderItemCategory } from '@/utils/codes'
import { VISIT_TYPE_NAME } from '@/utils/constants'
import { SERVICE_CENTER_CATEGORY } from '@/utils/constants'
// interface IPendingPreOrderProps {
// }

const PendingPreOrder: React.FC = (props: any) => {
  const { values, schema, user: { data: { clinicianProfile } } } = props
  const [medications, setMedications] = useState()
  const [consumables, setConsumables] = useState()
  const [vaccinations, setVaccinations] = useState()
  const [services, setServices] = useState()
  const [labs, setLabs] = useState()
  const [radiology, setRadiology] = useState()

  const modifyPreOrderAccessRight = Authorized.check('patientdatabase.modifypreorder') ||  {rights: 'hidden'}

  const isEditable = modifyPreOrderAccessRight.rights === 'enable' ? true : false;

  const commitChanges = ({ rows }) => {
    const { setFieldValue, values } = props
    setFieldValue('pendingPreOrderItem', rows)
  }

  const fetchCodeTable = async (ctname: 'ctservice' | 'inventoryvaccination' | 'inventorymedication' | 'inventoryconsumable') => {
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
    if(!consumables) {
      const {codetable: {inventoryconsumable}} = props
      if(inventoryconsumable && inventoryconsumable.length >= 0) {
        const retResponse = inventoryconsumable.reduce(itemWrapper,[])
        setConsumables(retResponse)
      }else{
        fetchCodeTable('inventoryconsumable').then((response) => {
          const retResponse = response.reduce(itemWrapper, [])
          setConsumables(retResponse)
        })
      }
    }
    if (!services) {
      const {codetable: {ctservice}} = props
      if(ctservice && ctservice.length >= 0) {
        const retSerResponse = ctservice.filter(c => c.serviceCenterCategoryFK !== SERVICE_CENTER_CATEGORY.INTERNALLABSERVICECENTER  && c.serviceCenterCategoryFK !== SERVICE_CENTER_CATEGORY.INTERNALRADIOLOGYSERVICECENTER).reduce(itemWrapper,[])
        setServices(retSerResponse)
        const retLabResponse = ctservice.filter(c => c.serviceCenterCategoryFK === SERVICE_CENTER_CATEGORY.INTERNALLABSERVICECENTER ).reduce(itemWrapper,[])
        setLabs(retLabResponse)
        const retRadiologyResponse = ctservice.filter(c => c.serviceCenterCategoryFK === SERVICE_CENTER_CATEGORY.INTERNALRADIOLOGYSERVICECENTER).reduce(itemWrapper,[])
        setRadiology(retRadiologyResponse)
      }else{
        fetchCodeTable('ctservice').then((response) => {
          const retSerResponse = response.filter(c => c.serviceCenterCategoryFK !== SERVICE_CENTER_CATEGORY.INTERNALLABSERVICECENTER  && c.serviceCenterCategoryFK !== SERVICE_CENTER_CATEGORY.INTERNALRADIOLOGYSERVICECENTER).reduce(itemWrapper,[])
          setServices(retSerResponse)
          const retLabResponse = response.filter(c => c.serviceCenterCategoryFK === SERVICE_CENTER_CATEGORY.INTERNALLABSERVICECENTER ).reduce(itemWrapper,[])
          setLabs(retLabResponse)
          const retRadiologyResponse = response.filter(c => c.serviceCenterCategoryFK === SERVICE_CENTER_CATEGORY.INTERNALRADIOLOGYSERVICECENTER).reduce(itemWrapper,[])
          setRadiology(retRadiologyResponse)})
      }
    }
  }

  const generateItemDataSource = (row: any) => {
    const { preOrderItemType } = row
    if (preOrderItemType) {
      if (preOrderItemType === preOrderItemCategory[0].value) {
        return medications
      }
      if (preOrderItemType === preOrderItemCategory[1].value) {
        return consumables
      }
      if (preOrderItemType === preOrderItemCategory[2].value) {
        return vaccinations
      }
      if (preOrderItemType === preOrderItemCategory[3].value) {
        return services
      }
      if (preOrderItemType === preOrderItemCategory[4].value) {
        return labs
      }
      if (preOrderItemType === preOrderItemCategory[5].value) {
        return radiology
      }
    }
  }

  const getFilteredRows = (rows : any) =>{
    const result = rows.filter((c: { preOrderItemStatus: string }) => c.preOrderItemStatus !=='Actualized')
    return result
  }
  const handleCategoryChanged = (e: any) => {
    if (!e.option) {
      return
    }

    const { option, row } = e
    row.quantity = undefined,
    row.amount = undefined,
    row.sourceRecordFK =undefined,
    row.itemName = undefined,
    row.preOrderVaccinationItem = undefined,
    row.preOrderServiceItem = undefined,
    row.preOrderMedicationItem =undefined,
    row.preOrderConsumableItem = undefined

  }
  const handleItemChanged = (e: any) => {
    const { row,option } = e
    row.itemName = option?.combinDisplayValue 
    if(row.preOrderItemType === preOrderItemCategory[0].value)
      row.preOrderMedicationItem = {InventoryMedicationFK : row.sourceRecordFK}
      else if (row.preOrderItemType === preOrderItemCategory[1].value)
      row.preOrderConsumableItem = {InventoryConsumableFK : row.sourceRecordFK}
      else if (row.preOrderItemType === preOrderItemCategory[2].value)
      row.preOrderVaccinationItem = {InventoryVaccinationFK : row.sourceRecordFK}
      else if (row.preOrderItemType === preOrderItemCategory[3].value || row.preOrderItemType == preOrderItemCategory[4].value ||row.preOrderItemType == preOrderItemCategory[5].value)
      row.preOrderServiceItem = {ServiceCenterServiceFK : row.sourceRecordFK}
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

    if (medications && sourceCategory === preOrderItemCategory[0].value) {
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
      { name: 'preOrderItemType', title: 'Category' },
      { name: 'sourceRecordFK', title: 'Name' },
      { name: 'quantity', title: 'Quantity' },
      { name: 'visitPurposeFK', title: 'Visit Type' },
      { name: 'orderByUserFK', title: 'Order By' },
      { name: 'orderDate', title: 'Order Date' },
      { name: 'remarks', title: 'Remarks' },
      { name: 'amount', title: 'Amount' },
      { name: 'preOrderItemStatus', title: 'Status'},
    ],
    columnExtensions: [
      {
        columnName: 'preOrderItemType',
        type: 'select',
        labelField: 'name',
        valueField: 'value',
        width: 180,
        options: () => preOrderItemCategory,
        onChange: handleCategoryChanged,
        isDisabled :(row) =>  isEditable === true && row.id < 0 ? false : true 
      },
      {
        columnName: 'sourceRecordFK',
        type: 'select',
        labelField: 'combinDisplayValue',
        valueField: 'id' , 
        options: generateItemDataSource,
        onChange: handleItemChanged,
        render: (row,option)=>{
          return <div>{row.itemName }</div>
        },
        isDisabled :() =>  isEditable ? false : true,
      },
      {
        columnName: 'quantity',
        type: 'number',
        precision: 2,
        width: 100,
        onChange: handelQuantityChanged,
        isDisabled :() =>  isEditable ? false : true,
      },
      {
        columnName: 'visitPurposeFK',
        type: 'select',
        width: 150,
        labelField: 'displayName',
        valueField: 'visitPurposeFK',
        options: () => VISIT_TYPE_NAME,
        sortingEnabled: false,
        isDisabled :() =>  isEditable ? false : true,
      },
      {
        columnName: 'orderByUserFK',
        width: 150,
        type: 'text',
        render:(row)=>{
          return row.orderByUser
        },
        isDisabled: () => true,
      },
      {
        columnName: 'orderDate',
        type: 'date',
        width: 100,
        isDisabled: () => true,
      },
      {
        columnName: 'remarks',
        maxLength: 100,
        sortingEnabled: false,
        isDisabled :() =>  isEditable ? false : true,
      },
      {
        columnName: 'amount',
        width: 100,
        type: 'currency',
        isDisabled :() =>  isEditable ? false : true,
      },
      {
        columnName: 'preOrderItemStatus',
        width: 100,
        isDisabled: () => true,
      },
    ],
  }

  if (!medications || !vaccinations) {
    return <Loading />
  }

  return <>
    <FastEditableTableGrid
      rows={getFilteredRows(values.pendingPreOrderItem)}
      schema={schema}
      FuncProps={{
          pager:false,
      }}
      EditingProps={{
        showAddCommand: isEditable,
        isDeletable: (row) => {
          return isEditable && row.preOrderItemStatus ==='New' ? true : false;
        },
        onCommitChanges: commitChanges,
        onAddedRowsChange: (rows: any) => {
          return rows.map(o => {
            return {
              orderDate: moment(),
              orderByUserFK: clinicianProfile?.userProfileFK,
              orderByUser: clinicianProfile?.userProfile.userName,
              preOrderItemStatus: 'New',
              preOrderVaccinationItem : undefined,
              preOrderServiceItem : undefined,
              preOrderMedicationItem : undefined,
              preOrderConsumableItem : undefined,
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