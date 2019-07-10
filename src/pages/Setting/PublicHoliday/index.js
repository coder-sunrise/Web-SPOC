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

@connect(({ settingPublicHoliday }) => ({
    settingPublicHoliday,
}))
class PublicHoliday extends PureComponent {
  state = {}

  toggleModal = () => {
    this.props.dispatch({
      type: 'settingPublicHoliday/updateState',
      payload: {
        showModal: !this.props.settingPublicHoliday.showModal,
      },
    })
  }

  render () {
    const {
      classes,
      settingPublicHoliday,
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
          open={settingPublicHoliday.showModal}
          title='Add Public Holiday'
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

export default withStyles(styles, { withTheme: true })(PublicHoliday)
