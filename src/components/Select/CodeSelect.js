import React, { useMemo } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import Select from '../Antd/AntdSelect'
import { checkShouldRefresh } from '@/utils/codes'

@connect(({ codetable }) => ({ codetable }))
class CodeSelect extends React.PureComponent {
  constructor (props) {
    super(props)
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

  componentWillUnmount () {
    // const { code } = props
  }

  render () {
    const { codetable, code, localFilter } = this.props
    const options =
      code !== undefined ? codetable[code.toLowerCase()] || [] : []
    const filteredOptions = localFilter ? options.filter(localFilter) : options

    return (
      <Select options={filteredOptions || []} valueField='id' {...this.props} />
    )
  }
}

CodeSelect.propTypes = {
  code: PropTypes.string,
  tenantCode: PropTypes.string,
}

// export default withStyles(extendedFormsStyle)(CodeSelect)
export default CodeSelect
