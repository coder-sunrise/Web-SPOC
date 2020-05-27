import React, { PureComponent } from 'react'
import Edit from '@material-ui/icons/Edit'
import { CommonTableGrid, Button, Tooltip } from '@/components'
import { status } from '@/utils/codes'

class Grid extends PureComponent {
    editRow = (row, e) => {
        if (row.isUserMaintainable) {
            const { dispatch, settingCaseDescription } = this.props

            const { list } = settingCaseDescription
            dispatch({
                type: 'settingCaseDescription/updateState',
                payload: {
                    showModal: true,
                    entity: list.find((o) => o.id === row.id),
                },
            })
        }
    }

    render() {
        return (
            <CommonTableGrid
                style={{ margin: 0 }}
                type='settingCaseDescription'
                onRowDoubleClick={this.editRow}
                columns={[
                    { name: 'code', title: 'Code' },
                    { name: 'displayValue', title: 'Display Value' },
                    { name: 'description', title: 'Description' },
                    { name: 'caseTypeFK', title: 'Case Type' },
                    { name: 'isActive', title: 'Status' },
                    {
                        name: 'action',
                        title: 'Action',
                    },
                ]}
                // FuncProps={{ pager: false }}
                columnExtensions={[
                    {
                        columnName: 'isActive',
                        sortingEnabled: false,
                        type: 'select',
                        options: status,
                        width: 120,
                        align: 'center',
                    },
                    {
                        columnName: 'action',
                        sortingEnabled: false,
                        align: 'center',
                        width: 100,
                        render: (row) => {
                            return (
                                <Tooltip title='Edit Case Description'>
                                    <Button
                                        size='sm'
                                        onClick={() => {
                                            this.editRow(row)
                                        }}
                                        justIcon
                                        color='primary'
                                        style={{ marginRight: 0 }}
                                        disabled={!row.isUserMaintainable}
                                    >
                                        <Edit />
                                    </Button>
                                </Tooltip>
                            )
                        },
                    },
                    {
                        columnName: 'caseTypeFK',
                        type: 'codeSelect',
                        code: 'ctcasetype',
                        label: 'name',
                    },
                ]}
            />
        )
    }
}

export default Grid
