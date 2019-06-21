import React, { useEffect } from 'react'
import { connect } from 'dva'
import { withStyles } from '@material-ui/core/styles'
import { Divider } from '@material-ui/core'
import { withFormik, FastField } from 'formik'
import Yup from '@/utils/yup'
import { compose } from 'redux'

import {
  CodeSelect,
  CardContainer,
  TextField,
  Button,
  GridContainer,
  GridItem,
  Select,
  DatePicker,
  ProgressButton,
  Checkbox,
} from '@/components'

const styles = () => ({})

const Detail = ({ consumableDetail, dispatch }) => {
  useEffect(() => {
    if (consumableDetail.currentId) {
      dispatch({
        type: 'consumableDetail/query',
        payload: {
          id: consumableDetail.currentId,
        },
      })
    }
  }, [])

  return (
    <CardContainer
      hideHeader
      style={{
        marginLeft: 5,
        marginRight: 5,
      }}
    >
      <GridContainer gutter={0}>
        <GridItem xs={12} md={5}>
          <GridContainer>
            <GridItem xs={12}>
              <FastField
                name='code'
                render={(args) => {
                  return <TextField label='Consumable Code' {...args} />
                }}
              />
            </GridItem>
            <GridItem xs={12}>
              <FastField
                name='displayValue'
                render={(args) => {
                  return <TextField label='Consumable Name' {...args} />
                }}
              />
            </GridItem>
            <GridItem xs={12}>
              <FastField
                name='description'
                render={(args) => {
                  return <TextField label='Description' {...args} />
                }}
              />
            </GridItem>
            <GridItem xs={12}>
              <FastField
                name='remark'
                render={(args) => {
                  return (
                    <TextField label='Remark' multiline rowsMax='5' {...args} />
                  )
                }}
              />
            </GridItem>
            <GridItem xs={12}>
              <FastField
                name='isEnableRetail'
                render={(args) => {
                  return (
                    <Checkbox
                      prefix='Enable Retail'
                      isSwitch
                      colon={false}
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
                name='supplier'
                render={(args) => (
                  <CodeSelect
                    label='Supplier'
                    code='Supplier'
                    max={10}
                    {...args}
                  />
                )}
              />
            </GridItem>
            <GridItem xs={12}>
              <FastField
                name='baseUOM'
                render={(args) => (
                  <CodeSelect
                    label='Base UOM'
                    code='BaseUOM'
                    max={10}
                    {...args}
                  />
                )}
              />
            </GridItem>
            <GridItem xs={12}>
              <FastField
                name='consumableCategory'
                render={(args) => (
                  <Select label='Consumable Category' options={[]} {...args} />
                )}
              />
            </GridItem>
            <GridItem xs={12}>
              <FastField
                name='revenueCategory'
                render={(args) => (
                  <Select label='Revenue Category' options={[]} {...args} />
                )}
              />
            </GridItem>
            <GridItem xs={12}>
              <FastField
                name='effectiveStartDate'
                render={(args) => (
                  <DatePicker label='Effective Start Date' {...args} />
                )}
              />
            </GridItem>
            <GridItem xs={12}>
              <FastField
                name='effectiveEndDate'
                render={(args) => (
                  <DatePicker label='Effective End Date' {...args} />
                )}
              />
            </GridItem>
          </GridContainer>
        </GridItem>
      </GridContainer>
      <Divider style={{ margin: '40px 0 20px 0' }} />
    </CardContainer>
  )
}
export default compose(
  withStyles(styles, { withTheme: true }),
  connect(({ consumableDetail }) => ({
    consumableDetail,
  })),
)(Detail)
