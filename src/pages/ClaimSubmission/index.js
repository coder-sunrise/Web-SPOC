import React from 'react'
import { connect } from 'dva'
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

@connect(({ claimSubmission }) => ({
  claimSubmission,
}))
class ClaimSubmission extends React.Component {
  componentDidMount () {
    const data = {
      'ClaimCountListDto[0].SchemeType': 'CHAS',
      'ClaimCountListDto[0].Status': 'New',
      // 'ClaimCountListDto[1].SchemeType': 'Corporate',
      // 'ClaimCountListDto[1].Status': 'New',
    }

    this.props.dispatch({
      type: 'claimSubmission/getClaimCount',
      payload: data,
    })
  }

  navigate = ({ currentTarget }) => {
    const { history } = this.props
    const { location } = history
    history.push(`${location.pathname}/${currentTarget.id}`)
  }

  render () {
    const { classes, claimSubmission } = this.props
    const { invoiceClaimCount } = claimSubmission || []
    return (
      <GridContainer className={classes.container}>
        {invoiceClaimCount.map((scheme) => {
          return (
            <GridItem md={2}>
              <Badge
                badgeContent={scheme.count}
                color='error'
                className={classes.badge}
              >
                <Button
                  fullWidth
                  bigview
                  color='primary'
                  variant='outlined'
                  onClick={this.navigate}
                  id={scheme.schemeType}
                >
                  <Note />
                  {scheme.schemeType}
                </Button>
              </Badge>
            </GridItem>
          )
        })}

        {/* <GridItem md={2}>
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
        </GridItem> */}

        {/* <GridItem md={2}>
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
        </GridItem> */}
      </GridContainer>
    )
  }
}

export default withStyles(styles, { name: 'ClaimSubmission' })(ClaimSubmission)
