import React from 'react'
import PropTypes from 'prop-types'
import numeral from 'numeral'
import { currencySymbol, qtyFormat } from '@/utils/config'
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

  renderMedication = option => {
    const {
      code,
      displayValue,
      sellingPrice = 0,
      medicationGroup = {},
      stock = 0,
      dispensingUOM = {},
      isExclusive,
    } = option
    const { name: uomName = '' } = dispensingUOM

    return (
      <div
        style={{
          height: 40,
          lineHeight: '40px',
        }}
      >
        <div
          style={{
            height: '20px',
            lineHeight: '20px',
          }}
        >
          <Tooltip
            useTooltip2
            title={
              <div>
                <div
                  style={{ fontWeight: 'bold' }}
                >{`Name: ${displayValue}`}</div>
                <div>{`Code: ${code}`}</div>
              </div>
            }
          >
            <div
              style={{
                width: 535,
                display: 'inline-block',
                whiteSpace: 'nowrap',
                textOverflow: 'ellipsis',
                overflow: 'hidden',
              }}
            >
              <span
                style={{ fontWeight: '550', fontSize: 15 }}
              >{`${displayValue} - `}</span>
              <span>{code}</span>
            </div>
          </Tooltip>

          {isExclusive && (
            <div
              style={{
                backgroundColor: 'green',
                color: 'white',
                fontSize: '0.7rem',
                position: 'relative',
                right: '0px',
                marginLeft: 3,
                top: '-6px',
                display: 'inline-block',
                height: 18,
                lineHeight: '18px',
                borderRadius: 4,
                padding: '1px 3px',
                fontWeight: 500,
              }}
              title='The item has no local stock, we will purchase on behalf and charge to patient in invoice'
            >
              Excl.
            </div>
          )}
        </div>
        <div
          style={{
            height: '20px',
            lineHeight: '20px',
          }}
        >
          <Tooltip
            title={
              <div>
                Unit Price:
                <span
                  style={{ color: 'darkblue' }}
                >{` ${currencySymbol}${sellingPrice.toFixed(2)}`}</span>
              </div>
            }
          >
            <div
              style={{
                width: 130,
                display: 'inline-block',
                whiteSpace: 'nowrap',
                textOverflow: 'ellipsis',
                overflow: 'hidden',
                height: '100%',
              }}
            >
              Unit Price:
              <span
                style={{ color: 'darkblue' }}
              >{` ${currencySymbol}${sellingPrice.toFixed(2)}`}</span>
            </div>
          </Tooltip>

          <Tooltip
            title={
              <div>
                Stock:{' '}
                <span
                  style={{
                    color: stock < 0 ? 'red' : 'black',
                  }}
                >{` ${numeral(stock || 0).format(qtyFormat)} `}</span>
                {uomName || ''}
              </div>
            }
          >
            <div
              style={{
                width: 150,
                display: 'inline-block',
                whiteSpace: 'nowrap',
                textOverflow: 'ellipsis',
                overflow: 'hidden',
                marginLeft: 3,
                height: '100%',
              }}
            >
              Stock:{' '}
              <span
                style={{
                  color: stock < 0 ? 'red' : 'black',
                }}
              >{` ${numeral(stock || 0).format(qtyFormat)} `}</span>
              {uomName || ''}
            </div>
          </Tooltip>

          <Tooltip
            useTooltip2
            title={medicationGroup.name ? `Group: ${medicationGroup.name}` : ''}
          >
            <div
              style={{
                width: 290,
                display: 'inline-block',
                whiteSpace: 'nowrap',
                textOverflow: 'ellipsis',
                overflow: 'hidden',
                marginLeft: 3,
                height: '100%',
              }}
            >
              {' '}
              {medicationGroup.name ? `Grp.: ${medicationGroup.name}` : ''}
            </div>
          </Tooltip>
        </div>
      </div>
    )
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
        maxTagCount={1}
      />
    )
  }
}

MedicationSelect.propTypes = {}

export default MedicationSelect
