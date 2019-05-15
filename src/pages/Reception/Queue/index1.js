import React, { PureComponent } from 'react'

// umi locale
import { FormattedMessage, formatMessage } from 'umi/locale'

// formik
import { withFormik } from 'formik'

// class names
import classNames from 'classnames'

// material ui
import { Drawer, withStyles } from '@material-ui/core'
import {
  Home,
  Queue as QueueIcon,
  CalendarToday,
  ChevronLeft,
  ChevronRight,
  AccessTime,
} from '@material-ui/icons'

// custom components
import {
  Card,
  CardHeader,
  CardBody,
  CardIcon,
  CommonModal,
  PageHeaderWrapper,
  Button,
} from '@/components'

// current page sub components
import DetailsActionBar from './Details/DetailsActionBar'
import DetailsGrid from './Details/DetailsGrid'
import DetailsFooter from './Details/DetailsFooter'
import NewVisitModal from './modal/NewVisit'

const drawerWidth = 400

const styles = theme => ({
  hide: {
    display: 'none',
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
  },
  drawerPaper: {
    width: drawerWidth,
  },
  drawerHeader: {
    display: 'flex',
    alignItems: 'center',
    padding: '0 8px',
    ...theme.mixins.toolbar,
    justifyContent: 'flex-start',
  },
  sessionNo: {
    float: 'left',
    marginBottom: '0px',
    marginTop: '20px',
  },
  toolBtns: {
    float: 'right',
    marginTop: '5px',
  },
  icon: {
    paddingTop: '0.5px',
    paddingBottom: '0.5px',
  },
})

@withFormik({ mapPropsToValues: () => ({}) })
class Queue extends PureComponent {
  state = {
    showDrawer: false,
    showNewVisit: false,
    showAnotherVisit: false,
  }

  toggleDrawer = () => {
    const { showDrawer } = this.state
    this.setState({ showDrawer: !showDrawer })
  }

  toggleNewVisit = () => {
    const { showNewVisit } = this.state
    this.setState({ showNewVisit: !showNewVisit })
  }

  toggleAnotherVisit = () => {
    const { showAnotherVisit } = this.state
    this.setState({ showAnotherVisit: !showAnotherVisit })
  }

  render() {
    const { classes, theme } = this.props
    const { showDrawer, showNewVisit, showAnotherVisit } = this.state
    const options = [
      { name: 'All doctor', value: 'all' },
      { name: 'Cheah', value: 'cheah' },
      { name: 'Joseph', value: 'Joseph' },
    ]
    return (
      <PageHeaderWrapper
        title={<FormattedMessage id="app.forms.basic.title" />}
        content={<FormattedMessage id="app.forms.basic.description" />}
      >
        <Card>
          <CardHeader color="primary" icon>
            <CardIcon color="primary">
              <QueueIcon />
            </CardIcon>
            <h4 className={classNames(classes.sessionNo)}>
              <FormattedMessage id="reception.queue.sessionNo" />
            </h4>
            <div className={classNames(classes.toolBtns)}>
              <Button
                color="info"
                justIcon
                classes={{ justIcon: classes.icon }}
                onClick={this.toggleDrawer}
              >
                <Home />
              </Button>
              <Button
                color="info"
                justIcon
                classes={{ justIcon: classes.icon }}
                onClick={this.toggleDrawer}
              >
                <CalendarToday />
              </Button>
              <Button
                color="info"
                justIcon
                classes={{ justIcon: classes.icon }}
                onClick={this.toggleDrawer}
              >
                <AccessTime />
              </Button>
            </div>
          </CardHeader>
          <CardBody>
            <DetailsActionBar handleNewVisit={this.toggleNewVisit} />
            <DetailsGrid />
            <DetailsFooter />
            <CommonModal
              open={showNewVisit}
              title={formatMessage({ id: 'reception.queue.newVisit.title' })}
              onClose={this.toggleNewVisit}
              onConfirm={this.toggleNewVisit}
              maxWidth="sm"
              showFooter={false}
              fluidHeight
            >
              <NewVisitModal testNestModal={this.toggleAnotherVisit} />
            </CommonModal>

            <CommonModal
              open={showAnotherVisit}
              title={formatMessage({ id: 'reception.queue.newVisit.title' })}
              onClose={this.toggleAnotherVisit}
              onConfirm={this.toggleAnotherVisit}
              maxWidth="md"
              showFooter={false}
            >
              <div>test</div>
              <div>test</div>
              <div>test</div>
              <div>test</div>
            </CommonModal>
          </CardBody>
        </Card>
      </PageHeaderWrapper>
    )
  }
}

export default withStyles(styles, { withTheme: true })(Queue)
