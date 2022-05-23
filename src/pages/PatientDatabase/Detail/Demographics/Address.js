import React, { Component, Fragment } from 'react'
import _ from 'lodash'
import axios from 'axios'
import { connect } from 'dva'
import Close from '@material-ui/icons/Close'
import Search from '@material-ui/icons/Search'

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
  AutoSuggestion,
  Tooltip,
} from '@/components'
import { getUniqueId } from '@/utils/utils'
import { queryList } from '@/services/common'
import { Divider } from '@material-ui/core'
import { number } from 'prop-types'

@connect(({ streetAddress, codetable }) => ({
  streetAddress,
  codetable,
}))
class Address extends Component {
  state = {
    postcode: '',
  }

  handleAddressType = e => {}

  deleteAddress = id => () => {
    const contact = _.cloneDeep(this.props.values.contact)
    const { contactAddress } = contact

    const deleted = contactAddress.find((o, idx) => o.id === id)
    if (deleted) {
      deleted.street = !null
      deleted.countryFK = !null
      deleted.isDeleted = true
      this.props.setFieldValue('contact', contact)
    }
  }

  getPrefix = () => {
    const { addressIndex, classes, theme, values, style, propName } = this.props

    let prefix = propName
    if (addressIndex >= 0) {
      prefix += `[${addressIndex}]`
    }
    prefix += '.'
    return prefix
  }

  renderOption = option => {
    const textStyle = {
      overflow: 'hidden',
      whiteSpace: 'nowrap',
      textOverflow: 'ellipsis',
    }
    return (
      <div>
        <GridContainer>
          <GridItem xs={3} md={3}>
            <Tooltip title={`Postal Code: ${option.postalCode || ''}`}>
              <div style={textStyle}>
                <span style={{ fontWeight: 500 }}>Postal Code: </span>
                {option.postalCode || '-'}
              </div>
            </Tooltip>
          </GridItem>
          <GridItem xs={2} md={2}>
            <Tooltip title={`Block No.: ${option.blkHseNo || ''}`}>
              <div style={textStyle}>
                <span style={{ fontWeight: 500 }}>Block No.: </span>{' '}
                {option.blkHseNo || '-'}
              </div>
            </Tooltip>
          </GridItem>
          <GridItem xs={3} md={3}>
            <Tooltip title={`Street: ${option.street || ''}`}>
              <div style={textStyle}>
                <span style={{ fontWeight: 500 }}>Street: </span>
                {option.street || '-'}{' '}
              </div>
            </Tooltip>
          </GridItem>
          <GridItem xs={4} md={4}>
            <Tooltip title={`Building Name: ${option.building || ''}`}>
              <div style={textStyle}>
                <span style={{ fontWeight: 500 }}>Building Name: </span>
                {option.building || '-'}{' '}
              </div>
            </Tooltip>
          </GridItem>
        </GridContainer>
        <Divider />
      </div>
    )
  }

  searchAddress = async (value, type) => {
    const response = await queryList('/api/streetAddress', {
      apiCriteria: {
        searchValue: value,
      },
      pagesize: 50,
    })
    if (response && response.data) {
      return response.data.data || []
    }
    return []
  }

  render() {
    const searchBtnUid = getUniqueId()
    const {
      addressIndex,
      classes,
      theme,
      values,
      style,
      propName,
      hideCheckBox,
    } = this.props
    const v = Object.byString(values, propName)
    let addresses = v
    let isArray = false
    if (Array.isArray(v)) {
      isArray = true
    }
    let prefix = this.getPrefix()
    if (Object.byString(values, `${prefix}isDeleted`)) return null

    const onOptionSelected = (value, option) => {
      const { codetable, setFieldValue } = this.props
      const { ctcountry } = codetable
      const country = ctcountry.find(c => c.code === 'SG')
      const { postalCode, blkHseNo, building, street } = option
      setFieldValue(`${prefix}postcode`, postalCode)
      setFieldValue(`${prefix}blockNo`, blkHseNo)
      setFieldValue(`${prefix}buildingName`, building)
      setFieldValue(`${prefix}street`, street)
      setFieldValue(`${prefix}countryFK`, country.id)
    }

    return (
      <div style={style}>
        {isArray && (
          <GridContainer>
            {hideCheckBox ? (
              <GridItem xs={6} md={5} />
            ) : (
              <Fragment>
                <GridItem xs={6} md={2}>
                  <Field
                    name={`${prefix}isMailing`}
                    render={args => (
                      <Checkbox
                        label='Mailing Address'
                        inputLabel=' '
                        disabled={
                          !!addresses.find(o => o.isMailing && !o.isDeleted) &&
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
                    render={args => (
                      <Checkbox
                        label='Primary Address'
                        inputLabel=' '
                        disabled={
                          !!addresses.find(o => o.isPrimary && !o.isDeleted) &&
                          !addresses[addressIndex].isPrimary
                        }
                        {...args}
                      />
                    )}
                  />
                </GridItem>
              </Fragment>
            )}

            <GridItem xs={6} md={5}></GridItem>
            <GridItem
              xs={6}
              md={2}
              align='right'
              style={{ lineHeight: theme.props.rowHeight }}
            >
              {addresses.filter(o => !o.isDeleted).length > 1 && (
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
            <GridItem xs={6} md={10} />
          </GridContainer>
        )}
        <GridContainer>
          <GridItem xs={12} md={4}>
            <FastField
              name={`${prefix}postcode`}
              render={args => {
                return (
                  <AutoSuggestion
                    label='Postal Code'
                    onOptionSelected={onOptionSelected}
                    renderOption={this.renderOption}
                    valuePath='postalCode'
                    query={async value => {
                      return await this.searchAddress(value, 'PostalCode')
                    }}
                    {...args}
                  />
                )
              }}
            />
          </GridItem>
          <GridItem xs={12} md={4}>
            <FastField
              name={`${prefix}blockNo`}
              render={args => <TextField label='Block No.' {...args} />}
            />
          </GridItem>
          <GridItem xs={12} md={4}>
            <FastField
              name={`${prefix}unitNo`}
              render={args => <TextField label='Unit No.' {...args} />}
            />
          </GridItem>
        </GridContainer>
        <GridContainer>
          <GridItem xs={12} md={4}>
            <FastField
              name={`${prefix}buildingName`}
              render={args => <TextField label='Building Name' {...args} />}
            />
          </GridItem>
          <GridItem xs={12} md={4}>
            <FastField
              name={`${prefix}street`}
              render={args => <TextField label='Street' {...args} />}
            />
          </GridItem>
          <GridItem xs={12} md={4}>
            <FastField
              name={`${prefix}countryFK`}
              render={args => (
                <CodeSelect
                  label='Country'
                  code='ctCountry'
                  max={10}
                  autocomplete='off'
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
