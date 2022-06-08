import React, { PureComponent } from 'react'
import { connect } from 'dva'
import $ from 'jquery'
import { withStyles } from '@material-ui/core'
import basicStyle from 'mui-pro-jss/material-dashboard-pro-react/layouts/basicLayout'

import { CardContainer, CommonModal, withSettingBase } from '@/components'

import Filter from './Filter'
import Grid from './Grid'
import Detail from './Detail'
import { DOCUMENT_CATEGORY } from '@/utils/constants'

const styles = theme => ({
  ...basicStyle(theme),
})

@connect(({ settingDocumentTemplate, global }) => ({
  settingDocumentTemplate,
  mainDivHeight: global.mainDivHeight,
}))
@withSettingBase({ modelName: 'settingDocumentTemplate' })
class DocumentTemplate extends PureComponent {
  state = {}

  componentDidMount() {
    this.props.dispatch({
      type: 'settingDocumentTemplate/query',
      payload: {
        isActive: true,
      },
    })
  }

  toggleModal = () => {
    this.props.dispatch({
      type: 'settingDocumentTemplate/updateState',
      payload: {
        showModal: !this.props.settingDocumentTemplate.showModal,
      },
    })
  }

  render() {
    const {
      settingDocumentTemplate,
      mainDivHeight = 700,
      settingDocumentTemplate: { documentCategoryFK },
    } = this.props
    const cfg = {
      toggleModal: this.toggleModal,
    }
    let height =
      mainDivHeight - 120 - ($('.filterDocumentTemplateBar').height() || 0)
    if (height < 300) height = 300
    const isFullScreen =
      (settingDocumentTemplate.entity?.documentCategoryFK ||
        documentCategoryFK) === DOCUMENT_CATEGORY.FORM
    return (
      <CardContainer hideHeader>
        <div className='filterDocumentTemplateBar'>
          <Filter {...cfg} {...this.props} />
        </div>
        <Grid {...cfg} {...this.props} height={height} />
        <CommonModal
          open={settingDocumentTemplate.showModal}
          observe='DocumentTemplateDetail'
          // title={this.getModalTitle(settingDocumentTemplate.entity)}
          title={`${
            settingDocumentTemplate.entity ? 'Edit ' : 'Add '
          }Document Template`}
          maxWidth='lg'
          fullScreen={isFullScreen}
          bodyNoPadding
          onClose={this.toggleModal}
          onConfirm={this.toggleModal}
        >
          <Detail {...cfg} {...this.props} />
        </CommonModal>
      </CardContainer>
    )
  }
}

export default withStyles(styles, { withTheme: true })(DocumentTemplate)
