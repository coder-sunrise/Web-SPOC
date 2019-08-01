import RenderAuthorized from '@/components/Authorized'
import { getAuthority } from './authority'

const rights = getAuthority()
let Authorized = RenderAuthorized(rights) // eslint-disable-line
// console.log(getAuthority(), Authorized)
// Reload the rights component
const reloadAuthorized = () => {
  Authorized = RenderAuthorized(rights)
}
// console.log('RenderAuthorized', RenderAuthorized)

export { reloadAuthorized }
export default Authorized
