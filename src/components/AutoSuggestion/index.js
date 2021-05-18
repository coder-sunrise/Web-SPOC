import React, { PureComponent } from 'react'
import withStyles from '@material-ui/core/styles/withStyles'
import { control } from '@/components/Decorator'
import { AutoComplete } from 'antd'
import PropTypes from 'prop-types'

const STYLES = (theme) => {
  return {
  }
}

@control()
class AutoSuggestion extends PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      value: props.field.value || '',
      options: props.options || [],
      filterOptions: [],
      isFocused: false,
    }
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (this.state.value !== nextProps.field.value) {
      this.setState({ value: nextProps.field.value })
    }
  }

  filterOption = async (value) => {
    const inputValue = value.trim().toLowerCase()
    const inputLength = inputValue.length
    const { valuePath = 'value' } = this.props

    return inputLength === 0 ? [] : this.state.options.filter(lang =>
      lang[ valuePath ].toLowerCase().indexOf(inputValue) >= 0
    )
  }

  onChange = (value) => {
    this.props.form.setFieldValue(this.props.field.name, value)
    if (this.props.onChange) {
      this.props.onChange(value)
    }
  }

  onSearch = async (value) => {
    if (this.props.query) {
      this.setState({
        filterOptions: value.length ? await this.props.query(value) : []
      })
    }
    else {
      this.setState({
        filterOptions: this.filterOption(value).data
      })
    }
  }

  onOptionSelect = (value, option) => {
    const { valuePath = 'value', onOptionSelected } = this.props
    const { filterOptions = [] } = this.state

    const selectOption = filterOptions.find(s => s[ valuePath ] === value)
    if (onOptionSelected) {
      onOptionSelected(value, selectOption)
    }

    this.setState({ filterOptions: [] })
  }

  renderDataSource = () => {
    const { renderOption, valuePath = 'value', displayPath = 'text' } = this.props
    const { filterOptions = [] } = this.state
    return filterOptions.map(s => { return { ...s, value: s[ valuePath ], text: renderOption ? renderOption(s) : s[ displayPath ] } })
  }

  onFocus = () => {
    this.setState({ isFocused: true })
  }

  onBlur = () => {
    this.setState({ isFocused: false })
  }

  render() {
    const { label } = this.props
    const { value, isFocused } = this.state

    return <div style={{ marginTop: 5, marginBottom: 5 }}>

      <label style={{
        height: 19,
        display: 'block',
        fontSize: '13px',
        color: 'rgba(0, 0, 0, 0.54)', paddingTop: 1, letterSpacing: '0.00938em',
        fontFamily: 'Roboto, Helvetica, Arial, sans-serif',
        fontWeight: 'inherit',
      }} >{(isFocused || value) ? label : ''}
      </label>
      <AutoComplete
        value={value}
        defaultValue={value}
        dataSource={this.renderDataSource()}
        style={{ width: '100%' }}
        onSelect={this.onOptionSelect}
        onChange={this.onChange}
        onSearch={this.onSearch}
        optionLabelProp='value'
        placeholder={isFocused || value ? '' : label}
        onFocus={this.onFocus}
        onBlur={this.onBlur}
      >
      </AutoComplete>
    </div >
  }
}

AutoSuggestion.propTypes = {
  options: PropTypes.array,
  valuePath: PropTypes.string,
  displayPath: PropTypes.string,
  renderOption: PropTypes.function,
  onOptionSelected: PropTypes.function,
  query: PropTypes.function,
}

export default withStyles(STYLES, { name: 'AutoSuggestion', withTheme: true })(
  AutoSuggestion,
)
