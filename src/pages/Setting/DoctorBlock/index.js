import React, { PureComponent } from 'react'
import { connect } from 'dva'
import { withStyles } from '@material-ui/core'
import basicStyle from 'mui-pro-jss/material-dashboard-pro-react/layouts/basicLayout'
import { CardContainer, CommonModal } from '@/components'
import Filter from './Filter'
import Grid from './Grid'
import Detail from './Detail'
import DoctorBlockForm from '@/pages/Reception/Appointment/components/form/DoctorBlock'

const styles = (theme) => ({
  ...basicStyle(theme),
})

@connect(({ doctorBlock }) => ({
  doctorBlock,
}))
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

  render () {
    const { showModal } = this.state
    const { classes, doctorBlock, dispatch, theme, ...restProps } = this.props

    const cfg = {
      toggleModal: this.toggleModal,
    }

    return (
      <CardContainer hideHeader>
        <Filter {...cfg} {...this.props} />
        <Grid onEditClick={this.handleEdit} dataSource={doctorBlock.list} />
        <CommonModal
          open={showModal}
          title='Add Doctor Block'
          maxWidth='md'
          bodyNoPadding
          onClose={this.toggleModal}
          onConfirm={this.toggleModal}
        >
          <DoctorBlockForm />
        </CommonModal>
      </CardContainer>
    )
  }
}

export default withStyles(styles, { withTheme: true })(DoctorBlock)
