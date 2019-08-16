import React, { PureComponent } from 'react'

import { CommonTableGrid } from '@/components'
import { Table } from '@devexpress/dx-react-grid-material-ui'
import Delete from '@material-ui/icons/Delete'
import * as service from './services'

class Grid extends PureComponent {
	render() {
		return (
			<CommonTableGrid
				style={{ margin: 0 }}
				type='settingServiceCenterCategory'
				columns={[
					{ name: 'code', title: 'Code' },
					{ name: 'displayValue', title: 'Display Value' },
					{ name: 'description', title: 'Description' }
				]}
			/>
		)
	}
}

export default Grid
