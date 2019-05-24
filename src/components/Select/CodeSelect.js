import React from 'react'
// import Select from './index'
import Select from '../Antd/AntdSelect'
import { getCodes } from '@/utils/codes'

const codetables = {}

class CodeSelect extends React.Component {
  state = {
    options: [],
    width: 'auto',
  }

  componentDidMount () {
    // console.log(this.props.code)
    if (this.props.code) {
      if (!codetables[this.props.code]) {
        setTimeout(async () => {
          const codetable = await getCodes(this.props.code)

          this.setState({
            options: codetable,
          })
        }, 0)
      } else {
        this.setState({
          options: codetables[this.props.code],
        })
      }
    }
  }

  render () {
    // console.log(this.props)
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
