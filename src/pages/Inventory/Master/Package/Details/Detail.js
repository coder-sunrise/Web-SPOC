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

const Detail = (props) => {
  const { packDetail, dispatch } = props
  const submitKey = `packDetail/submit`
  useEffect(() => {
    if (packDetail.currentId) {
      dispatch({
        type: 'packDetail/query',
        payload: {
          id: packDetail.currentId,
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
                  return <TextField label='Package Code' {...args} />
                }}
              />
            </GridItem>
            <GridItem xs={12}>
              <FastField
                name='displayValue'
                render={(args) => {
                  return <TextField label='Package Name' {...args} />
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
                name='isOrderable '
                render={(args) => {
                  return (
                    <Checkbox
                      prefix='Orderable'
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
      <div style={{ textAlign: 'center' }}>
        <Button
          color='danger'
          onClick={() => {
            props.history.push('/inventory/master?t=1')
          }}
        >
          Cancel
        </Button>
        <ProgressButton submitKey={submitKey} onClick={props.handleSubmit} />
      </div>
    </CardContainer>
  )
}
export default compose(
  withStyles(styles, { withTheme: true }),
  connect(({ packDetail }) => ({
    packDetail,
  })),
  withFormik({
    enableReinitialize: true,
    mapPropsToValues: ({ packDetail }) => {
      return packDetail.entity ? packDetail.entity : {}
    },
    validationSchema: Yup.object().shape({
      code: Yup.string().required(),
      displayValue: Yup.string().required(),
      effectiveStartDate: Yup.string().required(),
      effectiveEndDate: Yup.string().required(),
    }),
    handleSubmit: (values, { props }) => {
      const { dispatch } = props
      // dispatch({
      //   type: `${modelType}/submit`,
      //   payload: test,
      // }).then((r) => {
      //   if (r.message === 'Ok') {
      //     notification.success({
      //       message: 'Done',
      //     })
      //   }
      // })
    },
    displayName: 'InventoryPackageDetail',
  }),
)(Detail)
