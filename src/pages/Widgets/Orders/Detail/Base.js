import React, { Component, PureComponent } from 'react'
import { connect } from 'dva'
import _ from 'lodash'

import {
  Button,
  GridContainer,
  GridItem,
  TextField,
  notification,
  Select,
  CodeSelect,
  DatePicker,
  RadioGroup,
  ProgressButton,
  CardContainer,
  confirm,
  Checkbox,
  SizeContainer,
  RichEditor,
  NumberInput,
  CustomInputWrapper,
  Popconfirm,
  FastField,
  Field,
  withFormikExtend,
} from '@/components'
import Yup from '@/utils/yup'
import { getServices } from '@/utils/codes'
import { calculateAdjustAmount } from '@/utils/utils'

@connect(({ global }) => ({ global }))
class Base extends PureComponent {
  UNSAFE_componentWillReceiveProps (nextProps) {
    if (!this.props.global.openAdjustment && nextProps.global.openAdjustment) {
      nextProps.dispatch({
        type: 'orders/updateState',
        payload: {
          entity: nextProps.values,
        },
      })
    }
  }

  render () {
    return null
  }
}
export default Base
