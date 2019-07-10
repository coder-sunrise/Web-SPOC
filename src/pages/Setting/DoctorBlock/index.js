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

@connect(({ settingDoctorBlock }) => ({
    settingDoctorBlock,
}))
class DoctorBlock extends PureComponent {
  state = {}

  toggleModal = () => {
    this.props.dispatch({
      type: 'settingDoctorBlock/updateState',
      payload: {
        showModal: !this.props.settingDoctorBlock.showModal,
      },
    })
  }

  render () {
    const {
      classes,
      settingDoctorBlock,
      dispatch,
      theme,
      ...restProps
    } = this.props

    const cfg = {
      toggleModal: this.toggleModal,
    }

    return (
      <CardContainer hideHeader>
        <Filter {...cfg} {...this.props} />
        <Grid {...cfg} {...this.props} />
        <CommonModal
          open={settingDoctorBlock.showModal}
          title='Add Doctor Block'
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

export default withStyles(styles, { withTheme: true })(DoctorBlock)
