import React, { Component, Suspense } from 'react'
import { connect } from 'dva'
import { Row, Col, Icon, Menu, Dropdown } from 'antd'



import GridContent from '@/components/PageHeaderWrapper/GridContent'
import { getTimeDistance } from '@/utils/utils'
// import { ButtonComponent } from '@syncfusion/ej2-react-buttons'
// import { Grid, GridColumn } from '@progress/kendo-react-grid'
// import { Panel } from '@sencha/ext-modern'
import styles from './Analysis.less'
import PageLoading from '@/components/PageLoading'
// import '@progress/kendo-theme-default/dist/all.css'

import BlurExample from './Test'


const IntroduceRow = React.lazy(() => import('./IntroduceRow'))
const SalesCard = React.lazy(() => import('./SalesCard'))
const TopSearch = React.lazy(() => import('./TopSearch'))
const ProportionSales = React.lazy(() => import('./ProportionSales'))
const OfflineData = React.lazy(() => import('./OfflineData'))

@connect(({ chart, loading }) => ({
  chart,
  loading: loading.effects['chart/fetch'],
}))
class Analysis extends Component {
  state = {
    salesType: 'all',
    currentTabKey: '',
    rangePickerValue: getTimeDistance('year'),
    data: [
      {ProductName: "Chai", Price: 10},
      {ProductName: "Chang", Price: 20},
    ],
  };

  componentDidMount () {
    const { dispatch } = this.props
    this.reqRef = requestAnimationFrame(() => {
      dispatch({
        type: 'chart/fetch',
      })
    })
  }

  componentWillUnmount () {
    const { dispatch } = this.props
    dispatch({
      type: 'chart/clear',
    })
    cancelAnimationFrame(this.reqRef)
    clearTimeout(this.timeoutId)
  }

  handleChangeSalesType = e => {
    this.setState({
      salesType: e.target.value,
    })
  };

  handleTabChange = key => {
    this.setState({
      currentTabKey: key,
    })
  };

  handleRangePickerChange = rangePickerValue => {
    const { dispatch } = this.props
    this.setState({
      rangePickerValue,
    })

    dispatch({
      type: 'chart/fetchSalesData',
    })
  };

  selectDate = type => {
    const { dispatch } = this.props
    this.setState({
      rangePickerValue: getTimeDistance(type),
    })

    dispatch({
      type: 'chart/fetchSalesData',
    })
  };

  isActive = type => {
    const { rangePickerValue } = this.state
    const value = getTimeDistance(type)
    if (!rangePickerValue[0] || !rangePickerValue[1]) {
      return ''
    }
    if (
      rangePickerValue[0].isSame(value[0], 'day') &&
      rangePickerValue[1].isSame(value[1], 'day')
    ) {
      return styles.currentDate
    }
    return ''
  };

  render () {
    const { rangePickerValue, salesType, currentTabKey } = this.state
    const { chart, loading } = this.props
    // console.log(this.props)
    const {
      visitData,
      visitData2,
      salesData,
      searchData,
      offlineData,
      offlineChartData,
      salesTypeData,
      salesTypeDataOnline,
      salesTypeDataOffline,
    } = chart
    let salesPieData
    if (salesType === 'all') {
      salesPieData = salesTypeData
    } else {
      salesPieData = salesType === 'online' ? salesTypeDataOnline : salesTypeDataOffline
    }
    const menu = (
      <Menu>
        <Menu.Item>?????????</Menu.Item>
        <Menu.Item>?????????</Menu.Item>
      </Menu>
    )

    const dropdownGroup = (
      <span className={styles.iconGroup}>
        <Dropdown overlay={menu} placement="bottomRight">
          <Icon type="ellipsis" />
        </Dropdown>
      </span>
    )

    const activeKey = currentTabKey || (offlineData[0] && offlineData[0].name)

    return (
      <GridContent>
        <Suspense fallback={<PageLoading />}>
          <IntroduceRow loading={loading} visitData={visitData} />
        </Suspense>
        <Suspense fallback={null}>
          <SalesCard
            rangePickerValue={rangePickerValue}
            salesData={salesData}
            isActive={this.isActive}
            handleRangePickerChange={this.handleRangePickerChange}
            loading={loading}
            selectDate={this.selectDate}
          />
        </Suspense>
        <Row gutter={24}>
          <Col xl={12} lg={24} md={24} sm={24} xs={24}>
            <Suspense fallback={null}>
              <TopSearch
                loading={loading}
                visitData2={visitData2}
                selectDate={this.selectDate}
                searchData={searchData}
                dropdownGroup={dropdownGroup}
              />
            </Suspense>
          </Col>
          <Col xl={12} lg={24} md={24} sm={24} xs={24}>
            <Suspense fallback={null}>
              <ProportionSales
                dropdownGroup={dropdownGroup}
                salesType={salesType}
                loading={loading}
                salesPieData={salesPieData}
                handleChangeSalesType={this.handleChangeSalesType}
              />
            </Suspense>
          </Col>
        </Row>
        <Suspense fallback={null}>
          <OfflineData
            activeKey={activeKey}
            loading={loading}
            offlineData={offlineData}
            offlineChartData={offlineChartData}
            handleTabChange={this.handleTabChange}
          />
        </Suspense> 
      </GridContent>
    )
  }
}

export default Analysis
