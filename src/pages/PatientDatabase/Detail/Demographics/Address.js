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

  handleGetAddress = (i) => () => {
    const { values, setFieldValue } = this.props
    const { postcode } = values.contact.contactAddress[i]
    if (postcode === '') return

    axios
      .get(`${API}${postcode}`)
      .then((result) => {
        // console.log(result)
        if (result.data.found > 0) {
          const { BLK_NO, BUILDING, ROAD_NAME, POSTAL } = result.data.results[0]

          setFieldValue(`contact.contactAddress[${i}].postcode`, POSTAL)
          setFieldValue(`contact.contactAddress[${i}].blockNo`, BLK_NO)
          setFieldValue(`contact.contactAddress[${i}].buildingName`, BUILDING)
          setFieldValue(`contact.contactAddress[${i}].street`, ROAD_NAME)
        } else {
          notification.warn('Not able to find this postcode')
        }
      })
      .catch((error) => {
        notification.error('Not able to get this address')
      })
  }

  deleteAddress = (i) => () => {
    const contact = _.cloneDeep(this.props.values.contact)
    const { contactAddress } = contact
    const deleted = contactAddress.filter((o, idx) => idx === i)[0]
    deleted.isDeleted = true
    this.props.setFieldValue('contact', contact)
  }

  render () {
    const {
      addressIndex,
      defaultValue,
      classes,
      theme,
      values,
      setFieldValue,
    } = this.props
    // console.log(values, addressIndex)
    const addresses = values.contact.contactAddress.filter((o) => !o.isDeleted)

    return (
      <div
        style={{
          padding: theme.spacing.unit,
          marginTop: theme.spacing.unit,
          marginBottom: theme.spacing.unit,
        }}
      >
        <GridContainer>
          <GridItem xs={6} md={2}>
            <Field
              name={`contact.contactAddress[${addressIndex}].isMailing`}
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
              name={`contact.contactAddress[${addressIndex}].isPrimary`}
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
              name={`contact.contactAddress[${addressIndex}].postcode`}
              render={(args) => <TextField label='Postal Code' {...args} />}
            />
          </GridItem>
          <GridItem xs={6} md={2} className={classes.btnContainer}>
            <Button
              // className={classes.modalCloseButton}
              key='search'
              color='info'
              aria-label='Get Address'
              size='sm'
              onClick={this.handleGetAddress(addressIndex)}
              className={classes.btnContainer}
              // style={{ marginTop: 20 }}
            >
              <Search />
              Get Address
            </Button>
            {addresses.length > 1 && (
              <Popconfirm
                title='Do you want to remove this address?'
                onConfirm={this.deleteAddress(addressIndex)}
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
        <GridContainer>
          <GridItem xs={12} md={5}>
            <FastField
              name={`contact.contactAddress[${addressIndex}].blockNo`}
              render={(args) => <TextField label='Block No.' {...args} />}
            />
          </GridItem>
          <GridItem xs={12} md={3}>
            <FastField
              name={`contact.contactAddress[${addressIndex}].unitNo`}
              render={(args) => <TextField label='Unit No.' {...args} />}
            />
          </GridItem>
          <GridItem xs={12} md={4}>
            <FastField
              name={`contact.contactAddress[${addressIndex}].buildingName`}
              render={(args) => <TextField label='Building Name' {...args} />}
            />
          </GridItem>
        </GridContainer>
        <GridContainer>
          <GridItem xs={12} md={8}>
            <FastField
              name={`contact.contactAddress[${addressIndex}].street`}
              render={(args) => (
                <TextField multiline rowsMax='2' label='Street' {...args} />
              )}
            />
          </GridItem>
          {/* <GridItem xs={12} md={2} /> */}
          <GridItem xs={12} md={4}>
            <FastField
              name={`contact.contactAddress[${addressIndex}].countryFK`}
              render={(args) => (
                <CodeSelect label='Country' code='Country' max={10} {...args} />
              )}
            />
          </GridItem>
        </GridContainer>
      </div>
    )
  }
}

export default Address
