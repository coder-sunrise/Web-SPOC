import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { connect, useDispatch } from 'dva'
import CodeSelect from './CodeSelect'
import { Select } from '@/components'
import { fetchCodeTable } from '@/utils/codetable'
import { withStyles, Divider } from '@material-ui/core'
import { set } from '@umijs/deps/compiled/lodash'
import { orderItemCategory } from '@/utils/codes'
const ItemSelect = ({ codetable, itemType, ...props }) => {
  const { inventoryconsumable, ctservice = [] } = codetable
  const dispatch = useDispatch()
  let selectProps = props
  const initMaxTagCount =
    props.field && props.field.value && props.field.value.length === 1 ? 1 : 0
  const [maxTagCount, setMaxTagCount] = useState(
    props.maxTagCount !== undefined ? props.maxTagCount : initMaxTagCount,
  )
  if (
    props.maxTagCount === undefined &&
    props.mode &&
    props.mode === 'multiple'
  ) {
    selectProps = { ...props, maxTagCount }
  }
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
    await dispatch({
      type: 'codetable/fetchCodes',
      payload: {
        code: 'inventoryconsumable',
      },
    })
  }

  const optionsList =
    itemType === orderItemCategory[0].value
      ? inventoryconsumable
      : itemType === orderItemCategory[1].value
      ? ctservice
      : []
  return (
    <Select
      valueField='id'
      mode='multiple'
      options={optionsList || []}
      onChange={(values, opts) => {
        if (
          props.maxTagCount === undefined &&
          props.mode &&
          props.mode === 'multiple'
        ) {
          setMaxTagCount(values && values.length === 1 ? 1 : 0)
        }
        if (props.onChange) {
          props.onChange(values, opts)
        }
      }}
      {...selectProps}
    />
  )
}

const Connected = connect(({ codetable }) => ({ codetable }))(ItemSelect)

export default withStyles({ withTheme: true })(Connected)
