import React, { PureComponent } from 'react'
import {
  GridContainer,
  GridItem,
  TextField,
  RadioGroup,
  Button,
  FieldArray,
} from '@/components'
import { FastField, getIn } from 'formik'
import { Delete, Add } from '@material-ui/icons'
import { getUniqueId } from '@/utils/utils'
import { Input } from 'antd'
import withStyles from '@material-ui/core/styles/withStyles'

const style = theme => ({
  inputSplit: {
    backgroundColor: '#fff !important',
    width: '16px !important',
    borderLeft: 0,
    borderRight: 0,
    pointerEvents: 'none',
    textAlign: 'center !important',
    margin: '4px 0 !important',
    lineHeight: '1.3',
  },
  inputLeft: {
    width: '50px !important',
    textAlign: 'center !important',
    borderRightWidth: '0 !important',
    margin: '4px 0 !important',
    lineHeight: '1.3',
  },
  inputRight: {
    width: '50px !important',
    textAlign: 'center !important',
    borderLeftWidth: '0 !important',
    margin: '4px 0 !important',
    lineHeight: '1.3',
  },
})

const InputGroup = (leftProp, rightProp, classes) => (
  <Input.Group compact>
    <FastField
      name={leftProp}
      render={args => (
        <Input className={classes.inputLeft} {...args} {...args.field} />
      )}
    />
    <Input className={classes.inputSplit} placeholder='/' disabled />
    <FastField
      name={rightProp}
      render={args => (
        <Input className={classes.inputRight} {...args} {...args.field} />
      )}
    />
  </Input.Group>
)
class VisionRefraction extends PureComponent {
  constructor(props) {
    super(props)
    this.state = {}
  }

