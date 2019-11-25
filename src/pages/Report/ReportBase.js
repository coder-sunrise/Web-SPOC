import React from 'react'
// common components
import {
  CardContainer,
  GridContainer,
  GridItem,
  Button,
} from '@/components'
import ReportLayoutWrapper from './ReportLayout'
// services
import {
  getRawData,
} from '@/services/report'

export default class ReportBase extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      default: {
        loaded: false,
        isLoading: false,
        activePanel: -1,
        reportDatas: null,
        reportId: 0,
        fileName: '',
      },
    }
    // this.onSubmitClick = this.onSubmitClick.bind(this)
  }

  componentDidMount () {
    this.setState((state) => ({
      ...state.default,
    }))
  }

  componentWillUnmount () {
    this.setState((state) => ({
      ...state.default,
    }))
  }

  handleActivePanelChange = (event, panel) => {
    this.setState((state) => ({
      ...state,
      activePanel: state.activePanel === panel.key ? -1 : panel.key,
    }))
  }

  formatReportParams = (params) => {
    return params
  }

  onSubmitClick = async () => {
    if (this.props.validateForm) {
      const errors = await this.props.validateForm()
      if (Object.keys(errors).length > 0) return
    }
    this.setState((state) => ({
      ...state,
      loaded: false,
      isLoading: true,
      reportDatas: null,
    }))
    const params = this.formatReportParams(this.props.values)
    const reportDatas = await getRawData(this.state.reportId, { ...params })

    if (reportDatas) {
      this.setState((state) => ({
        ...state,
        activePanel: 0,
        loaded: true,
        isLoading: false,
        reportDatas,
      }))
    } else {
      this.setState(() => ({
        loaded: false,
        isLoading: false,
        reportDatas: null,
      }))
    }
  }

  renderFilterBar = (handleSubmit) => {
    return (
      <GridContainer size='sm'>
        <GridItem md={3}>
          <Button color='primary' onClick={handleSubmit}>
            Generate Report
          </Button>
        </GridItem>
      </GridContainer>
    )
  }

  renderContent = () => {
    return null
  }

  render () {
    return (
      <CardContainer hideHeader>
        <GridContainer>
          <GridItem md={12}>
            {this.renderFilterBar(this.onSubmitClick)}
          </GridItem>
          <GridItem md={12}>
            <ReportLayoutWrapper
              loading={this.state.isLoading}
              reportID={this.state.reportId}
              reportParameters={this.formatReportParams(this.props.values)}
              loaded={this.state.loaded}
              fileName={this.state.fileName}
            >
              {this.renderContent(this.state.reportDatas)}
            </ReportLayoutWrapper>
          </GridItem>
        </GridContainer>
      </CardContainer>
    )
  }
}
