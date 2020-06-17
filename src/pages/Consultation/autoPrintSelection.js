import React from 'react'
// common components
import {
  withStyles,
} from '@material-ui/core'
import { GridContainer, GridItem, NumberInput, Checkbox, CommonTableGrid } from '@/components'
import styles from './style'

class AutoPrintSelection extends React.PureComponent {
  columns = [
    {
      name: 'item',
      title: 'Item',
    },
    {
      name: 'description',
      title: 'Description',
    },
    {
      name: 'Copies',
      title: 'No. Of Label',
    },
    {
      name: 'print',
      title: 'Print',
    },
  ]

  colExtensions = [
    {
      columnName: 'item',
      width: 200,
      render: (row) => {
        return (
          <div style={{ position: 'relative' }}>
            <div
              style={{
                wordWrap: 'break-word',
                whiteSpace: 'pre-wrap',
              }}
            >
              {row.item}
            </div>
          </div>
        )
      },
    },
    {
      columnName: 'description',
      render: (row) => {
        return (
          <div style={{ position: 'relative' }}>
            <div
              style={{
                wordWrap: 'break-word',
                whiteSpace: 'pre-wrap',
              }}
            >
              {row.description}
            </div>
          </div>
        )
      },
    },
    {
      columnName: 'Copies',
      type: 'number',
      width: 100,
      render: (row) => {
        return (
          <p>
            <NumberInput
              max={99}
              precision={0}
              min={1}
              value={row.Copies}
              defaultValue={1}
              onChange={(event, value) => {
                this.setState((prevState) => ({
                  data: prevState.data.map((item) => row.id === item.id ? (
                    {
                      ...item,
                      Copies: value,
                    }) : item),
                }))
              }}
            />
          </p>
        )
      },
    },
    {
      columnName: 'print',
      align: 'center',
      width: 80,
      render: (row) => {
        return (
          <Checkbox onChange={(event, value) => {
            console.log(value)
            this.setState((prevState) => ({
              data: prevState.data.map((item) => row.id === item.id ? (
                {
                  ...item,
                  print: value,
                }) : item),
            }))
          }}
            checked={row.print}
            simple
          />
        )
      },
    },
  ]

  tableConfig = {
    FuncProps: { pager: false },
  }

  constructor(props) {
    super(props)
    this.state = {
      data: props.data.map((item, index) => ({
        ...item,
        id: `${index}`,
      })),
    }
    // this.onSubmitClick = this.onSubmitClick.bind(this)
  }




  render () {
    const {
      handleSubmit,
      footer,
      classes,
    } = this.props
    return (
      <div>
        <GridContainer>
          <GridItem md={12}>
            {this.state.data &&
              <div className={classes.tableContainer}>
                <h5>Print the following document after sign off</h5>
                <CommonTableGrid
                  size='sm'
                  columns={this.columns}
                  columnExtensions={this.colExtensions}
                  rows={this.state.data}
                  {...this.tableConfig}
                />
              </div>}
          </GridItem>
        </GridContainer>
        {footer({
          onConfirm: () => handleSubmit(this.state.data),
          confirmBtnText: 'Confirm',
        })}
      </div>
    )
  }
}

export default withStyles(styles, { withTheme: true })(AutoPrintSelection)
