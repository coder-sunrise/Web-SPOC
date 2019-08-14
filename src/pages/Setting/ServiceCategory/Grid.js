import React, { PureComponent } from 'react'

import { CommonTableGrid, Button } from '@/components'
import { Table } from '@devexpress/dx-react-grid-material-ui'
import { status } from '@/utils/codes'
import Delete from '@material-ui/icons/Delete'
import Edit from '@material-ui/icons/Edit'
import * as service from './services'

class Grid extends PureComponent {
	editRow = (row, e) => {
		if (row.isUserMaintainable) {
			const { dispatch, settingServiceCategory } = this.props

			const { list } = settingServiceCategory
			// For complex object retrieve from server
			// dispatch({
			//   type: 'settingRoom/querySingle',
			//   payload: {
			//     id: row.id,
			//   },
			// }).then(toggleModal)
			// console.log(settingRoom, row.id, e)
			dispatch({
				type: 'settingServiceCategory/updateState',
				payload: {
					showModal: true,
					entity: list.find((o) => o.id === row.id)
				}
			})
		}
	}

	render() {
		const { dispatch, classes, settingServiceCategory, toggleModal } = this.props
		return (
			<CommonTableGrid
				style={{ margin: 0 }}
				type='settingServiceCategory'
				onRowDoubleClick={this.editRow}
				columns={[
					{ name: 'code', title: 'Code' },
					{ name: 'displayValue', title: 'Display Value' },
					{ name: 'description', title: 'Description' },
					{
						name: 'action',
						title: 'Action'
					}
				]}
				// FuncProps={{ pager: false }}
				columnExtensions={[
					{
						columnName: 'action',
						sortingEnabled: false,
						align: 'center',
						render: (row) => {
							return (
								<Button
									size='sm'
									onClick={() => {
										this.editRow(row)
									}}
									justIcon
									color='primary'
									disabled={!row.isUserMaintainable}
								>
									<Edit />
								</Button>
							)
						}
					}
				]}
			/>
		)
	}
}

export default Grid
