import { CommonTableGrid, DatePicker } from '@/components'

export default ({ current, classes, theme }) => (
  
  <div>
    <div className={classes.paragraph}>
      <ul
        style={{
          listStyle: 'decimal',
          paddingLeft: theme.spacing(2),
        }}
      >
      {console.log("current.diagnosis ", current.diagnosis)}
        {current.diagnosis.map((o, i) => (
          <li key={i}>
            {o.diagnosisDescription} (<DatePicker
              text
              defaultValue={o.onsetDate}
            />)
          </li>
        ))}
      </ul>
    </div>
  </div>
)
