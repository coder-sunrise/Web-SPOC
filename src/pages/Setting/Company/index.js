import React, { PureComponent } from 'react'
import { connect } from 'dva'
import $ from 'jquery'
import { withStyles } from '@material-ui/core'
import basicStyle from 'mui-pro-jss/material-dashboard-pro-react/layouts/basicLayout'
import { CardContainer, CommonModal, withSettingBase } from '@/components'
import Filter from './Filter'
import Grid from './Grid'
import Detail from './Detail'

const styles = (theme) => ({
  ...basicStyle(theme),
})

@connect(({ settingCompany, global }) => ({
  settingCompany,
  mainDivHeight: global.mainDivHeight,
}))
@withSettingBase({ modelName: 'settingCompany' })
class Supplier extends PureComponent {
  state = {}

  componentDidMount () {
    const { route, dispatch } = this.props
    const suppSorting = [
      { columnName: 'effectiveEndDate', direction: 'desc' },
      { columnName: 'displayValue', direction: 'asc' },
    ]
    const copayerSorting = [
      { columnName: 'effectiveEndDate', direction: 'desc' },
      { columnName: 'coPayerTypeFK', direction: 'asc' },
      { columnName: 'displayValue', direction: 'asc' },
    ]
    const copayer = route.name === 'copayer'
    dispatch({
      type: 'settingCompany/query',
      payload: {
        companyTypeFK: copayer ? 1 : 2,
        sorting: copayer ? copayerSorting : suppSorting,
      },
    })
  }

  toggleModal = () => {
    this.props.dispatch({
      type: 'settingCompany/updateState',
      payload: {
        showModal: !this.props.settingCompany.showModal,
      },
    })
  }

  render () {
    const { settingCompany, route, mainDivHeight = 700 } = this.props
    const cfg = {
      toggleModal: this.toggleModal,
    }
    const { name } = route
    const companyType = name === 'copayer' ? 'Co-Payer' : 'Supplier'
    let height = mainDivHeight - 110 - ($('.filterBar').height() || 0)
    if (height < 300) height = 300
    return (
      <CardContainer hideHeader>
        <div className='filterBar'>
          <Filter {...cfg} {...this.props} />
        </div>
        <Grid {...cfg} {...this.props} height={height} />

        <CommonModal
          open={settingCompany.showModal}
          observe='CompanyDetail'
          title={
            settingCompany.entity ? `Edit ${companyType}` : `Add ${companyType}`
          }
          maxWidth='md'
          bodyNoPadding
          onClose={this.toggleModal}
          onConfirm={this.toggleModal}
        >
          <Detail {...cfg} {...this.props} />
        </CommonModal>
      </CardContainer>
    )
  }
}

export default withStyles(styles, { withTheme: true })(Supplier)
