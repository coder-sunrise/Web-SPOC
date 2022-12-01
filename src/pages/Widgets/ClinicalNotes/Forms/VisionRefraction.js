import React, { PureComponent } from 'react'
import {
  GridContainer,
  GridItem,
  TextField,
  RadioGroup,
  Button,
  FieldArray,
  Checkbox,
  Popconfirm,
} from '@/components'
import { FastField, Field } from 'formik'
import { Delete, Add } from '@material-ui/icons'
import { getUniqueId } from '@/utils/utils'
import { Input } from 'antd'
import withStyles from '@material-ui/core/styles/withStyles'
import { Input as MUIInput } from '@material-ui/core'

const antdInput = {
  backgroundColor: '#fff !important',
  margin: '4px 0 !important',
  lineHeight: '1.3',
  padding: '4px 0px 4px 2px',
}
const style = theme => ({
  inputSplit: {
    backgroundColor: '#fff !important',
    width: '10px !important',
    borderLeft: 0,
    borderRight: 0,
    pointerEvents: 'none',
    textAlign: 'center !important',
    margin: '4px 0 !important',
    lineHeight: '1.3',
    padding: '4px 0 ',
  },
  inputLeft: {
    width: '30px !important',
    textAlign: 'center !important',
    borderRightWidth: '0 !important',
    ...antdInput,
  },
  inputRight: {
    width: '30px !important',
    textAlign: 'center !important',
    borderLeftWidth: '0 !important',
    ...antdInput,
  },
  antdInput,
})

const InputGroup = (leftProp, rightProp, classes) => (
  <Input.Group compact>
    <Field
      name={leftProp.name}
      render={args => (
        <Input
          className={classes.inputLeft}
          placeholder={leftProp.label}
          disabled={leftProp.disabled}
          {...args.field}
        />
      )}
    />
    <Input className={classes.inputSplit} placeholder='/' disabled />
    <Field
      name={rightProp.name}
      render={args => (
        <Input
          className={classes.inputRight}
          placeholder={rightProp.label}
          disabled={rightProp.disabled}
          {...args.field}
        />
      )}
    />
  </Input.Group>
)
class VisionRefraction extends PureComponent {
  constructor(props) {
    super(props)
    const { prefixProp, values } = props
    const isVerifiedByOptomertist = _.get(
      values,
      `${prefixProp}.subjectiveRefraction_IsVerifiedByOptomertist`,
    )
    this.state = { isVerifiedByOptomertist }
  }

