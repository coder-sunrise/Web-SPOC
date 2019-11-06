import React from 'react'
import classnames from 'classnames'
import _ from 'lodash'
// material ui
import { withStyles } from '@material-ui/core'
import Search from '@material-ui/icons/Search'
// common components
import {
  Accordion,
  Button,
  CardContainer,
  GridContainer,
  GridItem,
  TextField,
} from '@/components'

const styles = (theme) => ({
  bigviewBtn: {
    // width: 180,
    marginRight: 0,
    minHeight: 75,
  },
  longTextBtn: {
    '& span': {
      whiteSpace: 'initial',
    },
    '& svg': {
      width: 50,
      height: 50,
    },
  },
})

const menuData = [
  {
    title: 'Admin',
    text: 'Session Summary Report',
    url: '/report/sessionsummary',
  },
  {
    title: 'Finance',
    text: 'Payment Collection Report',
    url: '/report/paymentcollection',
  },
  {
    title: 'Finance',
    text: 'GST Report',
    url: '/report/gstreport',
  },
  {
    title: 'Finance',
    text: 'Queue Listing Report',
    url: '/report/queuelisting',
  },
  {
    title: 'Finance',
    text: 'Patient Listing Report',
    url: '/report/patientlisting',
  },
  {
    title: 'Finance',
    text: 'Sale Summary Report',
    url: '/report/salesummary',
  },
  {
    title: 'Finance',
    text: 'Credit Note Listing Report',
    url: '/report/creditnotelistingreport',
  },
  {
    title: 'Finance',
    text: 'Void Credit Note & Payment Report',
    url: '/report/voidcreditnotereport',
  },
  {
    title: 'Finance',
    text: 'Deposit Transaction Report',
    url: '/report/deposittransactionreport',
  },
  {
    title: 'Finance',
    text: 'Outstanding Payment Report',
    url: '/report/outstandingpaymentreport',
  },
  {
    title: 'Finance',
    text: 'CHAS Claim Report',
    url: '',
  },
  {
    title: 'Inventory',
    text: 'Medication Movement Report',
    url: '/report/medicationmovementreport',
  },
  {
    title: 'Inventory',
    text: 'Consumable Movement Report',
    url: '/report/consumablemovementreport',
  },
  {
    title: 'Inventory',
    text: 'Low Stock Medication Report',
    url: '/report/lowstockmedicationreport',
  },
  {
    title: 'Inventory',
    text: 'Low Stock Consumables Report',
    url: '/report/lowstockconsumablesreport',
  },
  {
    title: 'Other',
    text: 'Diagnosis Trending Report',
    url: '/report/diagnosistrending',
  },
]

class Report extends React.Component {
  constructor (props) {
    super(props)
    this.group = _.groupBy(menuData, 'title')
  }

  state = {
    searchText: '',
  }

  onFilterChange = (event) => {
    this.setState({
      searchText: event.target.value.toLowerCase(),
    })
  }

  onButtonClick = (event) => {
    const { currentTarget } = event

    currentTarget.id !== '' && this.props.history.push(currentTarget.id)
  }

  menus = () => {
    const { classes, theme } = this.props

    return Object.keys(this.group).map((o) => {
      return {
        title: o,
        items: this.group[o],
        content: (
          <GridContainer style={{ marginTop: theme.spacing(1) }} key={o}>
            {this.group[o]
              .filter((m) => {
                return (
                  m.text.toLocaleLowerCase().indexOf(this.state.searchText) >=
                    0 || !this.state.searchText
                )
              })
              .map((item) => {
                return (
                  <GridItem
                    key={item.name}
                    xs={4}
                    md={2}
                    style={{ marginBottom: theme.spacing(2) }}
                  >
                    <Button
                      fullWidth
                      color='primary'
                      className={classnames({
                        [classes.bigviewBtn]: true,
                        // [classes.longTextBtn]: item.longText,
                      })}
                      variant='outlined'
                      id={item.url}
                      onClick={this.onButtonClick}
                    >
                      {item.text}
                    </Button>
                  </GridItem>
                )
              })}
          </GridContainer>
        ),
      }
    })
  }

  render () {
    return (
      <CardContainer hideHeader>
        <TextField prefix={<Search />} onChange={this.onFilterChange} />
        <Accordion
          defaultActive={0}
          mode={this.state.searchText.length > 0 ? 'multiple' : 'default'}
          collapses={this.menus().filter((item) => {
            return (
              !this.state.searchText ||
              // item.title.toLocaleLowerCase().indexOf(this.state.searchText) >=
              //   0 ||
              item.items.find(
                (m) =>
                  m.text.toLocaleLowerCase().indexOf(this.state.searchText) >=
                  0,
              )
            )
          })}
        />
      </CardContainer>
    )
  }
}

export default withStyles(styles, { withTheme: true })(Report)