  addPresentSpectacles = () => {
    const { prefixProp, classes } = this.props
    const { form } = this.arrayHelpers
    const { setFieldValue, values } = form
    const present = getIn(values, prefixProp) || {}
    const presentSpectacles =
      getIn(values, `${prefixProp}.corVisionRefraction_PresentSpectacles`) || []
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
    return (
      <div style={{ marginTop: 8 }}>
        <span style={{ fontWeight: 500, fontSize: '1rem' }}>
          Vision and Refraction
        </span>
        <div
          style={{
            padding: '0px 8px',
          }}
        >
          <div
            style={{
              border: '2px solid #CCCCCC',
              width: '100%',
              borderBottom: 'none',
              padding: 6,
            }}
          >
            <div style={{ fontWeight: 500 }}> Present Spectacles Details</div>
            <FieldArray
              name={`${prefixProp}.corVisionRefraction_PresentSpectacles`}
              render={arrayHelpers => {
                this.arrayHelpers = arrayHelpers
                const presentSpectacles =
                  getIn(
                    arrayHelpers.form.values,
                    `${prefixProp}.corVisionRefraction_PresentSpectacles`,
                  ) || []
                const activePresentSpectacles = presentSpectacles.filter(
                  val => !val.isDeleted,
                )
                return activePresentSpectacles.map((val, activeIndex) => {
                  const i = presentSpectacles.findIndex(presentSpectacle =>
                    val.id
                      ? presentSpectacle.id === val.id
                      : val.uid === presentSpectacle.uid,
                  )
                  const presentSpectaclesItem = `${prefixProp}.corVisionRefraction_PresentSpectacles[${i}]`
                  return (
                    <div key={i} style={{ margin: '6px 0px' }}>
                      <GridContainer
                        style={{ position: 'relative', paddingLeft: 160 }}
                      >
                        <div
                          style={{
                            textAlign: 'right',
                            position: 'absolute',
                            top: 8,
                            left: 0,
                            width: 160,
                          }}
                        >
                          Distance Prescription
                        </div>
                        <GridItem md={11} container>
                          <GridItem
                            md={1}
                            style={{ position: 'relative', top: 8 }}
                          >
                            RE
                          </GridItem>
                          <GridItem md={2}>
                            <FastField
                              name={`${presentSpectaclesItem}.distancePrescription_RE_SPH`}
                              render={args => (
                                <TextField
                                  maxLength={500}
                                  label='SPH'
                                  {...args}
                                />
                              )}
                            />
                          </GridItem>
                          <GridItem md={1} className={classes.symbolText}>
                            / -
                          </GridItem>
                          <GridItem md={2}>
                            <FastField
                              name={`${presentSpectaclesItem}.distancePrescription_RE_CYL`}
                              render={args => (
                                <TextField
                                  maxLength={500}
                                  label='CYL'
                                  {...args}
                                />
                              )}
                            />
                          </GridItem>
                          <GridItem md={1} className={classes.symbolText}>
                            x
                          </GridItem>
                          <GridItem md={2}>
                            <FastField
                              name={`${presentSpectaclesItem}.distancePrescription_RE_AXIS`}
                              render={args => (
                                <TextField
                                  maxLength={500}
                                  label='AXIS'
                                  {...args}
                                />
                              )}
                            />
                          </GridItem>
                          <GridItem md={3} container>
                            <GridItem md={3} className={classes.symbolText}>
                              VA
                            </GridItem>
                            <GridItem md={9}>
                              {InputGroup(
                                `${presentSpectaclesItem}.distancePrescription_RE_VA`,
                                `${presentSpectaclesItem}.distancePrescription_RE_VA_Comments`,
                                classes,
                              )}
                            </GridItem>
                          </GridItem>
                          <GridItem
                            md={1}
                            style={{ position: 'relative', top: 8 }}
                          >
                            LE
                          </GridItem>
                          <GridItem md={2}>
                            <FastField
                              name={`${presentSpectaclesItem}.distancePrescription_LE_SPH`}
                              render={args => (
                                <TextField
                                  maxLength={500}
                                  label='SPH'
                                  {...args}
                                />
                              )}
                            />
                          </GridItem>
                          <GridItem md={1} className={classes.symbolText}>
                            / -
                          </GridItem>
                          <GridItem md={2}>
                            <FastField
                              name={`${presentSpectaclesItem}.distancePrescription_LE_CYL`}
                              render={args => (
                                <TextField
                                  maxLength={500}
                                  label='CYL'
                                  {...args}
                                />
                              )}
                            />
                          </GridItem>
                          <GridItem md={1} className={classes.symbolText}>
                            x
                          </GridItem>
                          <GridItem md={2}>
                            <FastField
                              name={`${presentSpectaclesItem}.distancePrescription_LE_AXIS`}
                              render={args => (
                                <TextField
                                  maxLength={500}
                                  label='AXIS'
                                  {...args}
                                />
                              )}
                            />
                          </GridItem>
                          <GridItem md={3} container>
                            <GridItem md={3} className={classes.symbolText}>
                              VA
                            </GridItem>
                            <GridItem md={9}>
                              {InputGroup(
                                `${presentSpectaclesItem}.distancePrescription_LE_VA`,
                                `${presentSpectaclesItem}.distancePrescription_LE_VA_Comments`,
                                classes,
                              )}
                            </GridItem>
                          </GridItem>
                        </GridItem>
                        <GridItem md={1}>
                          {activePresentSpectacles.length > 1 && (
                            <Button justIcon color='danger'>
                              <Delete
                                onClick={() => {
                                  const { form } = this.arrayHelpers
                                  const { setFieldValue } = form
                                  setFieldValue(
                                    `${presentSpectaclesItem}.isDeleted`,
                                    true,
                                  )
                                }}
                              />
                            </Button>
                          )}
                        </GridItem>
                      </GridContainer>
                      <GridContainer
                        style={{ position: 'relative', paddingLeft: 160 }}
                      >
                        <div
                          style={{
                            textAlign: 'right',
                            position: 'absolute',
                            top: 8,
                            left: 0,
                            width: 160,
                          }}
                        >
                          Near Addition
                        </div>
                        <GridItem md={11} container>
                          <GridItem
                            md={1}
                            style={{ position: 'relative', top: 8 }}
                          >
                            RE
                          </GridItem>
                          <GridItem md={2}>
                            <FastField
                              name={`${presentSpectaclesItem}.nearAddition_RE_Value`}
                              render={args => (
                                <TextField maxLength={500} label='' {...args} />
                              )}
                            />
                          </GridItem>
                          <GridItem md={1} className={classes.symbolText}>
                            NVA
                          </GridItem>
                          <GridItem md={2}>
                            <FastField
                              name={`${presentSpectaclesItem}.nearAddition_RE_NVA`}
                              render={args => (
                                <TextField maxLength={500} label='' {...args} />
                              )}
                            />
                          </GridItem>
                          <GridItem md={1} className={classes.symbolText}>
                            @
                          </GridItem>
                          <GridItem md={2}>
                            <FastField
                              name={`${presentSpectaclesItem}.nearAddition_RE_CM`}
                              render={args => (
                                <TextField maxLength={500} label='' {...args} />
                              )}
                            />
                          </GridItem>
                          <GridItem
                            md={1}
                            style={{ position: 'relative', top: 8 }}
                          >
                            cm
                          </GridItem>
                          <GridItem md={2}></GridItem>
                          <GridItem
                            md={1}
                            style={{ position: 'relative', top: 8 }}
                          >
                            LE
                          </GridItem>
                          <GridItem md={2}>
                            <FastField
                              name={`${presentSpectaclesItem}.nearAddition_LE_Value`}
                              render={args => (
                                <TextField maxLength={500} label='' {...args} />
                              )}
                            />
                          </GridItem>
                          <GridItem md={1} className={classes.symbolText}>
                            NVA
                          </GridItem>
                          <GridItem md={2}>
                            <FastField
                              name={`${presentSpectaclesItem}.nearAddition_LE_NVA`}
                              render={args => (
                                <TextField maxLength={500} label='' {...args} />
                              )}
                            />
                          </GridItem>
                          <GridItem md={1} className={classes.symbolText}>
                            @
                          </GridItem>
                          <GridItem md={2}>
                            <FastField
                              name={`${presentSpectaclesItem}.nearAddition_LE_CM`}
                              render={args => (
                                <TextField maxLength={500} label='' {...args} />
                              )}
                            />
                          </GridItem>
                          <GridItem
                            md={1}
                            style={{ position: 'relative', top: 8 }}
                          >
                            cm
                          </GridItem>
                          <GridItem md={2}></GridItem>
                        </GridItem>
                      </GridContainer>
                      <GridContainer
                        style={{ position: 'relative', paddingLeft: 160 }}
                      >
                        <div
                          style={{
                            textAlign: 'right',
                            position: 'absolute',
                            top: 8,
                            left: 0,
                            width: 160,
                          }}
                        >
                          Remarks
                        </div>
                        <GridItem md={11} container>
                          <FastField
                            name={`${presentSpectaclesItem}.remarks`}
                            render={args => (
                              <TextField maxLength={2000} label='' {...args} />
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
              border: '2px solid #CCCCCC',
              width: '100%',
              borderBottom: 'none',
              padding: 6,
            }}
          >
            <div style={{ fontWeight: 500 }}> Unaided VA</div>
            <GridContainer style={{ position: 'relative', paddingLeft: 160 }}>
              <div
                style={{
                  textAlign: 'right',
                  position: 'absolute',
                  top: 8,
                  left: 0,
                  width: 160,
                }}
              >
                Distance
              </div>
              <GridItem md={11} container>
                <GridItem md={1} style={{ position: 'relative', top: 8 }}>
                  RE
                </GridItem>
                <GridItem md={3} container>
                  <GridItem md={3} className={classes.symbolText}>
                    VA
                  </GridItem>
                  <GridItem md={9}>
                    {InputGroup(
                      `${prefixProp}.unaidedVA_Distance_RE_VA`,
                      `${prefixProp}.unaidedVA_Distance_RE_VA_Comments`,
                      classes,
                    )}
                  </GridItem>
                </GridItem>
                <GridItem md={8} />
                <GridItem md={1} style={{ position: 'relative', top: 8 }}>
                  LE
                </GridItem>
                <GridItem md={3} container>
                  <GridItem md={3} className={classes.symbolText}>
                    VA
                  </GridItem>
                  <GridItem md={9}>
                    {InputGroup(
                      `${prefixProp}.unaidedVA_Distance_LE_VA`,
                      `${prefixProp}.unaidedVA_Distance_LE_VA_Comments`,
                      classes,
                    )}
                  </GridItem>
                </GridItem>
              </GridItem>
            </GridContainer>
            <GridContainer style={{ position: 'relative', paddingLeft: 160 }}>
              <div
                style={{
                  textAlign: 'right',
                  position: 'absolute',
                  top: 8,
                  left: 0,
                  width: 160,
                }}
              >
                Near Habitual VA
              </div>
              <GridItem md={11} container>
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
                      <TextField maxLength={500} label='' {...args} />
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
                      <TextField maxLength={500} label='' {...args} />
                    )}
                  />
                </GridItem>
                <GridItem md={1} style={{ position: 'relative', top: 8 }}>
                  cm
                </GridItem>
                <GridItem md={4} />
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
                      <TextField maxLength={500} label='' {...args} />
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
                      <TextField maxLength={500} label='' {...args} />
                    )}
                  />
                </GridItem>
                <GridItem md={1} style={{ position: 'relative', top: 8 }}>
                  cm
                </GridItem>
              </GridItem>
            </GridContainer>
            <GridContainer style={{ position: 'relative', paddingLeft: 160 }}>
              <div
                style={{
                  textAlign: 'right',
                  position: 'absolute',
                  top: 8,
                  left: 0,
                  width: 160,
                }}
              >
                Remarks
              </div>
              <GridItem md={11} container>
                <FastField
                  name={`${prefixProp}.unaidedVA_Remarks`}
                  render={args => (
                    <TextField maxLength={2000} label='' {...args} />
                  )}
                />
              </GridItem>
            </GridContainer>
          </div>
          <div
            style={{
              border: '2px solid #CCCCCC',
              width: '100%',
              borderBottom: 'none',
              padding: 6,
            }}
          >
            <div style={{ fontWeight: 500 }}> Pupillary Distance</div>
            <GridContainer style={{ position: 'relative', paddingLeft: 160 }}>
              <div
                style={{
                  textAlign: 'right',
                  position: 'absolute',
                  top: 8,
                  left: 0,
                  width: 160,
                }}
              >
                Far / Near PD
              </div>
              <GridItem md={11} container>
                <GridItem md={2}>
                  <FastField
                    name={`${prefixProp}.pupillaryDistance_Far`}
                    render={args => (
                      <TextField maxLength={500} label='' {...args} />
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
                      <TextField maxLength={500} label='' {...args} />
                    )}
                  />
                </GridItem>
              </GridItem>
            </GridContainer>
          </div>
          <div
            style={{
              border: '2px solid #CCCCCC',
              width: '100%',
              borderBottom: 'none',
              padding: 6,
            }}
          >
            <div style={{ fontWeight: 500 }}> Objective Refraction</div>
            <GridContainer style={{ position: 'relative', paddingLeft: 160 }}>
              <div
                style={{
                  textAlign: 'right',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: 160,
                }}
              >
                Method
              </div>
              <GridItem md={11} container>
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
            <GridContainer style={{ position: 'relative', paddingLeft: 160 }}>
              <div
                style={{
                  textAlign: 'right',
                  position: 'absolute',
                  top: 8,
                  left: 0,
                  width: 160,
                }}
              ></div>
              <GridItem md={11} container>
                <GridItem md={1} style={{ position: 'relative', top: 8 }}>
                  RE
                </GridItem>
                <GridItem md={2}>
                  <FastField
                    name={`${prefixProp}.objectiveRefraction_RE_SPH`}
                    render={args => (
                      <TextField maxLength={500} label='' {...args} />
                    )}
                  />
                </GridItem>
                <GridItem md={1} className={classes.symbolText}>
                  / -
                </GridItem>
                <GridItem md={2}>
                  <FastField
                    name={`${prefixProp}.objectiveRefraction_RE_CYL`}
                    render={args => (
                      <TextField maxLength={500} label='' {...args} />
                    )}
                  />
                </GridItem>
                <GridItem md={1} className={classes.symbolText}>
                  x
                </GridItem>
                <GridItem md={2}>
                  <FastField
                    name={`${prefixProp}.objectiveRefraction_RE_AXIS`}
                    render={args => (
                      <TextField maxLength={500} label='' {...args} />
                    )}
                  />
                </GridItem>
                <GridItem md={3} container>
                  <GridItem md={3} className={classes.symbolText}>
                    VA
                  </GridItem>
                  <GridItem md={9}>
                    {InputGroup(
                      `${prefixProp}.objectiveRefraction_RE_VA`,
                      `${prefixProp}.objectiveRefraction_RE_VA_Comments`,
                      classes,
                    )}
                  </GridItem>
                </GridItem>
                <GridItem md={1} style={{ position: 'relative', top: 8 }}>
                  LE
                </GridItem>
                <GridItem md={2}>
                  <FastField
                    name={`${prefixProp}.objectiveRefraction_LE_SPH`}
                    render={args => (
                      <TextField maxLength={500} label='' {...args} />
                    )}
                  />
                </GridItem>
                <GridItem md={1} className={classes.symbolText}>
                  / -
                </GridItem>
                <GridItem md={2}>
                  <FastField
                    name={`${prefixProp}.objectiveRefraction_LE_CYL`}
                    render={args => (
                      <TextField maxLength={500} label='' {...args} />
                    )}
                  />
                </GridItem>
                <GridItem md={1} className={classes.symbolText}>
                  x
                </GridItem>
                <GridItem md={2}>
                  <FastField
                    name={`${prefixProp}.objectiveRefraction_LE_AXIS`}
                    render={args => (
                      <TextField maxLength={500} label='' {...args} />
                    )}
                  />
                </GridItem>
                <GridItem md={3} container>
                  <GridItem md={3} className={classes.symbolText}>
                    VA
                  </GridItem>
                  <GridItem md={9}>
                    {InputGroup(
                      `${prefixProp}.objectiveRefraction_LE_VA`,
                      `${prefixProp}.objectiveRefraction_LE_VA_Comments`,
                      classes,
                    )}
                  </GridItem>
                </GridItem>
              </GridItem>
            </GridContainer>
            <GridContainer style={{ position: 'relative', paddingLeft: 160 }}>
              <div
                style={{
                  textAlign: 'right',
                  position: 'absolute',
                  top: 8,
                  left: 0,
                  width: 160,
                }}
              >
                Remarks
              </div>
              <GridItem md={11} container>
                <FastField
                  name={`${prefixProp}.objectiveRefraction_Remarks`}
                  render={args => (
                    <TextField maxLength={2000} label='' {...args} />
                  )}
                />
              </GridItem>
            </GridContainer>
          </div>
          <div
            style={{
              border: '2px solid #CCCCCC',
              width: '100%',
              padding: 6,
            }}
          >
            <div style={{ fontWeight: 500 }}> Subjective Refraction</div>
            <GridContainer style={{ position: 'relative', paddingLeft: 160 }}>
              <div
                style={{
                  textAlign: 'right',
                  position: 'absolute',
                  top: 8,
                  left: 0,
                  width: 160,
                }}
              ></div>
              <GridItem md={11} container>
                <GridItem md={1} style={{ position: 'relative', top: 8 }}>
                  RE
                </GridItem>
                <GridItem md={2}>
                  <FastField
                    name={`${prefixProp}.subjectiveRefraction_RE_SPH`}
                    render={args => (
                      <TextField maxLength={500} label='SPH' {...args} />
                    )}
                  />
                </GridItem>
                <GridItem md={1} className={classes.symbolText}>
                  / -
                </GridItem>
                <GridItem md={2}>
                  <FastField
                    name={`${prefixProp}.subjectiveRefraction_RE_CYL`}
                    render={args => (
                      <TextField maxLength={500} label='CYL' {...args} />
                    )}
                  />
                </GridItem>
                <GridItem md={1} className={classes.symbolText}>
                  x
                </GridItem>
                <GridItem md={2}>
                  <FastField
                    name={`${prefixProp}.subjectiveRefraction_RE_AXIS`}
                    render={args => (
                      <TextField maxLength={500} label='AXIS' {...args} />
                    )}
                  />
                </GridItem>
                <GridItem md={3} container>
                  <GridItem md={3} className={classes.symbolText}>
                    VA
                  </GridItem>
                  <GridItem md={9}>
                    {InputGroup(
                      `${prefixProp}.subjectiveRefraction_RE_VA`,
                      `${prefixProp}.subjectiveRefraction_RE_VA_Comments`,
                      classes,
                    )}
                  </GridItem>
                </GridItem>
                <GridItem md={1} style={{ position: 'relative', top: 8 }}>
                  LE
                </GridItem>
                <GridItem md={2}>
                  <FastField
                    name={`${prefixProp}.subjectiveRefraction_LE_SPH`}
                    render={args => (
                      <TextField maxLength={500} label='SPH' {...args} />
                    )}
                  />
                </GridItem>
                <GridItem md={1} className={classes.symbolText}>
                  / -
                </GridItem>
                <GridItem md={2}>
                  <FastField
                    name={`${prefixProp}.subjectiveRefraction_LE_CYL`}
                    render={args => (
                      <TextField maxLength={500} label='CYL' {...args} />
                    )}
                  />
                </GridItem>
                <GridItem md={1} className={classes.symbolText}>
                  x
                </GridItem>
                <GridItem md={2}>
                  <FastField
                    name={`${prefixProp}.subjectiveRefraction_LE_AXIS`}
                    render={args => (
                      <TextField maxLength={500} label='AXIS' {...args} />
                    )}
                  />
                </GridItem>
                <GridItem md={3} container>
                  <GridItem md={3} className={classes.symbolText}>
                    VA
                  </GridItem>
                  <GridItem md={9}>
                    {InputGroup(
                      `${prefixProp}.subjectiveRefraction_LE_VA`,
                      `${prefixProp}.subjectiveRefraction_LE_VA_Comments`,
                      classes,
                    )}
                  </GridItem>
                </GridItem>
              </GridItem>
            </GridContainer>
            <GridContainer style={{ position: 'relative', paddingLeft: 160 }}>
              <div
                style={{
                  textAlign: 'right',
                  position: 'absolute',
                  top: 8,
                  left: 0,
                  width: 160,
                }}
              >
                Near Addition
              </div>
              <GridItem md={11} container>
                <GridItem md={1} style={{ position: 'relative', top: 8 }}>
                  RE
                </GridItem>
                <GridItem md={2}>
                  <FastField
                    name={`${prefixProp}.subjectiveRefraction_NearAddition_RE_Value`}
                    render={args => (
                      <TextField maxLength={500} label='' {...args} />
                    )}
                  />
                </GridItem>
                <GridItem md={1} className={classes.symbolText}>
                  NVA
                </GridItem>
                <GridItem md={2}>
                  <FastField
                    name={`${prefixProp}.subjectiveRefraction_NearAddition_RE_NVA`}
                    render={args => (
                      <TextField maxLength={500} label='' {...args} />
                    )}
                  />
                </GridItem>
                <GridItem md={1} className={classes.symbolText}>
                  @
                </GridItem>
                <GridItem md={2}>
                  <FastField
                    name={`${prefixProp}.subjectiveRefraction_NearAddition_RE_CM`}
                    render={args => (
                      <TextField maxLength={500} label='' {...args} />
                    )}
                  />
                </GridItem>
                <GridItem md={1} style={{ position: 'relative', top: 8 }}>
                  cm
                </GridItem>
                <GridItem md={2}></GridItem>
                <GridItem md={1} style={{ position: 'relative', top: 8 }}>
                  LE
                </GridItem>
                <GridItem md={2}>
                  <FastField
                    name={`${prefixProp}.subjectiveRefraction_NearAddition_LE_Value`}
                    render={args => (
                      <TextField maxLength={500} label='' {...args} />
                    )}
                  />
                </GridItem>
                <GridItem md={1} className={classes.symbolText}>
                  NVA
                </GridItem>
                <GridItem md={2}>
                  <FastField
                    name={`${prefixProp}.subjectiveRefraction_NearAddition_LE_NVA`}
                    render={args => (
                      <TextField maxLength={500} label='' {...args} />
                    )}
                  />
                </GridItem>
                <GridItem md={1} className={classes.symbolText}>
                  @
                </GridItem>
                <GridItem md={2}>
                  <FastField
                    name={`${prefixProp}.subjectiveRefraction_NearAddition_LE_CM`}
                    render={args => (
                      <TextField maxLength={500} label='' {...args} />
                    )}
                  />
                </GridItem>
                <GridItem md={1} style={{ position: 'relative', top: 8 }}>
                  cm
                </GridItem>
                <GridItem md={2}></GridItem>
              </GridItem>
            </GridContainer>
            <GridContainer style={{ position: 'relative', paddingLeft: 160 }}>
              <div
                style={{
                  textAlign: 'right',
                  position: 'absolute',
                  top: 8,
                  left: 0,
                  width: 160,
                }}
              >
                Remarks
              </div>
              <GridItem md={11} container>
                <FastField
                  name={`${prefixProp}.subjectiveRefraction_NearAddition_Remarks`}
                  render={args => (
                    <TextField maxLength={2000} label='' {...args} />
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
