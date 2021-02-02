import React, { Fragment } from 'react'
import {
  FastField,
  GridContainer,
  GridItem,
  TextField,
  CodeSelect,
} from '@/components'
import { MobileNumberInput } from '@/components/_medisys'

const Contact = (props) => {
  const { theme, type } = props
  const isCopayer = type === 'copayer'
  const isReferralSource = type === 'referralsource'
  const isReferralPerson = type === 'referralperson'
  return (
    <React.Fragment>
      <div
        style={{
          margin: theme.spacing(1),
        }}
      >
        <h4 style={{ fontWeight: 400, marginTop: 15 }}>
          <b>Contact</b>
        </h4>
      </div>
      <div
        style={{
          marginRight: theme.spacing(2),
          marginLeft: theme.spacing(2),
          marginBottom: theme.spacing(2),
        }}
      >
        <GridContainer>
          <GridItem md={12}>
            <FastField
              name='contact.contactAddress[0].street'
              render={(args) => (
                <TextField label='Address' multiline {...args} />
              )}
            />
          </GridItem>
          <GridItem md={6}>
            <FastField
              name='contact.contactAddress[0].postcode'
              render={(args) => (
                <TextField label='Postal Code' maxLength={10} {...args} />
              )}
            />
          </GridItem>
          <GridItem md={6}>
            <FastField
              name='contact.contactAddress[0].countryFK'
              render={(args) => (
                <CodeSelect label='Country' code='ctCountry' {...args} />
              )}
            />
          </GridItem>

          {!isReferralSource && !isReferralPerson && (
            <GridItem md={6}>
              <FastField
                name='contactPerson'
                render={(args) => (
                  <TextField label='Contact Person' {...args} />
                )}
              />
            </GridItem>
          )}

          {!isReferralSource &&
            <GridItem md={6}>
              <FastField
                name='contact.mobileContactNumber.number'
                render={(args) => (
                  <MobileNumberInput
                    {...args}
                    label={isReferralPerson ? 'Mobile Number' : 'Contact Number'}
                  />
                )}
              />
            </GridItem>
          }

          <GridItem md={6}>
            <FastField
              name='contact.officeContactNumber.number'
              render={(args) => (
                <MobileNumberInput {...args} label='Office Number' />
              )}
            />
          </GridItem>

          <GridItem md={6}>
            <FastField
              name='contact.faxContactNumber.number'
              render={(args) => (
                <MobileNumberInput {...args} label='Fax Number' />
              )}
            />
          </GridItem>

          {(isCopayer || isReferralSource || isReferralPerson) && (
            <Fragment>
              {(isCopayer || isReferralSource) && (
                <GridItem md={6}>
                  <FastField
                    name='contact.contactWebsite.website'
                    render={(args) => <TextField label='URL' {...args} />}
                  />
                </GridItem>
              )} 
              <GridItem md={6}>
                <FastField
                  name='contact.contactEmailAddress.emailAddress'
                  render={(args) => <TextField label='Email' {...args} />}
                />
              </GridItem>
            </Fragment>
          )}
        </GridContainer>
      </div>
    </React.Fragment>
  )
}

export default Contact
