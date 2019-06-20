import React from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'
// material ui
import { Divider } from '@material-ui/core'
import withStyles from '@material-ui/styles/withStyles'
// custom components
import { Card, CardBody } from '@/components'
// style
import CardStyle from './style'

const CommonCard = ({ classes, title, size, children }) => {
  return (
    <Card size={size}>
      <CardBody size={size}>
        {title && (
          <React.Fragment>
            <h4 className={classnames(classes.title)}>{title}</h4>
            <Divider className={classnames(classes.divider)} />
          </React.Fragment>
        )}
        {children}
      </CardBody>
    </Card>
  )
}

CommonCard.propTypes = {
  size: PropTypes.oneOf([
    'sm',
  ]),
  title: PropTypes.string,
  children: PropTypes.object,
}

export default withStyles(CardStyle, { name: 'CommonCardComponent' })(
  CommonCard,
)
