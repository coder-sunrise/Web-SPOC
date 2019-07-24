import React, { Component } from 'react'
import { FastField, Field } from 'formik'
import { Paper } from '@material-ui/core'
import _ from 'lodash'
import axios from 'axios'
import { Save, Close, Clear, FilterList, Search, Add } from '@material-ui/icons'

import {
  Button,
  GridContainer,
  GridItem,
  TextField,
  Select,
  RadioGroup,
  CodeSelect,
  confirm,
  Popconfirm,
  notification,
  Checkbox,
} from '@/components'

import { countries, addressTypes } from '@/utils/codes'
import { getUniqueGUID } from '@/utils/cdrss'

const API =
  'https://developers.onemap.sg/commonapi/search?returnGeom=Y&getAddrDetails=Y&searchVal='

class Address extends Component {
  handleAddressType = (e) => {
    console.log(e, 'address-handleAddressType')
  }

  handleGetAddress = (i, prefix, postcode) => () => {
    const { values, setFieldValue, propName } = this.props

    if (postcode === '') return

    axios
      .get(`${API}${postcode}`)
      .then((result) => {
        // console.log(result)
        if (result.data.found > 0) {
          const { BLK_NO, BUILDING, ROAD_NAME, POSTAL } = result.data.results[0]

          setFieldValue(`${prefix}postcode`, POSTAL)
          setFieldValue(`${prefix}blockNo`, BLK_NO)
          setFieldValue(`${prefix}buildingName`, BUILDING)
          setFieldValue(`${prefix}street`, ROAD_NAME)
        } else {
          notification.warn('Not able to find this postcode')
        }
      })
      .catch((error) => {
        notification.error('Not able to get this address')
      })
  }

  deleteAddress = (id) => () => {
    const contact = _.cloneDeep(this.props.values.contact)
    const { contactAddress } = contact
    // console.log(contactAddress, id)
    const deleted = contactAddress.find((o, idx) => o.id === id)
    deleted.isDeleted = true
    this.props.setFieldValue('contact', contact)
  }

  render () {
    const { addressIndex, classes, theme, values, style, propName } = this.props
    // console.log(values, propName)
    const v = Object.byString(values, propName)
    // console.log(v)
    let addresses = v
    let isArray = false
    if (Array.isArray(v)) {
      isArray = true
    }
    let prefix = propName
    if (addressIndex >= 0) {
      prefix += `[${addressIndex}]`
    }
    prefix += '.'
    if (Object.byString(values, `${prefix}isDeleted`)) return null
    const btnSearch = (
      <Button
        // className={classes.modalCloseButton}
        key='search'
        color='info'
        aria-label='Get Address'
        size='sm'
        onClick={this.handleGetAddress(
          addressIndex,
          prefix,
          Object.byString(values, `${prefix}postcode`),
        )}
        // style={{ marginTop: 20 }}
      >
        <Search />
        Get Address
      </Button>
    )
    return (
      <div style={style}>
        {isArray && (
          <GridContainer>
            <GridItem xs={6} md={2}>
              <Field
                name={`${prefix}isMailing`}
                render={(args) => (
                  <Checkbox
                    label='Mailing Address'
                    inputLabel=' '
                    disabled={
                      !!addresses.find((o) => o.isMailing) &&
                      !addresses[addressIndex].isMailing
                    }
                    {...args}
                  />
                )}
              />
            </GridItem>
            <GridItem xs={6} md={3}>
              <Field
                name={`${prefix}isPrimary`}
                render={(args) => (
                  <Checkbox
                    label='Primary Address'
                    inputLabel=' '
                    disabled={
                      !!addresses.find((o) => o.isPrimary) &&
                      !addresses[addressIndex].isPrimary
                    }
                    {...args}
                  />
                )}
              />
            </GridItem>
            <GridItem xs={6} md={5}>
              <FastField
                name={`${prefix}postcode`}
                render={(args) => <TextField label='Postal Code' {...args} />}
              />
            </GridItem>
            <GridItem
              xs={6}
              md={2}
              style={{ lineHeight: theme.props.rowHeight }}
            >
              {btnSearch}
              {addresses.filter((o) => !o.isDeleted).length > 1 && (
                <Popconfirm
                  title='Do you want to remove this address?'
                  onConfirm={this.deleteAddress(
                    Object.byString(values, `${prefix}id`),
                  )}
                >
                  <Button
                    color='danger'
                    size='sm'
                    aria-label='Delete'
                    justIcon
                    className={classes.btnContainer}
                  >
                    <Close />
                  </Button>
                </Popconfirm>
              )}
            </GridItem>
          </GridContainer>
        )}
        {!isArray && (
          <GridContainer>
            <GridItem xs={0} md={5} />
            <GridItem xs={6} md={5}>
              <FastField
                name={`${prefix}postcode`}
                render={(args) => <TextField label='Postal Code' {...args} />}
              />
            </GridItem>
            <GridItem
              xs={6}
              md={2}
              style={{ lineHeight: theme.props.rowHeight }}
            >
              {btnSearch}
            </GridItem>
          </GridContainer>
        )}
        <GridContainer>
          <GridItem xs={12} md={5}>
            <FastField
              name={`${prefix}blockNo`}
              render={(args) => <TextField label='Block No.' {...args} />}
            />
          </GridItem>
          <GridItem xs={12} md={3}>
            <FastField
              name={`${prefix}unitNo`}
              render={(args) => <TextField label='Unit No.' {...args} />}
            />
          </GridItem>
          <GridItem xs={12} md={4}>
            <FastField
              name={`${prefix}buildingName`}
              render={(args) => <TextField label='Building Name' {...args} />}
            />
          </GridItem>
        </GridContainer>
        <GridContainer>
          <GridItem xs={12} md={8}>
            <FastField
              name={`${prefix}street`}
              render={(args) => (
                <TextField multiline rowsMax='2' label='Street' {...args} />
              )}
            />
          </GridItem>
          {/* <GridItem xs={12} md={2} /> */}
          <GridItem xs={12} md={4}>
            <FastField
              name={`${prefix}countryFK`}
              render={(args) => (
                <CodeSelect
                  label='Country'
                  code='ctCountry'
                  max={10}
                  {...args}
                />
              )}
            />
          </GridItem>
        </GridContainer>
      </div>
    )
  }
}

export default Address
