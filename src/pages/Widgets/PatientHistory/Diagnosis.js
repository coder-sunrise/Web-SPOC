import { CommonTableGrid, DatePicker } from '@/components'

export default ({ current, classes, theme, codetable }) => {

  const complicationData = (complicationList) => {
    let complicationValue = ''

    for (let i = 0; i < complicationList.length; i++) {
      for (let b = 0; b < codetable.ctcomplication.length; b++) {
        if (
          complicationList[i].complicationFK === codetable.ctcomplication[b].id
        ) {
          complicationValue += codetable.ctcomplication[b].name
        }
      }
    }

    return complicationValue
  }

  return (
    <div>
      <div className={classes.paragraph}>
        <ul
          style={{
            listStyle: 'decimal',
            paddingLeft: theme.spacing(2),
          }}
        >
          {' '}
          {current.diagnosis.map((o, i) => (
            <li key={i}>
              {o.diagnosisDescription} (<DatePicker
                text
                defaultValue={o.onsetDate}
              />)
              {o.corComplication.length > 0 ? <br /> : ''}
              {o.corComplication.length > 0 ? (
                `Complication: ${complicationData(o.corComplication)}`
              ) : (
                ''
              )}
              {o.remarks ? <br /> : ''}
              {o.remarks ? `Remark: ${o.remarks}` : ''}
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
