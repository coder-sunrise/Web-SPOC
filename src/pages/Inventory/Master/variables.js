import Consumable from './Consumable'
import Medication from './Medication'
import Vaccination from './Vaccination'
import OrderSet from './OrderSet'
import Authorized from '@/utils/Authorized'

const addContent = (type, props) => {
  switch (type) {
    case 1:
      return <Medication {...props} />
    case 2:
      return <Consumable {...props} />
    case 3:
      return <Vaccination {...props} />
    default:
      return <OrderSet {...props} />
  }
}

export const InventoryMasterOption = (props) => {
  const Tabs = [
    {
      id: '0',
      name: 'Medication',
      authority: 'inventorymaster.medication',
      content: addContent(1, props),
    },
    {
      id: '1',
      name: 'Consumable',
      authority: 'inventorymaster.consumable',
      content: addContent(2, props),
    },
    {
      id: '2',
      name: 'Vaccination',
      authority: 'inventorymaster.vaccination',
      content: addContent(3, props),
    },
    {
      id: '3',
      name: 'Order Set',
      authority: 'inventorymaster.orderset',
      content: addContent(4, props),
    },
  ]
  return Tabs.filter((tab) => {
    const accessRight = Authorized.check(tab.authority)
    if (!accessRight || (accessRight && accessRight.rights === 'hidden'))
      return false
    return true
  })
}
