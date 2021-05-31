import { createFromIconfontCN } from '@ant-design/icons'

const IconFont = createFromIconfontCN()

export default ({ type = 'question' }: { type: string }) => {
  return <IconFont type={`icon-${type}`} />
}
