import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import Select from '../Antd/AntdSelect'

@connect(({ codetable }) => ({ codetable }))
class CodeSelect extends React.PureComponent {
  constructor (props) {
    super(props)
    this.state = {
      maxTagCount:
        this.props.maxTagCount !== undefined ? this.props.maxTagCount : 5,
    }
    const { dispatch, codetable } = props
    if (props.code) {
      const isExisted = codetable[props.code.toLowerCase()]
      const { temp } = props
      if (isExisted && !temp) {
        return
        // checkShouldRefresh({
        //   code: props.code,
        //   filter: props.remoteFilter,
        // }).then((response) => {
        //   if (response) {
        //     dispatch({
        //       type: 'codetable/fetchCodes',
        //       payload: {
        //         code: props.code.toLowerCase(),
        //         filter: props.remoteFilter,
        //         force: true,
        //       },
        //     })
        //   }
        // })
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

  render () {
    const { codetable, code, localFilter } = this.props
    const options =
      code !== undefined ? codetable[code.toLowerCase()] || [] : []
    const filteredOptions = localFilter ? options.filter(localFilter) : options

    return (
      <Select
        options={filteredOptions || []}
        valueField='id'
        {...this.props}
        ref={this.codeSelectRef}
        maxTagCount={this.state.maxTagCount}
        onChange={(values, opts) => {
          if (this.props.mode && this.props.mode === 'multiple') {
            this.setState({
              maxTagCount: values && values.length === 1 ? 1 : 0,
            })
          }
          if (this.props.onChange) {
            this.props.onChange(values, opts)
          }
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
