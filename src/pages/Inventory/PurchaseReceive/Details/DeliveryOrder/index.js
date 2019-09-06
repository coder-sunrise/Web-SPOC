import React, { PureComponent } from 'react'
import { connect } from 'dva'
import { formatMessage } from 'umi/locale'
import { Divider } from '@material-ui/core'
import { withStyles } from '@material-ui/core'
import basicStyle from 'mui-pro-jss/material-dashboard-pro-react/layouts/basicLayout'
import { GridContainer, GridItem } from '@/components'
import DOGrid from './Grid'

const styles = (theme) => ({
  ...basicStyle(theme),
  buttonGroup: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(1),
  },
})

@connect(({ deliveryOrderDetail }) => ({
  deliveryOrderDetail,
}))
class index extends PureComponent {
  componentDidMount () {
    this.props.dispatch({
      type: 'deliveryOrderDetail/query',
    })
  }

  render () {
    console.log(this.props)
    
    const { props } = this
    const { classes, deliveryOrderDetail } = props
    return (
      <div>
        <GridContainer gutter={0}>
          <GridItem xs={12} md={12}>
            <h4 style={{ marginTop: 20, fontWeight: 'bold' }}>
              {formatMessage({
                id: 'inventory.pr.detail.dod.do',
              })}
            </h4>
          </GridItem>
          <DOGrid {...this.props} />
        </GridContainer>
      </div>
    )
  }
}

export default withStyles(styles, { withTheme: true })(index)
