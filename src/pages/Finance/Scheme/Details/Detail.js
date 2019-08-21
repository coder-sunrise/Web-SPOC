import React, { useEffect } from 'react'
import { formatMessage } from 'umi/locale'
import { withStyles } from '@material-ui/core/styles'
import { Divider } from '@material-ui/core'
import { FastField } from 'formik'
import { compose } from 'redux'

import {
  CodeSelect,
  CardContainer,
  TextField,
  GridContainer,
  GridItem,
  Select,
  DatePicker,
  DateRangePicker,
  Switch,
} from '@/components'

const styles = () => ({})

const Detail = ({ schemeDetail, dispatch, height }) => {
  useEffect(() => {
    if (schemeDetail.currentId) {
      dispatch({
        type: 'schemeDetail/query',
        payload: {
          id: schemeDetail.currentId,
        },
      })
    }
  }, [])

  return (
    <CardContainer
      hideHeader
      style={{
        height,
        overflow: 'auto',
      }}
    >
      <GridContainer gutter={0}>
        <GridItem xs={12} md={5}>
          <GridContainer>
            <GridItem xs={12}>
              <FastField
                name='code'
                render={(args) => {
                  return (
                    <TextField
                      label={formatMessage({
                        id: 'finance.scheme.detail.code',
                      })}
                      {...args}
                    />
                  )
                }}
              />
            </GridItem>
            <GridItem xs={12}>
              <FastField
                name='name'
                render={(args) => {
                  return (
                    <TextField
                      label={formatMessage({
                        id: 'finance.scheme.detail.name',
                      })}
                      {...args}
                    />
                  )
                }}
              />
            </GridItem>
            <GridItem xs={12}>
              <FastField
                name='description'
                render={(args) => {
                  return (
                    <TextField
                      label={formatMessage({
                        id: 'finance.scheme.detail.description',
                      })}
                      {...args}
                    />
                  )
                }}
              />
            </GridItem>
            <GridItem xs={12}>
              <FastField
                name='remarks'
                render={(args) => {
                  return (
                    <TextField
                      label={formatMessage({
                        id: 'finance.scheme.detail.remarks',
                      })}
                      multiline
                      rowsMax='5'
                      {...args}
                    />
                  )
                }}
              />
            </GridItem>
          </GridContainer>
        </GridItem>
        <GridItem xs={12} md={2} />
        <GridItem xs={12} md={5}>
          <GridContainer>
            <GridItem xs={12}>
              <FastField
                name='schemeTypeFK'
                render={(args) => {
                  return (
                    <CodeSelect
                      label={formatMessage({
                        id: 'finance.scheme.detail.type',
                      })}
                      code='ctSchemeType'
                      {...args}
                    />
                  )
                }}
              />
            </GridItem>
            <GridItem xs={12}>
              <FastField
                name='schemeCategoryFK'
                render={(args) => {
                  return (
                    <CodeSelect
                      label={formatMessage({
                        id: 'finance.scheme.detail.category',
                      })}
                      code='ctCopayerType'
                      {...args}
                    />
                  )
                }}
              />
            </GridItem>
            <GridItem xs={12}>
              <FastField
                name='coPayer'
                render={(args) => (
                  <CodeSelect
                    label={formatMessage({
                      id: 'finance.scheme.detail.coPayer',
                    })}
                    code='ctCompany'
                    max={50}
                    {...args}
                  />
                )}
              />
            </GridItem>
            <GridItem xs={12}>
              <FastField
                name='effectiveDates'
                render={(args) => {
                  return (
                    <DateRangePicker
                      label='Effective Start Date'
                      label2='End Date'
                      {...args}
                    />
                  )
                }}
              />
            </GridItem>
          </GridContainer>
        </GridItem>
      </GridContainer>
    </CardContainer>
  )
}
export default compose(
  withStyles(styles, { withTheme: true }),
  React.memo,
  // connect(({ schemeDetail }) => ({
  //   schemeDetail,
  // })),
)(Detail)
