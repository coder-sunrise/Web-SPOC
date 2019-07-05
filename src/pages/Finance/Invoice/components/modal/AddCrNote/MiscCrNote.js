import React from 'react'
// formik
import { FastField } from 'formik'
// material ui
import { withStyles } from '@material-ui/core'
// common components
import {
  Button,
  CardContainer,
  GridContainer,
  GridItem,
  NumberInput,
  SizeContainer,
  TextField,
} from '@/components'
// styles
import styles from './styles'

const MiscCrNote = ({ classes }) => (
  <div className={classes.misc}>
    <h4 className={classes.miscTitle}>Add Misc. Credit Note</h4>
    <CardContainer size='sm' hideHeader>
      <SizeContainer size='sm'>
        <React.Fragment>
          <GridContainer>
            <GridItem md={8}>
              <GridContainer direction='column'>
                <GridItem md={10}>
                  <TextField label='Type' defaultValue='MISC' disabled />
                </GridItem>
                <GridItem md={10}>
                  <FastField
                    name='description'
                    render={(args) => (
                      <TextField {...args} label='Description: ' />
                    )}
                  />
                </GridItem>
                <GridItem className={classes.miscActions}>
                  <Button size='sm' color='primary' disabled>
                    Add
                  </Button>
                  <Button size='sm' color='danger' disabled>
                    Reset
                  </Button>
                </GridItem>
              </GridContainer>
            </GridItem>
            <GridItem md={4}>
              <GridContainer direction='column'>
                <GridItem>
                  <FastField
                    name='unitPrice'
                    render={(args) => (
                      <NumberInput {...args} label='Unit Price: ' currency />
                    )}
                  />
                </GridItem>
                <GridItem>
                  <FastField
                    name='quantiy'
                    render={(args) => (
                      <NumberInput {...args} label='Quantity:' />
                    )}
                  />
                </GridItem>

                <GridItem>
                  <FastField
                    name='total'
                    render={(args) => (
                      <NumberInput {...args} label='Total: ' currency />
                    )}
                  />
                </GridItem>
              </GridContainer>
            </GridItem>
          </GridContainer>
        </React.Fragment>
      </SizeContainer>
    </CardContainer>
  </div>
)

export default withStyles(styles, { name: 'MiscCrNote' })(MiscCrNote)
