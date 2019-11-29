import React, { PureComponent } from 'react'
import classnames from 'classnames'
import _ from 'lodash'
import Call from '@material-ui/icons/Call'
import Print from '@material-ui/icons/Print'

import { withStyles } from '@material-ui/core'

import { GridContainer, GridItem, CardContainer, Button } from '@/components'

const menuData = [
  {
    title: 'Download',
    text: 'Contact Us',
    url: '/support/contactus',
    icon: <Call style={{ transform: 'rotate(-90deg)' }} />,
  },
  {
    title: 'Download',
    text: 'Drug Label',
    url: '/support/druglabel',
    icon: <Print />,
  },
]
const styles = () => ({
  bigviewBtn: {
    marginRight: 0,
    minHeight: 106,
  },
})

class Support extends PureComponent {
  constructor (props) {
    super(props)
    this.group = _.groupBy(menuData, 'title')
  }

  state = {}

  supportItems = () => {
    const { classes, theme } = this.props

    return Object.keys(this.group).map((o) => {
      return (
        <GridContainer style={{ marginTop: theme.spacing(1) }} key={o}>
          {this.group[o]
            .filter((m) => {
              return (
                m.text.toLocaleLowerCase().indexOf(this.state.searchText) >=
                  0 || !this.state.searchText
              )
            })
            .map((item, i) => {
              return (
                <GridItem
                  key={i}
                  xs={4}
                  md={2}
                  style={{ marginBottom: theme.spacing(2) }}
                >
                  <Button
                    fullWidth
                    bigview
                    color='primary'
                    className={classnames({
                      [classes.bigviewBtn]: true,
                    })}
                    variant='outlined'
                    onClick={() => {
                      this.props.history.push(item.url)
                    }}
                  >
                    {item.icon}
                    <span>{item.text}</span>
                  </Button>
                </GridItem>
              )
            })}
        </GridContainer>
      )
    })
  }

  render () {
    return <CardContainer hideHeader>{this.supportItems()}</CardContainer>
  }
}

export default withStyles(styles, { withTheme: true })(Support)
