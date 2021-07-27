import React, { useState, useRef, useEffect } from 'react'
import { connect } from 'dva'
import moment from 'moment'
import { currencySymbol } from '@/utils/config'
import _ from 'lodash'
import Authorized from '@/utils/Authorized'
import { FastEditableTableGrid } from '@/components'
import Loading from '@/components/PageLoading/index'
import { preOrderItemCategory } from '@/utils/codes'
import { SERVICE_CENTER_CATEGORY } from '@/utils/constants'
// interface IPendingPreOrderProps {
// }

const PendingPreOrder: React.FC = (props: any) => {
  const {
    values,
    schema,
    user: {
      data: { clinicianProfile },
    },
  } = props
  const [medications, setMedications] = useState()
  const [consumables, setConsumables] = useState()
  const [vaccinations, setVaccinations] = useState()
  const [services, setServices] = useState()
  const [labs, setLabs] = useState()
  const [radiology, setRadiology] = useState()

  const addPreOrderAccessRight = Authorized.check(
    'patientdatabase.modifypreorder.addpreorder',
  ) || { rights: 'hidden' }
  const deletePreOrderAccessRight = Authorized.check(
    'patientdatabase.modifypreorder.deletepreorder',
  ) || { rights: 'hidden' }

  const isEditable = row => {
    return row.id < 0 ? true : false
  }

  const commitChanges = ({ rows }) => {
    const { setFieldValue, values } = props
    setFieldValue('pendingPreOrderItem', rows)
  }

  const fetchCodeTable = async (
    ctname:
      | 'ctservice'
      | 'inventoryvaccination'
      | 'inventorymedication'
      | 'inventoryconsumable',
  ) => {
    return props.dispatch({
      type: 'codetable/fetchCodes',
      payload: {
        code: ctname,
      },
    })
  }

  const initAllTypeOptions = () => {
    const itemWrapper = (p: any, c: any) => {
      const {
        code,
        displayValue,
        sellingPrice = 0,
        dispensingUOM = {},
        uom = {},
        unitPrice = 0,
      } = c
      const { name: medAndVacUOM = '' } = dispensingUOM
      const { name: consumableUOM = '' } = uom
      let uomName = medAndVacUOM || consumableUOM || ''
      let pricing =
        sellingPrice === 0 ? (unitPrice === 0 ? 0 : unitPrice) : sellingPrice
      let opt = {
        ...c,
        combinDisplayValue: `${displayValue} - ${code} (${currencySymbol}${pricing.toFixed(
          2,
        )} / ${uomName})`,
      }
      return [...p, opt]
    }

    if (!medications) {
      const {
        codetable: { inventorymedication },
      } = props
      if (inventorymedication && inventorymedication.length > 0) {
        const retResponse = inventorymedication.reduce(itemWrapper, [])
        setMedications(retResponse)
      } else {
        fetchCodeTable('inventorymedication').then(response => {
          const retResponse = response.reduce(itemWrapper, [])
          setMedications(retResponse)
        })
      }
    }
    if (!vaccinations) {
      const {
        codetable: { inventoryvaccination },
      } = props
      if (inventoryvaccination && inventoryvaccination.length >= 0) {
        const combinRespons = inventoryvaccination.reduce(itemWrapper, [])
        setVaccinations(combinRespons)
      } else {
        fetchCodeTable('inventoryvaccination').then(response => {
          const combinRespons = response.reduce(itemWrapper, [])
          setVaccinations(combinRespons)
        })
      }
    }
    if (!consumables) {
      const {
        codetable: { inventoryconsumable },
      } = props
      if (inventoryconsumable && inventoryconsumable.length >= 0) {
        const retResponse = inventoryconsumable.reduce(itemWrapper, [])
        setConsumables(retResponse)
      } else {
        fetchCodeTable('inventoryconsumable').then(response => {
          const retResponse = response.reduce(itemWrapper, [])
          setConsumables(retResponse)
        })
      }
    }
    if (!services) {
      const {
        codetable: { ctservice },
      } = props
      if (ctservice && ctservice.length >= 0) {
        const retSerResponse = ctservice
          .filter(
            c =>
              c.serviceCenterCategoryFK !==
                SERVICE_CENTER_CATEGORY.INTERNALLABSERVICECENTER &&
              c.serviceCenterCategoryFK !==
                SERVICE_CENTER_CATEGORY.INTERNALRADIOLOGYSERVICECENTER,
          )
          .reduce(itemWrapper, [])
        setServices(retSerResponse)
        const retLabResponse = ctservice
          .filter(
            c =>
              c.serviceCenterCategoryFK ===
              SERVICE_CENTER_CATEGORY.INTERNALLABSERVICECENTER,
          )
          .reduce(itemWrapper, [])
        setLabs(retLabResponse)
        const retRadiologyResponse = ctservice
          .filter(
            c =>
              c.serviceCenterCategoryFK ===
              SERVICE_CENTER_CATEGORY.INTERNALRADIOLOGYSERVICECENTER,
          )
          .reduce(itemWrapper, [])
        setRadiology(retRadiologyResponse)
      } else {
        fetchCodeTable('ctservice').then(response => {
          const retSerResponse = response
            .filter(
              c =>
                c.serviceCenterCategoryFK !==
                  SERVICE_CENTER_CATEGORY.INTERNALLABSERVICECENTER &&
                c.serviceCenterCategoryFK !==
                  SERVICE_CENTER_CATEGORY.INTERNALRADIOLOGYSERVICECENTER,
            )
            .reduce(itemWrapper, [])
          setServices(retSerResponse)
          const retLabResponse = response
            .filter(
              c =>
                c.serviceCenterCategoryFK ===
                SERVICE_CENTER_CATEGORY.INTERNALLABSERVICECENTER,
            )
            .reduce(itemWrapper, [])
          setLabs(retLabResponse)
          const retRadiologyResponse = response
            .filter(
              c =>
                c.serviceCenterCategoryFK ===
                SERVICE_CENTER_CATEGORY.INTERNALRADIOLOGYSERVICECENTER,
            )
            .reduce(itemWrapper, [])
          setRadiology(retRadiologyResponse)
        })
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

  const getFilteredRows = (rows: any) => {
    const result = rows.filter(
      (c: { preOrderItemStatus: string }) =>
        c.preOrderItemStatus !== 'Actualized',
    )
    return result
  }
  const handleCategoryChanged = (e: any) => {
    if (!e.option) {
      return
    }

    const { option, row } = e
    ;(row.quantity = undefined),
      (row.amount = 0),
      (row.itemName = undefined),
      (row.preOrderVaccinationItem = undefined),
      (row.preOrderServiceItem = undefined),
      (row.preOrderMedicationItem = undefined),
      (row.preOrderConsumableItem = undefined)
  }
  const handleItemChanged = (e: any) => {
    const { row, option } = e
    row.itemName = option?.combinDisplayValue
    if (row.preOrderItemType === preOrderItemCategory[0].value)
      row.preOrderMedicationItem = { InventoryMedicationFK: option.id }
    else if (row.preOrderItemType === preOrderItemCategory[1].value)
      row.preOrderConsumableItem = { InventoryConsumableFK: option.id }
    else if (row.preOrderItemType === preOrderItemCategory[2].value)
      row.preOrderVaccinationItem = {
        InventoryVaccinationFK: option.id,
      }
    else if (
      row.preOrderItemType === preOrderItemCategory[3].value ||
      row.preOrderItemType == preOrderItemCategory[4].value ||
      row.preOrderItemType == preOrderItemCategory[5].value
    )
      row.preOrderServiceItem = { ServiceCenterServiceFK: option.id }
    row.quantity = undefined
    row.amount = 0
    row.remarks = undefined
  }

  const handelQuantityChanged = e => {
    const { row, value } = e
    const {
      preOrderItemType,
      preOrderMedicationItem = {},
      preOrderServiceItem = {},
      preOrderVaccinationItem = {},
      preOrderConsumableItem = {},
    } = row
    if (!preOrderItemType) {
      return
    }

    if (medications && preOrderItemType === preOrderItemCategory[0].value) {
      const item = medications.find(
        m => m.id === preOrderMedicationItem.InventoryMedicationFK,
      )
      if (item) {
        const { sellingPrice } = item
        row.amount = sellingPrice * value
      }
    }

    if (consumables && preOrderItemType === preOrderItemCategory[1].value) {
      const item = consumables.find(
        m => m.id === preOrderConsumableItem.InventoryConsumableFK,
      )
      if (item) {
        const { sellingPrice } = item
        row.amount = sellingPrice * value
      }
    }

    if (vaccinations && preOrderItemType === preOrderItemCategory[2].value) {
      const item = vaccinations.find(
        m => m.id === preOrderVaccinationItem.InventoryVaccinationFK,
      )
      if (item) {
        const { sellingPrice } = item
        row.amount = sellingPrice * value
      }
    }

    if (services && preOrderItemType === preOrderItemCategory[3].value) {
      const item = services.find(
        m => m.id === preOrderServiceItem.ServiceCenterServiceFK,
      )
      if (item) {
        const { unitPrice } = item
        row.amount = unitPrice * value
      }
    }

    if (labs && preOrderItemType === preOrderItemCategory[4].value) {
      const item = labs.find(
        m => m.id === preOrderServiceItem.ServiceCenterServiceFK,
      )
      if (item) {
        const { unitPrice } = item
        row.amount = unitPrice * value
      }
    }

    if (radiology && preOrderItemType === preOrderItemCategory[5].value) {
      const item = radiology.find(
        m => m.id === preOrderServiceItem.ServiceCenterServiceFK,
      )
      if (item) {
        const { unitPrice } = item
        row.amount = unitPrice * value
      }
    }
  }

  useEffect(() => {
    initAllTypeOptions()
  }, [])

  const tableParas = {
    columns: [
      { name: 'preOrderItemType', title: 'Type' },
      { name: 'itemName', title: 'Name' },
      { name: 'quantity', title: 'Order Qty.' },
      { name: 'orderByUserFK', title: 'Order By' },
      { name: 'orderDate', title: 'Order Date' },
      { name: 'remarks', title: 'Remarks' },
      { name: 'amount', title: 'Amount' },
      { name: 'hasPaid', title: 'Paid' },
      { name: 'preOrderItemStatus', title: 'Status' },
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
        isDisabled: row => !isEditable(row),
      },
      {
        columnName: 'itemName',
        type: 'select',
        labelField: 'combinDisplayValue',
        valueField: 'id',
        options: generateItemDataSource,
        onChange: handleItemChanged,
        render: (row, option) => {
          return <div>{row.itemName}</div>
        },
        isDisabled: row => !isEditable(row),
      },
      {
        columnName: 'quantity',
        type: 'number',
        precision: 1,
        width: 100,
        onChange: handelQuantityChanged,
        render: row => {
          return (
            <span>
              {row.id < 0 ? row.quantity : row.quantity.toFixed(1)}
              {row.dispenseUOM}
            </span>
          )
        },
        isDisabled: row => !isEditable(row),
      },
      {
        columnName: 'orderByUserFK',
        width: 150,
        type: 'text',
        render: row => {
          return row.orderByUser
        },
        isDisabled: () => true,
      },
      {
        columnName: 'orderDate',
        type: 'date',
        width: 150,
        isDisabled: () => true,
        render: row => {
          return (
            <span>{moment(row.orderDate).format('DD MMM YYYY HH:mm')}</span>
          )
        },
      },
      {
        columnName: 'remarks',
        maxLength: 100,
        sortingEnabled: false,
        isDisabled: row =>
          addPreOrderAccessRight.rights === 'enable' ? false : true,
      },
      {
        columnName: 'amount',
        width: 100,
        type: 'currency',
        isDisabled: row => !isEditable(row),
      },
      {
        columnName: 'hasPaid',
        width: 100,
        isDisabled: () => true,
        render: row => {
          return row.hasPaid ? 'Yes' : 'No'
        },
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

  return (
    <>
      <FastEditableTableGrid
        rows={getFilteredRows(values.pendingPreOrderItem)}
        schema={schema}
        FuncProps={{
          pager: false,
        }}
        EditingProps={{
          showAddCommand:
            addPreOrderAccessRight.rights === 'enable' ? true : false,
          isDeletable: row => {
            return deletePreOrderAccessRight.rights === 'enable' &&
              row.hasPaid === false &&
              row.preOrderItemStatus === 'New'
              ? true
              : false
          },
          showCommandColumn:
            deletePreOrderAccessRight.rights === 'hidden' ? false : true,
          onCommitChanges: commitChanges,
          onAddedRowsChange: (rows: any) => {
            return rows.map(o => {
              return {
                orderDate: moment(),
                orderByUserFK: clinicianProfile?.userProfileFK,
                orderByUser: clinicianProfile?.userProfile.userName,
                preOrderItemStatus: 'New',
                hasPaid: false,
                amount: 0,
                preOrderVaccinationItem: undefined,
                preOrderServiceItem: undefined,
                preOrderMedicationItem: undefined,
                preOrderConsumableItem: undefined,
                ...o,
              }
            })
          },
        }}
        {...tableParas}
      />
    </>
  )
}

export default connect(({ codetable, user }) => ({ codetable, user }))(
  PendingPreOrder,
)
