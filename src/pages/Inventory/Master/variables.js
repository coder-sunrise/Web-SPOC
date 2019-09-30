import Consumable from './Consumable'
import Medication from './Medication'
import Vaccination from './Vaccination'
import Package from './Package'

const addContent = (type, props) => {
  switch (type) {
    case 1:
      return <Medication {...props} />
    case 2:
      return <Consumable {...props} />
    case 3:
      return <Vaccination {...props} />
    default:
      return <Package {...props} />
  }
}

export const InventoryMasterOption = (props) => [
  {
    id: 0,
    name: 'Medication',
    content: addContent(1, props),
  },
  {
    id: 1,
    name: 'Consumable',
    content: addContent(2, props),
  },
  {
    id: 2,
    name: 'Vaccination',
    content: addContent(3, props),
  },
  {
    id: 3,
    name: 'Package',
    content: addContent(4, props),
  },
]
