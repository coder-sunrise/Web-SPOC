import React, { PureComponent } from 'react'

import classNames from 'classnames'
// material ui components
import { Divider, withStyles } from '@material-ui/core'

// custom components
import { GridContainer, GridItem, Button, CustomDropdown } from '@/components'

// import assets
import avatar from 'assets/img/faces/avatar.jpg'

const styles = (theme) => ({
  footer: {
    marginTop: 15,
  },
  photo: {
    width: '100%',
    height: '150px',
    overflow: 'hidden',
    paddingTop: 10,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  img: {
    display: 'block',
    maxHeight: '150px',
    width: 'auto',
    height: 'auto',
    verticalAlign: 'middle',
    border: '0',
  },
})

class DetailsFooter extends PureComponent {
  render () {
    const { classes } = this.props
    return (
      <div className={classNames(classes.footer)}>
        <GridContainer>
          <GridItem xs md={2}>
            <div className={classNames(classes.photo)}>
              <img
                src={avatar}
                className={classNames(classes.img)}
                alt='patient-profile-pic'
              />
            </div>
          </GridItem>
          <GridItem xs md={4}>
            <h6>Demographic</h6>
            <Divider />
            <p>PT-000001</p>
            <p>Annie Leonhart @ Annabelle Perfectionism</p>
            <p>Femaile / 38</p>
            <p>Speak english</p>
          </GridItem>
          <GridItem xs md={3}>
            <h6>Financial Status</h6>
            <Divider />
            <p>
              This patient having $1836.35 of total outstanding balance (Excl.
              current session)
            </p>
          </GridItem>
          <GridItem xs md={3}>
            <h6>Visit</h6>
            <Divider />
            <p>Queue 1.0, Registration</p>
            <p>Doctor: Cheah</p>
          </GridItem>
        </GridContainer>
        <GridContainer>
          <GridItem xs md={1}>
            <Button size='sm' color='rose'>
              View Profile
            </Button>
          </GridItem>
          <GridItem xs md={4}>
            <CustomDropdown
              buttonText='Patient Label'
              buttonProps={{
                color: 'rose',
                size: 'sm',
              }}
              dropdownList={[
                'Patient Laboratory Label',
                'Patient Mailing Label',
                'Patient Label',
                'Patient Visit Label',
              ]}
              onClick={(props) => {
                console.log('print', props)
              }}
            />
            <CustomDropdown
              buttonText='Drug Label'
              buttonProps={{
                color: 'rose',
                size: 'sm',
              }}
              dropdownList={[
                'Preview',
                'Print',
              ]}
              onClick={(props) => {
                console.log('print', props)
              }}
            />
            <Button size='sm' color='rose'>
              Invoice
            </Button>
          </GridItem>
          <GridItem container justify='flex-end' xs md={7}>
            <Button size='sm' color='danger'>
              Dispense
            </Button>
          </GridItem>
        </GridContainer>
      </div>
    )
  }
}

export default withStyles(styles)(DetailsFooter)
