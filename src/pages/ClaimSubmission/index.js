import React from 'react'
// material ui
import { Badge, withStyles } from '@material-ui/core'
import Note from '@material-ui/icons/EventNote'
// common components
import { Button, GridContainer, GridItem } from '@/components'

const styles = (theme) => ({
  container: {
    marginTop: theme.spacing(2),
  },
  badge: {
    margin: theme.spacing(1),
    width: '100%',
  },
})

class ClaimSubmission extends React.Component {
  navigate = ({ currentTarget }) => {
    const { history } = this.props
    const { location } = history

    history.push(`${location.pathname}/${currentTarget.id}`)
  }

  render () {
    const { classes } = this.props
    return (
      <GridContainer className={classes.container}>
        <GridItem md={2}>
          <Badge badgeContent={5} color='error' className={classes.badge}>
            <Button
              fullWidth
              bigview
              color='primary'
              variant='outlined'
              onClick={this.navigate}
              id='chas'
            >
              <Note />
              CHAS
            </Button>
          </Badge>
        </GridItem>

        <GridItem md={2}>
          <Badge badgeContent={5} color='error' className={classes.badge}>
            <Button
              fullWidth
              bigview
              color='primary'
              variant='outlined'
              id='medisave'
              onClick={this.navigate}
            >
              <Note />
              MEDISAVE
            </Button>
          </Badge>
        </GridItem>
      </GridContainer>
    )
  }
}

export default withStyles(styles, { name: 'ClaimSubmission' })(ClaimSubmission)
