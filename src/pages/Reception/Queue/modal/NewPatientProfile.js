import React, { PureComponent } from 'react'

// umi
import { formatMessage, FormattedMessage } from 'umi/locale'

// formik
import { withFomik, FastField } from 'formik'

// material ui
import { Search, AddBox } from '@material-ui/icons'

// custom component
import { Button, GridContainer, GridItem, TextField } from '@/components'

class NewPatientProfile extends PureComponent {
  // TODO: new patient profile modal
  render () {
    return (
      <GridContainer>
        <GridItem xs md={8}>
          <FastField
            name='patient'
            render={(args) => (
              <TextField
                {...args}
                label={formatMessage({
                  id: 'reception.queue.newVisit.patient',
                })}
              />
            )}
          />
        </GridItem>
      </GridContainer>
    )
  }
}

export default NewPatientProfile
