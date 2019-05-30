import {
  primaryColor,
  dangerColor,
  roseColor,
  grayColor,
  fontColor,
  infoColor,
} from 'mui-pro-jss'

export default ({ h3, header, body }) => (
  <div style={{ padding: '17px 0' }}>
    <h5 style={{ fontWeight: 500 }}>{h3}</h5>
    <h5 style={{ color: infoColor }}>{header}</h5>
    <div>{body}</div>
  </div>
)
