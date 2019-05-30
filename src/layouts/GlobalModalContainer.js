import React, { PureComponent } from 'react'
import { connect } from 'dva'
import qs from 'query-string'
import { CommonModal, SimpleModal } from '@/components'
import PatientDetail from '@/pages/PatientDatabase/Detail'

import { sleep, getRemovedUrl } from '@/utils/utils'

@connect(({ global, loading }) => ({
  global,
}))
class GlobalModalContainer extends PureComponent {
  // componentDidMount () {
  //   const para = qs.parse(location.search)
  //   console.log(para)
  // }

  render () {
    const { global, dispatch, history } = this.props
    return (
      <div>
        {/* <SimpleModal
          title={`Are you sure to void the Payment ${this.state
            .currentItemCode} ?`}
          open={this.state.openModal}
          status={this.props.status}
          onCancel={() => this.hideAlert()}
          onConfirm={() => {
            this.props.handleSubmit()
          }}
        /> */}
        {global.showPatientInfoPanel && (
          <CommonModal
            open={global.showPatientInfoPanel}
            title='Patient Profile'
            onClose={(e) => {
              history.push(
                getRemovedUrl([
                  'md',
                  'cmt',
                  'pid',
                  'new',
                ]),
              )
              dispatch({
                type: 'global/updateAppState',
                payload: {
                  showPatientInfoPanel: false,
                  fullscreen: false,
                  currentPatientId: null,
                },
              })
            }}
            // onConfirm={this.toggleModal}
            fullScreen
            showFooter={false}
          >
            <PatientDetail {...this.props} />
            {/* {global.currentPatientId} */}
          </CommonModal>
        )}
      </div>
    )
  }
}
export default GlobalModalContainer
