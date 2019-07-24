import React from 'react'
import PropTypes, { instanceOf } from 'prop-types'
import classnames from 'classnames'
import _ from 'lodash'
// material ui
import withStyles from '@material-ui/core/styles/withStyles'
import Input from '@material-ui/core/Input'

// ant
import { Select, Spin } from 'antd'
import AntdWrapper from './AntdWrapper'
import { CustomInputWrapper, BaseInput, CustomInput } from '@/components'

import { extendFunc } from '@/utils/utils'

const STYLES = () => {
  return {
    // dropdownMenu: {
    //   zIndex: 1310,
    // },
    selectContainer: {
      width: '100%',
      boxSizing: 'content-box',
      lineHeight: '1rem',
      color: 'currentColor',

      '& > div': {
        // erase all border, and boxShadow
        // height: 31,
        border: 'none',
        boxShadow: 'none !important',
        borderRadius: 0,
        // borderBottom: '1px solid rgba(0, 0, 0, 0.4)',
      },
      '& .ant-select-selection': {
        background: 'none',
      },
      // '& .ant-select-selection-selected-value': {
      //   height: 40,
      // },
      '& .ant-select-selection__rendered': {
        lineHeight: 'inherit',
        marginRight: 0,
      },
      '& .ant-select-selection--single': {
        height: '100%',
        lineHeight: '1em',
      },
      '& .ant-select-selection--multiple': {
        height: '100%',
        minHeight: '20px',
        // to match the same line
        // with ant-select-select--single
        paddingBottom: 0,
        position: 'relative',
        top: -4,
      },
      '& .ant-select-selection > div': {
        marginLeft: 0,
        // fontSize: '1rem',
        // fontWeight: 400,
        // paddingTop: 3,
      },
    },
  }
}

class AntdSelect extends React.PureComponent {
  static propTypes = {
    // required props
    options: PropTypes.array,
    // optional props
    label: PropTypes.string,
    labelField: PropTypes.string,
    valueField: PropTypes.string,
    onChange: PropTypes.func,
    disabled: PropTypes.bool,
    size: PropTypes.string,
    renderDropdown: PropTypes.func,
  }

  static defaultProps = {
    options: [],
    label: undefined,
    labelField: 'name',
    valueField: 'value',
    disabled: false,
    size: 'default',
  }

  constructor (props) {
    super(props)
    const { form, field, mode } = props
    this.state = {
      shrink: false,
      value: form && field ? field.value : props.value || props.defaultValue,
      data: props.options || [],
      fetching: false,
      fetchId: 0,
    }

    this.lastFetchId = 0
    this.fetchData = _.debounce(props.onFetchData || this.fetchData, 800)
  }

  componentDidMount () {
    if (this.state.value && this.props.query && this.state.data.length === 0) {
      // for remote datasouce, get the selected value by default
      // console.log(this.state.value)
      this.fetchData(this.state.value)
    }
  }

  componentWillReceiveProps (nextProps) {
    const { field, value, options, valueField, autoComplete } = nextProps
    let v = this.state.value
    if (field) {
      v = field.value
      this.setState({
        value: field.value,
      })
    } else if (value) {
      v = value

      this.setState({
        value,
      })
    }
    if (autoComplete && options && this.state.data.length === 0) {
      this.setState({
        data: _.filter(options, (o) => o[valueField] === v),
      })
    }
  }

  handleFilter = (input, option) => {
    // console.log(input, option, option.props.children, this.props.labelField)
    try {
      if (Array.isArray(option.props.children)) {
        // return (
        //   option.props.children.filter(
        //     (o) =>
        //       o.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0,
        //   ).length > 0
        // )
        return false
      }
      return (
        option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
      )
    } catch (error) {
      console.log({ error })
      return false
    }
  }

  handleFocus = () => {
    this.setState({ shrink: true })
  }

  handleBlur = () => {
    // console.log(this.state.value)
    if (
      this.state.value === undefined ||
      this.state.value === null ||
      this.state.value === '' ||
      (this.state.value && this.state.value.length === 0)
    ) {
      this.setState({ shrink: false })
    }
  }

  handleValueChange = (val) => {
    const {
      form,
      field,
      all,
      mode,
      onChange,
      options,
      autoComplete,
      query,
      valueField,
    } = this.props
    let newVal = val
    if (mode === 'multiple') {
      if (val.indexOf(all) > 0) {
        newVal = [
          all,
        ]
      } else if (val.indexOf(all) === 0) {
        newVal = _.reject(newVal, (v) => v === all)
      }
    }
    // console.log(val)
    // console.log(returnValue)

    let proceed = true
    if (onChange) {
      const option = (autoComplete || query ? this.state.data : options).find(
        (o) => o[valueField] === newVal,
      )
      proceed = onChange(newVal, option) !== false
    }
    if (proceed) {
      if (form && field) {
        form.setFieldValue(field.name, newVal)
        form.setFieldTouched(field.name, true)
      }
      this.setState({
        shrink: newVal !== undefined,
        value: newVal,
      })
    }
  }

