import React, { Component, Fragment } from 'react'
import { connect } from 'dva'
import { formatMessage, FormattedMessage } from 'umi/locale'
import PageHeaderWrapper from '@/components/PageHeaderWrapper'
import PatientDetail from '../Detail'

@connect(({ patient }) => ({
  patient,
}))
class New extends Component {
  render () {
    const { history } = this.props

    return (
      <PageHeaderWrapper>
        <PatientDetail
          history={history}
          linkProps={{
            to: '#',
          }}
          onMenuClick={(e, o) => {
            this.props.dispatch({
              type: 'patient/updateState',
              payload: {
                currentComponent: o.url.cmt,
              },
            })
          }}
        />
      </PageHeaderWrapper>
    )
  }
}

export default New
