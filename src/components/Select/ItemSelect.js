import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { connect, useDispatch } from 'dva'
import CodeSelect from './CodeSelect'
import { Select } from '@/components'
import { fetchCodeTable } from '@/utils/codetable'
import { withStyles, Divider } from '@material-ui/core'
import { set } from '@umijs/deps/compiled/lodash'
import { preOrderItemCategory } from '@/utils/codes'
import { SERVICE_CENTER_CATEGORY } from '@/utils/constants'
const ItemSelect = ({ codetable, itemType, ...props }) => {
  const {
    inventorymedication,
    inventoryconsumable,
    inventoryvaccination,
    ctservice = [],
  } = codetable
  const dispatch = useDispatch()

  useEffect(() => {
    fetchCodeTables()
  }, [])

  const fetchCodeTables = async () => {
    await dispatch({
      type: 'codetable/fetchCodes',
      payload: {
        code: 'ctservice',
        force: true,
        temp: true,
      },
    })
  }

  const labsFilter =
    ctservice.length > 0
      ? ctservice.filter(
          c =>
            c.serviceCenterCategoryFK ===
            SERVICE_CENTER_CATEGORY.INTERNALLABSERVICECENTER,
        )
      : []

  const radiologysFilter =
    ctservice.length > 0
      ? ctservice.filter(
          c =>
            c.serviceCenterCategoryFK ===
            SERVICE_CENTER_CATEGORY.INTERNALRADIOLOGYSERVICECENTER,
        )
      : []

  const servicesFilter =
    ctservice.length > 0
      ? ctservice.filter(
          c =>
            c.serviceCenterCategoryFK !==
              SERVICE_CENTER_CATEGORY.INTERNALLABSERVICECENTER &&
            c.serviceCenterCategoryFK !==
              SERVICE_CENTER_CATEGORY.INTERNALRADIOLOGYSERVICECENTER,
        )
      : []

  const optionsList =
    itemType === preOrderItemCategory[0].value
      ? inventorymedication
      : itemType === preOrderItemCategory[1].value
      ? inventoryconsumable
      : itemType === preOrderItemCategory[2].value
      ? inventoryvaccination
      : itemType === preOrderItemCategory[3].value
      ? servicesFilter
      : itemType === preOrderItemCategory[4].value
      ? labsFilter
      : itemType === preOrderItemCategory[5].value
      ? radiologysFilter
      : []

  return (
    <Select
      valueField='id'
      labelField='displayValue'
      label='Item List'
      mode='multiple'
      options={optionsList}
      {...props}
    />
  )
}

const Connected = connect(({ codetable }) => ({ codetable }))(ItemSelect)

export default withStyles({ withTheme: true })(Connected)
