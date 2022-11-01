import Authorized from '@/utils/Authorized'
import Consumable from './Consumable'
import OrderSet from './OrderSet'

const addContent = (type, props) => {
  switch (type) {
    case 2:
      return <Consumable {...props} />
    default:
      return <OrderSet {...props} />
  }
}

export const InventoryMasterOption = props => {
  const Tabs = [
    {
      id: '1',
      name: 'Product',
      authority: 'inventorymaster.consumable',
      content: addContent(2, props),
      component: Consumable,
    },
    //{
    //  id: '3',
    //  name: 'Order Set',
    //  authority: 'inventorymaster.orderset',
    //  content: addContent(4, props),
    //  component: OrderSet,
    //},
  ]
  return Tabs.filter(tab => {
    const accessRight = Authorized.check(tab.authority)
    if (!accessRight || (accessRight && accessRight.rights === 'hidden'))
      return false
    return true
  })
}
