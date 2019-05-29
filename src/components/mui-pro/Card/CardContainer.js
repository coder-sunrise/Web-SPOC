import React from 'react'
// nodejs library that concatenates classes
import classNames from 'classnames'
// nodejs library to set properties for components
import PropTypes from 'prop-types'
// @material-ui/core components
import { Assignment } from '@material-ui/icons'
import withStyles from '@material-ui/core/styles/withStyles'

import Card from './Card'
import CardHeader from './CardHeader'
import CardIcon from './CardIcon'
import CardBody from './CardBody'

// @material-ui/icons

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
      <CardBody>{children}</CardBody>
    </Card>
  )
}

CardContainer.propTypes = {}

export default CardContainer
