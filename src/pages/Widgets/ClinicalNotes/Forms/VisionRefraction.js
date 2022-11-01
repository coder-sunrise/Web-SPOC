import React, { useState } from 'react'
import {
  GridContainer,
  GridItem,
  TextField,
  NumberInput,
  RadioGroup,
  Button,
  FieldArray,
} from '@/components'
import { FastField } from 'formik'
import { Delete, Add } from '@material-ui/icons'
import { getUniqueId } from '@/utils/utils'
const VisionRefraction = props => {
  const { prefixProp, classes } = props
  const [currentArrayHelpers, setCurrentArrayHelpers] = useState(undefined)
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
            name={`${prefixProp}.presentSpectacles`}
            render={arrayHelpers => {
              if (!currentArrayHelpers) {
                setCurrentArrayHelpers(arrayHelpers)
              }
              const presentSpectacles = (
                arrayHelpers.form.values[prefixProp].presentSpectacles || []
              ).filter(val => !val.isDeleted)
              return presentSpectacles.map((val, activeIndex) => {
                if (val && val.isDeleted) return null
                const i = arrayHelpers.form.values[
                  prefixProp
                ].presentSpectacles.findIndex(presentSpectacle =>
                  val.id
                    ? presentSpectacle.id === val.id
                    : val.uid === presentSpectacle.uid,
                )
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
                            name={`${prefixProp}.chequeNo`}
                            render={args => <NumberInput label='' {...args} />}
                          />
                        </GridItem>
                        <GridItem md={1} className={classes.symbolText}>
                          / -
                        </GridItem>
                        <GridItem md={2}>
                          <FastField
                            name={`${prefixProp}.chequeNo`}
                            render={args => <NumberInput label='' {...args} />}
                          />
                        </GridItem>
                        <GridItem md={1} className={classes.symbolText}>
                          x
                        </GridItem>
                        <GridItem md={2}>
                          <FastField
                            name={`${prefixProp}.chequeNo`}
                            render={args => <NumberInput label='' {...args} />}
                          />
                        </GridItem>
                        <GridItem md={1} className={classes.symbolText}>
                          VA
                        </GridItem>
                        <GridItem
                          md={2}
                          container
                          style={{ position: 'relative', paddingLeft: 30 }}
                        >
                          <div
                            style={{ position: 'absolute', left: 8, top: 8 }}
                          >
                            6 /
                          </div>
                          <FastField
                            name={`${prefixProp}.chequeNo`}
                            render={args => <NumberInput label='' {...args} />}
                          />
                        </GridItem>
                        <GridItem
                          md={1}
                          style={{ position: 'relative', top: 8 }}
                        >
                          LE
                        </GridItem>
                        <GridItem md={2}>
                          <FastField
                            name={`${prefixProp}.chequeNo`}
                            render={args => <NumberInput label='' {...args} />}
                          />
                        </GridItem>
                        <GridItem md={1} className={classes.symbolText}>
                          / -
                        </GridItem>
                        <GridItem md={2}>
                          <FastField
                            name={`${prefixProp}.chequeNo`}
                            render={args => <NumberInput label='' {...args} />}
                          />
                        </GridItem>
                        <GridItem md={1} className={classes.symbolText}>
                          x
                        </GridItem>
                        <GridItem md={2}>
                          <FastField
                            name={`${prefixProp}.chequeNo`}
                            render={args => <NumberInput label='' {...args} />}
                          />
                        </GridItem>
                        <GridItem md={1} className={classes.symbolText}>
                          VA
                        </GridItem>
                        <GridItem
                          md={2}
                          container
                          style={{ position: 'relative', paddingLeft: 30 }}
                        >
                          <div
                            style={{ position: 'absolute', left: 8, top: 8 }}
                          >
                            6 /
                          </div>
                          <FastField
                            name={`${prefixProp}.chequeNo`}
                            render={args => <NumberInput label='' {...args} />}
                          />
                        </GridItem>
                      </GridItem>
                      <GridItem md={1}>
                        {presentSpectacles.length > 1 && (
                          <Button justIcon color='danger'>
                            <Delete
                              onClick={() => {
                                const { form } = currentArrayHelpers
                                const { setFieldValue } = form
                                setFieldValue(
                                  `${prefixProp}.presentSpectacles[${i}].isDeleted`,
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
                            name={`${prefixProp}.chequeNo`}
                            render={args => <NumberInput label='' {...args} />}
                          />
                        </GridItem>
                        <GridItem md={1} className={classes.symbolText}>
                          NVA
                        </GridItem>
                        <GridItem md={2}>
                          <FastField
                            name={`${prefixProp}.chequeNo`}
                            render={args => <NumberInput label='' {...args} />}
                          />
                        </GridItem>
                        <GridItem md={1} className={classes.symbolText}>
                          @
                        </GridItem>
                        <GridItem md={2}>
                          <FastField
                            name={`${prefixProp}.chequeNo`}
                            render={args => <NumberInput label='' {...args} />}
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
                            name={`${prefixProp}.chequeNo`}
                            render={args => <NumberInput label='' {...args} />}
                          />
                        </GridItem>
                        <GridItem md={1} className={classes.symbolText}>
                          NVA
                        </GridItem>
                        <GridItem md={2}>
                          <FastField
                            name={`${prefixProp}.chequeNo`}
                            render={args => <NumberInput label='' {...args} />}
                          />
                        </GridItem>
                        <GridItem md={1} className={classes.symbolText}>
                          @
                        </GridItem>
                        <GridItem md={2}>
                          <FastField
                            name={`${prefixProp}.chequeNo`}
                            render={args => <NumberInput label='' {...args} />}
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
                          name={`${prefixProp}.chequeNo`}
                          render={args => <TextField label='' {...args} />}
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
            onClick={() => {
              const { form } = currentArrayHelpers
              const { setFieldValue, values } = form
              setFieldValue(prefixProp, {
                ...values[prefixProp],
                presentSpectacles: [
                  values[prefixProp].presentSpectacles,
                  { uid: getUniqueId() },
                ],
              })
            }}
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
              <GridItem md={1} className={classes.symbolText}>
                VA
              </GridItem>
              <GridItem
                md={2}
                container
                style={{ position: 'relative', paddingLeft: 30 }}
              >
                <div style={{ position: 'absolute', left: 8, top: 8 }}>6 /</div>
                <FastField
                  name={`${prefixProp}.chequeNo`}
                  render={args => <NumberInput label='' {...args} />}
                />
              </GridItem>
              <GridItem md={8} />
              <GridItem md={1} style={{ position: 'relative', top: 8 }}>
                LE
              </GridItem>
              <GridItem md={1} className={classes.symbolText}>
                VA
              </GridItem>
              <GridItem
                md={2}
                container
                style={{ position: 'relative', paddingLeft: 30 }}
              >
                <div style={{ position: 'absolute', left: 8, top: 8 }}>6 /</div>
                <FastField
                  name={`${prefixProp}.chequeNo`}
                  render={args => <NumberInput label='' {...args} />}
                />
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
                  name={`${prefixProp}.chequeNo`}
                  render={args => <NumberInput label='' {...args} />}
                />
              </GridItem>
              <GridItem md={1} className={classes.symbolText}>
                @
              </GridItem>
              <GridItem md={2}>
                <FastField
                  name={`${prefixProp}.chequeNo`}
                  render={args => <NumberInput label='' {...args} />}
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
                  name={`${prefixProp}.chequeNo`}
                  render={args => <NumberInput label='' {...args} />}
                />
              </GridItem>
              <GridItem md={1} className={classes.symbolText}>
                @
              </GridItem>
              <GridItem md={2}>
                <FastField
                  name={`${prefixProp}.chequeNo`}
                  render={args => <NumberInput label='' {...args} />}
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
                name={`${prefixProp}.chequeNo`}
                render={args => <TextField label='' {...args} />}
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
                  name={`${prefixProp}.chequeNo`}
                  render={args => <NumberInput label='' {...args} />}
                />
              </GridItem>
              <GridItem md={1} className={classes.symbolText}>
                /
              </GridItem>
              <GridItem md={2}>
                <FastField
                  name={`${prefixProp}.chequeNo`}
                  render={args => <NumberInput label='' {...args} />}
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
                name={`${prefixProp}.ObjectiveRefractionMethod`}
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
                  name={`${prefixProp}.chequeNo`}
                  render={args => <NumberInput label='' {...args} />}
                />
              </GridItem>
              <GridItem md={1} className={classes.symbolText}>
                / -
              </GridItem>
              <GridItem md={2}>
                <FastField
                  name={`${prefixProp}.chequeNo`}
                  render={args => <NumberInput label='' {...args} />}
                />
              </GridItem>
              <GridItem md={1} className={classes.symbolText}>
                x
              </GridItem>
              <GridItem md={2}>
                <FastField
                  name={`${prefixProp}.chequeNo`}
                  render={args => <NumberInput label='' {...args} />}
                />
              </GridItem>
              <GridItem md={1} className={classes.symbolText}>
                VA
              </GridItem>
              <GridItem
                md={2}
                container
                style={{ position: 'relative', paddingLeft: 30 }}
              >
                <div style={{ position: 'absolute', left: 8, top: 8 }}>6 /</div>
                <FastField
                  name={`${prefixProp}.chequeNo`}
                  render={args => <NumberInput label='' {...args} />}
                />
              </GridItem>
              <GridItem md={1} style={{ position: 'relative', top: 8 }}>
                LE
              </GridItem>
              <GridItem md={2}>
                <FastField
                  name={`${prefixProp}.chequeNo`}
                  render={args => <NumberInput label='' {...args} />}
                />
              </GridItem>
              <GridItem md={1} className={classes.symbolText}>
                / -
              </GridItem>
              <GridItem md={2}>
                <FastField
                  name={`${prefixProp}.chequeNo`}
                  render={args => <NumberInput label='' {...args} />}
                />
              </GridItem>
              <GridItem md={1} className={classes.symbolText}>
                x
              </GridItem>
              <GridItem md={2}>
                <FastField
                  name={`${prefixProp}.chequeNo`}
                  render={args => <NumberInput label='' {...args} />}
                />
              </GridItem>
              <GridItem md={1} className={classes.symbolText}>
                VA
              </GridItem>
              <GridItem
                md={2}
                container
                style={{ position: 'relative', paddingLeft: 30 }}
              >
                <div style={{ position: 'absolute', left: 8, top: 8 }}>6 /</div>
                <FastField
                  name={`${prefixProp}.chequeNo`}
                  render={args => <NumberInput label='' {...args} />}
                />
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
                name={`${prefixProp}.chequeNo`}
                render={args => <TextField label='' {...args} />}
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
                  name={`${prefixProp}.chequeNo`}
                  render={args => <NumberInput label='' {...args} />}
                />
              </GridItem>
              <GridItem md={1} className={classes.symbolText}>
                / -
              </GridItem>
              <GridItem md={2}>
                <FastField
                  name={`${prefixProp}.chequeNo`}
                  render={args => <NumberInput label='' {...args} />}
                />
              </GridItem>
              <GridItem md={1} className={classes.symbolText}>
                x
              </GridItem>
              <GridItem md={2}>
                <FastField
                  name={`${prefixProp}.chequeNo`}
                  render={args => <NumberInput label='' {...args} />}
                />
              </GridItem>
              <GridItem md={1} className={classes.symbolText}>
                VA
              </GridItem>
              <GridItem
                md={2}
                container
                style={{ position: 'relative', paddingLeft: 30 }}
              >
                <div style={{ position: 'absolute', left: 8, top: 8 }}>6 /</div>
                <FastField
                  name={`${prefixProp}.chequeNo`}
                  render={args => <NumberInput label='' {...args} />}
                />
              </GridItem>
              <GridItem md={1} style={{ position: 'relative', top: 8 }}>
                LE
              </GridItem>
              <GridItem md={2}>
                <FastField
                  name={`${prefixProp}.chequeNo`}
                  render={args => <NumberInput label='' {...args} />}
                />
              </GridItem>
              <GridItem md={1} className={classes.symbolText}>
                / -
              </GridItem>
              <GridItem md={2}>
                <FastField
                  name={`${prefixProp}.chequeNo`}
                  render={args => <NumberInput label='' {...args} />}
                />
              </GridItem>
              <GridItem md={1} className={classes.symbolText}>
                x
              </GridItem>
              <GridItem md={2}>
                <FastField
                  name={`${prefixProp}.chequeNo`}
                  render={args => <NumberInput label='' {...args} />}
                />
              </GridItem>
              <GridItem md={1} className={classes.symbolText}>
                VA
              </GridItem>
              <GridItem
                md={2}
                container
                style={{ position: 'relative', paddingLeft: 30 }}
              >
                <div style={{ position: 'absolute', left: 8, top: 8 }}>6 /</div>
                <FastField
                  name={`${prefixProp}.chequeNo`}
                  render={args => <NumberInput label='' {...args} />}
                />
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
                  name={`${prefixProp}.chequeNo`}
                  render={args => <NumberInput label='' {...args} />}
                />
              </GridItem>
              <GridItem md={1} className={classes.symbolText}>
                NVA
              </GridItem>
              <GridItem md={2}>
                <FastField
                  name={`${prefixProp}.chequeNo`}
                  render={args => <NumberInput label='' {...args} />}
                />
              </GridItem>
              <GridItem md={1} className={classes.symbolText}>
                @
              </GridItem>
              <GridItem md={2}>
                <FastField
                  name={`${prefixProp}.chequeNo`}
                  render={args => <NumberInput label='' {...args} />}
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
                  name={`${prefixProp}.chequeNo`}
                  render={args => <NumberInput label='' {...args} />}
                />
              </GridItem>
              <GridItem md={1} className={classes.symbolText}>
                NVA
              </GridItem>
              <GridItem md={2}>
                <FastField
                  name={`${prefixProp}.chequeNo`}
                  render={args => <NumberInput label='' {...args} />}
                />
              </GridItem>
              <GridItem md={1} className={classes.symbolText}>
                @
              </GridItem>
              <GridItem md={2}>
                <FastField
                  name={`${prefixProp}.chequeNo`}
                  render={args => <NumberInput label='' {...args} />}
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
                name={`${prefixProp}.chequeNo`}
                render={args => <TextField label='' {...args} />}
              />
            </GridItem>
          </GridContainer>
        </div>
      </div>
    </div>
  )
}
export default VisionRefraction
