import React, { Component, Fragment } from 'react'
import { connect } from 'dva'
import router from 'umi/router'

import { withStyles } from '@material-ui/core'
import { formatMessage, FormattedMessage } from 'umi/locale'

import Card from '@material-ui/core/Card'
import CardActions from '@material-ui/core/CardActions'
import CardContent from '@material-ui/core/CardContent'
import Typography from '@material-ui/core/Typography'
import Hotel from '@material-ui/icons/Hotel'
import LinkOff from '@material-ui/icons/LinkOff'

import {
  CardContainer,
  Button,
  Tooltip,
  GridContainer,
  GridItem,
  Badge,
} from '@/components'

const styles = () => ({
  card: {
    minWidth: 275,
  },
  bullet: {
    display: 'inline-block',
    margin: '0 2px',
    transform: 'scale(0.8)',
  },
  title: {
    fontSize: 14,
  },
  pos: {
    marginBottom: 12,
  },
  cls1: {
    textAlign: 'center',
  },
  btn: {
    textAlign: 'center',
    display: 'inherit',
  },
  status: {
    fontSize: 20,
    minWidth: 49,
    padding: 8,
    '& > span': {
      right: '46%',
      bottom: -24,
      height: 14,
      width: 14,
    },
  },
})
class Dashboard extends Component {
  render () {
    const { history, classes } = this.props
    const card = ({ number1, number2, number3, type }) => {
      return (
        <Card className={classes.card}>
          <CardContent style={{ textAlign: 'center' }}>
            <Typography className={classes.cls1} variant='h5' component='h2'>
              {type}
            </Typography>
            <Hotel style={{ width: 150, height: 150, margin: '0 70px' }} />
            <GridContainer
              justify='space-evenly'
              alignItems='center'
              style={{ marginBottom: 20 }}
            >
              <Badge
                className={classes.status}
                ripple
                color='info'
                overlap='circle'
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'center',
                }}
                variant='dot'
              >
                {number1}
              </Badge>
              <Badge
                className={classes.status}
                color='danger'
                overlap='circle'
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'center',
                }}
                variant='dot'
                ripple={false}
              >
                {number2}
              </Badge>
              <Badge
                className={classes.status}
                ripple
                color='primary'
                overlap='circle'
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'center',
                }}
                variant='dot'
              >
                {number3}
              </Badge>
            </GridContainer>
          </CardContent>
          <CardActions className={classes.btn}>
            <Button
              color='primary'
              style={{ marginBottom: 8 }}
              onClick={() => {
                router.push('/wardmanagement/wardoccupancy')
              }}
            >
              View
            </Button>
          </CardActions>
        </Card>
      )
    }
    return (
      <div style={{ padding: '24px 0' }}>
        <GridContainer>
          <GridItem xs={4}>
            {card({
              type: 'ICU',
              number1: <span>&nbsp;1</span>,
              number2: <span>12</span>,
              number3: <span>13</span>,
            })}
          </GridItem>
          <GridItem xs={4}>
            {card({
              type: 'Special',
              number1: <span>&nbsp;5</span>,
              number2: <span>&nbsp;3</span>,
              number3: <span>&nbsp;8</span>,
            })}
          </GridItem>
          <GridItem xs={4}>
            {card({
              type: 'RICU',
              number1: <span>10</span>,
              number2: <span>13</span>,
              number3: <span>23</span>,
            })}
          </GridItem>
        </GridContainer>
        <GridContainer justify='flex-end'>
          <Badge
            className={classes.status}
            color='info'
            overlap='circle'
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'center',
            }}
            variant='dot'
            ripple
          >
            Available (16)
          </Badge>
          <Badge
            className={classes.status}
            color='danger'
            overlap='circle'
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'center',
            }}
            variant='dot'
            ripple={false}
          >
            Occupied (28)
          </Badge>
          <Badge
            className={classes.status}
            color='primary'
            overlap='circle'
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'center',
            }}
            variant='dot'
          >
            Total (44)
          </Badge>
        </GridContainer>
      </div>
    )
  }
}

export default withStyles(styles)(Dashboard)
