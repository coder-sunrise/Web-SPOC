import React, { PureComponent } from 'react'
import { withStyles } from '@material-ui/core/styles'
import { downloadTeamviewer } from '../download'

import {
    GridContainer,
    CardContainer,
    GridItem,
    Button,
} from '@/components'
 
class Teamviewer extends PureComponent {
    render () {
        return (
          <CardContainer hideHeader>
            <GridContainer>
              <GridItem xs={12}
                md={12}
                style={{ marginTop: 20, fontSize: 20 }}
              >
                <span>Teamviewer</span>
              </GridItem>
              <GridItem xs={12}
                md={12}
                style={{ marginTop: 20 }}
              >
                <span>Get remote supports from Medisys.</span>
              </GridItem>
              <GridItem xs={12}
                md={12}
                style={{ marginTop: 20 }}
              >
                <Button
                  color='primary'
                  onClick={() => {
                                downloadTeamviewer('Teamviewer.exe')
                            }}
                  variant='outlined'
                >
                  <span>Download</span>
                </Button>
              </GridItem>
            </GridContainer>
          </CardContainer>
        )
    }
}
export default withStyles({}, { withTheme: true })(Teamviewer)
