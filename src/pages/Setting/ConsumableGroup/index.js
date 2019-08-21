import React, { PureComponent } from 'react'
import { connect } from 'dva'

import { withStyles, Divider } from '@material-ui/core'
import basicStyle from 'mui-pro-jss/material-dashboard-pro-react/layouts/basicLayout'

import { CardContainer, CommonModal } from '@/components'

import Filter from './Filter'
import Grid from './Grid'
import Detail from './Detail'

const styles = (theme) => ({
	...basicStyle(theme)
})

@connect(({ settingConsumableGroup, global }) => ({
	settingConsumableGroup,
	global
}))
class ConsumableGroup extends PureComponent {
	state = {}

	componentDidMount() {
		this.props.dispatch({
			type: 'settingConsumableGroup/query'
		})
	}

	toggleModal = () => {
		this.props.dispatch({
			type: 'settingConsumableGroup/updateState',
			payload: {
				showModal: !this.props.settingConsumableGroup.showModal
			}
		})
	}

	render() {
		const { classes, settingConsumableGroup, dispatch, theme, ...restProps } = this.props
		const cfg = {
			toggleModal: this.toggleModal
		}

		return (
			<CardContainer hideHeader>
				<Filter {...cfg} {...this.props} />
				<Grid {...cfg} {...this.props} />

				<CommonModal
					open={settingConsumableGroup.showModal}
					observe='ConsumableGroupDetail'
					title={settingConsumableGroup.entity ? 'Edit Consumable Category' : 'Add Consumable Category'}
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

export default withStyles(styles, { withTheme: true })(ConsumableGroup)
