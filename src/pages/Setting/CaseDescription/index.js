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

@connect(({ settingCaseDescription, global }) => ({
    settingCaseDescription,
    global,
}))
    @withSettingBase({ modelName: 'settingCaseDescription' })
class CaseDescription extends PureComponent {
    state = {}

    componentDidMount() {
        this.props.dispatch({
            type: 'settingCaseDescription/query',
        })
    }

    toggleModal = () => {
        this.props.dispatch({
            type: 'settingCaseDescription/updateState',
            payload: {
                showModal: !this.props.settingCaseDescription.showModal,
            },
        })
    }

    render() {
        const { settingCaseDescription } = this.props
        const cfg = {
            toggleModal: this.toggleModal,
        }
        return (
            <CardContainer hideHeader>
                <Filter {...cfg} {...this.props} />
                <Grid {...cfg} {...this.props} />
                <CommonModal
                    open={settingCaseDescription.showModal}
                    observe='CaseDescriptionDetail'
                    title={
                        settingCaseDescription.entity ? (
                            'Edit Case Description'
                        ) : (
                                'Add Case Description'
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

export default withStyles(styles, { withTheme: true })(CaseDescription)