  addPresentSpectacles = () => {
    const { prefixProp, classes } = this.props
    const { form } = this.arrayHelpers
    const { setFieldValue, values } = form
    const present = _.get(values, prefixProp) || {}
    const presentSpectacles =
      _.get(values, `${prefixProp}.corVisionRefraction_PresentSpectacles`) || []
    setFieldValue(prefixProp, {
      ...present,
      corVisionRefraction_PresentSpectacles: [
        ...presentSpectacles,
        {
          uid: getUniqueId(),
          distancePrescription_RE_VA: '6',
          distancePrescription_LE_VA: '6',
        },
      ],
    })
  }
  render() {
    const { prefixProp, classes } = this.props
    const listProp = `${prefixProp}.corVisionRefraction_PresentSpectacles`
    return (
      <div style={{ margin: '8px 0' }}>
        <span style={{ fontWeight: 500, fontSize: '1rem', margin: 8 }}>
          Vision and Refraction
        </span>
        <div style={{ padding: 8 }}>
          <div
            style={{
              border: '1px solid #CCCCCC',
              width: '100%',
              borderBottom: 'none',
              padding: 6,
            }}
          >
            <div style={{ fontWeight: 500 }}> Present Spectacles Details</div>
            <FieldArray
              name={listProp}
              render={arrayHelpers => {
                this.arrayHelpers = arrayHelpers
                const presentSpectacles =
                  _.get(arrayHelpers.form.values, listProp) || []
                const activePresentSpectacles = presentSpectacles.filter(
                  val => !val.isDeleted,
                )
                return activePresentSpectacles.map((val, activeIndex) => {
                  const i = presentSpectacles.findIndex(presentSpectacle =>
                    val.id
                      ? presentSpectacle.id === val.id
                      : val.uid === presentSpectacle.uid,
                  )
                  const itemProp = `${prefixProp}.corVisionRefraction_PresentSpectacles[${i}]`
                  return (
                    <div key={val.uid || val.id} style={{ margin: '6px 0px' }}>
                      <GridContainer
                        style={{ position: 'relative', paddingRight: 30 }}
                      >
                        <GridItem
                          md={3}
                          style={{ textAlign: 'right', top: 24 }}
                          className={classes.symbolText}
                        >
                          Distance Prescription
                        </GridItem>
                        <GridItem md={9} container>
                          <GridItem
                            md={1}
                            style={{ position: 'relative', top: 24 }}
                          >
                            RE
                          </GridItem>
                          <GridItem md={2}>
                            <FastField
                              name={`${itemProp}.distancePrescription_RE_SPH`}
                              render={args => (
                                <TextField
                                  maxLength={500}
                                  label='SPH'
                                  {...args}
                                />
                              )}
                            />
                          </GridItem>
                          <GridItem
                            md={1}
                            className={classes.symbolText}
                            style={{ top: 24 }}
                          >
                            / -
                          </GridItem>
                          <GridItem md={2}>
                            <FastField
                              name={`${itemProp}.distancePrescription_RE_CYL`}
                              render={args => (
                                <TextField
                                  maxLength={500}
                                  label='CYL'
                                  {...args}
                                />
                              )}
                            />
                          </GridItem>
                          <GridItem
                            md={1}
                            className={classes.symbolText}
                            style={{ top: 24 }}
                          >
                            x
                          </GridItem>
                          <GridItem md={2}>
                            <FastField
                              name={`${itemProp}.distancePrescription_RE_AXIS`}
                              render={args => (
                                <TextField
                                  maxLength={500}
                                  label='AXIS'
                                  {...args}
                                />
                              )}
                            />
                          </GridItem>
                          <GridItem
                            md={1}
                            className={classes.symbolText}
                            style={{ top: 24 }}
                          >
                            VA
                          </GridItem>
                          <GridItem
                            md={2}
                            className={classes.symbolText}
                            style={{ top: 16 }}
                          >
                            {InputGroup(
                              {
                                name: `${itemProp}.distancePrescription_RE_VA`,
                              },
                              {
                                name: `${itemProp}.distancePrescription_RE_VA_Comments`,
                              },
                              classes,
                            )}
                          </GridItem>
                          <GridItem
                            md={1}
                            style={{ position: 'relative', top: 24 }}
                          >
                            LE
                          </GridItem>
                          <GridItem md={2}>
                            <FastField
                              name={`${itemProp}.distancePrescription_LE_SPH`}
                              render={args => (
                                <TextField
                                  maxLength={500}
                                  label='SPH'
                                  {...args}
                                />
                              )}
                            />
                          </GridItem>
                          <GridItem
                            md={1}
                            className={classes.symbolText}
                            style={{ top: 24 }}
                          >
                            / -
                          </GridItem>
                          <GridItem md={2}>
                            <FastField
                              name={`${itemProp}.distancePrescription_LE_CYL`}
                              render={args => (
                                <TextField
                                  maxLength={500}
                                  label='CYL'
                                  {...args}
                                />
                              )}
                            />
                          </GridItem>
                          <GridItem
                            md={1}
                            className={classes.symbolText}
                            style={{ top: 24 }}
                          >
                            x
                          </GridItem>
                          <GridItem md={2}>
                            <FastField
                              name={`${itemProp}.distancePrescription_LE_AXIS`}
                              render={args => (
                                <TextField
                                  maxLength={500}
                                  label='AXIS'
                                  {...args}
                                />
                              )}
                            />
                          </GridItem>
                          <GridItem
                            md={1}
                            className={classes.symbolText}
                            style={{ top: 24 }}
                          >
                            VA
                          </GridItem>
                          <GridItem
                            md={2}
                            className={classes.symbolText}
                            style={{ top: 16 }}
                          >
                            {InputGroup(
                              {
                                name: `${itemProp}.distancePrescription_LE_VA`,
                              },
                              {
                                name: `${itemProp}.distancePrescription_LE_VA_Comments`,
                              },
                              classes,
                            )}
                          </GridItem>
                        </GridItem>
                        <div
                          style={{
                            position: 'absolute',
                            top: 6,
                            right: 8,
                            width: 22,
                          }}
                        >
                          {activePresentSpectacles.length > 1 && (
                            <Popconfirm
                              title='Confirm to delete?'
                              onConfirm={() => {
                                const { form } = this.arrayHelpers
                                const { setFieldValue } = form
                                console.log('val.id', val.id)
                                if (!val.id)
                                  setFieldValue(
                                    `${listProp}`,
                                    presentSpectacles.filter(
                                      i => i.uid != val.uid,
                                    ),
                                  )
                                else
                                  setFieldValue(`${itemProp}.isDeleted`, true)
                              }}
                            >
                              <Button justIcon color='danger'>
                                <Delete />
                              </Button>
                            </Popconfirm>
                          )}
                        </div>
                      </GridContainer>
                      <GridContainer
                        style={{
                          position: 'relative',
                          paddingRight: 30,
                          paddingTop: 8,
                        }}
                      >
                        <GridItem
                          md={3}
                          style={{ textAlign: 'right' }}
                          className={classes.symbolText}
                        >
                          Near Addition
                        </GridItem>
                        <GridItem md={9} container>
                          <GridItem
                            md={1}
                            style={{ position: 'relative', top: 8 }}
                          >
                            RE
                          </GridItem>
                          <GridItem md={2}>
                            <FastField
                              name={`${itemProp}.nearAddition_RE_Value`}
                              render={args => (
                                <Input
                                  className={classes.antdInput}
                                  maxLength={500}
                                  {...args.field}
                                />
                              )}
                            />
                          </GridItem>
                          <GridItem md={1} className={classes.symbolText}>
                            NVA
                          </GridItem>
                          <GridItem md={2}>
                            <FastField
                              name={`${itemProp}.nearAddition_RE_NVA`}
                              render={args => (
                                <Input
                                  className={classes.antdInput}
                                  maxLength={500}
                                  {...args.field}
                                />
                              )}
                            />
                          </GridItem>
                          <GridItem md={1} className={classes.symbolText}>
                            @
                          </GridItem>
                          <GridItem md={2}>
                            <FastField
                              name={`${itemProp}.nearAddition_RE_CM`}
                              render={args => (
                                <Input
                                  className={classes.antdInput}
                                  maxLength={500}
                                  {...args.field}
                                />
                              )}
                            />
                          </GridItem>
                          <GridItem md={1} className={classes.symbolText}>
                            cm
                          </GridItem>
                          <GridItem md={2} />
                          <GridItem
                            md={1}
                            style={{ position: 'relative', top: 8 }}
                          >
                            LE
                          </GridItem>
                          <GridItem md={2}>
                            <FastField
                              name={`${itemProp}.nearAddition_LE_Value`}
                              render={args => (
                                <Input
                                  className={classes.antdInput}
                                  maxLength={500}
                                  {...args.field}
                                />
                              )}
                            />
                          </GridItem>
                          <GridItem md={1} className={classes.symbolText}>
                            NVA
                          </GridItem>
                          <GridItem md={2}>
                            <FastField
                              name={`${itemProp}.nearAddition_LE_NVA`}
                              render={args => (
                                <Input
                                  className={classes.antdInput}
                                  maxLength={500}
                                  {...args.field}
                                />
                              )}
                            />
                          </GridItem>
                          <GridItem md={1} className={classes.symbolText}>
                            @
                          </GridItem>
                          <GridItem md={2}>
                            <FastField
                              name={`${itemProp}.nearAddition_LE_CM`}
                              render={args => (
                                <Input
                                  className={classes.antdInput}
                                  maxLength={500}
                                  {...args.field}
                                />
                              )}
                            />
                          </GridItem>
                          <GridItem md={1} className={classes.symbolText}>
                            cm
                          </GridItem>
                        </GridItem>
                      </GridContainer>
                      <GridContainer
                        style={{ position: 'relative', paddingRight: 30 }}
                      >
                        <GridItem
                          md={3}
                          style={{
                            textAlign: 'right',
                            position: 'relative',
                            top: 8,
                          }}
                        >
                          Remarks
                        </GridItem>
                        <GridItem md={9} container style={{ paddingTop: 4 }}>
                          <FastField
                            name={`${itemProp}.remarks`}
                            render={args => (
                              <MUIInput
                                maxLength={2000}
                                placeholder='e.g. SVD / SVN / PAL / BF'
                                style={{ width: '100%' }}
                                multiline
                                {...args.field}
                              />
                            )}
                          />
                        </GridItem>
                      </GridContainer>
                    </div>
                  )
                })
              }}
            />

            <Button
              color='primary'
              size='sm'
              onClick={this.addPresentSpectacles}
            >
              <Add />
              Add New
            </Button>
          </div>
          <div
            style={{
              border: '1px solid #CCCCCC',
              width: '100%',
              borderBottom: 'none',
              padding: 6,
            }}
          >
            <div style={{ fontWeight: 500 }}> Unaided VA</div>
            <GridContainer>
              <GridItem
                md={3}
                style={{ textAlign: 'right', position: 'relative', top: 8 }}
              >
                Distance
              </GridItem>
              <GridItem md={9} container>
                <GridItem md={1} style={{ position: 'relative', top: 8 }}>
                  RE
                </GridItem>
                <GridItem md={1} className={classes.symbolText}>
                  VA
                </GridItem>
                <GridItem md={10}>
                  {InputGroup(
                    { name: `${prefixProp}.unaidedVA_Distance_RE_VA` },
                    { name: `${prefixProp}.unaidedVA_Distance_RE_VA_Comments` },
                    classes,
                  )}
                </GridItem>
                <GridItem md={1} style={{ position: 'relative', top: 8 }}>
                  LE
                </GridItem>
                <GridItem md={1} className={classes.symbolText}>
                  VA
                </GridItem>
                <GridItem md={10}>
                  {InputGroup(
                    { name: `${prefixProp}.unaidedVA_Distance_LE_VA` },
                    { name: `${prefixProp}.unaidedVA_Distance_LE_VA_Comments` },
                    classes,
                  )}
                </GridItem>
              </GridItem>
            </GridContainer>
            <GridContainer>
              <GridItem
                md={3}
                style={{ textAlign: 'right', position: 'relative', top: 8 }}
              >
                Near Habitual VA
              </GridItem>
              <GridItem md={9} container>
                <GridItem md={1} style={{ position: 'relative', top: 8 }}>
                  RE
                </GridItem>
                <GridItem md={1} className={classes.symbolText}>
                  NVA
                </GridItem>
                <GridItem md={2}>
                  <FastField
                    name={`${prefixProp}.unaidedVA_NearHabitualVA_RE_NVA`}
                    render={args => (
                      <Input
                        maxLength={500}
                        className={classes.antdInput}
                        {...args.field}
                      />
                    )}
                  />
                </GridItem>
                <GridItem md={1} className={classes.symbolText}>
                  @
                </GridItem>
                <GridItem md={2}>
                  <FastField
                    name={`${prefixProp}.unaidedVA_NearHabitualVA_RE_CM`}
                    render={args => (
                      <Input
                        maxLength={500}
                        className={classes.antdInput}
                        {...args.field}
                      />
                    )}
                  />
                </GridItem>
                <GridItem md={5} style={{ position: 'relative', top: 8 }}>
                  cm
                </GridItem>
                <GridItem md={1} style={{ position: 'relative', top: 8 }}>
                  LE
                </GridItem>
                <GridItem md={1} className={classes.symbolText}>
                  NVA
                </GridItem>
                <GridItem md={2}>
                  <FastField
                    name={`${prefixProp}.unaidedVA_NearHabitualVA_LE_NVA`}
                    render={args => (
                      <Input
                        maxLength={500}
                        className={classes.antdInput}
                        {...args.field}
                      />
                    )}
                  />
                </GridItem>
                <GridItem md={1} className={classes.symbolText}>
                  @
                </GridItem>
                <GridItem md={2}>
                  <FastField
                    name={`${prefixProp}.unaidedVA_NearHabitualVA_LE_CM`}
                    render={args => (
                      <Input
                        maxLength={500}
                        className={classes.antdInput}
                        {...args.field}
                      />
                    )}
                  />
                </GridItem>
                <GridItem md={5} style={{ position: 'relative', top: 8 }}>
                  cm
                </GridItem>
              </GridItem>
            </GridContainer>
            <GridContainer>
              <GridItem
                md={3}
                style={{
                  textAlign: 'right',
                  position: 'relative',
                  top: 8,
                }}
              >
                Remarks
              </GridItem>
              <GridItem md={9} container>
                <FastField
                  name={`${prefixProp}.unaidedVA_Remarks`}
                  render={args => (
                    <TextField maxLength={2000} multiline label='' {...args} />
                  )}
                />
              </GridItem>
            </GridContainer>
          </div>
          <div
            style={{
              border: '1px solid #CCCCCC',
              width: '100%',
              borderBottom: 'none',
              padding: 6,
            }}
          >
            <div style={{ fontWeight: 500 }}> Pupillary Distance</div>
            <GridContainer>
              <GridItem
                md={3}
                style={{
                  textAlign: 'right',
                }}
                className={classes.symbolText}
              >
                Far / Near PD
              </GridItem>
              <GridItem md={9} container>
                <GridItem md={2}>
                  <FastField
                    name={`${prefixProp}.pupillaryDistance_Far`}
                    render={args => (
                      <Input
                        maxLength={500}
                        className={classes.antdInput}
                        {...args.field}
                      />
                    )}
                  />
                </GridItem>
                <GridItem md={1} className={classes.symbolText}>
                  /
                </GridItem>
                <GridItem md={2}>
                  <FastField
                    name={`${prefixProp}.pupillaryDistance_NearPD`}
                    render={args => (
                      <Input
                        maxLength={500}
                        className={classes.antdInput}
                        {...args.field}
                      />
                    )}
                  />
                </GridItem>
              </GridItem>
            </GridContainer>
          </div>
          <div
            style={{
              border: '1px solid #CCCCCC',
              width: '100%',
              borderBottom: 'none',
              padding: 6,
            }}
          >
            <div style={{ fontWeight: 500 }}> Objective Refraction</div>
            <GridContainer>
              <GridItem md={3} style={{ textAlign: 'right', paddingTop: 4 }}>
                Method
              </GridItem>
              <GridItem md={9} container>
                <FastField
                  name={`${prefixProp}.objectiveRefraction_Method`}
                  render={args => (
                    <RadioGroup
                      label=' '
                      simple
                      defaultValue='Retinoscopy'
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
                      {...args}
                    />
                  )}
                />
              </GridItem>
            </GridContainer>
            <GridContainer>
              <GridItem md={3} />
              <GridItem md={9} container>
                <GridItem md={1} style={{ position: 'relative', top: 24 }}>
                  RE
                </GridItem>
                <GridItem md={2}>
                  <FastField
                    name={`${prefixProp}.objectiveRefraction_RE_SPH`}
                    render={args => (
                      <TextField maxLength={500} label='SPH' {...args} />
                    )}
                  />
                </GridItem>
                <GridItem
                  md={1}
                  className={classes.symbolText}
                  style={{ top: 24 }}
                >
                  / -
                </GridItem>
                <GridItem md={2}>
                  <FastField
                    name={`${prefixProp}.objectiveRefraction_RE_CYL`}
                    render={args => (
                      <TextField maxLength={500} label='CYL' {...args} />
                    )}
                  />
                </GridItem>
                <GridItem
                  md={1}
                  className={classes.symbolText}
                  style={{ top: 24 }}
                >
                  x
                </GridItem>
                <GridItem md={2}>
                  <FastField
                    name={`${prefixProp}.objectiveRefraction_RE_AXIS`}
                    render={args => (
                      <TextField maxLength={500} label='AXIS' {...args} />
                    )}
                  />
                </GridItem>
                <GridItem
                  md={1}
                  className={classes.symbolText}
                  style={{ top: 24 }}
                >
                  VA
                </GridItem>
                <GridItem
                  md={2}
                  className={classes.symbolText}
                  style={{ top: 16 }}
                >
                  {InputGroup(
                    { name: `${prefixProp}.objectiveRefraction_RE_VA` },
                    {
                      name: `${prefixProp}.objectiveRefraction_RE_VA_Comments`,
                    },
                    classes,
                  )}
                </GridItem>
                <GridItem md={1} style={{ position: 'relative', top: 24 }}>
                  LE
                </GridItem>
                <GridItem md={2}>
                  <FastField
                    name={`${prefixProp}.objectiveRefraction_LE_SPH`}
                    render={args => (
                      <TextField maxLength={500} label='SPH' {...args} />
                    )}
                  />
                </GridItem>
                <GridItem
                  md={1}
                  className={classes.symbolText}
                  style={{ top: 24 }}
                >
                  / -
                </GridItem>
                <GridItem md={2}>
                  <FastField
                    name={`${prefixProp}.objectiveRefraction_LE_CYL`}
                    render={args => (
                      <TextField maxLength={500} label='CYL' {...args} />
                    )}
                  />
                </GridItem>
                <GridItem
                  md={1}
                  className={classes.symbolText}
                  style={{ top: 24 }}
                >
                  x
                </GridItem>
                <GridItem md={2}>
                  <FastField
                    name={`${prefixProp}.objectiveRefraction_LE_AXIS`}
                    render={args => (
                      <TextField maxLength={500} label='AXIS' {...args} />
                    )}
                  />
                </GridItem>
                <GridItem
                  md={1}
                  className={classes.symbolText}
                  style={{ top: 24 }}
                >
                  VA
                </GridItem>
                <GridItem
                  md={2}
                  className={classes.symbolText}
                  style={{ top: 16 }}
                >
                  {InputGroup(
                    { name: `${prefixProp}.objectiveRefraction_LE_VA` },
                    {
                      name: `${prefixProp}.objectiveRefraction_LE_VA_Comments`,
                    },
                    classes,
                  )}
                </GridItem>
              </GridItem>
            </GridContainer>
            <GridContainer>
              <GridItem
                md={3}
                style={{
                  textAlign: 'right',
                  paddingTop: 16,
                }}
              >
                Remarks
              </GridItem>
              <GridItem md={9} container style={{ paddingTop: 8 }}>
                <FastField
                  name={`${prefixProp}.objectiveRefraction_Remarks`}
                  render={args => (
                    <TextField maxLength={2000} multiline label='' {...args} />
                  )}
                />
              </GridItem>
            </GridContainer>
          </div>
          <div
            style={{
              border: '1px solid #CCCCCC',
              width: '100%',
              padding: 6,
            }}
          >
            <div style={{ fontWeight: 500 }}> Subjective Refraction</div>
            <GridContainer>
              <GridItem
                md={3}
                style={{
                  textAlign: 'right',
                  top: 24,
                }}
                className={classes.symbolText}
              >
                Distance Prescription
              </GridItem>
              <GridItem md={9} container>
                <GridItem md={1} style={{ position: 'relative', top: 24 }}>
                  RE
                </GridItem>
                <GridItem md={2}>
                  <Field
                    name={`${prefixProp}.subjectiveRefraction_RE_SPH`}
                    render={args => (
                      <TextField
                        disabled={this.state.isVerifiedByOptomertist}
                        maxLength={500}
                        label='SPH'
                        {...args}
                      />
                    )}
                  />
                </GridItem>
                <GridItem
                  md={1}
                  className={classes.symbolText}
                  style={{ top: 24 }}
                >
                  / -
                </GridItem>
                <GridItem md={2}>
                  <Field
                    name={`${prefixProp}.subjectiveRefraction_RE_CYL`}
                    render={args => (
                      <TextField
                        disabled={this.state.isVerifiedByOptomertist}
                        maxLength={500}
                        label='CYL'
                        {...args}
                      />
                    )}
                  />
                </GridItem>
                <GridItem
                  md={1}
                  className={classes.symbolText}
                  style={{ top: 24 }}
                >
                  x
                </GridItem>
                <GridItem md={1}>
                  <Field
                    name={`${prefixProp}.subjectiveRefraction_RE_AXIS`}
                    render={args => (
                      <TextField
                        disabled={this.state.isVerifiedByOptomertist}
                        maxLength={500}
                        label='AXIS'
                        {...args}
                      />
                    )}
                  />
                </GridItem>
                <GridItem
                  md={1}
                  className={classes.symbolText}
                  style={{ top: 24 }}
                >
                  VA
                </GridItem>
                <GridItem
                  md={2}
                  className={classes.symbolText}
                  style={{ top: 16 }}
                >
                  {InputGroup(
                    {
                      name: `${prefixProp}.subjectiveRefraction_RE_VA`,
                      disabled: this.state.isVerifiedByOptomertist,
                    },
                    {
                      name: `${prefixProp}.subjectiveRefraction_RE_VA_Comments`,
                      disabled: this.state.isVerifiedByOptomertist,
                    },
                    classes,
                  )}
                </GridItem>
                <GridItem
                  md={1}
                  className={classes.symbolText}
                  style={{ top: 16 }}
                >
                  <Field
                    name={`${prefixProp}.subjectiveRefraction_RE_PH`}
                    render={args => (
                      <Input
                        disabled={this.state.isVerifiedByOptomertist}
                        maxLength={500}
                        placeholder='PH'
                        className={classes.antdInput}
                        {...args.field}
                      />
                    )}
                  />
                </GridItem>
                <GridItem md={1} style={{ position: 'relative', top: 24 }}>
                  LE
                </GridItem>
                <GridItem md={2}>
                  <Field
                    name={`${prefixProp}.subjectiveRefraction_LE_SPH`}
                    render={args => (
                      <TextField
                        disabled={this.state.isVerifiedByOptomertist}
                        maxLength={500}
                        label='SPH'
                        {...args}
                      />
                    )}
                  />
                </GridItem>
                <GridItem
                  md={1}
                  className={classes.symbolText}
                  style={{ top: 24 }}
                >
                  / -
                </GridItem>
                <GridItem md={2}>
                  <Field
                    name={`${prefixProp}.subjectiveRefraction_LE_CYL`}
                    render={args => (
                      <TextField
                        disabled={this.state.isVerifiedByOptomertist}
                        maxLength={500}
                        label='CYL'
                        {...args}
                      />
                    )}
                  />
                </GridItem>
                <GridItem
                  md={1}
                  className={classes.symbolText}
                  style={{ top: 24 }}
                >
                  x
                </GridItem>
                <GridItem md={1}>
                  <Field
                    name={`${prefixProp}.subjectiveRefraction_LE_AXIS`}
                    render={args => (
                      <TextField
                        disabled={this.state.isVerifiedByOptomertist}
                        maxLength={500}
                        label='AXIS'
                        {...args}
                      />
                    )}
                  />
                </GridItem>
                <GridItem
                  md={1}
                  className={classes.symbolText}
                  style={{ top: 24 }}
                >
                  VA
                </GridItem>
                <GridItem
                  md={2}
                  className={classes.symbolText}
                  style={{ top: 16 }}
                >
                  {InputGroup(
                    {
                      name: `${prefixProp}.subjectiveRefraction_LE_VA`,
                      disabled: this.state.isVerifiedByOptomertist,
                    },
                    {
                      name: `${prefixProp}.subjectiveRefraction_LE_VA_Comments`,
                      disabled: this.state.isVerifiedByOptomertist,
                    },
                    classes,
                  )}
                </GridItem>
                <GridItem
                  md={1}
                  className={classes.symbolText}
                  style={{ top: 16 }}
                >
                  <Field
                    name={`${prefixProp}.subjectiveRefraction_LE_PH`}
                    render={args => (
                      <Input
                        disabled={this.state.isVerifiedByOptomertist}
                        maxLength={500}
                        placeholder='PH'
                        className={classes.antdInput}
                        {...args.field}
                      />
                    )}
                  />
                </GridItem>
              </GridItem>
            </GridContainer>
            <GridContainer style={{ position: 'relative', paddingTop: 8 }}>
              <GridItem
                md={3}
                style={{ textAlign: 'right', position: 'relative', top: 8 }}
              >
                Near Addition
              </GridItem>
              <GridItem md={9} container>
                <GridItem md={1} style={{ position: 'relative', top: 8 }}>
                  RE
                </GridItem>
                <GridItem md={2}>
                  <Field
                    name={`${prefixProp}.subjectiveRefraction_NearAddition_RE_Value`}
                    render={args => (
                      <Input
                        disabled={this.state.isVerifiedByOptomertist}
                        maxLength={500}
                        className={classes.antdInput}
                        {...args.field}
                      />
                    )}
                  />
                </GridItem>
                <GridItem md={1} className={classes.symbolText}>
                  NVA
                </GridItem>
                <GridItem md={2}>
                  <Field
                    name={`${prefixProp}.subjectiveRefraction_NearAddition_RE_NVA`}
                    render={args => (
                      <Input
                        disabled={this.state.isVerifiedByOptomertist}
                        maxLength={500}
                        className={classes.antdInput}
                        {...args.field}
                      />
                    )}
                  />
                </GridItem>
                <GridItem md={1} className={classes.symbolText}>
                  @
                </GridItem>
                <GridItem md={2}>
                  <Field
                    name={`${prefixProp}.subjectiveRefraction_NearAddition_RE_CM`}
                    render={args => (
                      <Input
                        disabled={this.state.isVerifiedByOptomertist}
                        maxLength={500}
                        className={classes.antdInput}
                        {...args.field}
                      />
                    )}
                  />
                </GridItem>
                <GridItem md={1} className={classes.symbolText}>
                  cm
                </GridItem>
                <GridItem md={2} />
                <GridItem md={1} style={{ position: 'relative', top: 8 }}>
                  LE
                </GridItem>
                <GridItem md={2}>
                  <Field
                    name={`${prefixProp}.subjectiveRefraction_NearAddition_LE_Value`}
                    render={args => (
                      <Input
                        disabled={this.state.isVerifiedByOptomertist}
                        maxLength={500}
                        className={classes.antdInput}
                        {...args.field}
                      />
                    )}
                  />
                </GridItem>
                <GridItem md={1} className={classes.symbolText}>
                  NVA
                </GridItem>
                <GridItem md={2}>
                  <Field
                    name={`${prefixProp}.subjectiveRefraction_NearAddition_LE_NVA`}
                    render={args => (
                      <Input
                        disabled={this.state.isVerifiedByOptomertist}
                        maxLength={500}
                        className={classes.antdInput}
                        {...args.field}
                      />
                    )}
                  />
                </GridItem>
                <GridItem md={1} className={classes.symbolText}>
                  @
                </GridItem>
                <GridItem md={2}>
                  <Field
                    name={`${prefixProp}.subjectiveRefraction_NearAddition_LE_CM`}
                    render={args => (
                      <Input
                        disabled={this.state.isVerifiedByOptomertist}
                        maxLength={500}
                        className={classes.antdInput}
                        {...args.field}
                      />
                    )}
                  />
                </GridItem>
                <GridItem md={1} className={classes.symbolText}>
                  cm
                </GridItem>
                <GridItem md={2} />
              </GridItem>
            </GridContainer>
            <GridContainer>
              <GridItem
                md={3}
                style={{ textAlign: 'right', position: 'relative', top: 8 }}
              >
                Remarks
              </GridItem>
              <GridItem md={9} container>
                <Field
                  name={`${prefixProp}.subjectiveRefraction_NearAddition_Remarks`}
                  render={args => (
                    <TextField
                      disabled={this.state.isVerifiedByOptomertist}
                      maxLength={2000}
                      multiline
                      label=''
                      {...args}
                    />
                  )}
                />
              </GridItem>
            </GridContainer>
            <GridContainer>
              <GridItem md={3} />
              <GridItem md={9} container>
                <FastField
                  name={`${prefixProp}.subjectiveRefraction_IsVerifiedByOptomertist`}
                  render={args => (
                    <Checkbox
                      label={
                        <span>
                          verified by Optomertist
                          <span style={{ color: 'red' }}>
                            {' '}
                            (for Optometrist only)
                          </span>
                        </span>
                      }
                      {...args}
                      onChange={e => {
                        this.setState({
                          isVerifiedByOptomertist: e.target.value,
                        })
                      }}
                    />
                  )}
                />
              </GridItem>
            </GridContainer>
          </div>
        </div>
      </div>
    )
  }
}
export default withStyles(style, { name: 'VisionRefraction' })(VisionRefraction)
