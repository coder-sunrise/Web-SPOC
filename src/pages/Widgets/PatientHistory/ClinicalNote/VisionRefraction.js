import { GridContainer, GridItem, RadioGroup } from '@/components'
const TableHeader = (
  <tr>
    <th style={{ width: '20%' }}></th>
    <th style={{ width: 50 }}></th>
    <th style={{ width: '15%' }}></th>
    <th style={{ width: 50 }}></th>
    <th style={{ width: '15%' }}></th>
    <th style={{ width: 50 }}></th>
    <th style={{ width: '15%' }}></th>
    <th style={{ width: 50 }}></th>
    <th style={{ width: '15%' }}></th>
    <th></th>
  </tr>
)
const CellUnderline = value => (
  <td>
    <div
      style={{
        borderBottom: '1px solid #cccccc',
        minHeight: 'calc(1rem + 8px)',
        overflowWrap: 'anywhere',
        padding: '0 4px',
      }}
    >
      {value}
    </div>
  </td>
)
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
        <span style={{ fontSize: '1.1rem', fontWeight: 500, marginRight: 8 }}>
          Vision and Refraction
        </span>
      </GridItem>
      <GridItem md={12} container>
        <span className={classes.sectionTitle}>Present Spectacles Details</span>
        {formContent.corVisionRefraction_PresentSpectacles?.map(ps => (
          <table className={classes.tableWithoutBorder}>
            {TableHeader}
            <tr>
              <td className={classes.cellLabel}>Distance Prescription</td>
              <td>RE</td>
              {CellUnderline(ps.distancePrescription_RE_SPH)}
              <td>/ -</td>
              {CellUnderline(ps.distancePrescription_RE_CYL)}
              <td>x</td>
              {CellUnderline(ps.distancePrescription_RE_AXIS)}
              <td>VA</td>
              {CellBordered(
                `${ps.distancePrescription_RE_VA} / ${ps.distancePrescription_RE_VA_Comments}`,
              )}
            </tr>
            <tr>
              <td></td>
              <td>LE</td>
              {CellUnderline(ps.distancePrescription_LE_SPH)}
              <td>/ -</td>
              {CellUnderline(ps.distancePrescription_LE_CYL)}
              <td>x</td>
              {CellUnderline(ps.distancePrescription_LE_AXIS)}
              <td>VA</td>
              {CellBordered(
                `${ps.distancePrescription_LE_VA} / ${ps.distancePrescription_LE_VA_Comments}`,
              )}
            </tr>
            <tr>
              <td className={classes.cellLabel}>Near Addition</td>
              <td>RE</td>
              {CellBordered(ps.nearAddition_RE_Value)}
              <td>NVA</td>
              {CellBordered(ps.nearAddition_RE_NVA)}
              <td>@</td>
              {CellBordered(ps.nearAddition_RE_CM)}
              <td>cm</td>
            </tr>
            <tr>
              <td></td>
              <td>LE</td>
              {CellBordered(ps.nearAddition_LE_Value)}
              <td>NVA</td>
              {CellBordered(ps.nearAddition_LE_NVA)}
              <td>@</td>
              {CellBordered(ps.nearAddition_LE_CM)}
              <td>cm</td>
            </tr>
            <tr>
              <td className={classes.cellLabel}>Remarks</td>
              {CellBordered(ps.Remarks, 9, { textAlign: 'left' })}
            </tr>
          </table>
        ))}
      </GridItem>
      <GridItem md={12} container>
        <div className={classes.sectionTitle}>Unaided VA</div>
        <table className={classes.tableWithoutBorder}>
          <tr>
            <th style={{ width: '20%' }}></th>
            <th style={{ width: 50 }}></th>
            <th style={{ width: 50 }}></th>
            <th style={{ width: '15%' }}></th>
            <th style={{ width: 50 }}></th>
            <th style={{ width: '15%' }}></th>
            <th style={{ width: 50 }}></th>
            <th></th>
            <th></th>
            <th></th>
          </tr>
          <tr>
            <td className={classes.cellLabel}>Distance</td>
            <td>RE</td>
            <td>VA</td>
            {CellBordered(
              `${formContent.unaidedVA_Distance_RE_VA} / ${formContent.unaidedVA_Distance_RE_VA_Comments}`,
            )}
          </tr>
          <tr>
            <td></td>
            <td>LE</td>
            <td>VA</td>
            {CellBordered(
              `${formContent.unaidedVA_Distance_LE_VA} / ${formContent.unaidedVA_Distance_LE_VA_Comments}`,
            )}
          </tr>
          <tr>
            <td className={classes.cellLabel}>Near Habitual VA</td>
            <td>RE</td>
            <td>NVA</td>
            {CellBordered(formContent.unaidedVA_NearHabitualVA_RE_NVA)}
            <td>@</td>
            {CellBordered(formContent.unaidedVA_NearHabitualVA_RE_CM)}
            <td>cm</td>
          </tr>
          <tr>
            <td></td>
            <td>LE</td>
            <td>NVA</td>
            {CellBordered(formContent.unaidedVA_NearHabitualVA_LE_NVA)}
            <td>@</td>
            {CellBordered(formContent.unaidedVA_NearHabitualVA_LE_CM)}
            <td>cm</td>
          </tr>
          <tr>
            <td className={classes.cellLabel}>Remarks</td>
            {CellBordered(formContent.unaidedVA_Remarks, 9, {
              textAlign: 'left',
            })}
          </tr>
        </table>
      </GridItem>
      <GridItem md={12} container>
        <div className={classes.sectionTitle}>Pupillary Distance</div>
        <table className={classes.tableWithoutBorder}>
          <tr>
            <th style={{ width: '20%' }}></th>
            <th style={{ width: '15%' }}></th>
            <th style={{ width: 50 }}></th>
            <th style={{ width: '15%' }}></th>
            <th></th>
          </tr>
          <tr>
            <td className={classes.cellLabel}>Far / Near PD</td>
            {CellBordered(formContent.pupillaryDistance_Far)}
            <td>/</td>
            {CellBordered(formContent.pupillaryDistance_PD)}
          </tr>
        </table>
      </GridItem>
      <GridItem md={12} container>
        <div className={classes.sectionTitle}>Objective Refraction</div>
        <table className={classes.tableWithoutBorder}>
          {TableHeader}
          <tr>
            <td className={classes.cellLabel}>Method</td>
            <td colspan='9' style={{ textAlign: 'left', paddingLeft: 16 }}>
              <RadioGroup
                label=' '
                simple
                disabled
                value={formContent.objectiveRefraction_Method}
                options={[
                  {
                    value: 'Retinoscopy',
                    label: 'Retinoscopy',
                  },
                  {
                    value: 'AutoRefraction',
                    label: 'Auto-refraction',
                  },
                ]}
              />
            </td>
          </tr>
          <tr>
            <td></td>
            <td>RE</td>
            {CellUnderline(formContent.objectiveRefraction_RE_SPH)}
            <td>/ -</td>
            {CellUnderline(formContent.objectiveRefraction_RE_CYL)}
            <td>x</td>
            {CellUnderline(formContent.objectiveRefraction_RE_AXIS)}
            <td>VA</td>
            {CellBordered(
              `${formContent.objectiveRefraction_RE_VA} / ${formContent.objectiveRefraction_RE_VA_Comments}`,
            )}
          </tr>
          <tr>
            <td></td>
            <td>LE</td>
            {CellUnderline(formContent.objectiveRefraction_LE_SPH)}
            <td>/ -</td>
            {CellUnderline(formContent.objectiveRefraction_LE_CYL)}
            <td>x</td>
            {CellUnderline(formContent.objectiveRefraction_LE_AXIS)}
            <td>VA</td>
            {CellBordered(
              `${formContent.objectiveRefraction_LE_VA} / ${formContent.objectiveRefraction_LE_VA_Comments}`,
            )}
          </tr>
          <tr>
            <td className={classes.cellLabel}>Remarks</td>
            {CellBordered(formContent.objectiveRefraction_Remarks, 9, {
              textAlign: 'left',
            })}
          </tr>
        </table>
      </GridItem>
      <GridItem md={12} container>
        <div className={classes.sectionTitle}>Subjective Refraction</div>
        <table className={classes.tableWithoutBorder}>
          {TableHeader}
          <tr>
            <td></td>
            <td>RE</td>
            {CellUnderline(formContent.subjectiveRefraction_RE_SPH)}
            <td>/ -</td>
            {CellUnderline(formContent.subjectiveRefraction_RE_CYL)}
            <td>x</td>
            {CellUnderline(formContent.subjectiveRefraction_RE_AXIS)}
            <td>VA</td>
            {CellBordered(
              `${formContent.subjectiveRefraction_RE_VA} / ${formContent.subjectiveRefraction_RE_VA_Comments}`,
            )}
          </tr>
          <tr>
            <td></td>
            <td>LE</td>
            {CellUnderline(formContent.subjectiveRefraction_LE_SPH)}
            <td>/ -</td>
            {CellUnderline(formContent.subjectiveRefraction_LE_CYL)}
            <td>x</td>
            {CellUnderline(formContent.subjectiveRefraction_LE_AXIS)}
            <td>VA</td>
            {CellBordered(
              `${formContent.subjectiveRefraction_LE_VA} / ${formContent.subjectiveRefraction_LE_VA_Comments}`,
            )}
          </tr>
          <tr>
            <td className={classes.cellLabel}>Near Addition</td>
            <td>RE</td>
            {CellBordered(
              formContent.subjectiveRefraction_NearAddition_RE_Value,
            )}
            <td>NVA</td>
            {CellBordered(formContent.subjectiveRefraction_NearAddition_RE_NVA)}
            <td>@</td>
            {CellBordered(formContent.subjectiveRefraction_NearAddition_RE_CM)}
            <td>cm</td>
          </tr>
          <tr>
            <td></td>
            <td>LE</td>
            {CellBordered(
              formContent.subjectiveRefraction_NearAddition_LE_Value,
            )}
            <td>NVA</td>
            {CellBordered(formContent.subjectiveRefraction_NearAddition_LE_NVA)}
            <td>@</td>
            {CellBordered(formContent.subjectiveRefraction_NearAddition_LE_CM)}
            <td>cm</td>
          </tr>
          <tr>
            <td className={classes.cellLabel}>Remarks</td>
            {CellBordered(
              formContent.subjectiveRefraction_NearAddition_Remarks,
              9,
              { textAlign: 'left' },
            )}
          </tr>
        </table>
      </GridItem>
    </GridContainer>
  )
}
