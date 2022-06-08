import React, { PureComponent } from 'react'
import { connect } from 'dva'
import $ from 'jquery'
import { withStyles } from '@material-ui/core'
import basicStyle from 'mui-pro-jss/material-dashboard-pro-react/layouts/basicLayout'
import { CardContainer, CommonModal, withSettingBase } from '@/components'
import Filter from './Filter'
import Grid from './Grid'
import Detail from './Detail'
import withWebSocket from '@/components/Decorator/withWebSocket'
import { getRawData } from '@/services/report'
import { REPORT_ID } from '@/utils/constants'

const styles = theme => ({
  ...basicStyle(theme),
})

@connect(({ settingCompany, global, clinicSettings }) => ({
  settingCompany,
  clinicSettings,
  mainDivHeight: global.mainDivHeight,
}))
@withSettingBase({ modelName: 'settingCompany' })
class Supplier extends PureComponent {
  state = {}

  componentDidMount() {
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
    const supplier = route.name === 'supplier'
    dispatch({
      type: 'settingCompany/query',
      payload: {
        isActive: true,
        companyTypeFK: copayer ? 1 : supplier ? 2 : 3,
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

  printLabel = async (copayerId, contactPersonName, copies) => {
    if (!Number.isInteger(copayerId)) return

    const { handlePrint, clinicSettings } = this.props
    const { labelPrinterSize } = clinicSettings.settings

    const sizeConverter = sizeCM => {
      return sizeCM
        .split('x')
        .map(o =>
          (10 * parseFloat(o.replace('cm', ''))).toString().concat('MM'),
        )
        .join('_')
    }
    const { route } = this.props
    const reportID =
      REPORT_ID[
        (route.name === 'copayer'
          ? 'COPAYER_ADDRESS_LABEL_'
          : 'SUPPLIER_ADDRESS_LABEL_'
        ).concat(sizeConverter(labelPrinterSize))
      ]

    const data = await getRawData(
      reportID,
      route.name === 'copayer'
        ? {
            copayerId,
            contactPersonName: contactPersonName
              ? contactPersonName
              : undefined,
          }
        : { supplierId: copayerId },
    )
    const payload = [
      {
        ReportId: reportID,
        ReportData: JSON.stringify({
          ...data,
        }),
        Copies: copies || 1,
      },
    ]
    handlePrint(JSON.stringify(payload))
  }
  printCoverPage = async (copayerId, coverPageCopies) => {
    const { dispatch, handlePrint } = this.props
    dispatch({
      type: 'copayerDetail/queryCopayerDetails',
      payload: {
        id: copayerId,
      },
    }).then(r => {
      if (!r) return
      const data = {}
      let information = {}
      information.Title = r.displayValue
      if (r.address) {
        let address = r?.address || {}
        information.Content = `${address.blockNo || ''}${
          address.street ? (address.blockNo ? ' ' : '') + address.street : ''
        }${address.blockNo || address.street ? '\n' : ''}${address.unitNo ||
          ''}${
          address.buildingName
            ? (address.unitNo ? ' ' : '') + address.buildingName
            : ''
        }${
          address.unitNo || address.buildingName ? '\n' : ''
        }${address.countryName || ''}${
          address.postcode
            ? (address.countryName ? ' ' : '') + address.postcode
            : ''
        }`
      }
      data.MailingInformation = [information]
      const payload = [
        {
          ReportId: 95,
          ReportData: JSON.stringify(data),
          Copies: coverPageCopies,
        },
      ]
      handlePrint(JSON.stringify(payload))
    })
  }
  render() {
    const { settingCompany, route, mainDivHeight = 700 } = this.props
    const cfg = {
      toggleModal: this.toggleModal,
    }
    const { name } = route
    const companyType =
      name === 'copayer'
        ? 'Co-Payer'
        : name === 'supplier'
        ? 'Supplier'
        : 'Manufacturer'
    let height = mainDivHeight - 120 - ($('.filterCompanyBar').height() || 0)
    if (height < 300) height = 300
    return (
      <CardContainer hideHeader>
        <div className='filterCompanyBar'>
          <Filter {...cfg} {...this.props} />
        </div>
        <Grid
          {...cfg}
          {...this.props}
          onPrint={this.printLabel}
          onPrintCoverPage={this.printCoverPage}
          height={height}
        />

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
          <Detail {...cfg} {...this.props} onPrint={this.printLabel} />
        </CommonModal>
      </CardContainer>
    )
  }
}

export default withWebSocket()(
  withStyles(styles, { withTheme: true })(Supplier),
)
