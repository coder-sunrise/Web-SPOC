import React, { PureComponent } from 'react'
import { CodeSelect } from '@/components'
import { queryList } from '@/services/common'

class ICD10AMSelect extends PureComponent {
  onICD10AMSearch = async (v) => {
    const search = {
      props: 'id,displayvalue,code',
      sorting: [
        { columnName: 'displayvalue', direction: 'asc' },
      ],
      pagesize: 30,
    }
    if (typeof v === 'string') {
      const { labelField } = this.props
      if (!labelField || labelField === 'code') {
        search.code = v
      } else {
        search.displayvalue = v
      }
    } else {
      search.id = Number(v)
    }

    const response = await queryList('/api/codetable/ctsnomeddiagnosis', search)
    if (response && response.data) {
      if (this.props.onDataSouceChange)
        this.props.onDataSouceChange(response.data.data)
    }
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
      <CodeSelect
        label={label}
        mode={mode}
        options={options}
        valueField={valueField || 'id'}
        labelField={labelField || 'code'}
        query={this.onICD10AMSearch}
        onChange={(values, opts) => {
          if (this.props.onChange) {
            this.props.onChange(values, opts)
          }
        }}
        {...otherprops}
      />
    )
  }
}
export default ICD10AMSelect
