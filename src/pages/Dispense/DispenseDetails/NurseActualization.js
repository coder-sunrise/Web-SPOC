import React from 'react'
// common components
import {
  GridContainer,
  GridItem,
  CommonTableGrid,
  Button,
  DatePicker,
  TextField,
  CommonModal,
  Tooltip,
} from '@/components'
import {
  NURSE_WORKITEM_STATUS,
  RADIOLOGY_WORKITEM_STATUS,
} from '@/utils/constants'
import Authorized from '@/utils/Authorized'
import moment from 'moment'
import DeleteConfirmation from './DeleteConfirmation'

const dateTimeFormat = 'DD MMM YYYY HH:mm'
const localDateTime = value => {
  return value ? moment(value).format(dateTimeFormat) : '-'
}

const detailsColumns = [
  { name: 'type', title: 'Type' },
  { name: 'name', title: 'Name' },
  { name: 'qty', title: 'Qty.' },
  { name: 'orderBy', title: 'Order By' },
  { name: 'orderDate', title: 'Order Date' },
  { name: 'instructions', title: 'Instructions' },
  { name: 'accessionNo', title: 'Accession No.' },
  { name: 'orderRemarks', title: 'Order Remarks' },
]

const actualizedColumns = [
  { name: 'actulizeByUser', title: 'Actualize By' },
  { name: 'actulizeDate', title: 'Actualize Date' },
  { name: 'actulizeRemarks', title: 'Actualize Remarks' },
]

const colDetailsExtensions = [
  { columnName: 'type', width: 100 },
  { columnName: 'name' },
  {
    columnName: 'qty',
    width: 80,
    align: 'right',
    render: r => `${r.qty}${r.uom && r.uom.trim() !== '' ? ` ${r.uom}` : ''}`,
  },
  { columnName: 'orderBy', width: 130 },
  {
    columnName: 'orderDate',
    width: 140,
    render: r => localDateTime(r.orderDate),
  },
  { columnName: 'instructions' },
  { columnName: 'accessionNo', width: 130 },
  { columnName: 'orderRemarks' },
  { columnName: 'actulizeByUser', width: 130 },
  {
    columnName: 'actulizeDate',
    width: 140,
    render: r => localDateTime(r.actulizeDate),
  },
  { columnName: 'actulizeRemarks' },
]

const historyColumns = [
  { name: 'type', title: 'Type' },
  { name: 'name', title: 'Name' },
  { name: 'qty', title: 'Qty.' },
  { name: 'orderBy', title: 'Order By' },
  { name: 'orderDate', title: 'Order Date' },
  { name: 'instructions', title: 'Instructions' },
  { name: 'accessionNo', title: 'Accession No.' },
  { name: 'orderRemarks', title: 'Order Remarks' },
  { name: 'actualizeByUser', title: 'Actualize By' },
  { name: 'actualizeDate', title: 'Actualize Date' },
  { name: 'actualizeRemarks', title: 'Actualize Remarks' },
  { name: 'cancelByUser', title: 'Cancel By' },
  { name: 'cancelDate', title: 'Cancel Date' },
  { name: 'cancelReasons', title: 'Reasons' },
]

const historyColumnExtensions = [
  { columnName: 'type', width: 100 },
  { columnName: 'name' },
  {
    columnName: 'qty',
    width: 80,
    align: 'right',
    render: r => `${r.qty}${r.uom && r.uom.trim() !== '' ? ` ${r.uom}` : ''}`,
  },
  { columnName: 'orderBy', width: 130 },
  {
    columnName: 'orderDate',
    width: 135,
    render: r => localDateTime(r.orderDate),
  },
  { columnName: 'instructions', width: 130 },
  { columnName: 'accessionNo', width: 125 },
  { columnName: 'orderRemarks' },
  { columnName: 'actualizeByUser', width: 130 },
  {
    columnName: 'actualizeDate',
    width: 135,
    render: r => localDateTime(r.actualizeDate),
  },
  { columnName: 'actualizeRemarks' },
  { columnName: 'cancelByUser', width: 130 },
  {
    columnName: 'cancelDate',
    width: 135,
    render: r => localDateTime(r.cancelDate),
  },
  { columnName: 'cancelReasons' },
]

class NurseActualization extends React.PureComponent {
  state = {
    status: 0,
    remarks: '',
    actualize: [],
    history: [],
    showCancelConfirmation: false,
  }

  componentWillMount = () => {
    const { dispatch, nurseWorkitemIds = '', status = 0 } = this.props
    dispatch({
      type: 'dispense/getActualize',
      payload: { status, nurseWorkitemIds },
    }).then(r => {
      if (r && r.data) {
        this.setState({
          status: status,
          actualize: r.data.nurseActualize,
          history: r.data.nurseWorkitemHistory,
        })
      }
    })
  }

  getColumns = () => {
    switch (this.state.status) {
      case NURSE_WORKITEM_STATUS.NEW:
      case NURSE_WORKITEM_STATUS.CANCELLED:
        return detailsColumns
      case NURSE_WORKITEM_STATUS.ACTUALIZED:
        return [...detailsColumns, ...actualizedColumns]
    }
  }

  actualize = () => {
    this.props
      .dispatch({
        type: 'dispense/addActualize',
        payload: {
          remarks: this.state.remarks,
          nurseActualize: this.state.actualize,
        },
      })
      .then(r => {
        this.props.handleSubmit()
      })
  }

