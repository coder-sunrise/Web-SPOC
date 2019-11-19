import React, { PureComponent } from 'react'
import { connect } from 'dva'
import * as Yup from 'yup'
// material ui
import { withStyles } from '@material-ui/core'
import basicStyle from 'mui-pro-jss/material-dashboard-pro-react/layouts/basicLayout'
// common component
import { CardContainer, CommonModal, withSettingBase } from '@/components'
// medisys component
import { LoadingWrapper } from '@/components/_medisys'
// sub component
import Filter from './Filter'
import Grid from './Grid'
import DoctorBlockForm from '@/pages/Reception/Appointment/components/form/DoctorBlock'

const styles = (theme) => ({
  ...basicStyle(theme),
})

const DoctorFormValidation = Yup.object().shape({
  doctorBlockUserFk: Yup.string().required(),
  durationHour: Yup.string().required(),
  durationMinute: Yup.string().required(),
  eventDate: Yup.string().required(),
  eventTime: Yup.string().required(),
})

@connect(({ doctorBlock, loading }) => ({
  doctorBlock,
  loading: loading.effects['doctorBlock/query'],
}))
@withSettingBase({ modelName: 'doctorBlock' })
class DoctorBlock extends PureComponent {
  state = {
    showModal: false,
  }

  toggleModal = () => {
    const { showModal } = this.state
    this.setState({
      showModal: !showModal,
    })
    showModal &&
      this.props.dispatch({
        type: 'doctorBlock/updateState',
        payload: {
          currentViewDoctorBlock: {},
        },
      })
  }

  handleEdit = (id) => {
    this.props
      .dispatch({
        type: 'doctorBlock/queryOne',
        payload: { id },
      })
      .then(() => {
        this.toggleModal()
      })
  }

  confirmDelete = (id) => {
    const { dispatch } = this.props
    dispatch({
      type: 'doctorBlock/delete',
      payload: { id },
    }).then(() => {
      dispatch({
        type: 'doctorBlock/refresh',
      })
    })
  }

  handleDelete = (id) => {
    const { dispatch } = this.props
    dispatch({
      type: 'global/updateAppState',
      payload: {
        openConfirm: true,
        openConfirmContent: 'Are you sure want to delete this doctor block?',
        onConfirmSave: () => this.confirmDelete(id),
      },
    })
  }

  handleAfterSubmit = () => {
    this.props.dispatch({
      type: 'doctorBlock/query',
    })
  }

  render () {
    const { showModal } = this.state
    const { doctorBlock, loading, dispatch } = this.props

    return (
      <CardContainer hideHeader>
        <Filter toggleModal={this.toggleModal} dispatch={dispatch} />
        <LoadingWrapper loading={loading} text='Refreshing list...'>
          <Grid
            onEditClick={this.handleEdit}
            onDeleteClick={this.handleDelete}
            dataSource={doctorBlock.list}
          />
        </LoadingWrapper>
        <CommonModal
          open={showModal}
          observe='DoctorBlockForm'
          title='Doctor Block'
          maxWidth='md'
          bodyNoPadding
          onClose={this.toggleModal}
          onConfirm={this.toggleModal}
        >
          <DoctorBlockForm
            validationSchema={DoctorFormValidation}
            handleAfterSubmit={this.handleAfterSubmit}
          />
        </CommonModal>
      </CardContainer>
    )
  }
}

export default withStyles(styles, { withTheme: true })(DoctorBlock)
