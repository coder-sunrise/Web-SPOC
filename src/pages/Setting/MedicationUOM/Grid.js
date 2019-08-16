import React, { PureComponent } from 'react'

import { CommonTableGrid, Button } from '@/components'
import { Table } from '@devexpress/dx-react-grid-material-ui'
import { status } from '@/utils/codes'
import Delete from '@material-ui/icons/Delete'
import Edit from '@material-ui/icons/Edit'
import * as service from './services'

class Grid extends PureComponent {
	editRow = (row, e) => {
		const { dispatch, settingMedicationUOM } = this.props

		const { list } = settingMedicationUOM
		// For complex object retrieve from server
		// dispatch({
		//   type: 'settingMedicationUOM/querySingle',
		//   payload: {
		//     id: row.id,
		//   },
		// }).then(toggleModal)
		// console.log(settingMedicationUOM, row.id, e)
		dispatch({
			type: 'settingMedicationUOM/updateState',
			payload: {
				showModal: true,
				entity: list.find((o) => o.id === row.id)
			}
		})
	}

	render () {
		const {
			dispatch,
			classes,
			settingMedicationUOM,
			toggleModal
		} = this.props
		return (
			<CommonTableGrid
				style={{ margin: 0 }}
				type='settingMedicationUOM'
				onRowDoubleClick={this.editRow}
				columns={[
					{ name: 'code', title: 'Code' },
					{ name: 'displayValue', title: 'Display Value' },
					{ name: 'description', title: 'Description' },
					{ name: 'isActive', title: 'Status' },
					{
						name: 'action',
						title: 'Action'
					}
				]}
				// FuncProps={{ pager: false }}
				columnExtensions={[
					{
						columnName: 'isActive',
						sortingEnabled: false,
						type: 'select',
						options: status
					},
					{
						columnName: 'action',
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
