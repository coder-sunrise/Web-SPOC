import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import Select from '../Antd/AntdSelect'
import _ from 'lodash'

@connect(({ codetable }) => ({ codetable }))
class CodeSelect extends React.PureComponent {
  constructor(props) {
    super(props)
    // console.log({ props })
    this.state = {
      isCheckedShowOnTopFlage: false,
    }
    if (
      this.props.maxTagCount === undefined &&
      this.props.mode &&
      this.props.mode === 'multiple'
    ) {
      const initMaxTagCount =
        this.props.field &&
        this.props.field.value &&
        this.props.field.value.length === 1
          ? 1
          : 0
      this.state = {
        ...this.state,
        maxTagCount:
          this.props.maxTagCount !== undefined
            ? this.props.maxTagCount
            : initMaxTagCount,
      }
    }

    const { dispatch, codetable } = props
    if (props.code) {
      const isExisted = codetable[props.code.toLowerCase()]
      const { temp } = props
      if (isExisted && !temp) {
        return
      }
      dispatch({
        type: 'codetable/fetchCodes',
        payload: {
          code: props.code.toLowerCase(),
          temp: props.temp,
          force: props.temp,
          filter: props.remoteFilter,
        },
      })
    }
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (this.props.code !== nextProps.code) {
      const { codetable, dispatch, code } = nextProps
      const isExisted = codetable[code.toLowerCase()]
      if (isExisted) {
        return
      }
      dispatch({
        type: 'codetable/fetchCodes',
        payload: {
          code: nextProps.code.toLowerCase(),
          temp: nextProps.temp,
          force: nextProps.temp,
          filter: nextProps.remoteFilter,
        },
      })
    }
  }

  render() {
    const {
      codetable,
      code,
      localFilter,
      formatCodes,
      orderBy,
      customOrder,
      isCheckedShowOnTop,
    } = this.props

    const options = this.props.options
      ? //if options set explicitly, to use the options that have been set.
        //This is only for legacy purpose and options should not be set for codeselect, and use Select component instead.
        this.props.options
      : code !== undefined
      ? codetable[code.toLowerCase()] || []
      : []
    let filteredOptions = localFilter ? options.filter(localFilter) : options

    filteredOptions = customOrder
      ? _.orderBy(filteredOptions, [...orderBy[0]], [...orderBy[1]])
      : orderBy
      ? _.orderBy(
          filteredOptions,
          [
            option =>
              (_.get(option, orderBy[0]) || '').toString().toLowerCase(),
          ],
          [orderBy[1]],
        )
      : filteredOptions
    if (this.state.isCheckedShowOnTopFlage && isCheckedShowOnTop) {
      let checkedArray =
        this.props.form?.values[this.props.field.name] ?? this.props.value ?? []
      filteredOptions.sort(
        (a, b) =>
          checkedArray.includes(a[this.props.valueField || 'id']) &&
          !checkedArray.includes(b[this.props.valueField || 'id'])
            ? -1
            : 0,
        0,
      )
    }
    const formattedFilteredOptions = formatCodes
      ? formatCodes(filteredOptions)
      : filteredOptions
    let selectProps = this.props
    if (
      this.props.maxTagCount === undefined &&
      this.props.mode &&
      this.props.mode === 'multiple'
    ) {
      selectProps = {
        ...this.props,
        maxTagCount: this.state.maxTagCount,
      }
    }
    return (
      <Select
        valueField='id'
        {...selectProps}
        options={formattedFilteredOptions || []}
        // prevent to show default '请输入' placeholder
        placeholder=''
        onChange={(values, opts) => {
          if (
            this.props.maxTagCount === undefined &&
            this.props.mode &&
            this.props.mode === 'multiple'
          ) {
            this.setState({
              ...this.state,
              isCheckedShowOnTopFlage: false,
              maxTagCount: values && values.length === 1 ? 1 : 0,
            })
          }
          if (this.props.onChange) {
            this.setState({
              ...this.state,
              isCheckedShowOnTopFlage: false,
            })
            this.props.onChange(values, opts)
          }
        }}
        onDropdownVisibleChange={() => {
          this.setState({
            ...this.state,
            isCheckedShowOnTopFlage: true,
          })
        }}
      />
    )
  }
}

CodeSelect.propTypes = {
  code: PropTypes.string,
  tenantCode: PropTypes.string,
}

// export default withStyles(extendedFormsStyle)(CodeSelect)
export default CodeSelect
