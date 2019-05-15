import React, { PureComponent } from 'react'
import { connect } from 'dva'
import AntdBasicForm from './AntdBasicForm'
import SfuBasicForm from './SfuBasicForm'

@connect(({ setting }) => ({
  setting,
}))
class BasicForms extends PureComponent {
  
  render () {
    const { setting } = this.props
    
    return (
      <React.Fragment>
        {setting.ui==='mui'?<SfuBasicForm />:<AntdBasicForm />}
      </React.Fragment>
    )
  }
}

export default BasicForms
