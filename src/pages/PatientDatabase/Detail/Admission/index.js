import React, { PureComponent } from 'react'

import { withStyles, Divider } from '@material-ui/core'
import Add from '@material-ui/icons/Add'

import {
  Checkbox,
  CodeSelect,
  GridContainer,
  GridItem,
  Field,
  Select,
  Button,
  ClinicianSelect,
  TextField,
  CommonTableGrid,
  Tooltip,
} from '@/components'

const styles = () => ({})
const roomTypes = [
  {
    value: 1,
    name: 'Single',
  },
  {
    value: 2,
    name: 'Double',
  },
]
const data = [
  {
    department: 'ICU',
    roomtype: 1,
    roomnumber: 'A-001',
    bednumber: '01',
    status: 'Available',
    price: 100,
  },
  {
    department: 'ICU',
    roomtype: 1,
    roomnumber: 'A-002',
    bednumber: '01',
    status: 'Available',
    price: 100,
  },
  {
    department: 'ICU',
    roomtype: 1,
    roomnumber: 'A-003',
    bednumber: '01',
    status: 'Occupied',
    price: 100,
  },
  {
    department: 'Special',
    roomtype: 1,
    roomnumber: 'S-001',
    bednumber: '01',
    status: 'Occupied',
    price: 200,
  },
  {
    department: 'Special',
    roomtype: 2,
    roomnumber: 'S-002',
    bednumber: '01',
    status: 'Occupied',
    price: 150,
  },
  {
    department: 'Special',
    roomtype: 2,
    roomnumber: 'S-002',
    bednumber: '02',
    status: 'Available',
    price: 150,
  },
]

class Addmission extends PureComponent {
  state = {
    filter: undefined,
  }

  render () {
    const { theme } = this.props
    const { props } = theme
    return (
      <div>
        <GridContainer>
          <GridItem md={3}>
            <Select
              label='Room Type'
              value={this.state.filter}
              options={roomTypes}
              onChange={(value) => {
                this.setState({
                  filter: value,
                })
              }}
            />
          </GridItem>
          <GridItem md={3} style={{ lineHeight: props.rowHeight }}>
            <Button color='primary'>Check</Button>
          </GridItem>
          <GridItem md={6} />
          <GridItem md={3}>
            <Select
              label='Department'
              options={[
                {
                  value: 1,
                  name: 'ICU',
                },
              ]}
            />
          </GridItem>
          <GridItem md={3}>
            <ClinicianSelect label='Doctor' />
          </GridItem>

          <GridItem md={3}>
            <TextField label='Room No.' />
          </GridItem>
          <GridItem md={3}>
            <TextField label='Bed No.' />
          </GridItem>
        </GridContainer>
        {this.state.filter && (
          <React.Fragment>
            <Divider light style={{ marginBottom: theme.spacing(1) }} />
            <CommonTableGrid
              FuncProps={{ pager: false }}
              columns={[
                { name: 'department', title: 'Department' },
                { name: 'roomtype', title: 'Room Type' },
                { name: 'roomnumber', title: 'Room No.' },
                { name: 'bednumber', title: 'Bed No.' },
                { name: 'status', title: 'Status' },
                { name: 'price', title: 'Price' },
                // { name: 'action', title: 'Action' },
              ]}
              columnExtensions={[
                {
                  columnName: 'price',
                  type: 'currency',
                },
                {
                  columnName: 'roomtype',
                  type: 'select',
                  options: roomTypes,
                },
                {
                  columnName: 'action',
                  align: 'center',
                  sortingEnabled: false,
                  render: (row) => {
                    const { renderActionFn = (f) => f } = props
                    return (
                      <Tooltip title='Add' placement='bottom'>
                        <Button
                          size='sm'
                          onClick={() => {
                            // this.onAddExistPatient(row)
                          }}
                          justIcon
                          color='primary'
                          // style={{ marginRight: 5 }}
                        >
                          <Add />
                        </Button>
                      </Tooltip>
                    )
                  },
                },
              ]}
              rows={data.filter((o) => o.roomtype === this.state.filter)}
            />
          </React.Fragment>
        )}
      </div>
    )
  }
}

export default withStyles(styles, { withTheme: true })(Addmission)
