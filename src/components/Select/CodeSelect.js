import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import Select from '../Antd/AntdSelect'
import { checkShouldRefresh } from '@/utils/codes'

@connect(({ codetable }) => ({ codetable }))
class CodeSelect extends React.PureComponent {
  state = {
    options: [],
  }

  constructor (props) {
    super(props)
    const { dispatch, codetable } = props
    if (props.code) {
      const isExisted = codetable[props.code.toLowerCase()]
      const isPreviouslyFiltered = codetable.hasFilterProps.includes(
        props.code.toLowerCase(),
      )
      if (isExisted) {
        checkShouldRefresh({
          code: props.code,
          filter: props.remoteFilter,
        }).then((response) => {
          if (response || isPreviouslyFiltered || props.remoteFilter) {
            dispatch({
              type: 'codetable/fetchCodes',
              payload: {
                code: props.code.toLowerCase(),
                filter: props.remoteFilter,
                multiplier: props.multiplier, // for stress testing purpose only
                force: true,
              },
            })
          }
        })
      } else {
        dispatch({
          type: 'codetable/fetchCodes',
          payload: {
            code: props.code.toLowerCase(),
            filter: props.remoteFilter,
            multiplier: props.multiplier, // for stress testing purpose only
          },
        })
      }
    }
  }

  componentWillUnmount () {
    // const { code } = props
  }

  render () {
    const { codetable, code, remoteFilter } = this.props
    const options =
      code !== undefined ? codetable[code.toLowerCase()] : this.state.options
    return <Select options={options || []} valueField='id' {...this.props} />
  }
}

CodeSelect.propTypes = {
  code: PropTypes.string,
  tenantCode: PropTypes.string,
}

// export default withStyles(extendedFormsStyle)(CodeSelect)
export default CodeSelect
