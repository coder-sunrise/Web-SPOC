import React from 'react'
import PropTypes from 'prop-types'
// dva
import { connect } from 'dva'
// material ui
import { Paper } from '@material-ui/core'
// common components
import { GridContainer, GridItem, CardAvatar } from '@/components'
// sub component
import Block from './Block'
// assets
import { headerHeight } from 'mui-pro-jss'
import avatar from '@/assets/img/faces/marc.jpg'

const Banner = ({ extraCmt }) => {
  return (
    <Paper
      style={{
        position: 'sticky',
        top: headerHeight,
        zIndex: 1000,
      }}
    >
      <GridContainer>
        <GridItem xs={6} md={1} gutter={0}>
          <CardAvatar testimonial square>
            <img src={avatar} alt='...' />
          </CardAvatar>
        </GridItem>
        <GridItem xs={6} md={2}>
          <Block h3='Mr John Smith' body='G512345R, Malaysian' />
        </GridItem>
        <GridItem xs={6} md={2}>
          <Block header='Info' body='32, Male, 19-03-1988' />
        </GridItem>
        <GridItem xs={6} md={2}>
          <Block header='Allergies' body='Penicillin' />
        </GridItem>
        <GridItem xs={6} md={2}>
          <Block header='Medical Problem' body='Asthma' />
        </GridItem>
        <GridItem xs={6} md={3}>
          {extraCmt}
        </GridItem>
      </GridContainer>
    </Paper>
  )
}

Banner.propTypes = {
  extraCmt: PropTypes.node,
}

export default connect(({ patientDashboard }) => ({
  patientDashboard,
}))(Banner)
