import { CommonTableGrid } from '@/components'

export default ({ classes, current }) => (
  <div>
    <div
      className={classes.paragraph}
      dangerouslySetInnerHTML={{ __html: current.chiefComplaints }}
    />
  </div>
)
