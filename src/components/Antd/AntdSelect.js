import React from 'react'
import PropTypes, { instanceOf } from 'prop-types'
import classnames from 'classnames'
import AutosizeInput from 'react-input-autosize'
import _ from 'lodash'
// material ui
import withStyles from '@material-ui/core/styles/withStyles'
import Input from '@material-ui/core/Input'

// ant
import { Select, Spin } from 'antd'
import { CustomInput } from '@/components'
import { control } from '@/components/Decorator'
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

@control()
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
    max: PropTypes.number,
    allValue: PropTypes.number,
    allLabel: PropTypes.string,
    maxTagCount: PropTypes.number,
    maxTagTextLength: PropTypes.number,
    maxSelected: PropTypes.number,
  }

  static defaultProps = {
    options: [],
    label: undefined,
    labelField: 'name',
    valueField: 'value',
    disabled: false,
    size: 'default',
    max: 50,
    allValue: -99,
    allLabel: 'All',
    maxTagCount: 5,
    maxTagTextLength: 10,
    maxSelected: 0,
  }

  constructor (props) {
    super(props)
    const {
      form,
      field,
      mode,
      options = [],
      autoComplete,
      valueField,
      max,
      allValue,
      value,
    } = props
    let v = form && field ? field.value : props.value || props.defaultValue
    if (field) {
      v = [
        'multiple',
        'tags',
      ].includes(mode)
        ? field.value || []
        : field.value
      if (
        [
          'multiple',
          'tags',
        ].includes(mode)
      ) {
        if (v.indexOf(allValue) >= 0 && options.length > 1 && v.length === 1) {
          v = [
            allValue,
            ...options.map((o) => o[valueField]),
          ]
          form.setFieldValue(field.name, v)
        }
      }
    } else if (value) {
      v = [
        'multiple',
        'tags',
      ].includes(mode)
        ? value || []
        : value
      if (
        [
          'multiple',
          'tags',
        ].includes(mode)
      ) {
        if (
          Array.isArray(v) &&
          v.indexOf(allValue) >= 0 &&
          options.length > 1 &&
          v.length === 1
        ) {
          v = [
            allValue,
            ...options.map((o) => o[valueField]),
          ]
        }
      }
    }

    const shrink = [
      'multiple',
      'tags',
    ].includes(mode)
      ? v && v.length > 0
      : v !== undefined
    this.state = {
      shrink,
      value: v,
      data:
        autoComplete && options && options.length > max
          ? _.filter(options, (o) => o[valueField] === v)
          : options,
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

  // eslint-disable-next-line camelcase
  // eslint-disable-next-line react/sort-comp
  UNSAFE_componentWillReceiveProps (nextProps) {
    const {
      field,
      form,
      value,
      options,
      valueField,
      autoComplete,
      mode,
      allValue,
      maxSelected,
    } = nextProps
    let v = this.state.value

    if (field) {
      v = [
        'multiple',
        'tags',
      ].includes(mode)
        ? field.value || []
        : field.value
      if (
        [
          'multiple',
          'tags',
        ].includes(mode)
      ) {
        if (v.indexOf(allValue) >= 0 && options.length > 1 && v.length === 1) {
          v = [
            allValue,
            ...options.map((o) => Object.byString(o, valueField)),
          ]

          if (maxSelected) {
            v = v.slice(Math.max(v.length - maxSelected, 1))
          }
          form.setFieldValue(field.name, v)
        }
        if (
          v.indexOf(allValue) < 0 &&
          options.length &&
          options.length === v.length
        ) {
          v.unshift(allValue)
          form.setFieldValue(field.name, v)
        }
      }
      this.setState({
        value: v,
        // shrink: [
        //   'multiple',
        //   'tags',
        // ].includes(mode)
        //   ? v && v.length > 0
        //   : v !== undefined,
      })
    } else if (value) {
      v = [
        'multiple',
        'tags',
      ].includes(mode)
        ? value || []
        : value
      if (
        [
          'multiple',
          'tags',
        ].includes(mode)
      ) {
        if (v.indexOf(allValue) >= 0 && options.length > 1 && v.length === 1) {
          v = [
            allValue,
            ...options.map((o) => Object.byString(o, valueField)),
          ]
        }
        if (
          v.indexOf(allValue) < 0 &&
          options.length &&
          options.length === v.length
        ) {
          v.unshift(allValue)
        }
      }
      if (!_.isEqual(v, this.state.value)) {
        this.setState({
          value: v,
          // shrink: [
          //   'multiple',
          //   'tags',
          // ].includes(mode)
          //   ? v && v.length > 0
          //   : v !== undefined,
        })
      }
    } else {
      this.setState({
        value: [
          'multiple',
          'tags',
        ].includes(mode)
          ? []
          : undefined,
        shrink: false,
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
    let match = false
    try {
      if (Array.isArray(option.props.children)) {
        // return (
        //   option.props.children.filter(
        //     (o) =>
        //       o.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0,
        //   ).length > 0
        // )
        match = false
      }
      match = option.props.title.toLowerCase().indexOf(input.toLowerCase()) >= 0
    } catch (error) {
      console.log({ error })
      match = false
    }
    return match
  }

  handleFocus = () => {
    this.setState({ shrink: true, focus: true })
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
    this.setState({ focus: false })
  }

  handleValueChange = (val) => {
    const {
      form,
      field,
      allValue,
      allValueOption,
      mode,
      onChange,
      options,
      autoComplete,
      query,
      valueField,
      maxSelected,
    } = this.props
    let newVal = val

    if (
      [
        'multiple',
        'tags',
      ].includes(mode)
    ) {
      // let _allValue = Object.byString(allValueOption, allValueOption)
      // console.log({ _allValue })
      if (val.indexOf(allValue) >= 0) {
        if (this.state.value.indexOf(allValue) >= 0) {
          newVal = _.reject(newVal, (v) => v === allValue)
        } else {
          newVal = [
            allValue,
            ...options.map((o) => Object.byString(o, valueField)),
          ]
        }
      } else if (this.state.value.indexOf(allValue) >= 0) {
        newVal = []
      }
      // else if (
      //   val.length &&
      //   val.length ===
      //     val.filter((o) =>
      //       options.find((m) => {
      //         console.log({ m: Object.byString(m, valueField), o })
      //         return Object.byString(m, valueField) === o
      //       }),
      //     ).length
      // ) {
      //   console.log('else if 1.1')
      //   newVal = [
      //     allValue,
      //     ...options.map((o) => Object.byString(o, valueField)),
      //   ]
      // }
      if (maxSelected && newVal.length > maxSelected) {
        newVal = _.reject(newVal, (v) => v === allValue)
        newVal = newVal.slice(-maxSelected)
      }
    }
    let proceed = true

    if (onChange) {
      if (!mode || mode === 'default') {
        const option = (autoComplete || query ? this.state.data : options).find(
          (o) => o[valueField] === newVal,
        )
        proceed = onChange(newVal, option) !== false
      } else {
        const opts = (autoComplete || query
          ? this.state.data
          : options).filter((o) =>
          newVal.find(
            (m) =>
              valueField === 'id'
                ? parseInt(m, 10) === o[valueField]
                : m === o[valueField],
          ),
        )
        newVal = mode === 'tags' && newVal.length === 0 ? '' : newVal
        proceed = onChange(newVal, opts) !== false
      }
    }
    if (proceed) {
      if (form && field) {
        form.setFieldValue(field.name, newVal)
        form.setFieldTouched(field.name, true)
      }
      this.setState((ps) => {
        return {
          shrink: [
            'multiple',
            'tags',
          ].includes(mode)
            ? newVal && newVal.length > 0
            : newVal !== undefined || ps.focus,
          value: newVal,
        }
      })
    }
  }

  fetchData = async (value) => {
    // console.log('fetching data', value)
    this.setState((prevState) => {
      return { data: [], fetching: true, fetchId: ++prevState.fetchId }
    })
    if (this.props.query) {
      const { valueField, labelField } = this.props
      const q = await this.props.query(value)
      let data = []
      try {
        if (q instanceof Array) data = q
        else data = q.data.data
      } catch (error) {
        data = []
      }
      this.setState({
        fetching: false,
        data: data.map((o) => {
          return {
            ...o,
            name: o[labelField],
            value: o[valueField],
          }
        }),
      })
      if (this.props.onDataSouceChange) {
        this.props.onDataSouceChange(data)
      }
    } else {
      const search = value.toLowerCase()

      const { props } = this
      const {
        options,
        valueField,
        labelField,
        max,
        localFilter = () => true,
      } = props
      this.setState({
        data: _.filter(
          options,
          // (o) => o[labelField].toLowerCase().indexOf(search) >= 0,
          (o) =>
            Object.byString(o, labelField).toLowerCase().indexOf(search) >= 0 &&
            localFilter(o),
        ).splice(0, max),
        fetching: false,
      })
    }
  }

  getSelectOptions = (source, renderDropdown) => {
    const { valueField, labelField, optionLabelLength = 0, mode } = this.props
    return source
      .map((s) => {
        // console.log({ label: Object.byString(s, labelField) })
        return {
          ...s,
          value: Object.byString(s, mode === 'tags' ? labelField : valueField),
          // value: Object.byString(s, valueField),
          label: Object.byString(s, labelField),
          // value: s[valueField],
          // label: s[labelField],
        }
      })
      .map((option, index) => (
        <Select.Option
          data={option}
          title={option.label}
          label={
            optionLabelLength ? (
              option.label.substring(0, optionLabelLength)
            ) : (
              option.label
            )
          }
          key={`select-${option.value}`}
          value={mode === 'tags' ? `${option.value}` : option.value}
          // key={option.id ? `${option.id}` : option.value}
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
      allValue,
      allLabel,
      allValueOption,
      disableAll,
      classes,
      defaultValue,
      renderDropdown,
      onChange,
      onFocus,
      onBlur,
      allowClear = true,
      style,
      dropdownMatchSelectWidth = true,
      autoComplete,
      query,
      optionLabelLength,
      className,
      maxTagPlaceholder,
      value,
      isLoading,
      ...restProps
    } = this.props
    // console.log(options)
    const source =
      autoComplete || query
        ? this.state.data
        : [
            ...([
              'multiple',
              'tags',
            ].includes(restProps.mode) && !disableAll
              ? [
                  allValueOption || {
                    [valueField]: allValue,
                    [labelField]: allLabel,
                  },
                ]
              : []),
            ...options,
          ]
    // console.log({ source })
    const cfg = {
      value: this.state.value,
    }
    let opts = []
    if (source[0] && source[0][groupField]) {
      const groups = _.groupBy(source, groupField)
      const group = Object.values(groups)
      opts = group.map((g) => {
        return (
          <Select.OptGroup key={g[0].title} label={g[0].title}>
            {this.getSelectOptions(g, renderDropdown)}
          </Select.OptGroup>
        )
      })
    } else {
      opts = this.getSelectOptions(source, renderDropdown)
    }
    // console.log(opts)
    if (this.props.text) {
      const match = source.find(
        (o) => o[this.props.valueField] === this.state.value,
      )
      let text = ''
      if (match) text = match[this.props.labelField]
      return (
        <AutosizeInput
          readOnly
          inputClassName={props.className}
          value={
            optionLabelLength ? text.substring(0, optionLabelLength) : text
          }
        />
      )
    }
    // console.log(classes.selectContainer, classes.className)
    const customTagPlaceholder = maxTagPlaceholder || 'options'
    return (
      <div style={{ width: '100%' }} {...props}>
        <Select
          className={classnames([
            classes.selectContainer,
            className,
          ])}
          dropdownClassName={classnames(classes.dropdownMenu)}
          showSearch
          // defaultOpen
          onChange={this.handleValueChange}
          onFocus={extendFunc(onFocus, this.handleFocus)}
          onBlur={extendFunc(onBlur, this.handleBlur)}
          onSearch={this.fetchData}
          defaultValue={defaultValue}
          filterOption={this.handleFilter}
          // optionFilterProp={labelField}
          allowClear={allowClear}
          dropdownMatchSelectWidth={dropdownMatchSelectWidth}
          maxTagPlaceholder={(vv) => {
            return `${vv.filter((o) => o !== allValue)
              .length} ${customTagPlaceholder} selected`
          }}
          optionLabelProp='label'
          notFoundContent={
            this.state.fetching || isLoading ? (
              <Spin size='small' />
            ) : (
              <p>
                {this.state.fetchId === 0 && (autoComplete || query) ? (
                  'Input Search Text'
                ) : (
                  'Not Found'
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
    const { classes, mode, onChange, isLoading, ...restProps } = props
    const { value } = this.state
    const labelProps = {}
    if (!mode || mode === 'default') {
      labelProps.shrink =
        (value !== undefined && value !== null) ||
        this.state.shrink ||
        this.state.focus
    } else {
      // console.log(
      //   value,
      //   this.state.shrink,
      //   value !== undefined,
      //   value !== null,
      //   value !== '',
      //   value.length > 0,
      // )
      labelProps.shrink =
        (value && value.length > 0) || this.state.shrink || this.state.focus
    }
    // console.log(this.state, labelProps)
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
