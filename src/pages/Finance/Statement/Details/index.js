import React, { PureComponent } from 'react'
import { withStyles, Paper } from '@material-ui/core'
import { connect } from 'dva'
import { withFormikExtend, Tabs } from '@/components'
import { StatementDetailOption } from './variables'
import DetailsHeader from './DetailsHeader'

const styles = () => ({})
@connect(({ statement }) => ({
  statement,
}))
@withFormikExtend({
  enableReinitialize: true,
  mapPropsToValues: ({ statement }) => {
    const returnValue = statement.entity || statement.default
    const outstandingBalance =
      returnValue.totalAmount - returnValue.collectedAmount
    return {
      ...returnValue,
      outstandingBalance,
    }
  },
})
class StatementDetails extends PureComponent {
  componentDidMount = () => {
    const { statement, dispatch, history } = this.props

    if (statement.currentId) {
      dispatch({
        type: 'statement/queryOne',
        payload: {
          id: statement.currentId,
        },
      })
    } else {
      history.push('/finance/statement/')
    }
  }

  render () {
    return (
      <React.Fragment>
        <Paper>
          <DetailsHeader {...this.props} />
        </Paper>
        <Paper style={{ padding: 5 }}>
          <Tabs
            style={{ marginTop: 20 }}
            defaultActiveKey='0'
            options={StatementDetailOption(this.props)}
          />
        </Paper>
      </React.Fragment>
    )
  }
}

export default withStyles(styles, { withTheme: true })(StatementDetails)
