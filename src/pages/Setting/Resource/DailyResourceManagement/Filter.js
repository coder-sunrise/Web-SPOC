import React, { PureComponent } from 'react'
import { FormattedMessage } from 'umi'
import moment from 'moment'
import Yup from '@/utils/yup'
import Search from '@material-ui/icons/Search'
import { navigateDirtyCheck } from '@/utils/utils'
import {
  withFormikExtend,
  FastField,
  GridContainer,
  GridItem,
  Button,
  DatePicker,
  Field,
} from '@/components'

class Filter extends PureComponent {
  componentDidMount() {
    const { queryDailyCapacity } = this.props
    queryDailyCapacity()
  }
  render() {
    const {
      classes,
      values,
      calendarResource,
      setFieldValue,
      queryDailyCapacity,
      dispatch,
    } = this.props
    return (
      <div className={classes.filterBar}>
        <GridContainer>
          <GridItem xs={6} md={3}>
            <DatePicker
              picker='month'
              label='Month'
              timeFormat={false}
              allowClear={false}
              format='MMM YYYY'
              value={calendarResource.selectMonth}
              onChange={e => {
                dispatch({
                  type: 'calendarResource/updateState',
                  payload: {
                    selectMonth: e,
                  },
                })
              }}
            />
          </GridItem>
          <GridItem>
            <div className={classes.filterBtn}>
              <Button
                color='primary'
                onClick={e => {
                  navigateDirtyCheck({
                    onProceed: queryDailyCapacity,
                  })(e)
                }}
              >
                <Search /> <FormattedMessage id='form.search' />
              </Button>
            </div>
          </GridItem>
        </GridContainer>
      </div>
    )
  }
}

export default Filter
