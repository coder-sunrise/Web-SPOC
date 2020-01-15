import React, { PureComponent } from 'react'
import router from 'umi/router'
import { Paper, Divider, Chip } from '@material-ui/core'

import { isNumber } from 'util'
import * as Yup from 'yup'

import _ from 'lodash'
import { orderTypes } from '@/utils/codes'
import Form from '@/pages/Widgets/Orders/Detail'
import { currencySymbol } from '@/utils/config'

// common component
import {
  GridContainer,
  GridItem,
  notification,
  withFormikExtend,
  FastField,
  Field,
  OutlinedTextField,
  TextField,
  NumberInput,
  Button,
  ProgressButton,
  Select,
  Switch,
  CodeSelect,
} from '@/components'
// utils
import { calculateAdjustAmount } from '@/utils/utils'

import { getAppendUrl } from '@/utils/utils'
import Authorized from '@/utils/Authorized'
import TreatmentGrid from './TreatmentGrid'

class TreatmentForm extends PureComponent {
  render () {
    const {
      classes,
      dispense,
      consultation,
      dispatch,
      theme,
      dentalChartComponent,
      dentalChartTreatment,
      setFieldValue,
      values,
      global,
      codetable,
    } = this.props

    return (
      <div className={classes.content}>
        <Paper
          style={{
            marginBottom: theme.spacing(1),
            padding: theme.spacing(1, 0),
          }}
        >
          <Divider light />
          <Form
            singleMode='7'
            from='doctor'
            currentType={orderTypes.find((o) => o.value === '7')}
            codetable={codetable}
            dentalChartComponent={dentalChartComponent}
            dentalChartTreatment={dentalChartTreatment}
            global={global}
          />
        </Paper>
        <TreatmentGrid {...this.props} />
      </div>
    )
  }
}

export default TreatmentForm
