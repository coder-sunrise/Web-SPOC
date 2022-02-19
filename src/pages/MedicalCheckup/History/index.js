import React from 'react'
import { Divider, withStyles } from '@material-ui/core'
import { history, FormattedMessage, formatMessage, connect } from 'umi'

const styles = theme => ({})
@connect(({}) => ({}))
class History extends React.Component {
  render() {
    return 'MC History'
  }
}
export default withStyles(styles, { withTheme: true })(History)
