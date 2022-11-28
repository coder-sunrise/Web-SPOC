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
        {!_.isEmpty(formContent.personalOcularHealth) && (
          <div className={classes.textWithUnderline}>
            {formContent.personalOcularHealth}
          </div>
        )}
        {!_.isEmpty(formContent.personalGeneralHealth) && (
          <div className={classes.textWithUnderline}>
            {formContent.personalGeneralHealth}
          </div>
        )}
        {!_.isEmpty(formContent.allergies) && (
          <div className={classes.textWithUnderline}>
            {formContent.allergies}
          </div>
        )}
        {!_.isEmpty(formContent.familyOcularHealth) && (
          <div className={classes.textWithUnderline}>
            {formContent.familyOcularHealth}
          </div>
        )}
        {!_.isEmpty(formContent.familyGeneralHealth) && (
          <div className={classes.textWithUnderline}>
            {formContent.familyGeneralHealth}
          </div>
        )}
      </GridItem>
      <GridItem md={12} container>
        <div className={classes.sectionTitle}>Visual Requirements</div>
        {!_.isEmpty(formContent.refraction) && (
          <div className={classes.textWithUnderline}>
            {formContent.refraction}
          </div>
        )}
        {!_.isEmpty(formContent.visualTasks) && (
          <div className={classes.textWithUnderline}>
            {formContent.visualTasks}
          </div>
        )}
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
