import React, { PureComponent } from 'react'
import { connect } from 'dva'
import { CardContainer, GridItem, Button, CommonModal } from '@/components'
import Grid from './Grid'
import { withStyles } from '@material-ui/core'
import basicStyle from 'mui-pro-jss/material-dashboard-pro-react/layouts/basicLayout'
import Filter from './Filter'
import Detail from './Detail'
import DuplicatePO from './DuplicatePO'

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
      //type: 'purchasingReceiving/query',
      type: 'purchasingReceiving/fakeQueryDone',
    })
  }

  navigatePdoDetails = ({ currentTarget }) => {
    const { history } = this.props
    const { location } = history

    history.push(`${location.pathname}/${currentTarget.id}?type=new`)
  }

  toggleWriteOffModal = () => {
    this.props.dispatch({
      type: 'purchasingReceiving/updateState',
      payload: {
        showWriteOffModal: !this.props.purchasingReceiving.showWriteOffModal,
      },
    })
  }

  toggleDuplicatePOModal = () => {
    this.props.dispatch({
      type: 'purchasingReceiving/updateState',
      payload: {
        showDuplicatePOModal: !this.props.purchasingReceiving
          .showDuplicatePOModal,
      },
    })
  }

  render () {
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
          title='Write-Off'
          maxWidth='sm'
          onClose={this.toggleWriteOffModal}
          onConfirm={this.toggleWriteOffModal}
        >
          <Detail {...this.props} />
        </CommonModal>
        <CommonModal
          open={purchasingReceiving.showDuplicatePOModal}
          observe='PurchaseOrderConfirmationDetail'
          title='Duplicate Purchase Order'
          maxWidth='sm'
          onClose={this.toggleDuplicatePOModal}
          onConfirm={this.toggleDuplicatePOModal}
        >
          <DuplicatePO {...this.props} />
        </CommonModal>
        <GridItem md={4} className={classes.buttonGroup}>
          <Button
            color='primary'
            onClick={() => {
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
