import React, { Component, PureComponent, useState } from 'react'
import { withFormik, Formik, Form, Field, FastField, FieldArray } from 'formik'
import {
  Button,
  CommonHeader,
  CommonModal,
  NavPills,
  PictureUpload,
  GridContainer,
  GridItem,
  Card,
  CardAvatar,
  CardBody,
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
  Popover,
} from '@/components'
import { withStyles, Divider, Paper } from '@material-ui/core'
import DeleteIcon from '@material-ui/icons/Delete'

export default ({ theme, index, arrayHelpers, ...props }) => {
  const [
    show,
    setShow,
  ] = useState(false)
  return (
    <React.Fragment>
      <GridContainer style={{ marginTop: theme.spacing(1) }}>
        <GridItem xs={12}>
          <FastField
            name={`diagnosises[${index}].diagnosis`}
            render={(args) => {
              return (
                <CodeSelect
                  label='Diagnosis'
                  code='PatientAccountNoType'
                  {...args}
                />
              )
            }}
          />
        </GridItem>
        <GridItem xs={12}>
          <FastField
            name={`diagnosises[${index}].complication`}
            render={(args) => {
              return (
                <CodeSelect
                  label='Complication'
                  mode='multiple'
                  code='PatientAccountNoType'
                  {...args}
                />
              )
            }}
          />
        </GridItem>
        <GridItem xs={6}>
          <FastField
            name={`diagnosises[${index}].orderDate`}
            render={(args) => {
              return <DatePicker label='Order Date' {...args} />
            }}
          />
        </GridItem>
        <GridItem xs={6}>
          <FastField
            name={`diagnosises[${index}].isPersist`}
            render={(args) => {
              return <Checkbox inputLabel='Persist' {...args} />
            }}
          />
        </GridItem>
        <GridItem xs={11}>
          <FastField
            name={`diagnosises[${index}].remarks`}
            render={(args) => {
              return (
                <TextField label='Remarks' multiline rowsMax={6} {...args} />
              )
            }}
          />
        </GridItem>
        <GridItem xs={1} style={{ position: 'relative' }}>
          <Popover
            content={
              <div>
                <p style={{ paddingLeft: 20, paddingBottom: theme.spacing(2) }}>
                  Confirm to remove a persist diagnosis?
                </p>
                <Button
                  onClick={() => {
                    setShow(false)
                  }}
                  variant='outlined'
                >
                  Cancel
                </Button>
                <Button
                  color='primary'
                  onClick={() => {
                    arrayHelpers.remove(index)
                    setShow(false)
                  }}
                >
                  Remove Current Visit
                </Button>
                <Button
                  color='primary'
                  onClick={() => {
                    arrayHelpers.remove(index)
                  }}
                >
                  Remove Permanently
                </Button>
              </div>
            }
            title='Delete Diagnosis'
            trigger='click'
            visible={show}
            onVisibleChange={() => {
              setShow(!show)
            }}
          >
            {index > 0 && (
              <Button
                style={{ position: 'absolute', bottom: theme.spacing(1) }}
                justIcon
                color='danger'
                size='sm'
              >
                <DeleteIcon />
              </Button>
            )}
          </Popover>
        </GridItem>
      </GridContainer>
      <Divider />
    </React.Fragment>
  )
}
