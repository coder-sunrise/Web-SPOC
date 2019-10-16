import React, { PureComponent } from 'react'
import { connect } from 'dva'
import * as Yup from 'yup'
// material ui
import { withStyles } from '@material-ui/core'
import basicStyle from 'mui-pro-jss/material-dashboard-pro-react/layouts/basicLayout'
// common component
import { CardContainer, CommonModal } from '@/components'
// medisys component
import { LoadingWrapper } from '@/components/_medisys'
// sub component
import Filter from './Filter'
import Grid from './Grid'
import Detail from './Detail'

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

@connect(({ roomBlock, loading }) => ({
  roomBlock,
  loading: loading.effects['roomBlock/query'],
}))
class RoomBlock extends PureComponent {
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
        type: 'roomBlock/updateState',
        payload: {
          currentViewRoomBlock: {},
        },
      })
  }

  handleEdit = (id) => {
    this.props
      .dispatch({
        type: 'roomBlock/queryOne',
        payload: { id },
      })
      .then(() => {
        this.toggleModal()
      })
  }

  confirmDelete = (id) => {
    const { dispatch } = this.props
    dispatch({
      type: 'roomBlock/delete',
      payload: { id },
    }).then(() => {
      dispatch({
        type: 'roomBlock/refresh',
      })
    })
  }

  handleDelete = (id) => {
    const { dispatch } = this.props
    dispatch({
      type: 'global/updateAppState',
      payload: {
        openConfirm: true,
        openConfirmContent: 'Are you sure want to delete this room block?',
        onConfirmSave: () => this.confirmDelete(id),
      },
    })
  }

  render () {
    const { showModal } = this.state
    const { roomBlock, loading, dispatch } = this.props
    const cfg = {
      toggleModal: this.toggleModal,
    }
    console.log('asd', this.state.showModal)
    return (
      <CardContainer hideHeader>
        <Filter toggleModal={this.toggleModal} dispatch={dispatch} />
        <LoadingWrapper loading={loading} text='Refreshing list...'>
          <Grid
            onEditClick={this.handleEdit}
            onDeleteClick={this.handleDelete}
            dataSource={roomBlock.list}
          />
        </LoadingWrapper>
        <CommonModal
          open={showModal}
          observe='RoomBlockForm'
          title='Room Block'
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

export default withStyles(styles, { withTheme: true })(RoomBlock)
