import React, { Component, PureComponent } from 'react'
import { connect } from 'dva'
import {
  Button,
  GridContainer,
  GridItem,
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
  SizeContainer,
  RichEditor,
  NumberInput,
  CustomInputWrapper,
  Popconfirm,
  FastField,
  withFormikExtend,
  CommonTableGrid,
} from '@/components'
import Yup from '@/utils/yup'
import { calculateAdjustAmount, getUniqueId } from '@/utils/utils'
import { orderTypes } from '@/utils/codes'

@connect(({ global, codetable }) => ({ global, codetable }))
class Package extends PureComponent {
  state = {
    packageItems: [],
  }

  constructor (props) {
    super(props)

    this.tableProps = {
      columns: [
        { name: 'type', title: 'Type' },
        { name: 'name', title: 'Name' },
        { name: 'quantity', title: 'Quantity' },
        { name: 'subTotal', title: 'Total' },
      ],
      columnExtensions: [
        {
          columnName: 'type',
          type: 'select',
          options: orderTypes,
        },
        {
          columnName: 'quantity',
          type: 'number',
        },
        {
          columnName: 'subTotal',
          type: 'currency',
        },
      ],
    }
  }

  changePackage = (v, op) => {
    console.log(v, op)
    let rows = []
    rows = rows.concat(
      op.medicationPackageItem.map((o) => {
        return {
          ...o,
          name: o.medicationName,
          uid: getUniqueId(),
          type: '1',
        }
      }),
    )
    rows = rows.concat(
      op.vaccinationPackageItem.map((o) => {
        return {
          ...o,
          name: o.vaccinationName,
          uid: getUniqueId(),
          type: '2',
        }
      }),
    )
    rows = rows.concat(
      op.servicePackageItem.map((o) => {
        return {
          ...o,
          name: o.serviceName,
          uid: getUniqueId(),
          type: '3',
        }
      }),
    )
    rows = rows.concat(
      op.consumablePackageItem.map((o) => {
        return {
          ...o,
          name: o.consumableName,
          uid: getUniqueId(),
          type: '4',
        }
      }),
    )
    this.setState({
      packageItems: rows,
    })
  }

  render () {
    const {
      theme,
      classes,
      values,
      footer,
      handleSubmit,
      setFieldValue,
      codetable,
    } = this.props
    console.log(
      'Package',
      theme,
      this.props,
      codetable.inventorypackage,
      this.state,
    )
    return (
      <div>
        <GridContainer>
          <GridItem xs={12}>
            <CodeSelect
              label='Package Name'
              labelField='displayValue'
              code='inventorypackage'
              onChange={this.changePackage}
            />
          </GridItem>
          <GridItem xs={12}>
            <CommonTableGrid
              style={{
                margin: `${theme.spacing(1)}px 0`,
              }}
              rows={this.state.packageItems}
              {...this.tableProps}
            />
          </GridItem>
        </GridContainer>
        {footer({
          onSave: handleSubmit,
          showAdjustment: false,
        })}
      </div>
    )
  }
}
export default Package
