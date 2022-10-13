import React, { PureComponent } from 'react'
import { connect } from 'dva'
import $ from 'jquery'
import { withStyles } from '@material-ui/core'
import basicStyle from 'mui-pro-jss/material-dashboard-pro-react/layouts/basicLayout'

import { CardContainer, CommonModal, withSettingBase } from '@/components'
import { status } from '@/utils/codes'
import Filter from './Filter'
import Grid from './Grid'
import Detail from './Detail'
import { tagCategory } from '@/utils/codes'

const styles = theme => ({
  ...basicStyle(theme),
})

@connect(({ settingTag, global, clinicSettings }) => ({
  settingTag,
  global,
  clinicSettings,
  mainDivHeight: global.mainDivHeight,
}))
@withSettingBase({ modelName: 'settingTag' })
class Tag extends PureComponent {
  state = {}
  componentDidMount() {
    this.props.dispatch({
      type: 'settingTag/query',
      payload: {
        isActive: true,
      },
    })
  }

  toggleModal = () => {
    this.props.dispatch({
      type: 'settingTag/updateState',
      payload: {
        showModal: !this.props.settingTag.showModal,
      },
    })
  }

  render() {
    const { settingTag, mainDivHeight = 700, clinicSettings } = this.props
    const cfg = {
      toggleModal: this.toggleModal,
    }
    let height = mainDivHeight - 120 - ($('.filterTagBar').height() || 0)
    if (height < 300) height = 300

    let tagCategoryOptions = tagCategory.filter(c => c.value != 'Service')

    return (
      <CardContainer hideHeader>
        <div className='filterTagBar'>
          <Filter
            {...cfg}
            {...this.props}
            tagCategoryOptions={tagCategoryOptions}
          />
        </div>
        <Grid {...cfg} {...this.props} height={height} />
        <CommonModal
          open={settingTag.showModal}
          observe='TagDetail'
          title={settingTag.entity ? 'Edit Tag' : 'Add Tag'}
          maxWidth='md'
          bodyNoPadding
          onClose={this.toggleModal}
          onConfirm={this.toggleModal}
        >
          <Detail
            {...cfg}
            {...this.props}
            tagCategoryOptions={tagCategoryOptions}
          />
        </CommonModal>
      </CardContainer>
    )
  }
}

export default withStyles(styles, { withTheme: true })(Tag)
