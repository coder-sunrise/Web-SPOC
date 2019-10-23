import { CommonTableGrid, DatePicker } from '@/components'

export default ({ current, classes, theme, codetable }) => {
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
                `Complication: ${o.corComplication.map((c, index) => {
                  let value = ''
                  codetable.ctcomplication.map((b) => {
                    if (c.complicationFK === b.id) {
                      value = codetable.ctcomplication[index].name
                    }
                    return ''
                  })

                  return value
                })}`
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
