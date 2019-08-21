import React from 'react'
import { withStyles, Divider } from '@material-ui/core'
import {
  withFormikExtend,
  FastField,
  GridContainer,
  GridItem,
  TextField,
  Select,
  CodeSelect,
} from '@/components'

const Contact = (props) => {
  const { theme, type } = props
  console.log(props.values)
  return (
    <React.Fragment>
      <div
        style={{
          marginLeft: theme.spacing(1),
          marginRight: theme.spacing(1),
          marginTop: theme.spacing(3),
        }}
      >
        <h5>Address</h5>
        <Divider />
      </div>
      <div style={{ margin: theme.spacing(1) }}>
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
              render={(args) => <TextField label='Contact Number' {...args} />}
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
