import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import CodeSelect from './CodeSelect'
import { getMappedVisitType } from '@/utils/utils'

@connect(({ codetable, clinicSettings }) => ({ codetable, clinicSettings }))
class VisitTypeSelect extends React.Component {
  state = {}
  constructor(props) {
    super(props)
  }

  componentDidMount() {
    const { dispatch, clinicSettings } = this.props
    dispatch({
      type: 'codetable/fetchCodes',
      payload: {
        code: 'ctVisitpurpose',
      },
    }).then(result => {
      if (result) {
        const visitTypeSetting = JSON.parse(
          clinicSettings.settings.visitTypeSetting,
        )
        var newVisitType = getMappedVisitType(result, visitTypeSetting).filter(
          vt => vt.isEnabled === 'true',
        )
        this.setState({
          ctVisitpurpose: newVisitType,
        })
      }
    })
  }

  render() {
    const {
      field,
      form,
      codetable,
      clinicSettings,
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
        options={this.state.ctVisitpurpose}
        labelField='name'
        {...this.props}
      />
    )
  }
}

VisitTypeSelect.propTypes = {}

export default VisitTypeSelect
