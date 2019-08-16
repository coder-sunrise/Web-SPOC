import React, { PureComponent } from 'react'

import { CommonTableGrid, Button } from '@/components'
import { Table } from '@devexpress/dx-react-grid-material-ui'
import { status } from '@/utils/codes'
import Delete from '@material-ui/icons/Delete'
import Edit from '@material-ui/icons/Edit'
import * as service from './services'

class Grid extends PureComponent {
	editRow = (row) => {
		const { dispatch, settingClinicService } = this.props

		const { list } = settingClinicService
		dispatch({
			type: 'settingClinicService/updateState',
			payload: {
				showModal: true,
				entity: list.find((o) => o.id === row.id)
			}
		})
	}

	render() {
		const { dispatch, classes, settingClinicService, toggleModal } = this.props
		return (
			<CommonTableGrid
				style={{ margin: 0 }}
				type='settingClinicService'
				onRowDoubleClick={this.editRow}
				columns={[
					{ name: 'code', title: 'Code' },
					{ name: 'displayValue', title: 'Display Value' },
					{ name: 'description', title: 'Description' },
					{ name: 'serviceCenter', title: 'Service Center' },
					{ name: 'sellingPrice', title: 'Unit Selling Price' },
					{ name: 'isActive', title: 'Status' },
					{ name: 'action', title: 'Action' }
				]}
				columnExtensions={[
					{ columnName: 'sellingPrice', type: 'number', currency: true },
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
