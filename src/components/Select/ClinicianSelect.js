import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import CodeSelect from './CodeSelect'

@connect(({ codetable, user }) => ({ codetable, user }))
class ClinicianSelect extends React.PureComponent {
  render () {
    const { field, form, codetable, user, label, noDefaultValue } = this.props
    if (
      field &&
      !field.value &&
      user.data &&
      user.data.clinicianProfile &&
      user.data.clinicianProfile.userProfileFK
    ) {
      if (!noDefaultValue) {
        form.setFieldValue(field.name, user.data.clinicianProfile.userProfileFK)
      }
    }
    return (
      <CodeSelect
        code='clinicianprofile'
        valueField='userProfileFK'
        labelField='name'
        defaultValue={user.data.clinicianProfile.userProfileFK}
        {...this.props}
      />
    )
  }
}

ClinicianSelect.propTypes = {}

export default ClinicianSelect
