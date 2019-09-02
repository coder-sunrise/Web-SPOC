import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import CodeSelect from './CodeSelect'

@connect(({ codetable, user }) => ({ codetable, user }))
class ClinicianSelect extends React.PureComponent {
  render () {
    const { field, form, codetable, user, label } = this.props
    if (
      !field.value &&
      user.data &&
      user.data.clinicianProfile &&
      user.data.clinicianProfile.id
    ) {
      form.setFieldValue(field.name, user.data.clinicianProfile.id)
    }
    return (
      <CodeSelect
        code='clinicianprofile'
        label={label}
        field={field}
        form={form}
      />
    )
  }
}

ClinicianSelect.propTypes = {}

export default ClinicianSelect
