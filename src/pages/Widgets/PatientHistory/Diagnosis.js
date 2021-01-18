import { CommonTableGrid, DatePicker } from '@/components'

export default ({ current, classes, theme, codetable }) => {
  const complicationData = (complicationList) => {
    const { ctcomplication = [] } = codetable

    let currentComplication = complicationList.map((c) => {
      const selectItem = ctcomplication.find((cc) => cc.id === c.complicationFK)
      return {
        ...c,
        name: selectItem ? selectItem.name : undefined,
      }
    })

    return currentComplication
      .filter((c) => c.name)
      .map((c) => c.name)
      .join(', ')
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
          {(current.diagnosis || []).map((o, i) => (
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
