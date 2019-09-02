import React, { PureComponent } from 'react'
import { connect } from 'dva'
import { CardContainer, GridItem, Button, CommonModal } from '@/components'
import Grid from './Grid'
import { withStyles } from '@material-ui/core'
import basicStyle from 'mui-pro-jss/material-dashboard-pro-react/layouts/basicLayout'
import Filter from './Filter'
import Detail from './Detail'

const styles = (theme) => ({
  ...basicStyle(theme),
  buttonGroup: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(1),
  },
})

@connect(({ purchasingReceiving }) => ({
  purchasingReceiving,
}))
class PurchaseReceive extends PureComponent {
  componentDidMount () {
    this.props.dispatch({
      type: 'purchasingReceiving/query',
    })
  }

  navigatePdoDetails = ({ currentTarget }) => {
    const { history } = this.props
    const { location } = history

    history.push(`${location.pathname}/${currentTarget.id}`)
  }

  toggleWriteOffModal = () => {
    this.props.dispatch({
      type: 'purchasingReceiving/updateState',
      payload: {
        showWriteOffModal: !this.props.purchasingReceiving.showWriteOffModal,
      },
    })
  }

  render () {
    console.log(this.props)

    const { props } = this
    const { classes, purchasingReceiving, dispatch } = props
    const cfg = {
      navigatePdoDetails: this.navigatePdoDetails,
    }

    return (
      <CardContainer hideHeader>
        <Filter {...cfg} {...this.props} />
        <Grid {...this.props} />
        <CommonModal
          open={purchasingReceiving.showWriteOffModal}
          observe='PurchaseReceivingWriteOffDetail'
          title={'Write-Off'}
          maxWidth='xs'
          onClose={this.toggleWriteOffModal}
          onConfirm={this.toggleWriteOffModal}
        >
          <Detail {...this.props} />
        </CommonModal>
        <GridItem md={4} className={classes.buttonGroup}>
          <Button
            color='primary'
            onClick={() => {
              dispatch({
                type: 'purchasingReceiving/updateState',
              })
              this.toggleWriteOffModal()
            }}
          >
            Write-Off
          </Button>
        </GridItem>
      </CardContainer>
    )
  }
}

export default withStyles(styles, { withTheme: true })(PurchaseReceive)
