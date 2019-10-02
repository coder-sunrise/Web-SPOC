import React from 'react'
import PropTypes from 'prop-types'
import cx from 'classnames'

// @material-ui/core components
import withStyles from '@material-ui/core/styles/withStyles'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'

import footerStyle from 'mui-pro-jss/material-dashboard-pro-react/components/footerStyle'

function Footer ({ ...props }) {
  const { classes, fluid, white, rtlActive } = props
  let container = cx({
    [classes.container]: !fluid,
    [classes.containerFluid]: fluid,
    [classes.whiteColor]: white,
  })
  let anchor =
    classes.a +
    cx({
      [` ${classes.whiteColor}`]: white,
    })
  let block = cx({
    [classes.block]: true,
    [classes.whiteColor]: white,
  })
  return (
    <footer className={classes.footer}>
      <div className={container}>
        <div className={classes.left}>
          {/*
            <List className={classes.list}>
              <ListItem className={classes.inlineBlock}>
                <a href='#home' className={block}>
                  Home
                </a>
              </ListItem>
              <ListItem className={classes.inlineBlock}>
                <a href='#company' className={block}>
                  Company
                </a>
              </ListItem>
              <ListItem className={classes.inlineBlock}>
                <a href='#portfolio' className={block}>
                  Portfolio
                </a>
              </ListItem>
              <ListItem className={classes.inlineBlock}>
                <a href='#blog' className={block}>
                  Blog
                </a>
              </ListItem>
            </List>
        */}
        </div>
        <p className={classes.right}>
          &copy; {1900 + new Date().getYear()}&nbsp;
          <a href='http://medinno.com' className={anchor}>
            Medisys Innovation
          </a>
          , your trusted clinical solution provider
        </p>
      </div>
    </footer>
  )
}

Footer.propTypes = {
  classes: PropTypes.object.isRequired,
  fluid: PropTypes.bool,
  white: PropTypes.bool,
  rtlActive: PropTypes.bool,
}

export default withStyles(footerStyle)(Footer)
