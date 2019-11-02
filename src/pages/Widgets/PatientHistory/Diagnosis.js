import { CommonTableGrid, DatePicker } from '@/components'

export default ({ current, classes, theme, codetable }) => {
  const complicationData = (complicationList) => {
    const { ctcomplication = [] } = codetable
    let complicationValue = ''

    for (let i = 0; i < complicationList.length; i++) {
      for (let b = 0; b < ctcomplication.length; b++) {
        if (complicationList[i].complicationFK === ctcomplication[b].id) {
          complicationValue += ctcomplication[b].name
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
            <li key={i} style={{ paddingBottom: 10 }}>
              {o.diagnosisDescription} (<DatePicker text value={o.onsetDate} />)
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
