import CheckPermissions from './CheckPermissions'
// import Exception403 from '@/pages/Exception/403'

const Authorized = ({ children, authority, noMatch = null }) => {
  // console.log('Authorized', children, authority, noMatch)
  const childrenRender = typeof children === 'undefined' ? null : children
  return CheckPermissions(authority, childrenRender, noMatch)
}

export default Authorized
