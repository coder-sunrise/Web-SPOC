import React, { PureComponent } from 'react'

import { CommonTableGrid, Button } from '@/components'
import { Table } from '@devexpress/dx-react-grid-material-ui'
import { status } from '@/utils/codes'
import Delete from '@material-ui/icons/Delete'
import Edit from '@material-ui/icons/Edit'
import * as service from './services'

class Grid extends PureComponent {
	//editRow = (row, e) => {
	//const { dispatch, settingServiceCenterCategory } = this.props

	//const { list } = settingServiceCenterCategory
	// For complex object retrieve from server
	// dispatch({
	//   type: 'settingRoom/querySingle',
	//   payload: {
	//     id: row.id,
	//   },
	// }).then(toggleModal)
	// console.log(settingRoom, row.id, e)
	// dispatch({
	// 	type: 'settingServiceCenterCategory/updateState',
	// 	payload: {
	// 		showModal: true,
	// 		entity: list.find((o) => o.id === row.id)
	// 	}
	// })
	//}

	render() {
		const { dispatch, classes, settingServiceCenterCategory, toggleModal } = this.props
		return (
			<CommonTableGrid
				style={{ margin: 0 }}
				type='settingServiceCenterCategory'
				onRowDoubleClick={this.editRow}
				columns={[
					{ name: 'code', title: 'Code' },
					{ name: 'displayValue', title: 'Display Value' },
					{ name: 'description', title: 'Description' }
				]}
				// FuncProps={{ pager: false }}
				columnExtensions={[]}
			/>
		)
	}
}

export default Grid
