import React from 'react'
import { FormattedMessage } from 'umi/locale'
import Link from 'umi/link'
import { connect } from 'dva'
import Paper from '@material-ui/core/Paper'
import PageHeader from '@/components/PageHeader'
import GridContent from './GridContent'
import styles from './index.less'
import MenuContext from '@/layouts/MenuContext'

const PageHeaderWrapper = ({
  children,
  contentWidth,
  wrapperClassName,
  top,
  ...restProps
}) => (
  <div>
    {top}
    {/* <MenuContext.Consumer>
      {value => (
        <PageHeader
          wide={contentWidth === 'Fixed'}
          home={<FormattedMessage id="menu.home" defaultMessage="Home" />}
          {...value}
          key="pageheader"
          {...restProps}
          linkElement={Link}
          itemRender={item => {
            if (item.locale) {
              return <FormattedMessage id={item.locale} defaultMessage={item.title} />
            }
            return item.title
          }}
        />
      )}
    </MenuContext.Consumer> */}
    {children ? (
      <div>
        <GridContent>{children}</GridContent>
      </div>
    ) : null}
  </div>
)

export default connect(({ setting }) => ({
  contentWidth: setting.contentWidth,
}))(PageHeaderWrapper)
