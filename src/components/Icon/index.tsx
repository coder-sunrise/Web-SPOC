import { createFromIconfontCN } from '@ant-design/icons'

const IconFont = createFromIconfontCN()

export default ({ icon }: { icon: string }) => {
  return <IconFont type={`icon-${icon}`} />
}
