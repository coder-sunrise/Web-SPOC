import {
  primaryColor,
  dangerColor,
  roseColor,
  grayColor,
  fontColor,
  infoColor,
} from 'mui-pro-jss'

export default ({ h3, header, body }) => (
  <div>
    <h5 style={{ fontWeight: 500 }}>{h3}</h5>
    <h5 style={{ color: infoColor }}>{header}</h5>
    <h8>{body}</h8>
  </div>
)
