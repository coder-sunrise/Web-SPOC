import React, { PureComponent, Fragment } from 'react'
import { connect } from 'dva'
// material ui
import { Badge, withStyles } from '@material-ui/core'
import Note from '@material-ui/icons/EventNote'
// common components
import { Button, GridContainer, GridItem } from '@/components'
import Authorized from '@/utils/Authorized'
import { authorityConfig } from './config'

const styles = theme => ({
  container: {
    marginTop: theme.spacing(2),
  },
  badge: {
    margin: theme.spacing(1),
    width: '100%',
  },
})

@connect(({ claimSubmission, clinicSettings }) => ({
  claimSubmission,
  clinicSettings,
}))
class ClaimSubmission extends PureComponent {
  componentDidMount() {
    const { clinicSettings } = this.props
    const isMedisaveEnable = clinicSettings.settings.isEnableMedisave // global medisave
    this.props.dispatch({
      type: 'claimSubmission/getClaimCount',
      payload: isMedisaveEnable
        ? {
            'ClaimCountListDto[0].SchemeType': 'CHAS',
            'ClaimCountListDto[0].Status': 'New',
            'ClaimCountListDto[1].SchemeType': 'Medisave',
            'ClaimCountListDto[1].Status': 'New',
          }
        : {
            'ClaimCountListDto[0].SchemeType': 'CHAS',
            'ClaimCountListDto[0].Status': 'New',
          },
    })
  }

  navigate = ({ currentTarget }) => {
    const { history } = this.props
    const { location } = history
    history.push(`${location.pathname}/${currentTarget.id}`)
  }

  render() {
    const { classes, claimSubmission } = this.props
    const { invoiceClaimCount } = claimSubmission

    return (
      <GridContainer className={classes.container}>
        <GridItem md={12} container>
          <Authorized authority='claimsubmission'>
            <Fragment>
              {invoiceClaimCount.map(scheme => {
                const authority = authorityConfig.find(
                  item => item.type === scheme.schemeType,
                )

                return (
                  <GridItem md={2}>
                    <Badge
                      badgeContent={scheme.count}
                      color='error'
                      className={classes.badge}
                    >
                      <Authorized authority={authority.accessRight}>
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
                      </Authorized>
                    </Badge>
                  </GridItem>
                )
              })}
            </Fragment>
          </Authorized>
        </GridItem>
      </GridContainer>
    )
  }
}

export default withStyles(styles, { name: 'ClaimSubmission' })(ClaimSubmission)
