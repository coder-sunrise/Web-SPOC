import { GridContainer, GridItem } from '@/components'
const CellBordered = (value, colspan, style) => (
  <td colspan={colspan}>
    <div
      style={{
        border: '1px solid #cccccc',
        minHeight: 'calc(1rem + 8px)',
        overflowWrap: 'anywhere',
        padding: '0 4px',
        ...style,
      }}
    >
      {value}
    </div>
  </td>
)
export default ({ formContent, classes }) => {
  return (
    <GridContainer>
      <GridItem md={12}>
        <span style={{ fontSize: '1.1rem', fontWeight: 500 }}>Follow-Up</span>
      </GridItem>
      <GridItem md={12}>
        <span className={classes.sectionTitle}>History</span>
        <div className={classes.textWithBorder} style={{ minHeight: 84 }}>
          {formContent.history}
        </div>
      </GridItem>
      <GridItem md={12} container>
        <span className={classes.sectionTitle}>Vision</span>
        <table className={classes.tableWithoutBorder}>
          <tr>
            <th style={{ width: '20%' }}></th>
            <th style={{ width: 50 }}></th>
            <th style={{ width: 50 }}></th>
            <th style={{ width: '10%' }}></th>
            <th style={{ width: '10%' }}></th>
            <th style={{ width: '15%' }}></th>
            <th style={{ width: 50 }}></th>
            <th style={{ width: 50 }}></th>
            <th style={{ width: '15%' }}></th>
            <th></th>
          </tr>
          <tr>
            <td className={classes.cellLabel}>Aided</td>
            <td>RE</td>
            <td>VA</td>
            {CellBordered(
              <span>
                {formContent.aided_RE_VA} / {formContent.aided_RE_VA_Comments}
              </span>,
            )}
            {CellBordered(formContent.aided_RE_PH)}
            <td className={classes.cellLabel}>Unaided</td>
            <td>RE</td>
            <td>VA</td>
            {CellBordered(
              <span>
                {formContent.unaided_RE_VA} /{' '}
                {formContent.unaided_RE_VA_Comments}
              </span>,
            )}
          </tr>
          <tr>
            <td></td>
            <td>LE</td>
            <td>VA</td>
            {CellBordered(
              <span>
                {formContent.aided_LE_VA} / {formContent.aided_LE_VA_Comments}
              </span>,
            )}
            {CellBordered(formContent.aided_LE_PH)}
            <td></td>
            <td>LE</td>
            <td>VA</td>
            {CellBordered(
              <span>
                {formContent.unaided_LE_VA} /{' '}
                {formContent.unaided_LE_VA_Comments}
              </span>,
            )}
          </tr>
        </table>
      </GridItem>
    </GridContainer>
  )
}
