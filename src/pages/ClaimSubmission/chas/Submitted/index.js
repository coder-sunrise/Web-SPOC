import React from 'react'
// formik
import { withFormik } from 'formik'
// material ui
import { withStyles } from '@material-ui/core'
// common components
import { Button, CardContainer, GridContainer, GridItem } from '@/components'
// sub components
import BaseSearchBar from '../../common/BaseSearchBar'
import TableGrid from '../../common/TableGrid'
// variables
import { NewCHASColumnExtensions, NewCHASColumns, NewCHASTableData, TableConfig } from './variables'

const styles = (theme) => ({
	cardContainer: {
		margin: 1
	},
	buttonGroup: {
		marginTop: theme.spacing(2),
		marginBottom: theme.spacing(1)
	}
})

@withFormik({
	mapPropsToValues: () => ({})
})
class SubmittedCHAS extends React.Component {
	state = {
		selectedRows: []
	}

	handleSelectionChange = (selection) => {
		this.setState({ selectedRows: selection })
	}

	render() {
		const { classes, handleContextMenuItemClick } = this.props
		return (
			<CardContainer hideHeader size='sm'>
				<BaseSearchBar />
				<GridContainer>
					<GridItem md={12}>
						<TableGrid
							data={NewCHASTableData}
							columnExtensions={NewCHASColumnExtensions}
							columns={NewCHASColumns}
							tableConfig={TableConfig}
							selection={this.state.selectedRows}
							onSelectionChange={this.handleSelectionChange}
							onContextMenuItemClick={handleContextMenuItemClick}
						/>
					</GridItem>
					<GridItem md={4} className={classes.buttonGroup}>
						<Button color='primary'>Get Status</Button>
					</GridItem>
				</GridContainer>
			</CardContainer>
		)
	}
}

export default withStyles(styles, { name: 'SubmittedCHAS' })(SubmittedCHAS)
