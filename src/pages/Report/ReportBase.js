import React from 'react'
import { GridContainer, GridItem, Button } from '@/components'
import ReportLayoutWrapper from './ReportLayout'
// services
import { getRawData } from '@/services/report'

export default class ReportBase extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      default: {
        loaded: false,
        isLoading: false,
        isSubmitting: false,
        activePanel: -1,
        reportDatas: null,
        reportId: 0,
        fileName: '',
      },
    }
    // this.onSubmitClick = this.onSubmitClick.bind(this)
  }

  // componentDidMount () {
  //   this.setState((state) => ({
  //     ...state.default,
  //   }))
  // }

  // componentWillUnmount () {
  //   this.setState((state) => ({
  //     ...state.default,
  //   }))
  // }

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
      isSubmitting: true,
      reportDatas: null,
    }))
    const params = this.formatReportParams(this.props.values)
    const reportDatas = await getRawData(this.state.reportId, { ...params })

    if (reportDatas) {
      this.setState((state) => ({
        ...state,
        activePanel: 0,
        loaded: true,
        isSubmitting: false,
        isLoading: false,
        reportDatas,
      }))
    } else {
      this.setState(() => ({
        loaded: false,
        isLoading: false,
        isSubmitting: false,
        reportDatas: null,
      }))
    }
  }

  renderFilterBar = (handleSubmit, isSubmitting) => {
    return (
      <GridContainer size='sm'>
        <GridItem md={3}>
          <Button
            color='primary'
            onClick={handleSubmit}
            style={{ marginTop: 6 }}
            disabled={this.state.isSubmitting}
          >
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
    const { height } = this.props
    // console.log({ height })
    const maxHeight = !height ? '100%' : height - 200
    return (
      <GridContainer>
        <GridItem md={12}>
          {this.renderFilterBar(this.onSubmitClick, this.state.isSubmitting)}
        </GridItem>
        <GridItem md={12}>
          <ReportLayoutWrapper
            height={height}
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
    )
  }
}
