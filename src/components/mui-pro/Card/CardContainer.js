import React from 'react'
// nodejs library that concatenates classes
import classNames from 'classnames'
// nodejs library to set properties for components
import PropTypes from 'prop-types'
// @material-ui/core components
import withStyles from '@material-ui/core/styles/withStyles'
import Assignment from '@material-ui/icons/Assignment'

import Card from './Card'
import CardHeader from './CardHeader'
import CardIcon from './CardIcon'
import CardBody from './CardBody'

// core components

function CardContainer ({
  classes,
  title,
  children,
  className,
  hideHeader = false,
  simple = false,
  icon = <Assignment />,
  ...props
}) {
  const simpleHeader = hideHeader && title
  return simple ? (
    children
  ) : (
    <Card className={className} {...props}>
      {!hideHeader && (
        <CardHeader color='primary' icon>
          {icon && <CardIcon color='primary'>{icon}</CardIcon>}
          <h4>{typeof title === 'function' ? title() : title}</h4>
        </CardHeader>
      )}
      {simpleHeader &&
      title && (
        <h4
          style={{
            position: 'absolute',
            top: -17,
            display: 'block',
            backgroundColor: 'inherit',
            left: 20,
            fontWeight: 500,
          }}
        >
          {title}
        </h4>
      )}
      <CardBody {...props}>{children}</CardBody>
    </Card>
  )
}

CardContainer.propTypes = {}

export default CardContainer
