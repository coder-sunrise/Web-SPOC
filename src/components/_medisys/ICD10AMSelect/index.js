import React, { PureComponent } from 'react'
import { Select } from '@/components'
import { queryList } from '@/services/common'

class ICD10AMSelect extends PureComponent {
  onICD10AMSearch = async (v) => {
    const { labelField = 'code' } = this.props
    const search = {
      props: 'id,displayvalue,code',
      sorting: [
        { columnName: 'displayvalue', direction: 'asc' },
      ],
      pagesize: 30,
    }
    if (typeof v === 'string') {
      if (!labelField || labelField === 'code') {
        search.code = v
      } else {
        search.displayvalue = v
      }
    } else {
      search.id = Number(v)
    }

    const response = await queryList('/api/codetable/cticd10am', search)
    return response
  }

  render () {
    const {
      valueField,
      labelField,
      label,
      mode,
      options,
      ...otherprops
    } = this.props

    return (
      <Select
        autoComplete
        label={label}
        mode={mode}
        options={options}
        valueField={valueField || 'id'}
        labelField={labelField || 'code'}
        query={this.onICD10AMSearch}
        {...otherprops}
      />
    )
  }
}
export default ICD10AMSelect
