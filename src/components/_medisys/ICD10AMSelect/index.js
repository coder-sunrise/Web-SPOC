import React, { useState } from 'react'
import { withStyles } from '@material-ui/core'
import _ from 'lodash'
import { Select } from '@/components'
import { queryList } from '@/services/common'

const styles = (theme) => ({})

const ICD10AMSelect = ({
  dispatch,
  theme,
  classes,
  label,
  onDataSouceChange,
  labelField,
  valueField,
  mode,
  ...props
}) => {
  const [
    ctICD10AM,
    setCtICD10AM,
  ] = useState([])

  const onICD10AMSearch = async (v) => {
    const search = {
      props: 'id,displayvalue,code',
      sorting: [
        { columnName: 'displayvalue', direction: 'asc' },
      ],
      pagesize: 30,
    }
    if (typeof v === 'string') {
      search.group = [
        {
          displayvalue: v,
          code: v,
          combineCondition: 'or',
        },
      ]
    } else {
      search.id = Number(v)
    }

    const response = await queryList('/api/codetable/cticd10am', search)
    if (response && response.data) {
      setCtICD10AM(response.data.data)

      dispatch({
        type: 'codetable/updateState',
        payload: {
          'codetable/cticd10am': response.data.data,
        },
      })
    }
    return response
  }

  return (
    <Select
      label={mode === 'tags' ? undefined : label || 'ICD10-AM'}
      mode
      options={ctICD10AM}
      valueField={valueField || 'id'}
      labelField={labelField || 'displayvalue'}
      query={onICD10AMSearch}
      onDataSouceChange={(data) => {
        setCtICD10AM(data)
        if (onDataSouceChange) onDataSouceChange(data)
      }}
      onChange={(values, opts) => {
        if (props.onChange) {
          props.onChange(values, opts)
        }
      }}
      {...props}
    />
  )
}
export default withStyles(styles, { withTheme: true })(ICD10AMSelect)
