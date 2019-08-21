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

@connect(({ settingMedicationUOM, global }) => ({
	settingMedicationUOM,
	global
}))
class MedicationUOM extends PureComponent {
	state = {}

	componentDidMount () {
		this.props.dispatch({
			type: 'settingMedicationUOM/query'
		})
	}

	toggleModal = () => {
		this.props.dispatch({
			type: 'settingMedicationUOM/updateState',
			payload: {
				showModal: !this.props.settingMedicationUOM.showModal
			}
		})
	}

	render () {
		const {
			classes,
			settingMedicationUOM,
			dispatch,
			theme,
			...restProps
		} = this.props
		const cfg = {
			toggleModal: this.toggleModal
		}

		return (
			<CardContainer hideHeader>
				<Filter {...cfg} {...this.props} />
				<Grid {...cfg} {...this.props} />

				<CommonModal
					open={settingMedicationUOM.showModal}
					observe='MedicationUOMDetail'
					title={
						settingMedicationUOM.entity ? (
							'Edit Medication UOM'
						) : (
							'Add Medication UOM'
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

export default withStyles(styles, { withTheme: true })(MedicationUOM)
