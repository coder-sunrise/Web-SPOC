import { GridContainer, GridItem } from '@/components'

const textLabelStyle = {
  padding: '0',
  width: '100%',
  color: 'rgba(0,0,0,0.5)',
  fontSize: '0.9rem',
}
export default ({ formContent, classes }) => {
  return (
    <GridContainer>
      <GridItem md={12}>
        <span style={{ fontSize: '1.1rem', fontWeight: 500, marginRight: 8 }}>
          Patient History
        </span>
        <span>Reason of Visit / Chief Complaint(s) / Symptom(s)</span>
        <div className={classes.textWithBorder} style={{ minHeight: 84 }}>
          {formContent.subject}
        </div>
      </GridItem>
      <GridItem md={12} container>
        <div className={classes.sectionTitle}>Ocular & General History</div>
        <div style={textLabelStyle}>Personal Ocular Health</div>
        <div className={classes.textWithUnderline}>
          {formContent.personalOcularHealth}
        </div>
        <div style={textLabelStyle}>Personal General Health</div>
        <div className={classes.textWithUnderline}>
          {formContent.personalGeneralHealth}
        </div>
        <div style={textLabelStyle}>Medications, Allergies</div>
        <div className={classes.textWithUnderline}>{formContent.allergies}</div>
        <div style={textLabelStyle}>Family Ocular Health</div>
        <div className={classes.textWithUnderline}>
          {formContent.familyOcularHealth}
        </div>
        <div style={textLabelStyle}>Family General Health</div>
        <div className={classes.textWithUnderline}>
          {formContent.familyGeneralHealth}
        </div>
      </GridItem>
      <GridItem md={12} container>
        <div className={classes.sectionTitle}>Visual Requirements</div>
        <div style={textLabelStyle}>
          Refraction / Optical Appliances Hx / Contact Lens Hx
        </div>
        <div className={classes.textWithUnderline}>
          {formContent.refraction}
        </div>
        <div style={textLabelStyle}>Visual Tasks</div>
        <div className={classes.textWithUnderline}>
          {formContent.visualTasks}
        </div>
      </GridItem>
      <GridItem md={12} container>
        <div className={classes.sectionTitle}>Other Observations</div>
        <div className={classes.textWithBorder} style={{ minHeight: 84 }}>
          {formContent.otherObservations}
        </div>
      </GridItem>
    </GridContainer>
  )
}
