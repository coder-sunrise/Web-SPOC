import React, { Component } from 'react'
import { FastField } from 'formik'
import { Paper } from '@material-ui/core'
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
  notification,
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
          setFieldValue(`contact.contactAddress[${i}].line1`, BLK_NO)
          setFieldValue(`contact.contactAddress[${i}].line3`, BUILDING)
          setFieldValue(`contact.contactAddress[${i}].line4`, ROAD_NAME)
        } else {
          notification.warn('Not able to find this postcode')
        }
      })
      .catch((error) => {
        notification.error('Not able to get this address')
      })
  }

  deleteAddress = (i) => () => {
    confirm({
      title: 'Do you want to remove this address?',
      onOk: () => {
        const { contact = {} } = this.props.values
        const { contactAddress } = contact
        const deleted = contactAddress.filter((o, idx) => idx === i)[0]
        deleted.isDeleted = true
        this.props.setFieldValue('contact', contact)
        // this.props.arrayHelpers.remove(i)
      },
    })
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
          <GridItem md={1}>
            <Button
              color='transparent'
              aria-label='Delete'
              justIcon
              onClick={this.deleteAddress(addressIndex)}
            >
              <Close style={{ width: 16, height: 16 }} />
            </Button>
          </GridItem>
          <GridItem xs={12} md={4}>
            <FastField
              name={`contact.contactAddress[${addressIndex}].addressType`}
              render={(args) => (
                <RadioGroup
                  label=' '
                  simple
                  defaultValue='1'
                  options={[
                    {
                      value: '1',
                      label: 'Mailing Address',
                    },
                    {
                      value: '2',
                      label: 'Primary Address',
                    },
                  ]}
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
          </GridItem>
        </GridContainer>
        <GridContainer>
          <GridItem xs={12} md={5}>
            <FastField
              name={`contact.contactAddress[${addressIndex}].line1`}
              render={(args) => <TextField label='Block No.' {...args} />}
            />
          </GridItem>
          <GridItem xs={12} md={3}>
            <FastField
              name={`contact.contactAddress[${addressIndex}].line2`}
              render={(args) => <TextField label='Unit No.' {...args} />}
            />
          </GridItem>
          <GridItem xs={12} md={4}>
            <FastField
              name={`contact.contactAddress[${addressIndex}].line3`}
              render={(args) => <TextField label='Building Name' {...args} />}
            />
          </GridItem>
        </GridContainer>
        <GridContainer>
          <GridItem xs={12} md={8}>
            <FastField
              name={`contact.contactAddress[${addressIndex}].line4`}
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
