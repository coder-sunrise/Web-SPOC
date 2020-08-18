import React, { useEffect } from 'react'
import { connect } from 'dva'
import { withStyles } from '@material-ui/core/styles'
import { formatMessage } from 'umi/locale'
import { FastField } from 'formik'
import { compose } from 'redux'

import {
  CodeSelect,
  NumberInput,
  TextField,
  GridContainer,
  GridItem,
  DateRangePicker,
  dateFormatLong,
} from '@/components'

const styles = () => ({})

const Detail = ({ packageDetail, dispatch, setIsLoading }) => {
  useEffect(() => {
    if (packageDetail.currentId) {
      dispatch({
        type: 'packageDetail/query',
        payload: {
          id: packageDetail.currentId,
        },
      }).then((v) => setIsLoading(false))
    } else setIsLoading(false)
  }, [])
  return (
    <GridContainer gutter={0}>
      <GridItem xs={5} md={5}>
        <FastField
          name='code'
          render={(args) => {
            return (
              <TextField
                label={formatMessage({
                  id: 'inventory.master.package.code',
                })}
                maxLength={10}
                {...args}
              />
            )
          }}
        />
      </GridItem>
      <GridItem xs={2} md={2} />
      <GridItem xs={5} md={5}>
        <FastField
          name='effectiveDates'
          render={(args) => (
            <DateRangePicker
              format={dateFormatLong}
              label='Effective Start Date'
              label2='End Date'
              {...args}
            />
          )}
        />
      </GridItem>
      <GridItem xs={5} md={5}>
        <FastField
          name='displayValue'
          render={(args) => {
            return (
              <TextField
                label={formatMessage({
                  id: 'inventory.master.package.name',
                })}
                maxLength={255}
                {...args}
              />
            )
          }}
        />
      </GridItem>
      <GridItem xs={2} md={2} />
      <GridItem xs={5} md={5}>
        <GridContainer gutter={0}>
          <GridItem xs={5} md={5}>
            <FastField
              name='validDuration'
              render={(args) => {
                return (
                  <NumberInput
                    label={formatMessage({
                      id: 'inventory.master.package.validDuration',
                    })}
                    step={1}
                    min={0}
                    precision={0}
                    {...args}
                  />
                )
              }}
            />
          </GridItem>
          <GridItem xs={1} md={1} />
          <GridItem xs={6} md={6}>
            <FastField
              name='durationUnitFK'
              render={(args) => {
                return (
                  <CodeSelect
                    label={formatMessage({
                      id: 'inventory.master.package.durationUnit',
                    })}
                    code='ctDurationUnit'
                    {...args}
                  />
                )
              }}
            />
          </GridItem>
        </GridContainer>
      </GridItem>
      <GridItem xs={5} md={5}>
        <FastField
          name='description'
          render={(args) => {
            return (
              <TextField
                label={formatMessage({
                  id: 'inventory.master.package.description',
                })}
                maxLength={500}
                {...args}
              />
            )
          }}
        />
      </GridItem>
      <GridItem xs={2} md={2} />
      <GridItem xs={5} md={5}>
        <FastField
          name='remarks'
          render={(args) => {
            return (
              <TextField
                label={formatMessage({
                  id: 'inventory.master.package.remarks',
                })}
                multiline
                rowsMax='5'
                maxLength={2000}
                {...args}
              />
            )
          }}
        />
      </GridItem>
    </GridContainer>
  )
}
export default compose(
  withStyles(styles, { withTheme: true }),
  React.memo,
  connect(({ packageDetail }) => ({
    packageDetail,
  })),
)(Detail)
