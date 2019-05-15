import React from 'react'
import PropTypes from 'prop-types'
import { FormattedMessage } from 'umi/locale'
import { withStyles } from '@material-ui/core'
import { Assignment } from '@material-ui/icons'

// import Custom components
import {
  Card,
  CardBody,
  CardHeader,
  CardIcon,
  PageHeaderWrapper,
} from '@/components'

const styles = () => ({
  cardIconTitle: {
    color: 'black',
  },
})

const CommonHeader = ({
  Icon = <Assignment />,
  titleId = 'Title',
  postFix,
  classes,
  children,
}) => (
  <PageHeaderWrapper
    title={<FormattedMessage id='app.forms.basic.title' />}
    content={<FormattedMessage id='app.forms.basic.description' />}
  >
    <Card>
      <CardHeader color='primary' icon>
        <CardIcon color='primary'>{Icon}</CardIcon>
        <h4 className={classes ? classes.cardIconTitle : ''}>
          <FormattedMessage id={titleId} />
          {postFix !== undefined ? ` - ${postFix}` : ''}
        </h4>
      </CardHeader>
      <CardBody>{children}</CardBody>
    </Card>
  </PageHeaderWrapper>
)

CommonHeader.propTypes = {
  Icon: PropTypes.object,
  titleId: PropTypes.string.isRequired,
  children: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.array,
  ]).isRequired,
}

export default withStyles(styles)(CommonHeader)
