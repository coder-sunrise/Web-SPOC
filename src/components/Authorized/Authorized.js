import CheckPermissions from './CheckPermissions'
// import Exception403 from '@/pages/Exception/403'

const Authorized = ({ children, authority, noMatch = null, type }) => {
  // console.log('Authorized', children, authority, noMatch)
  const childrenRender = typeof children === 'undefined' ? null : children
  return CheckPermissions(authority, childrenRender, noMatch, type)
}

export default Authorized
