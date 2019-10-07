import React from 'react'
import {
  FastField,
  GridContainer,
  GridItem,
  TextField,
  CodeSelect,
  NumberInput,
} from '@/components'

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
                <TextField label='Address' multiline autoFocused {...args} />
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
                <NumberInput label='Contact Number' {...args} />
              )}
            />
          </GridItem>
          <GridItem md={6}>
            {type === 'copayer' ? (
              []
            ) : (
              <FastField
                name='contact.officeContactNumber.number'
                render={(args) => <TextField label='Office Number' {...args} />}
              />
            )}
          </GridItem>

          <GridItem md={6}>
            {type === 'copayer' ? (
              []
            ) : (
              <FastField
                name='contact.faxContactNumber.number'
                render={(args) => <TextField label='Fax Number' {...args} />}
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
