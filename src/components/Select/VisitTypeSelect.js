import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import CodeSelect from './CodeSelect'
import { getMappedVisitType } from '@/utils/utils'

@connect(({ codetable }) => ({ codetable }))
class VisitTypeSelect extends React.Component {
  constructor(props) {
    super(props)
  }
  render() {
    const {
      field,
      form,
      codetable,
      label,
      mode,
      maxTagPlaceholder,
    } = this.props
    return (
      <CodeSelect
        valueField='id'
        mode={mode}
        label={label}
        maxTagCount={0}
        maxTagPlaceholder={maxTagPlaceholder}
        code='ctVisitpurpose'
        labelField='name'
        {...this.props}
      />
    )
  }
}

VisitTypeSelect.propTypes = {}

export default VisitTypeSelect
