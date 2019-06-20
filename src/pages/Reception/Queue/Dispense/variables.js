export const tableConfig = {
  FuncProps: { pager: false },
}

export const PrescriptionColumns = [
  {
    name: 'name',
    title: 'Name',
  },
  {
    name: 'description',
    title: 'Description',
  },
  {
    name: 'batchNo',
    title: 'Batch #',
  },
  {
    name: 'expiryDate',
    title: 'Expiry Date',
  },
  {
    name: 'qtyOrdered',
    title: 'Qty Ordered',
  },
  {
    name: 'qtyDispensed',
    title: 'Qty Dispensed',
  },
  {
    name: 'unitPrice',
    title: 'Unit Price ($)',
  },
  {
    name: 'totalPrice',
    title: 'Total Price ($)',
  },
  {
    name: 'action',
    title: 'Action',
  },
]

export const PrescriptionColumnExtensions = [
  { columnName: 'expiryDate', type: 'date' },
  { columnName: 'unitPrice', type: 'currency', align: 'right' },
  { columnName: 'totalPrice', type: 'currency', align: 'right' },
]

const generatePrescriptionData = () => {
  let data = []
  for (let i = 0; i < 15; i++) {
    data.push({
      id: i,
      name: 'Anarex',
      desription: '',
      batchNo: '324792',
      expiryDate: '2019-06-20',
      qtyOrdered: 10,
      qtyDispensed: 10,
      unitPrice: 50,
      totalPrice: 500,
    })
  }
  return data
}

export const PrescriptionTableData = generatePrescriptionData()

export const VaccinationColumn = [
  {
    name: 'name',
    title: 'Name',
  },
  {
    name: 'sequence',
    title: 'Sequence',
  },
  {
    name: 'batchNo',
    title: 'Batch #',
  },
  {
    name: 'qtyDispensed',
    title: 'Qty Dispensed',
  },
  {
    name: 'unitPrice',
    title: 'Unit Price ($)',
  },
  {
    name: 'totalPrice',
    title: 'Total Price ($)',
  },
  {
    name: 'action',
    title: 'Action',
  },
]

export const VaccinationColumnExtensions = [
  { columnName: 'qtyDispensed', align: 'right' },
  { columnName: 'unitPrice', type: 'currency', align: 'right' },
  { columnName: 'totalPrice', type: 'currency', align: 'right' },
]

const generateVaccinationData = () => {
  let data = []
  for (let i = 0; i < 15; i++) {
    data.push({
      id: i,
      name: 'Anarex',
      sequence: i,
      batchNo: '324792',
      qtyDispensed: 10,
      unitPrice: 50,
      totalPrice: 500,
    })
  }
  return data
}

export const VaccinationData = generateVaccinationData()

export const OtherOrdersColumns = [
  {
    name: 'name',
    title: 'Name',
  },
  {
    name: 'description',
    title: 'Description',
  },
  {
    name: 'unitPrice',
    title: 'Unit Price ($)',
  },
  {
    name: 'totalPrice',
    title: 'Total Price ($)',
  },
  {
    name: 'action',
    title: 'Action',
  },
]

export const OtherOrdersColumnExtensions = [
  { columnName: 'unitPrice', type: 'currency', align: 'right' },
  { columnName: 'totalPrice', type: 'currency', align: 'right' },
]

const generateOtherOrdersData = () => {
  let data = []
  for (let i = 0; i < 15; i++) {
    data.push({
      id: i,
      name: 'Anarex',
      description: 'Consulation Service',
      unitPrice: 50,
      totalPrice: 500,
    })
  }
  return data
}

export const OtherOrdersData = generateOtherOrdersData()
