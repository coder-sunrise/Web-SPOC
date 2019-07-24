import React, { PureComponent } from 'react'
import { FastField, withFormik } from 'formik'
import Yup from '@/utils/yup'
import _ from 'lodash'
import { Table } from '@devexpress/dx-react-grid-material-ui'

import { formatMessage, FormattedMessage } from 'umi/locale'
import { withStyles, Tooltip } from '@material-ui/core'
import Edit from '@material-ui/icons/Edit'
import Delete from '@material-ui/icons/Delete'
import {
  GridContainer,
  GridItem,
  Button,
  TextField,
  Checkbox,
  Select,
  ProgressButton,
  DateRangePicker,
  Switch,
  EditableTableGrid2,
  notification,
  SizeContainer,
} from '@/components'

const styles = (theme) => ({})

const itemSchema = Yup.object().shape({
  serviceCenter: Yup.string().required(),
  sellingPrice: Yup.number().required(),
})

@withFormik({
  mapPropsToValues: ({ settingClinicService }) =>
    settingClinicService.entity || settingClinicService.default,
  validationSchema: Yup.object().shape({
    code: Yup.string().required(),
    displayValue: Yup.string().required(),
    effectiveDates: Yup.array().of(Yup.date()).min(2).required(),
    items: Yup.array().compact((v) => v.isDeleted).of(itemSchema),
  }),
  handleSubmit: (values, { props }) => {
    props
      .dispatch({
        type: 'settingClinicService/upsert',
        payload: values,
      })
      .then((r) => {
        if (r && r.message === 'Ok') {
          // toast.success('test')
          notification.success({
            // duration:0,
            message: 'Done',
          })
          if (props.onConfirm) props.onConfirm()
        }
      })
  },
  displayName: 'ServiceModal',
})
class Detail extends PureComponent {
  state = {
    editingRowIds: [],
    rowChanges: {},
  }

  tableParas = {
    columns: [
      { name: 'serviceCenter', title: 'Service Center' },
      { name: 'sellingPrice', title: 'Selling Price/Unit' },
      { name: 'isDefault', title: 'Default' },
    ],
    columnExtensions: [
      { columnName: 'sellingPrice', type: 'number', currency: true },
      {
        columnName: 'isDefault',
        type: 'radio',
        checkedValue: true,
        uncheckedValue: false,
        onRadioChange: (row, e, checked) => {
          // console.log(this)
          if (checked) {
            const { values, setFieldValue, setFieldTouched } = this.props
            const items = _.cloneDeep(values.items)
            items.forEach((pec) => {
              pec.isDefault = false
            })
            const r = items.find((o) => o.id === row.id)
            if (r) {
              r.isDefault = true
            }
            setFieldValue('items', items)
            setFieldTouched('items', true)
          }
        },
      },
    ],
  }

  changeEditingRowIds = (editingRowIds) => {
    this.setState({ editingRowIds })
  }

  changeRowChanges = (rowChanges) => {
    this.setState({ rowChanges })
  }

  commitChanges = ({ rows, added, changed, deleted }) => {
    const { setFieldValue } = this.props
    setFieldValue('items', rows)
  }

  render () {
    const { props } = this
    const { classes, theme, footer, values } = props
    // console.log('detail', props)
    return (
      <React.Fragment>
        <SizeContainer size='sm'>
          <div style={{ margin: theme.spacing(1) }}>
            <GridContainer>
              <GridItem md={6}>
                <FastField
                  name='code'
                  render={(args) => <TextField label='Code' {...args} />}
                />
              </GridItem>
              <GridItem md={6}>
                <FastField
                  name='displayValue'
                  render={(args) => (
                    <TextField label='Display Value' {...args} />
                  )}
                />
              </GridItem>
              <GridItem md={10}>
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
              <GridItem md={2}>
                <FastField
                  name='autoOrder'
                  render={(args) => {
                    return <Switch label='Auto Order' {...args} />
                  }}
                />
              </GridItem>
              <GridItem md={6}>
                <FastField
                  name='serviceCategory'
                  render={(args) => {
                    return <Select label='Service Category' {...args} />
                  }}
                />
              </GridItem>
              <GridItem md={6}>
                <FastField
                  name='revenueCategory'
                  render={(args) => {
                    return <Select label='Revenue Category' {...args} />
                  }}
                />
              </GridItem>
              <GridItem md={12}>
                <FastField
                  name='description'
                  render={(args) => {
                    return (
                      <TextField
                        label='Description'
                        multiline
                        rowsMax={4}
                        {...args}
                      />
                    )
                  }}
                />
              </GridItem>
            </GridContainer>
            <EditableTableGrid2
              style={{ marginTop: theme.spacing(1) }}
              rows={values.items}
              onRowDoubleClick={this.onRowDoubleClick}
              FuncProps={{
                pagerConfig: {
                  containerExtraComponent: this.PagerContent,
                },
              }}
              EditingProps={{
                showAddCommand: true,
                editingRowIds: this.state.editingRowIds,
                rowChanges: this.state.rowChanges,
                onEditingRowIdsChange: this.changeEditingRowIds,
                onRowChangesChange: this.changeRowChanges,
                onCommitChanges: this.commitChanges,
              }}
              schema={itemSchema}
              {...this.tableParas}
            />
          </div>
        </SizeContainer>
        {footer &&
          footer({
            onConfirm: props.handleSubmit,
            confirmBtnText: 'Save',
            confirmProps: {
              disabled: false,
            },
          })}
      </React.Fragment>
    )
  }
}

export default Detail
