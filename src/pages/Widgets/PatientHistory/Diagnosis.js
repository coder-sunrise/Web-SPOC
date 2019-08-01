import { CommonTableGrid } from '@/components'

export default ({ classes, theme }) => (
  <div>
    <div className={classes.paragraph}>
      <ul
        style={{
          listStyle: 'decimal',
          paddingLeft: theme.spacing(2),
        }}
      >
        <li>Asthma (12 Apr 2019)</li>
        <li>Fever (12 Apr 2019)</li>
        <li>Cough (12 Apr 2019)</li>
      </ul>
    </div>
  </div>
)
