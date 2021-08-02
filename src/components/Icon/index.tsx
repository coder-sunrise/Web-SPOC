import { createFromIconfontCN } from '@ant-design/icons'

const IconFont = createFromIconfontCN()

export default ({ type = 'question', ...props }: { type: string }) => {
  return <IconFont type={`icon-${type}`} {...props} />
}
