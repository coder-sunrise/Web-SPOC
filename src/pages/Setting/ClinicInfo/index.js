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
} from '@/components'

import Address from '@/pages/PatientDatabase/Detail/Demographics/Address'

const styles = (theme) => ({
  ...basicStyle(theme),
})

@connect(({ settingMasterClinicInfo }) => ({
  settingMasterClinicInfo,
}))
@withFormik({
  mapPropsToValues: ({ settingMasterClinicInfo }) => {
    console.log(settingMasterClinicInfo)
    return settingMasterClinicInfo.entity
      ? settingMasterClinicInfo.entity
      : settingMasterClinicInfo.default
  },
  validationSchema: Yup.object().shape({
    name: Yup.string().required(),
    address: Yup.object().shape({
      postcode: Yup.number().required(),
      countryFK: Yup.string().required(),
    }),
  }),

  handleSubmit: () => {},
  displayName: 'ClinicInfo',
})
class ClinicInfo extends PureComponent {
  state = {}

  render () {
    const { classes, clinicInfo, dispatch, theme, ...restProps } = this.props

    return (
      <CardContainer hideHeader>
        <GridContainer>
          <GridItem md={6}>
            <FastField
              name='name'
              render={(args) => <TextField label='Clinic Name' {...args} />}
            />
          </GridItem>
          <GridItem md={3}>
            <FastField
              name='hciCode'
              render={(args) => (
                <TextField label='Clinic ID (HCI Code)' disabled {...args} />
              )}
            />
          </GridItem>
          <GridItem md={3}>
            <FastField
              name='hospitalCode'
              render={(args) => (
                <TextField label='Hospital Code' disabled {...args} />
              )}
            />
          </GridItem>
        </GridContainer>
        <GridContainer>
          <GridItem md={6}>
            <FastField
              name='primaryClinician'
              render={(args) => (
                <Select
                  label='Primary Clinician'
                  options={[
                    { value: 1, name: 'Dr Levine Choong' },
                  ]}
                  {...args}
                />
              )}
            />
          </GridItem>
          <GridItem md={3}>
            <FastField
              name='primaryClinicianMCR'
              render={(args) => (
                <TextField label='Primary Clinician MCR Number' {...args} />
              )}
            />
          </GridItem>
        </GridContainer>
        <div
          style={{
            marginLeft: theme.spacing(1),
            marginRight: theme.spacing(1),
            marginTop: theme.spacing(3),
          }}
        >
          <h5>Address</h5>
          <Divider />
        </div>

        <Address propName='address' {...this.props} />
        <div className={classes.actionBtn}>
          <Button
            color='danger'
            onClick={() => {
              this.props.history.push('/setting')
            }}
          >
            Cancel
          </Button>

          <Button
            color='primary'
            onClick={() => {
              this.props.handleSubmit
            }}
          >
            Save
          </Button>
        </div>
      </CardContainer>
    )
  }
}

export default withStyles(styles, { withTheme: true })(ClinicInfo)
