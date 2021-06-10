import React, { PureComponent } from 'react'

import { Paper, Divider, Chip } from '@material-ui/core'

import { orderTypes } from '@/pages/Consultation/utils'
import Form from '@/pages/Widgets/Orders/Detail'

// utils
import { calculateAdjustAmount } from '@/utils/utils'

import { getAppendUrl } from '@/utils/utils'
import Authorized from '@/utils/Authorized'
import TreatmentGrid from './TreatmentGrid'

class TreatmentForm extends PureComponent {
  render() {
    const {
      classes,
      dispense,
      consultation,
      dispatch,
      theme,
      dentalChartComponent,
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
          <Form
            singleMode='7'
            from='doctor'
            currentType={orderTypes.find(o => o.value === '7')}
            codetable={codetable}
            dentalChartComponent={dentalChartComponent}
            global={global}
          />
        </Paper>
        <TreatmentGrid {...this.props} />
      </div>
    )
  }
}

export default TreatmentForm
