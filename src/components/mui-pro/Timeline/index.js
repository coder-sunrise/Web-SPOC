import React from "react"
import cx from "classnames"
import PropTypes from "prop-types"

// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles"

// core components
import Badge from "mui-pro-components/Badge/Badge.jsx"

import timelineStyle from "mui-pro-jss/material-dashboard-pro-react/components/timelineStyle.jsx"

function Timeline ({ ...props }) {
  const { classes, stories, simple } = props
  const timelineClass =
    `${classes.timeline 
    } ${ 
    cx({
      [classes.timelineSimple]: simple,
    })}`
  return (
    <ul className={timelineClass}>
      {stories.map((prop, key) => {
        const panelClasses =
          `${classes.timelinePanel 
          } ${ 
          cx({
            [classes.timelinePanelInverted]: prop.inverted,
            [classes.timelineSimplePanel]: simple,
          })}`
        const timelineBadgeClasses =
          `${classes.timelineBadge 
          } ${ 
          classes[prop.badgeColor] 
          } ${ 
          cx({
            [classes.timelineSimpleBadge]: simple,
          })}`
        const {value={}}=prop
        return (
          <li className={classes.item} key={value.id || key}>
            {prop.badgeIcon ? (
              <div className={timelineBadgeClasses}>
                {typeof prop.badgeIcon === 'object'?prop.badgeIcon:<prop.badgeIcon />}
              </div>
            ) : null}
            <div className={panelClasses}>
              {prop.title ? (
                <div className={classes.timelineHeading}>
                  <Badge color={prop.titleColor}>{prop.title}</Badge>
                  {prop.titleButton && <span className={classes.titleButton}>{prop.titleButton}</span>}
                </div>
              ) : null}
              <div className={classes.timelineBody}>{prop.body}</div>
              {prop.footerTitle ? (
                <h6 className={classes.footerTitle}>{prop.footerTitle}
                  <span className={classes.footerButton}>{prop.footerButton}</span>
                </h6>
              ) : null}
              {prop.footer ? <hr className={classes.footerLine} /> : null}
              {prop.footer ? (
                <div className={classes.timelineFooter}>{prop.footer}</div>
              ) : null}
            </div>
          </li>
        )
      })}
    </ul>
  )
}

Timeline.propTypes = {
  classes: PropTypes.object.isRequired,
  stories: PropTypes.arrayOf(PropTypes.object).isRequired,
  simple: PropTypes.bool,
}

export default withStyles(timelineStyle)(Timeline)
