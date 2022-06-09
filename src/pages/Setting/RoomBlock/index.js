import React, { PureComponent } from 'react'
import { connect } from 'dva'
import $ from 'jquery'
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
import Detail from './Detail'

const styles = theme => ({
  ...basicStyle(theme),
})

@connect(({ roomBlock, loading, global }) => ({
  roomBlock,
  loading: loading.models.roomBlock,
  mainDivHeight: global.mainDivHeight,
}))
@withSettingBase({ modelName: 'roomBlock' })
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

  handleEdit = id => {
    this.props
      .dispatch({
        type: 'roomBlock/queryOne',
        payload: { id },
      })
      .then(() => {
        this.toggleModal()
      })
  }

  confirmDelete = id => {
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

  handleDelete = id => {
    const { dispatch } = this.props
    dispatch({
      type: 'global/updateAppState',
      payload: {
        openConfirm: true,
        openConfirmContent: 'Delete this room block?',
        onConfirmSave: () => this.confirmDelete(id),
      },
    })
  }

  render() {
    const { showModal } = this.state
    const { roomBlock, loading, mainDivHeight = 700 } = this.props
    const cfg = {
      toggleModal: this.toggleModal,
    }
    let height = mainDivHeight - 120 - ($('.filterRoomBlockBar').height() || 0)
    if (height < 300) height = 300
    return (
      <CardContainer hideHeader>
        <div className='filterRoomBlockBar'>
          <Filter {...cfg} {...this.props} />
        </div>
        <LoadingWrapper loading={loading} text='Refreshing list...'>
          <Grid
            onEditClick={this.handleEdit}
            onDeleteClick={this.handleDelete}
            dataSource={roomBlock.list}
            height={height}
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
