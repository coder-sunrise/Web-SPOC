import React, { Component } from 'react'
import _ from 'lodash'
import axios from 'axios'
import { connect } from 'dva'
import { Close, Search } from '@material-ui/icons'
import Yup from '@/utils/yup'
import {
  Button,
  GridContainer,
  GridItem,
  TextField,
  FastField,
  Field,
  CodeSelect,
  Popconfirm,
  notification,
  Checkbox,
  withFormikExtend,
  ProgressButton,
} from '@/components'

// TODO: To update api to our server api
// const API =
// 'https://developers.onemap.sg/commonapi/search?returnGeom=Y&getAddrDetails=Y&searchVal='
// 'https://semr2webdev2010.emr.com.sg/api/streetaddress?'

// @withFormikExtend({
//   handleSubmit: () => {},
//   displayName: 'streetAddressFilter',
// })
@connect(({ streetAddress }) => ({
  streetAddress,
}))
class Address extends Component {
  state = {
    postcode: '',
  }

  handleOnChange = (e) => {
    this.setState((prevState) => {
      return { postcode: e.target.value }
    })
  }

  handleAddressType = (e) => {
    console.log(e, 'address-handleAddressType')
  }

  handleGetAddress = () => {
    const {
      values,
      addressIndex,
      setFieldValue,
      setValues,
      handleSubmit,
    } = this.props
    const { postcode } = this.state
    postcode === ''
      ? (setFieldValue(`${addressIndex}postcode`, ''),
        setFieldValue(`${addressIndex}blockNo`, ''),
        setFieldValue(`${addressIndex}buildingName`, ''),
        setFieldValue(`${addressIndex}street`, ''))
      : this.props
          .dispatch({
            type: 'streetAddress/fetchAddress',
            payload: {
              postalCode: postcode,
            },
          })
          .then((o) => {
            const { data } = o
            const { postalCode, blkHseNo, building, street } = data[0]
            const { contactAddress } = values.contact
            console.log('contactAddress', contactAddress)
            const contactAddressArray = [
              {
                ...contactAddress[addressIndex],
                postalCode,
                blockNo: blkHseNo,
                buildingName: building,
                street,
              },
            ]
            console.log('contactAddressArray', contactAddressArray)
            // contactAddressArray[addressIndex] = [
            //   {
            //     ...contactAddressArray[addressIndex],
            //     postalCode,
            //     blockNo: blkHseNo,
            //     buildingName: building,
            //     street,
            //   },
            // ]
            console.log('apple', values)
            setValues({
              ...values,
              contact: {
                ...values.contact,
                contactAddress: contactAddressArray,
              },
            })
            setFieldValue(`${addressIndex}blockNo`, blkHseNo)
            setFieldValue(`${addressIndex}buildingName`, building)
            setFieldValue(`${addressIndex}street`, street)
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
      <ProgressButton
        color='primary'
        icon={null}
        onClick={this.handleGetAddress}
      >
        <Search />
        Get Address
      </ProgressButton>
    )
    // console.log({ values, props: this.props, addressIndex })
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
                render={(args) => (
                  <TextField
                    label='Postal Code'
                    onChange={this.handleOnChange}
                    {...args}
                  />
                )}
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
                name={`${addressIndex}postcode`}
                render={(args) => (
                  <TextField
                    label='Postal Code'
                    onChange={this.handleOnChange}
                    {...args}
                  />
                )}
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
