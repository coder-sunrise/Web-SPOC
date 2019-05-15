import React, { PureComponent } from 'react'
import { FormattedMessage, formatMessage } from 'umi/locale'
import { Assignment } from '@material-ui/icons'
import { withStyles } from '@material-ui/core/styles'

import {
  PageHeaderWrapper,
  Card,
  CardHeader,
  CardIcon,
  CardBody,
} from '@/components'

class BasicPureComponent extends PureComponent {
  shouldComponentUpdate (nextProps, nextStates) {
    console.log(this.props)
    console.log(nextProps)

    console.log(this.state)

    console.log(nextStates)

    console.log(this.props === nextProps)
    console.log(this.state === nextStates)

    return true
  }

  render () {
    // console.log(this)
    const { children } = this.props
    return <React.Fragment>{children}</React.Fragment>
  }
}

export default BasicPureComponent
