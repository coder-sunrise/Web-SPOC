import React, { PureComponent } from 'react'
import Yup from '@/utils/yup'
import { connect } from 'dva'
import { withFormik, FastField } from 'formik'

import { withStyles, Divider } from '@material-ui/core'
import basicStyle from 'mui-pro-jss/material-dashboard-pro-react/layouts/basicLayout'

import {
  PictureUpload,
  GridContainer,
  GridItem,
  CardContainer,
  Transition,
  TextField,
  AntdInput,
  Select,
  Accordion,
  Button,
  CommonTableGrid2,
  DatePicker,
  NumberInput,
  CommonModal,
} from '@/components'

import Filter from './Filter'
import Grid from './Grid'
import Detail from './Detail'

const styles = (theme) => ({
  ...basicStyle(theme),
})

@connect(({ settingRoom, global }) => ({
  settingRoom,
  global,
}))
class Room extends PureComponent {
  state = {}

  componentDidMount () {
    this.props.dispatch({
      type: 'settingRoom/query',
    })
  }

  toggleModal = () => {
    this.props.dispatch({
      type: 'settingRoom/updateState',
      payload: {
        showModal: !this.props.settingRoom.showModal,
      },
    })
  }

  render () {
    const { classes, settingRoom, dispatch, theme, ...restProps } = this.props
    const cfg = {
      toggleModal: this.toggleModal,
    }
    return (
      <CardContainer hideHeader>
        <Filter {...cfg} {...this.props} />
        <Grid {...cfg} {...this.props} />
        <CommonModal
          open={settingRoom.showModal}
          title='Add Room'
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

export default withStyles(styles, { withTheme: true })(Room)
