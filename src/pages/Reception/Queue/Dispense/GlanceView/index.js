import React, { PureComponent } from 'react'

// material ui
import { Paper } from '@material-ui/core'
// custom components
import { GridContainer, GridItem } from '@/components'

class GlanceView extends PureComponent {
  render () {
    return (
      <GridContainer>
        <GridItem xs md={4}>
          <Paper elevation={4}>
            <div>Patient History</div>
          </Paper>
        </GridItem>
        <GridItem xs md={8}>
          <Paper elevation={4}>
            <div>CDD History</div>
          </Paper>
        </GridItem>
      </GridContainer>
    )
  }
}

export default GlanceView
