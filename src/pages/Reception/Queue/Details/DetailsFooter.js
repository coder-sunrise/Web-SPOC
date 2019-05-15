import React, { PureComponent } from 'react'
import classNames from 'classnames'
// umi
import { FormattedMessage } from 'umi/locale'
// material ui components
import { Divider, withStyles } from '@material-ui/core'
import { Create, PersonAdd } from '@material-ui/icons'
// custom components
import { GridContainer, GridItem, Button } from '@/components'
// import assets
import avatar from '@/assets/img/faces/marc.jpg'

const styles = () => ({
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
  imgContainer: {
    textAlign: 'center',
  },
  img: {
    display: 'block',
    maxHeight: '150px',
    width: 'auto',
    height: 'auto',
    margin: 'auto',
    verticalAlign: 'middle',
    border: '0',
  },
  viewProfileBtn: {
    marginTop: '10px',
  },
})

class DetailsFooter extends PureComponent {
  render () {
    const { classes, onViewPatientProfile } = this.props
    // return (
    //   <div className={classNames(classes.footer)}>
    //     <GridContainer>
    //       <GridItem xs md={7}>
    //         <Button color='primary' onClick={togglePatientSearch}>
    //           <Create />
    //           <FormattedMessage id='reception.queue.registerVisit' />
    //         </Button>
    //       </GridItem>
    //     </GridContainer>
    //   </div>
    // )
    return (
      <div className={classNames(classes.footer)}>
        <GridContainer justify='space-around'>
          <GridItem xs md={2}>
            <div className={classNames(classes.imgContainer)}>
              <img
                className={classNames(classes.img)}
                src={avatar}
                alt='patient-avatar'
              />
              <Button
                className={classNames(classes.viewProfileBtn)}
                color='primary'
                fullWidth
                size='sm'
                onClick={onViewPatientProfile}
              >
                View Profile
              </Button>
            </div>
          </GridItem>
          <GridItem xs md={3}>
            <h4>Demographic</h4>
            <Divider />
            <p>PT-000002A</p>
            <p>Patient Name</p>
            <p>Male / 39</p>
          </GridItem>
          <GridItem xs md={3}>
            <h4>Financial Status</h4>
            <Divider />
            <p>
              This patient having $184.58 of total outstanding balance (excl.
              current session)
            </p>
          </GridItem>
          <GridItem xs md={3}>
            <h4>Visit</h4>
            <Divider />
            <p>Queue 2.0, Registration</p>
            <p>Doctor: medinno</p>
          </GridItem>
        </GridContainer>
      </div>
    )
  }
}

export default withStyles(styles)(DetailsFooter)
