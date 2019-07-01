import React from 'react'
import classnames from 'classnames'
// material ui
import { withStyles } from '@material-ui/core'
// custom component
import {
  Button,
  CardContainer,
  GridContainer,
  GridItem,
  Danger,
} from '@/components'
import style from './style'

const ConflictBanner = ({ classes, hasConflict }) =>
  hasConflict ? (
    <CardContainer hideHeader size='sm'>
      <GridContainer>
        <GridItem xs md={8}>
          <Danger>
            <h4 className={classnames(classes.conflictContent)}>
              Appointment has conflict in schedule
            </h4>
          </Danger>
        </GridItem>
        <GridItem xs md={4} container justify='flex-end'>
          <Button color='primary' disabled>
            Validate
          </Button>
        </GridItem>
      </GridContainer>
    </CardContainer>
  ) : null

export default withStyles(style, { name: 'ConflictBanner' })(ConflictBanner)
