import React from 'react'
import classnames from 'classnames'
import moment from 'moment'
// antd
import { Skeleton } from 'antd'
// material ui
import { withStyles, Divider } from '@material-ui/core'
// common components
import {
  NumberInput,
  CodeSelect,
  dateFormatLong,
  DatePicker,
} from '@/components'
import { LoadingWrapper } from '@/components/_medisys'
// assets
import styles from './styles.js'

const PatientInfoSideBanner = ({ height, theme, classes, entity }) => {
  const entityNameClass = classnames({
    [classes.cardCategory]: true,
    [classes.entityName]: true,
  })
  return entity && entity.id ? (
    <React.Fragment>
      <h4 className={entityNameClass}>
        <CodeSelect
          // authority='none'
          text
          code='ctSalutation'
          value={entity.salutationFK}
        />{' '}
        {entity.name}
      </h4>
      <p>{entity.patientReferenceNo}</p>
      <p>
        {entity.patientAccountNo},{' '}
        <CodeSelect text code='ctNationality' value={entity.nationalityFK} />
      </p>

      <p>
        <DatePicker text format={dateFormatLong} value={entity.dob} />
        ({Math.floor(
          moment.duration(moment().diff(entity.dob)).asYears(),
        )},&nbsp;
        {
          <CodeSelect
            code='ctGender'
            // optionLabelLength={1}
            text
            value={entity.genderFK}
          />
        })
      </p>

      <Divider light />
      <div
        className={classes.schemeContainer}
        style={{ maxHeight: height - 455 - 20 }}
      >
        {entity.patientScheme.filter((o) => o.schemeTypeFK <= 5).map((o) => {
          return (
            <div style={{ marginBottom: theme.spacing(1) }}>
              <p style={{ fontWeight: 500 }}>
                <CodeSelect text code='ctSchemeType' value={o.schemeTypeFK} />
              </p>
              {o.validFrom && (
                <div>
                  <p>
                    Balance: <NumberInput value={80} currency text />
                  </p>
                  <p>
                    Validity:{' '}
                    <DatePicker
                      text
                      format={dateFormatLong}
                      value={o.validFrom}
                    />{' '}
                    -{' '}
                    <DatePicker
                      text
                      format={dateFormatLong}
                      value={o.validTo}
                    />
                  </p>
                </div>
              )}
            </div>
          )
        })}
      </div>
      {entity.patientScheme.filter((o) => o.schemeTypeFK <= 5).length > 0 && (
        <Divider light />
      )}
    </React.Fragment>
  ) : null
}

export default withStyles(styles, {
  withTheme: true,
  name: 'PatientInfoSideBanner',
})(PatientInfoSideBanner)
