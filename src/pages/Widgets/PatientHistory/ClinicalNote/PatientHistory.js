import { GridContainer, GridItem } from '@/components'

export default ({ formContent, classes }) => {
  return (
    <GridContainer>
      <GridItem md={12}>
        <span style={{ fontSize: '1.1rem', fontWeight: 500, marginRight: 8 }}>
          Patient History
        </span>
        <span style={{ clolr: '#ccc' }}>
          Reason of Visit / Chief Complaint(s) / Symptom(s)
        </span>
        <div className={classes.textWithBorder} style={{ minHeight: 84 }}>
          {formContent.subject}
        </div>
      </GridItem>
      <GridItem md={12} container>
        <div className={classes.sectionTitle}>Ocular & General History</div>
        <div className={classes.textWithUnderline}>
          {formContent.personalOcularHealth}
        </div>
        <div className={classes.textWithUnderline}>
          {formContent.personalGeneralHealth}
        </div>
        <div className={classes.textWithUnderline}>{formContent.allergies}</div>
        <div className={classes.textWithUnderline}>
          {formContent.familyOcularHealth}
        </div>
        <div className={classes.textWithUnderline}>
          {formContent.familyGeneralHealth}
        </div>
      </GridItem>
      <GridItem md={12} container>
        <div className={classes.sectionTitle}>Visual Requirements</div>
        <div className={classes.textWithUnderline}>
          {formContent.refraction}
        </div>
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
