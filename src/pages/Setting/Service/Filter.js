import React, { PureComponent } from 'react'
import { FastField, withFormik } from 'formik'
import { formatMessage, FormattedMessage } from 'umi/locale'
import { Search, PermIdentity } from '@material-ui/icons'
import { withStyles, Tooltip } from '@material-ui/core'
import { standardRowHeight } from 'mui-pro-jss'
import { getAppendUrl } from '@/utils/utils'
import { status } from '@/utils/codes'

import { GridContainer, GridItem, Button, TextField, Checkbox, CodeSelect, Select, ProgressButton } from '@/components'

const styles = (theme) => ({
	filterBar: {
		marginBottom: '10px'
	},
	filterBtn: {
		lineHeight: standardRowHeight,
		textAlign: 'left',
		'& > button': {
			marginRight: theme.spacing.unit
		}
	},
	tansactionCheck: {
		position: 'absolute',
		bottom: 0,
		width: 30,
		right: 0
	}
})

@withFormik({
	handleSubmit: () => {},
	displayName: 'ServiceFilter'
})
class Filter extends PureComponent {
	render() {
		const { classes } = this.props

		return (
			<div className={classes.filterBar}>
				<GridContainer>
					<GridItem xs={6} md={3}>
						<FastField
							name='code'
							render={(args) => {
								return <TextField label='Code' {...args} />
							}}
						/>
					</GridItem>
					<GridItem xs={6} md={3}>
						<FastField
							name='displayValue'
							render={(args) => {
								return <TextField label='Display Value' {...args} />
							}}
						/>
					</GridItem>
					<GridItem xs={6} md={3}>
						<FastField
							name='serviceCenter'
							render={(args) => {
								return <CodeSelect code='ctServiceCenter' label='Service Center' {...args} />
							}}
						/>
					</GridItem>
					<GridItem xs={6} md={3}>
						<FastField
							name='isActive'
							render={(args) => {
								return <Select label='Status' options={status} {...args} />
							}}
						/>
					</GridItem>
					<GridItem xs={12} md={12}>
						<div className={classes.filterBtn}>
							<ProgressButton
								color='primary'
								icon={null}
								onClick={() => {
									const prefix = this.props.values.isExactSearch ? 'eql_' : 'like_'
									this.props.dispatch({
										type: 'settingClinicService/query',
										payload: {
											[`${prefix}name`]: this.props.values.search
										}
									})
								}}
							>
								<FormattedMessage id='form.search' />
							</ProgressButton>

							<Button
								color='primary'
								onClick={() => {
									this.props.toggleModal()
									this.props.dispatch({
										type: 'settingClinicService/reset'
									})
								}}
							>
								Add New
							</Button>
						</div>
					</GridItem>
				</GridContainer>
			</div>
		)
	}
}

export default Filter
