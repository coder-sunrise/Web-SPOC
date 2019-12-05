import React from 'react'
import {
  FastField,
  GridContainer,
  GridItem,
  TextField,
  CodeSelect,
  NumberInput,
} from '@/components'
import { MobileNumberInput } from '@/components/_medisys'

const Contact = (props) => {
  const { theme, type } = props
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
                <TextField label='Address' multiline autoFocus {...args} />
              )}
            />
          </GridItem>
          <GridItem md={6}>
            <FastField
              name='contact.contactAddress[0].postcode'
              render={(args) => <TextField label='Postal Code' {...args} />}
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

          <GridItem md={6}>
            {type === 'copayer' ? (
              []
            ) : (
              <FastField
                name='contactPerson'
                render={(args) => (
                  <TextField label='Contact Person' {...args} />
                )}
              />
            )}
          </GridItem>

          <GridItem md={type === 'copayer' ? 12 : 6}>
            <FastField
              name='contact.mobileContactNumber.number'
              render={(args) => (
                // <NumberInput
                //   label='Contact Number'
                //   maxLength='15'
                //   min='0'
                //   max='999999999999999'
                //   precision={0}
                //   {...args}
                // />
                <MobileNumberInput {...args} label='Contact Number' />
              )}
            />
          </GridItem>
          <GridItem md={6}>
            {type === 'copayer' ? (
              []
            ) : (
              <FastField
                name='contact.officeContactNumber.number'
                render={(args) => (
                  // <NumberInput
                  //   label='Office Number'
                  //   maxLength='15'
                  //   min='0'
                  //   max='999999999999999'
                  //   precision={0}
                  //   {...args}
                  // />
                  <MobileNumberInput {...args} label='Office Number' />
                )}
              />
            )}
          </GridItem>

          <GridItem md={6}>
            {type === 'copayer' ? (
              []
            ) : (
              <FastField
                name='contact.faxContactNumber.number'
                render={(args) => (
                  // <NumberInput
                  //   label='Fax Number'
                  //   maxLength='15'
                  //   min='0'
                  //   max='999999999999999'
                  //   precision={0}
                  //   {...args}
                  // />
                  <MobileNumberInput {...args} label='Fax Number' />
                )}
              />
            )}
          </GridItem>

          {type === 'copayer' ? (
            <GridContainer>
              <GridItem md={6}>
                <FastField
                  name='contact.contactEmailAddress.emailAddress'
                  render={(args) => <TextField label='Email' {...args} />}
                />
              </GridItem>
              <GridItem md={6}>
                <FastField
                  name='contact.contactWebsite.website'
                  render={(args) => <TextField label='URL' {...args} />}
                />
              </GridItem>
            </GridContainer>
          ) : (
            <GridContainer />
          )}
        </GridContainer>
      </div>
    </React.Fragment>
  )
}

export default Contact