  cancel = () => {
    this.setState({ showCancelConfirmation: true })
  }

  confirmCancel = reasons => {
    this.props
      .dispatch({
        type: 'dispense/cancelActualize',
        payload: {
          remarks: reasons,
          nurseActualize: this.state.actualize,
        },
      })
      .then(r => {
        this.closeCancelConfirmation()
        this.props.handleSubmit()
      })
  }

  closeCancelConfirmation = () => {
    this.setState({ showCancelConfirmation: false })
  }

  render() {
    const { actualize, history, status } = this.state

    const actualizeViewable = status > 0
    const historyViewable = this.state.history?.length > 0
    const remarksViewable =
      [NURSE_WORKITEM_STATUS.NEW, NURSE_WORKITEM_STATUS.CANCELLED].indexOf(
        status,
      ) > -1
    const actualizeBtnViewable = remarksViewable
    const cancelBtnViewable = NURSE_WORKITEM_STATUS.ACTUALIZED === status

    const actualizeRight = Authorized.check('dispense.actualizeorderitems')
    const cancelActualizeRight = Authorized.check(
      'dispense.cancelactualizeorderitems',
    )
    const isDisabledActualize =
      actualizeRight && actualizeRight.rights === 'disable'
    const isDisabledCancelActualize =
      cancelActualizeRight && cancelActualizeRight.rights === 'disable'
    const radiologyCancellableActualizeStatus = [
      RADIOLOGY_WORKITEM_STATUS.NEW,
      RADIOLOGY_WORKITEM_STATUS.CANCELLED,
    ]
    const isEnableCancelActualizeByRadiology = actualize.some(
      x =>
        !x.radiologyWorkitemStatusFK ||
        radiologyCancellableActualizeStatus.includes(
          x.radiologyWorkitemStatusFK,
        ),
    )

    return (
      <div>
        {actualizeViewable && (
          <GridContainer style={{ marginBottom: 20 }}>
            <GridItem lg={12}>
              <div>
                <h5>Details</h5>
                <CommonTableGrid
                  minHeight={100}
                  size='sm'
                  getRowId={r => r.id}
                  columns={this.getColumns()}
                  columnExtensions={colDetailsExtensions}
                  rows={actualize}
                  FuncProps={{ pager: false }}
                />
              </div>
            </GridItem>
          </GridContainer>
        )}
        {historyViewable && (
          <GridContainer style={{ marginBottom: 10 }}>
            <GridItem lg={12}>
              <div>
                <h5>{status > 0 ? 'Actualization History' : 'Details'}</h5>
                <CommonTableGrid
                  minHeight={100}
                  size='sm'
                  getRowId={r => r.id}
                  columns={historyColumns}
                  columnExtensions={historyColumnExtensions}
                  rows={history}
                  FuncProps={{ pager: false }}
                />
              </div>
            </GridItem>
          </GridContainer>
        )}
        {remarksViewable && (
          <Authorized authorized='dispense.actualizeorderitems'>
            <GridContainer>
              <GridItem lg={12}>
                <DatePicker
                  label='Actualize at'
                  format={dateTimeFormat}
                  value={new Date()}
                  disabled={true}
                  showTime
                  timeFormat
                />
              </GridItem>
            </GridContainer>
            <GridContainer>
              <GridItem lg={12}>
                <TextField
                  label='Remarks'
                  disabled={false}
                  value={this.state.remarks}
                  onChange={e => {
                    this.setState({ remarks: e.target.value })
                  }}
                />
              </GridItem>
            </GridContainer>
          </Authorized>
        )}
        <GridContainer>
          <GridItem lg={12}>
            <div style={{ marginTop: 8, marginBottom: 10 }} align='right'>
              {actualizeViewable && actualizeBtnViewable && (
                <Authorized authorized='dispense.actualizeorderitems'>
                  <Button
                    color='success'
                    onClick={this.actualize}
                    disabled={isDisabledActualize}
                  >
                    Actualize
                  </Button>
                </Authorized>
              )}
              {actualizeViewable && cancelBtnViewable && (
                <Authorized authorized='dispense.cancelactualizeorderitems'>
                  {!isEnableCancelActualizeByRadiology ? (
                    <Tooltip title='Workitem has been started, cancel actualization is not supported.'>
                      <span>
                        <Button
                          color='warning'
                          onClick={this.cancel}
                          disabled={true}
                        >
                          Cancel Actualization
                        </Button>
                      </span>
                    </Tooltip>
                  ) : (
                    <Button
                      color='warning'
                      onClick={this.cancel}
                      disabled={isDisabledCancelActualize}
                    >
                      Cancel Actualization
                    </Button>
                  )}
                </Authorized>
              )}
              {!actualizeViewable && (
                <Button
                  color='primary'
                  onClick={() => {
                    this.props.onClose()
                  }}
                >
                  Close
                </Button>
              )}
            </div>
          </GridItem>
        </GridContainer>

        <CommonModal
          open={this.state.showCancelConfirmation}
          title='Alert'
          onClose={this.closeCancelConfirmation}
          maxWidth='sm'
        >
          <DeleteConfirmation
            showIcon
            message='Please indicate reason for cancellation'
            handleSubmit={this.confirmCancel}
          />
        </CommonModal>
      </div>
    )
  }
}

export default NurseActualization
