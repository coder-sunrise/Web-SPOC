import React, { PureComponent } from 'react'
import classnames from 'classnames'
// umi
import { formatMessage, FormattedMessage } from 'umi/locale'
// material ui
import { Drawer, Divider, withStyles } from '@material-ui/core'
import {
  Pageview,
  AccountBoxOutlined,
  ChevronLeft,
  ChevronRight,
} from '@material-ui/icons'
// custom components
import { CommonHeader, Button, NavPills, Tooltip } from '@/components'
// sub components
import DispenseGrid from './DispenseGrid'
import ItemControls from './ItemControls'
import PatientInfo from './PatientInfo'
import InvoiceView from './InvoiceView'
import GlanceView from './GlanceView'

const DRAWER_WIDTH = 300

const styles = (theme) => ({
  root: {
    display: 'flex',
  },
  inlineHeader: {
    display: 'inline-block',
  },
  drawer: {
    width: DRAWER_WIDTH,
    flexShrink: 0,
  },
  drawerOpen: {
    width: DRAWER_WIDTH,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  drawerClose: {
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    overflowX: 'hidden',
    width: '0px !important',
    [theme.breakpoints.up('sm')]: {
      width: theme.spacing.unit * 9 + 1,
    },
  },
  content: {
    flexGrow: 1,
    // padding: theme.spacing.unit * 3,
  },
  floatButton: {
    position: 'absolute',
    right: 28,
    top: -35,
    zIndex: 100,
    '& > button': {
      margin: 0,
    },
  },
})

class Dispense extends PureComponent {
  state = {
    open: false,
  }

  toggleDrawer = () => {
    const { open } = this.state
    this.setState({ open: !open })
  }

  render () {
    const { open } = this.state
    const { classes, theme } = this.props
    return (
      <CommonHeader
        Icon={<Pageview />}
        titleId={formatMessage({ id: 'reception.queue.dispense.visit' })}
      >
        <div className={classnames(classes.root)}>
          <div className={classnames(classes.content)}>
            <Tooltip title='Show Patient and Visit Info'>
              <Button
                justIcon
                color='primary'
                className={classnames(classes.floatButton)}
                onClick={this.toggleDrawer}
              >
                <AccountBoxOutlined />
              </Button>
            </Tooltip>
            <NavPills
              color='info'
              tabs={[
                {
                  tabButton: 'Invoice',
                  tabContent: <InvoiceView />,
                },
                {
                  tabButton: 'Glance View',
                  tabContent: <GlanceView />,
                },
                // {
                //   tabButton: 'Payment',
                //   tabContent: <div>Payment</div>,
                // },
                // {
                //   tabButton: 'MC',
                //   tabContent: <div>MC</div>,
                // },
                // {
                //   tabButton: 'Memo',
                //   tabContent: <div>Memo</div>,
                // },
                // {
                //   tabButton: 'Follow-up',
                //   tabContent: <div>Follow-up</div>,
                // },
              ]}
            />
          </div>
          <Drawer
            variant='permanent'
            anchor='right'
            open={open}
            className={classnames(classes.drawer, {
              [classes.drawerOpen]: open,
              [classes.drawerClose]: !open,
            })}
            classes={{
              paper: classnames({
                [classes.drawerOpen]: open,
                [classes.drawerClose]: !open,
              }),
            }}
          >
            <div className={classes.toolbar}>
              <Button
                simple
                justIcon
                color='primary'
                onClick={this.toggleDrawer}
              >
                {theme.direction === 'rtl' ? <ChevronLeft /> : <ChevronRight />}
              </Button>
              <h4 className={classnames(classes.inlineHeader)}>
                <FormattedMessage id='reception.queue.dispense' />
              </h4>
            </div>
            <Divider />
            <PatientInfo />
          </Drawer>
        </div>
      </CommonHeader>
    )
  }
}

export default withStyles(styles, { withTheme: true })(Dispense)
