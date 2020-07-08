import React, { useState, Fragment } from 'react'
import { connect } from 'dva'
import { compose } from 'redux'
import Delete from '@material-ui/icons/Delete'
import { withStyles, Divider } from '@material-ui/core'
import _ from 'lodash'
// custom components
import {
  GridContainer,
  GridItem,
  Select,
  ProgressButton,
  TextField,
  Popconfirm,
  notification,
  SizeContainer,
  CustomInputWrapper,
} from '@/components'
// utils

const styles = (theme) => ({
  container: {
    margin: theme.spacing(2),
  },
})
const Templates = ({
  dispatch,
  theme,
  classes,
  appointment: { filterTemplates },
  filterByDoctor,
  filterByApptType,
  handleFilterTemplate,
}) => {
  const [
    templateName,
    setTemplateName,
  ] = useState('')

  const [
    selectedTemplateId,
    setSelectedTemplateId,
  ] = useState(null)

  const saveFilterTemplate = (requestDelete, saveAsFavorite) => {
    let newFilterTemplates = [
      ...filterTemplates,
    ]
    let newTemplateObj
    let newId = 1

    const favTemplateExist = newFilterTemplates.find(
      (template) => template.isFavorite,
    )
    if (favTemplateExist) favTemplateExist.isFavorite = false

    if (selectedTemplateId) {
      const selectedTemplate = filterTemplates.find(
        (template) => template.id === selectedTemplateId,
      )

      newTemplateObj = {
        ...selectedTemplate,
        filterByDoctor,
        filterByApptType,
        isDeleted: !!requestDelete,
        isFavorite: !!saveAsFavorite,
      }

      const selectedTemplateindex = filterTemplates.findIndex(
        (template) => template.id === selectedTemplateId,
      )
      newFilterTemplates[selectedTemplateindex] = newTemplateObj
    } else {
      const latestTemplate = _.maxBy(filterTemplates, 'id')
      if (latestTemplate) newId = latestTemplate.id + 1

      newTemplateObj = {
        id: newId,
        filterByDoctor,
        filterByApptType,
        isFavorite: !!saveAsFavorite,
        templateName,
      }

      newFilterTemplates = [
        ...newFilterTemplates,
        newTemplateObj,
      ]
    }

    newFilterTemplates = newFilterTemplates.filter(
      (template) => !template.isDeleted,
    )

    dispatch({
      type: 'appointment/saveFilterTemplate',
      // payload: null,
      payload: _.sortBy(newFilterTemplates, 'id'),
    }).then((r) => {
      if (r) {
        if (requestDelete) {
          notification.success({
            message: `Template ${newTemplateObj.templateName} deleted`,
          })
          dispatch({
            type: 'appointment/setCurrentFilterTemplate',
            payload: {
              id: false,
            },
          })
          setSelectedTemplateId(undefined)
        } else {
          notification.success({
            message: `Template ${newTemplateObj.templateName} saved`,
          })
        }
        handleFilterTemplate()
        dispatch({
          type: 'appointment/getFilterTemplate',
        })
      }
    })
  }

  const loadTemplate = (selectedId) => {
    dispatch({
      type: 'appointment/setCurrentFilterTemplate',
      payload: {
        id: selectedId,
      },
    })
  }

  return (
    <SizeContainer size='sm'>
      <div>
        <GridContainer gutter={0}>
          <GridItem xs={12}>
            <h5 style={{ fontWeight: 500, lineHeight: 1.3 }}>
              Manage Filter Template
            </h5>
          </GridItem>
          <GridItem xs={8}>
            <Select
              label='My Filter Template'
              strongLabel
              value={selectedTemplateId}
              options={filterTemplates}
              valueField='id'
              labelField='templateName'
              dropdownMatchSelectWidth={false}
              onChange={(v) => {
                setSelectedTemplateId(v)
                setTemplateName('')

                if (v) {
                  loadTemplate(v)
                }
              }}
            />
          </GridItem>
        </GridContainer>

        {selectedTemplateId && (
          <GridContainer gutter={0} style={{ marginTop: 10 }}>
            <GridItem xs={12}>
              <ProgressButton onClick={() => saveFilterTemplate()}>
                Replace
              </ProgressButton>
              <Popconfirm onConfirm={() => saveFilterTemplate(true)}>
                <ProgressButton color='danger' icon={<Delete />}>
                  Delete
                </ProgressButton>
              </Popconfirm>
            </GridItem>
          </GridContainer>
        )}
        {!selectedTemplateId && (
          <Fragment>
            <GridContainer
              gutter={0}
              style={{
                marginTop: theme.spacing(2),
                marginBottom: theme.spacing(1),
              }}
            >
              <GridItem xs={12}>
                <h5 style={{ fontWeight: 500, lineHeight: 1.3 }}>
                  Add New Filter Template
                </h5>
              </GridItem>
              <GridItem xs={8}>
                <TextField
                  label='Filter Template Name'
                  value={templateName}
                  onChange={(e) => setTemplateName(e.target.value)}
                />
              </GridItem>
              <GridItem
                xs={4}
                alignItems='flex-end'
                justify='flex-end'
                container
              >
                <ProgressButton
                  onClick={() => saveFilterTemplate()}
                  disabled={
                    templateName.length === 0 ||
                    filterTemplates.length >= 7 ||
                    (filterByDoctor.length === 0 &&
                      filterByApptType.length === 0)
                  }
                >
                  Save
                </ProgressButton>
              </GridItem>
            </GridContainer>

            <Divider light />
            <div className={classes.fabDiv}>
              <h5
                style={{
                  fontWeight: 500,
                  lineHeight: 1.3,
                  position: 'absolute',
                }}
              >
                Manage Filter Value
              </h5>
              <CustomInputWrapper
                label=''
                style={{ paddingTop: 25 }}
                strongLabel
                labelProps={{
                  shrink: true,
                }}
              >
                <ProgressButton
                  style={{ margin: theme.spacing(1, 0) }}
                  onClick={() => {
                    saveFilterTemplate(false, true)
                  }}
                  disabled={
                    templateName.length === 0 ||
                    (filterByDoctor.length === 0 &&
                      filterByApptType.length === 0)
                  }
                >
                  Save as My Favourite
                </ProgressButton>
                <ul
                  style={{
                    listStyle: 'square',
                    paddingLeft: 16,
                    fontSize: 'smaller',
                  }}
                >
                  <li>
                    <p>Save current filter value as my favourite.</p>
                  </li>
                  <li>
                    <p>
                      System will use favourite filter value on calendar by
                      default.
                    </p>
                  </li>
                </ul>
              </CustomInputWrapper>
            </div>
          </Fragment>
        )}
      </div>
    </SizeContainer>
  )
}

export default compose(
  withStyles(styles, { withTheme: true }),
  connect(({ appointment }) => ({
    appointment,
  })),
)(Templates)