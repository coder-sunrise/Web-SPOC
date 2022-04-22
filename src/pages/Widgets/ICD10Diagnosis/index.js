import React, { PureComponent } from 'react'
import moment from 'moment'
import { connect } from 'dva'
import { FieldArray } from 'formik'
import { getUniqueGUID } from 'utils'
import { withStyles } from '@material-ui/core'
import Add from '@material-ui/icons/Add'
import { AuthorizedContext, Button } from '@/components'
import Authorized from '@/utils/Authorized'
import ICD10DiagnosisItem from './item'
import { USER_PREFERENCE_TYPE } from '@/utils/constants'

const styles = theme => ({
  diagnosisRow: {
    marginBottom: theme.spacing(1),
    padding: theme.spacing(0.5),
  },
})
@connect(({ diagnosis, codetable, consultation }) => ({
  diagnosis,
  codetable,
  consultation,
}))
class ICD10Diagnosis extends PureComponent {
  componentDidMount() {
    const { dispatch } = this.props
    this.fetchCodeTables()
  }

  componentWillReceiveProps(nextProps) {
    if (
      !this.props.diagnosis.shouldAddNew &&
      nextProps.diagnosis.shouldAddNew
    ) {
      let index = 0
      if (this.diagnosises.length === 0) {
        index = 1
      } else {
        index = this.diagnosises[this.diagnosises.length - 1].sequence
      }
      this.addDiagnosis(index + 1)
      this.props.dispatch({
        type: 'diagnosis/updateState',
        payload: {
          shouldAddNew: false,
        },
      })
    }
  }

  fetchCodeTables = async () => {
    const { dispatch } = this.props
    await Promise.all([
      dispatch({
        type: 'codetable/fetchCodes',
        payload: {
          code: 'ctComplication',
        },
      }),
      dispatch({
        type: 'codetable/fetchCodes',
        payload: { code: 'userpreference' },
      }),
    ]).then(() => {
      dispatch({
        type: 'diagnosis/getUserPreference',
        payload: {
          type: USER_PREFERENCE_TYPE.FAVOURITEICD10DIAGNOSISSETTING,
        },
      })
      dispatch({
        type: 'diagnosis/getUserPreference',
        payload: {
          type: USER_PREFERENCE_TYPE.FAVOURITEDIAGNOSISLANGUAGESETTING,
        },
      })
    })
  }

  addDiagnosis = index => {
    this.arrayHelpers.push({
      // onsetDate: moment(),
      uid: getUniqueGUID(),
      sequence: index,
      isNew: true,
    })
  }

  handleAddDiagnosisClick = () => {
    let index = 0
    if (this.diagnosis.length === 0) {
      index = 1
    } else {
      index = this.diagnosis[this.diagnosis.length - 1].sequence
    }
    this.addDiagnosis(index + 1)
  }

  saveDiagnosisAsFavourite = (icD10DiagnosisCode, uid) => {
    const { dispatch, diagnosis } = this.props
    let newFavouriteDiagnosis
    let addNewFavorite
    if (
      (diagnosis.favouriteDiagnosis || []).find(d => d === icD10DiagnosisCode)
    ) {
      newFavouriteDiagnosis = (diagnosis.favouriteDiagnosis || []).filter(
        d => d !== icD10DiagnosisCode,
      )
    } else {
      addNewFavorite = true
      newFavouriteDiagnosis = [
        ...(diagnosis.favouriteDiagnosis || []),
        icD10DiagnosisCode,
      ]
    }
    dispatch({
      type: 'diagnosis/saveUserPreference',
      payload: {
        userPreferenceDetails: {
          value: newFavouriteDiagnosis,
          Identifier: 'FavouriteICD10Diagnosis',
        },
        itemIdentifier: 'FavouriteICD10Diagnosis',
        type: '7',
      },
    }).then(r => {
      if (r) {
        dispatch({
          type: 'diagnosis/getUserPreference',
          payload: {
            type: '7',
          },
        }).then(response => {
          if (response) {
            const { form } = this.arrayHelpers
            const { values, setFieldValue } = form
            setFieldValue(
              'corDiagnosis',
              (values.corDiagnosis || []).map(d => {
                if (d.uid === uid) {
                  return {
                    ...d,
                    favouriteDiagnosisMessage: addNewFavorite
                      ? 'Add to favourite successfully'
                      : 'Remove favourite successfully',
                  }
                }
                return d
              }),
            )

            setTimeout(() => {
              this.clearFavouriteDiagnosisMessage(uid)
            }, 3000)
          }
        })
      }
    })
  }

  clearFavouriteDiagnosisMessage = uid => {
    const { form } = this.arrayHelpers
    const { values, setFieldValue } = form
    setFieldValue(
      'corDiagnosis',
      (values.corDiagnosis || []).map(d => {
        if (d.uid === uid) {
          return {
            ...d,
            favouriteDiagnosisMessage: undefined,
          }
        }
        return d
      }),
    )
  }

  getDiagnosisAccessRight = () => {
    const { isEnableEditOrder = true } = this.props
    let right = Authorized.check('queue.consultation.widgets.diagnosis') || {
      rights: 'hidden',
    }
    if (right.rights === 'enable' && !isEnableEditOrder) {
      right = { rights: 'disable' }
    }
    return right
  }

  render() {
    const { rights, diagnosis, dispatch } = this.props

    const favLang = diagnosis.favouriteDiagnosisLanguage
    return (
      <div>
        <FieldArray
          name='corDiagnosis'
          render={arrayHelpers => {
            const { form } = arrayHelpers
            const { values } = form
            this.diagnosis = values.corDiagnosis || []
            this.arrayHelpers = arrayHelpers
            if (this.diagnosis.length === 0) {
              if (rights === 'enable') {
                this.addDiagnosis(1)
                return null
              }
            }
            return this.diagnosis.map((v, i) => {
              if (v.isDeleted === true) return null
              return (
                <AuthorizedContext.Provider
                  value={this.getDiagnosisAccessRight()}
                >
                  <div key={v.uid}>
                    <ICD10DiagnosisItem
                      {...this.props}
                      index={i}
                      arrayHelpers={arrayHelpers}
                      diagnosis={this.diagnosis}
                      saveDiagnosisAsFavourite={this.saveDiagnosisAsFavourite}
                      uid={v.uid}
                      icD10DiagnosisCode={v.icD10DiagnosisCode}
                      favouriteDiagnosisMessage={v.favouriteDiagnosisMessage}
                      favouriteDiagnosis={diagnosis.favouriteDiagnosis || []}
                      defaultLanguage={
                        diagnosis.favouriteDiagnosisLanguage || favLang
                      }
                    />
                  </div>
                </AuthorizedContext.Provider>
              )
            })
          }}
        />

        <AuthorizedContext.Provider
          value={{
            rights:
              this.getDiagnosisAccessRight().rights !== 'enable'
                ? 'hidden'
                : 'enable',
          }}
        >
          <div>
            <Button
              size='sm'
              color='primary'
              onClick={this.handleAddDiagnosisClick}
            >
              <Add /> Add Diagnosis
            </Button>
          </div>
        </AuthorizedContext.Provider>
      </div>
    )
  }
}

export default withStyles(styles, { withTheme: true })(ICD10Diagnosis)
