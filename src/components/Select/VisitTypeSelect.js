import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import CodeSelect from './CodeSelect'

@connect(({ codetable, clinicSettings }) => ({ codetable, clinicSettings }))
class VisitTypeSelect extends React.Component {
  state = {}
  constructor(props) {
    super(props)
  }

  mapVisitType = (visitpurpose, visitTypeSettingsObj) => {
    return visitpurpose
      .map((item, index) => {
        const { name, code, sortOrder, ...rest } = item
        const visitType = visitTypeSettingsObj
          ? visitTypeSettingsObj[index]
          : undefined
        return {
          ...rest,
          name: visitType?.displayValue || name,
          code: visitType?.code || code,
          isEnabled: visitType?.isEnabled || 'true',
          sortOrder: visitType?.sortOrder || 0,
          customTooltipField: `Code: ${visitType?.code ||
            code}\nName: ${visitType?.displayValue || name}`,
        }
      })
      .sort((a, b) => (a.sortOrder >= b.sortOrder ? 1 : -1))
  }

  componentDidMount() {
    const { dispatch, clinicSettings } = this.props
    dispatch({
      type: 'codetable/fetchCodes',
      payload: { code: 'ctVisitpurpose', force: true },
    }).then(result => {
      if (result) {
        const visitTypeSetting = JSON.parse(
          clinicSettings.settings.visitTypeSetting,
        )
        var newVisitType = this.mapVisitType(result, visitTypeSetting)
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