  fetchData = async (value) => {
    console.log('fetching data', value)
    this.setState((prevState) => {
      return { data: [], fetching: true, fetchId: ++prevState.fetchId }
    })
    if (this.props.query) {
      const q = await this.props.query(value)
      // console.log(q)
      let data = []
      try {
        data = q.data.data
      } catch (error) {}
      this.setState({
        fetching: false,
        data: data.map((o) => {
          return {
            ...o,
            name: o.name,
            value: o.id,
          }
        }),
      })
    } else {
      const search = value.toLowerCase()

      const { props } = this
      const { options, valueField, labelField, max = 50 } = props

      this.setState({
        data: _.filter(
          options,
          (o) => o[labelField].toLowerCase().indexOf(search) >= 0,
        ).splice(0, max),
        fetching: false,
      })
    }
  }

  getSelectOptions = (source, renderDropdown) => {
    const { valueField, labelField } = this.props
    return source
      .map((s) => ({
        ...s,
        value: s[valueField],
        label: s[labelField],
      }))
      .map((option) => (
        <Select.Option
          data={option}
          key={option.value}
          title={option.label}
          label={option.label}
          value={option.value}
          disabled={!!option.disabled}
        >
          {typeof renderDropdown === 'function' ? (
            renderDropdown(option)
          ) : (
            option.label
          )}
        </Select.Option>
      ))
  }

  getComponent = ({ inputRef, ...props }) => {
    const {
      valueField,
      labelField,
      groupField,
      options,
      classes,
      defaultValue,
      renderDropdown,
      onChange,
      onFocus,
      onBlur,
      allowClear = true,
      style,
      dropdownMatchSelectWidth = false,
      autoComplete,
      query,
      ...restProps
    } = this.props
    const { form, field, value } = restProps
    // console.log(options)
    const source = autoComplete || query ? this.state.data : options

    const cfg = {
      value: this.state.value,
    }
    // console.log(newOptions)
    // console.log(newOptions, this.state.value, cfg)
    let opts = []
    if (source[0] && source[0][groupField]) {
      const groups = _.groupBy(source, groupField)
      const group = Object.values(groups)
      opts = group.map((g) => {
        return (
          <Select.OptGroup label={g[0].title}>
            {this.getSelectOptions(g, renderDropdown)}
          </Select.OptGroup>
        )
      })
    } else {
      opts = this.getSelectOptions(source, renderDropdown)
    }
    return (
      <div style={{ width: '100%' }} {...props}>
        <Select
          className={classnames(classes.selectContainer)}
          dropdownClassName={classnames(classes.dropdownMenu)}
          showSearch
          // defaultOpen
          onChange={this.handleValueChange}
          onFocus={extendFunc(onFocus, this.handleFocus)}
          onBlur={extendFunc(onBlur, this.handleBlur)}
          onSearch={this.fetchData}
          defaultValue={defaultValue}
          filterOption={this.handleFilter}
          allowClear={allowClear}
          dropdownMatchSelectWidth={dropdownMatchSelectWidth}
          optionLabelProp='label'
          notFoundContent={
            this.state.fetching ? (
              <Spin size='small' />
            ) : (
              <p>
                {this.state.fetchId > 0 && (autoComplete || query) ? (
                  'Not Found'
                ) : (
                  'Input Search Text'
                )}
              </p>
            )
          }
          {...cfg}
          {...restProps}
        >
          {opts}
        </Select>
      </div>
    )
  }

  render () {
    const { props } = this
    const { classes, mode, onChange, ...restProps } = props
    const { value } = this.state
    const labelProps = {}
    if (!mode || mode === 'default') {
      labelProps.shrink =
        (value !== undefined && value !== null) || this.state.shrink
    } else {
      labelProps.shrink =
        (value !== undefined &&
          value !== null &&
          value !== '' &&
          value.length > 0) ||
        this.state.shrink
    }

    return (
      <CustomInput
        labelProps={labelProps}
        inputComponent={this.getComponent}
        preventDefaultChangeEvent
        preventDefaultKeyDownEvent
        {...restProps}
      />
    )
  }
}

export default withStyles(STYLES, { name: 'AntdSelect' })(AntdSelect)
