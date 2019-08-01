import React from 'react'
// import Select from './index'
import Select from '../Antd/AntdSelect'
import { getCodes, getTenantCodes } from '@/utils/codes'

const codetables = {}

class CodeSelect extends React.PureComponent {
  state = {
    options: [],
    width: 'auto',
  }

  constructor (props) {
    super(props)
    // console.log(props.code)
    if (props.code) {
      getCodes(props.code).then((codetableData) => {
        this.setState({ options: codetableData })
      })

      // if (!codetables[props.code]) {
      //   getCodes(props.code).then((options) => {
      //     this.setState({
      //       options,
      //     })
      //   })
      // } else {
      //   this.setState({
      //     options: codetables[props.code],
      //   })
      // }
    } else if (props.tenantCode) {
      getTenantCodes(props.tenantCode).then((response) => {
        const { data = [] } = response

        const tenantCodeOptions = data.reduce((options, opt) => {
          return [
            ...options,
            {
              name:
                opt &&
                opt.clinicianInfomation &&
                opt.clinicianInfomation.userProfile
                  ? opt.clinicianInfomation.userProfile.name
                  : '',
              id: opt.id,
            },
          ]
        }, [])
        this.setState({
          options: tenantCodeOptions,
        })
      })
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
        options={this.state.options || []}
        valueField='id'
        {...this.props}
      />
    )
  }
}

CodeSelect.propTypes = {}

// export default withStyles(extendedFormsStyle)(CodeSelect)
export default CodeSelect
