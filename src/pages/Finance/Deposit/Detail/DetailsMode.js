import React, { PureComponent } from 'react'
import { withStyles, Divider, Paper } from '@material-ui/core'
import Remove from '@material-ui/icons/Remove'

import { Button, GridContainer, GridItem, CommonModal } from '@/components'
// import AddPayment from '../../Invoice/Detail/Payment/AddPayment'
// import AddCreditNote from '../../Invoice/Detail/Payment/AddCreditNote'

const styles = () => ({
  item: {
    marginBottom: 30,
  },
  titleRowSpaces: {
    paddingTop: 10,
    paddingBottom: 10,
    paddingLeft: 0,
    paddingRight: 0,
    fontWeight: 'bold',
  },
  rowSpaces: {
    paddingTop: 5,
    paddingBottom: 5,
    paddingLeft: 0,
    paddingRight: 0,
  },
  centerAlign: {
    textAlign: 'center',
  },
  leftAlign: {
    textAlign: 'left',
  },
  rightAlign: {
    textAlign: 'right',
  },
})

const TitleRow = (props) => {
  const { classes } = props
  return (
    <GridContainer
      zeroMinWidth
      spacing={0}
      alignItems='center'
      className={classes.titleRowSpaces}
    >
      <GridItem xs sm={12} md={2} className={classes.centerAlign}>
        22/01/2019
      </GridItem>
      <GridItem xs sm={12} md={2} className={classes.leftAlign}>
        IV-000008
      </GridItem>
      <GridItem xs sm={12} md={5} className={classes.leftAlign}>
        Co-Payer (Annie Leonhard @ Annablele Perfectionism)
      </GridItem>
      <GridItem xs sm={12} md={2} className={classes.rightAlign}>
        -$89.10
      </GridItem>
      <GridItem xs sm={12} md={1} className={classes.rightAlign} />
    </GridContainer>
  )
}

const ContentRows = (props) => {
  const { classes, contentRows = [], onVoidClick } = props
  return contentRows.map((row) => (
    <GridContainer
      zeroMinWidth
      spacing={0}
      alignItems='center'
      className={classes.rowSpaces}
    >
      <GridItem xs sm={12} md={2} className={classes.centerAlign}>
        {row.date}
      </GridItem>
      <GridItem xs sm={12} md={7} className={classes.leftAlign}>
        {row.description}
      </GridItem>
      <GridItem xs sm={12} md={2} className={classes.rightAlign}>
        {row.amount}
      </GridItem>
      <GridItem xs sm={12} md={1} className={classes.centerAlign}>
        <Button
          size='sm'
          justIcon
          color='danger'
          round
          title='Void'
          onClick={() => onVoidClick(row.id)}
        >
          <Remove />
        </Button>
      </GridItem>
    </GridContainer>
  ))
}

const FooterRow = (props) => {
  const {
    classes,
    footerButtonEvents: { onAddPaymentClick, onAddCreditNoteClick },
  } = props

  return (
    <GridContainer
      zeroMinWidth
      spacing={0}
      alignItems='center'
      className={classes.rowSpaces}
    >
      <GridItem xs sm={12} md={1} className={classes.rightAlign}>
        Add
      </GridItem>
      <GridItem xs sm={12} md={1} className={classes.centerAlign}>
        <Button size='sm' color='info' onClick={onAddPaymentClick}>
          Payment
        </Button>
      </GridItem>
      <GridItem xs sm={12} md={1} className={classes.centerAlign}>
        <Button size='sm' color='info' onClick={onAddCreditNoteClick}>
          C.N
        </Button>
      </GridItem>
      <GridItem xs sm={12} md={6} className={classes.centerAlign} />
      <GridItem xs sm={12} md={1} className={classes.rightAlign}>
        Balance:
      </GridItem>
      <GridItem xs sm={12} md={1} className={classes.rightAlign}>
        $28.00
      </GridItem>
      <GridItem xs sm={12} md={1} className={classes.leftAlign} />
    </GridContainer>
  )
}

const itemList = [
  {
    title: {
      date: '22/01/2019',
      visitRefNo: 'IV-000008',
      description: 'Co-Payer (Annie Leonhard @ Annablele Perfectionism)',
      totalAmount: 139.1,
    },
    content: [
      {
        id: 'content-1',
        date: '22/01/2019',
        description: 'Co-Payer (Annie Leonhard @ Annablele Perfectionism)',
        amount: '$20.00',
      },
      {
        id: 'content-2',
        date: '22/02/2019',
        description: 'Co-Payer (Annie Leonhard @ Annablele Perfectionism)',
        amount: '$10.00',
      },
    ],
  },
  {
    title: {
      date: '22/01/2019',
      visitRefNo: 'IV-000004',
      description: 'Agnes Chan',
      totalAmount: 139.1,
    },
    content: [
      {
        id: 'content-3',
        date: '22/01/2019',
        description: 'Agnes Chan',
        amount: '$20.00',
      },
      {
        id: 'content-4',
        date: '22/02/2019',
        description: 'Payment(RC-000126)',
        amount: '$10.00',
      },
    ],
  },
  {
    title: {
      date: '22/01/2019',
      visitRefNo: 'IV-000004',
      description: 'Agnes Chan',
      totalAmount: 139.1,
    },
    content: [
      {
        id: 'content-5',
        date: '22/01/2019',
        description: 'Agnes Chan',
        amount: '$20.00',
      },
      {
        id: 'content-6',
        date: '22/02/2019',
        description: 'Payment(RC-000126)',
        amount: '$10.00',
      },
    ],
  },
]

const GroupedList = (props) => {
  const {
    list = [],
    onVoidClick = (f) => f,
    footerButtonEvents,
    classes,
  } = props
  return list.map((item) => (
    <Paper className={classes.item}>
      <TitleRow {...props} title={item.title} />
      <Divider variant='middle' />
      <ContentRows
        {...props}
        contentRows={item.content}
        onVoidClick={onVoidClick}
      />
      <Divider variant='middle' />
      <FooterRow {...props} {...footerButtonEvents} />
    </Paper>
  ))
}

class DetailsMode extends PureComponent {
  state = {
    showAddPayment: false,
    showAddCreditNote: false,
  }

  toggleShowAddPayment = () => {
    const { showAddPayment } = this.state
    this.setState({ showAddPayment: !showAddPayment })
  }

  toggleShowAddCreditNote = () => {
    const { showAddCreditNote } = this.state
    this.setState({ showAddCreditNote: !showAddCreditNote })
  }

  voidContentRow = (id) => {
    alert(`Voiding content: ${id}`)
  }

  render () {
    const footerBtnEvents = {
      onAddPaymentClick: this.toggleShowAddPayment,
      onAddCreditNoteClick: this.toggleShowAddCreditNote,
    }
    const { showAddPayment, showAddCreditNote } = this.state
    return (
      <React.Fragment>
        <GroupedList
          {...this.props}
          footerButtonEvents={footerBtnEvents}
          list={itemList}
          onVoidClick={this.voidContentRow}
        />
        {/* <CommonModal
          open={showAddPayment}
          title='Make Payment'
          onClose={this.toggleShowAddPayment}
          showFooter={false}
          onConfirm={this.toggleShowAddPayment}
        >
          <AddPayment />
        </CommonModal>
        <CommonModal
          open={showAddCreditNote}
          title='Credit Note Details'
          onClose={this.toggleShowAddCreditNote}
          showFooter={false}
          onConfirm={this.toggleShowAddCreditNote}
        >
          <AddCreditNote />
        </CommonModal> */}
      </React.Fragment>
    )
  }
}

export default withStyles(styles)(DetailsMode)
