import React from 'react'
import classnames from 'classnames'
import PropTypes from 'prop-types'
import { FormattedMessage } from 'umi/locale'
import { withStyles } from '@material-ui/core'

// import Custom components
import { Card, CardBody, CardHeader, PageHeaderWrapper } from '@/components'

const styles = () => ({
  cardIconTitle: {
    color: 'black',
  },
  header: {
    marginTop: 0,
    color: 'black',
  },
})

const CommonHeader = ({
  // Icon = <Assignment />,
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
        <h3 className={classnames(classes.header)}>
          <FormattedMessage id={titleId} />
          {postFix !== undefined ? ` - ${postFix}` : ''}
        </h3>
      </CardHeader>
      <CardBody>{children}</CardBody>
    </Card>
  </PageHeaderWrapper>
)

CommonHeader.propTypes = {
  // Icon: PropTypes.object,
  // titleId: PropTypes.string.isRequired,
  children: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.array,
  ]).isRequired,
}

export default withStyles(styles)(CommonHeader)
