import React from 'react'
// import Select from './index'
import Select from '../Antd/AntdSelect'
import { getCodes } from '@/utils/codes'

const codetables = {}

class CodeSelect extends React.PureComponent {
  state = {
    options: [],
    width: 'auto',
  }

  constructor (props) {
    super(props)

    if (props.code) {
      if (!codetables[props.code]) {
        getCodes(props.code).then((options) => {
          // console.log(options)
          this.setState({
            options,
          })
        })
      } else {
        this.setState({
          options: codetables[props.code],
        })
      }
    }
  }

  // componentDidMount () {
  //   // console.log(this.props.code)

  // }

  render () {
    // console.log(this.props)
    // if (!this.state.options || this.state.options.length === 0) return null
    return (
      <Select
        {...this.props}
        options={this.state.options || []}
        valueField='id'
      />
    )
  }
}

CodeSelect.propTypes = {}

// export default withStyles(extendedFormsStyle)(CodeSelect)
export default CodeSelect
