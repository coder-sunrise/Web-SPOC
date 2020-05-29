import React, { PureComponent } from 'react'
import { connect } from 'dva'

import { withStyles } from '@material-ui/core'
import basicStyle from 'mui-pro-jss/material-dashboard-pro-react/layouts/basicLayout'

import { CardContainer, CommonModal, withSettingBase } from '@/components'

import Filter from './Filter'
import Grid from './Grid'
import Detail from './Detail'

const styles = (theme) => ({
    ...basicStyle(theme),
})

@connect(({ settingRefractionTestType, global }) => ({
    settingRefractionTestType,
    global,
}))
@withSettingBase({ modelName: 'settingRefractionTestType' })
class RefractionTestType extends PureComponent {
    state = {}

    componentDidMount() {
        this.props.dispatch({
            type: 'settingRefractionTestType/query',
        })
    }

    toggleModal = () => {
        this.props.dispatch({
            type: 'settingRefractionTestType/updateState',
            payload: {
                showModal: !this.props.settingRefractionTestType.showModal,
            },
        })
    }

    render() {
        const { settingRefractionTestType } = this.props
        const cfg = {
            toggleModal: this.toggleModal,
        }
        return (
            <CardContainer hideHeader>
                <Filter {...cfg} {...this.props} />
                <Grid {...cfg} {...this.props} />
                <CommonModal
                    open={settingRefractionTestType.showModal}
                    observe='RefractionTestTypeDetail'
                    title={
                        settingRefractionTestType.entity ? (
                            'Edit Refraction Test Type'
                        ) : (
                                'Add Refraction Test Type'
                            )
                    }
                    maxWidth='md'
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

export default withStyles(styles, { withTheme: true })(RefractionTestType)
