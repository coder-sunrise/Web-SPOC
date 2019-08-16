import React, { PureComponent } from 'react'
import { FormattedMessage } from 'umi/locale'
import {
	withFormikExtend,
	FastField,
	GridContainer,
	GridItem,
	Button,
	TextField,
	Select,
	ProgressButton,
} from '@/components'

@withFormikExtend({
	mapPropsToValues: ({ settingServiceCenterCategory }) => settingServiceCenterCategory.filter || {},
	handleSubmit: () => {},
	displayName: 'ServiceCenterFilter'
})
class Filter extends PureComponent {
	render() {
		console.log({ props: this.props.values })
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
						<div className={classes.filterBtn}>
							<ProgressButton
								color='primary'
								icon={null}
								onClick={() => {
									this.props.dispatch({
										type: 'settingServiceCenterCategory/query',
										payload: this.props.values
									})
								}}
							>
								<FormattedMessage id='form.search' />
							</ProgressButton>
						</div>
					</GridItem>
				</GridContainer>
			</div>
		)
	}
}

export default Filter
