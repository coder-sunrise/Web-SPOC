import SweetAlert from 'react-bootstrap-sweetalert'
import { SizeContainer } from '@/components'

export default function MuiSweetAlert ({ children, size = 'md', ...props }) {
  return (
    <SweetAlert {...props}>
      <SizeContainer size={size}>{children}</SizeContainer>
    </SweetAlert>
  )
}
