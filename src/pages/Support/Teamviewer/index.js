import React, { PureComponent } from 'react'
import { withStyles } from '@material-ui/core/styles'
import { Chat, Computer } from '@material-ui/icons'
import { downloadTeamviewer } from '../download'
import logoPic from '@/assets/img/contacttop.jpg'

import { GridContainer, CardContainer, GridItem } from '@/components'

class Teamviewer extends PureComponent {
  render () {
    const imgStyle = {
      backgroundImage: `url(${logoPic})`,
      width: '100%',
      height: '300px',
      backgroundSize: 'cover',
      backgroundRepeat: 'no-repeat',
      backgroundPosition: '50% 50%',
      display: 'block',
      overflow: 'hidden',
    }
    const centerAlignStyle = {
      alignItems: 'center',
      textAlign: 'center',
      display: 'inline-block',
    }

    return (
      <GridContainer>
        <GridItem xs={12} md={12} style={{ padding: 0 }}>
          <React.Fragment>
            <div style={imgStyle} />
          </React.Fragment>
        </GridItem>
        <GridItem xs={4} md={4} />
        <GridItem
          xs={4}
          md={4}
          style={{
            alignItems: 'center',
            textAlign: 'center',
            margin: 20,
            marginBottom: 50,
          }}
        >
          <CardContainer
            hideHeader
            style={{
              width: 560,
              ...centerAlignStyle,
            }}
          >
            <GridContainer>
              <GridItem xs={12} md={12}>
                <Chat
                  style={{
                    width: 50,
                    height: 50,
                    fill: '#1296db',
                  }}
                />
              </GridItem>
              <GridItem xs={12} md={12}>
                <React.Fragment>
                  <h4>Contact Customer Support</h4>
                </React.Fragment>
              </GridItem>
              <GridItem xs={12} md={12}>
                <React.Fragment>
                  <div>
                    <h3>
                      Sometimes you need a little help from our support rep.
                      Don't worry... we're here for you.
                    </h3>
                  </div>
                </React.Fragment>
              </GridItem>
            </GridContainer>
          </CardContainer>
        </GridItem>
        <GridItem
          xs={4}
          md={4}
          style={{
            alignItems: 'right',
            textAlign: 'right',
            alignSelf: 'center',
          }}
        >
          <Computer
            style={{
              width: 100,
              height: 100,
              marginRight: 50,
              fill: '#1296db',
            }}
          />
        </GridItem>
        <GridItem xs={4} md={4} style={{ marginLeft: 20, ...centerAlignStyle }}>
          <React.Fragment>
            <div
              style={{ textAlign: 'left', display: 'inline-block', width: 550 }}
            >
              <h3>
                <b> Call-in Support</b>
              </h3>
              <div style={{ marginLeft: 10, fontSize: 16 }}>
                <p>Our support engineers are standing by to help.</p>
                <p style={{ marginTop: 10 }}>1-888-xxxx-xxx</p>
                <p style={{ marginTop: 10 }}>
                  Download&nbsp;
                  <a
                    target='_blank'
                    href='https://get.teamviewer.com/v10/medisyssupport'
                  >
                    TeamViewer
                  </a>&nbsp; for better support.
                </p>
              </div>
            </div>
          </React.Fragment>
        </GridItem>
        <GridItem xs={4} md={4} />
      </GridContainer>
    )
  }
}
export default withStyles({}, { withTheme: true })(Teamviewer)
