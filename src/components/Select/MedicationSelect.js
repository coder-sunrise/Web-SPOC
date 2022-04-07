import React from 'react'
import PropTypes from 'prop-types'
import { Tooltip } from '@/components'
import Select from '../Antd/AntdSelect'

class MedicationSelect extends React.PureComponent {
  constructor(props) {
    super(props)
    let defaultOptions = []
    if (props.isFromTable && props.value) {
      defaultOptions = props.options.filter(x => x.id === props.value)
    }
    this.state = { filterMedications: defaultOptions }
  }

  searchMedication = v => {
    const { setFieldValue } = this.props
    if (v === undefined || v === null || !v.trim().length) {
      this.setState({ filterMedications: [] })
      return
    }
    const lowerCaseInput = v.toLowerCase()
    const { options = [] } = this.props

    const filterMedications = _.take(
      options.filter(
        m =>
          m.code.toLowerCase().indexOf(lowerCaseInput) >= 0 ||
          m.displayValue.toLowerCase().indexOf(lowerCaseInput) >= 0 ||
          (m.medicationGroup?.name || '')
            .toLowerCase()
            .indexOf(lowerCaseInput) >= 0,
      ),
      20,
    )
    this.setState({ filterMedications: filterMedications })
  }

  onChange = (v, op) => {
    const { onChange = () => {} } = this.props
    if (v) {
      this.setState({ filterMedications: [{ ...op }] })
    } else {
      this.setState({ filterMedications: [] })
    }
    onChange(v, op)
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    const { isFromTable = false, options = [] } = nextProps
    if (!isFromTable) {
      if (nextProps.values.inventoryMedicationFK) {
        this.setState({
          filterMedications: options.filter(
            x => x.id === nextProps.values.inventoryMedicationFK,
          ),
        })
      } else {
        this.setState({ filterMedications: [] })
      }
    }
  }
  render() {
    const { filterMedications } = this.state
    return (
      <Select
        {...this.props}
        valueField='id'
        onChange={this.onChange}
        options={filterMedications}
        onSearch={this.searchMedication}
      />
    )
  }
}

MedicationSelect.propTypes = {}

export default MedicationSelect
