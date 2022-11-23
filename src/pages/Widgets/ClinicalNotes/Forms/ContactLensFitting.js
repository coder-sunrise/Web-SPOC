import {
  GridContainer,
  GridItem,
  TextField,
  Button,
  FieldArray,
  MultipleTextField,
} from '@/components'
import { FastField, getIn } from 'formik'
import { PureComponent } from 'react'
import { getUniqueId } from '@/utils/utils'
import { Delete, Add, Edit } from '@material-ui/icons'
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
const base64Prefix = 'data:image/jpeg;base64,'

class ContactLensFitting extends PureComponent {
  constructor(props) {
    super(props)
    this.state = {}
  }

  addItem = () => {
    const { prefixProp, classes } = this.props
    const { form } = this.arrayHelpers
    const { setFieldValue, values } = form
    const present = getIn(values, prefixProp) || {}
    const items =
      getIn(values, `${prefixProp}.corContactLensFitting_Item`) || []
    setFieldValue(prefixProp, {
      ...present,
      corContactLensFitting_Item: [
        ...items,
        {
          uid: getUniqueId(),
        },
      ],
    })
  }
  render() {
    const {
      prefixProp,
      classes,
      editScribbleNote,
      values,
      defaultImage,
      cavanSize,
      imageSize,
      thumbnailSize,
      position,
      thumbnailDisplaySize,
    } = this.props
    return (
      <GridContainer>
        <GridItem md={12}>
          <span style={{ fontSize: '1.1rem', fontWeight: 500 }}>
            Contact Lens Fitting
          </span>
        </GridItem>
        <GridItem md={12}>Please draw out relevant diagram below.</GridItem>
        <GridItem md={12}>
          <div
            style={{
              border: '2px solid #CCCCCC',
              width: '100%',
              // borderBottom: 'none',
              padding: 6,
            }}
          >
            <div style={{ fontWeight: 500 }}> Present Spectacles Details</div>
            <FieldArray
              name={`${prefixProp}.corContactLensFitting_Item`}
              render={arrayHelpers => {
                this.arrayHelpers = arrayHelpers
                const contactLensFitting_Items =
                  getIn(
                    arrayHelpers.form.values,
                    `${prefixProp}.corContactLensFitting_Item`,
                  ) || []
                const activeItems = contactLensFitting_Items.filter(
                  val => !val.isDeleted,
                )
                return activeItems.map((val, activeIndex) => {
                  const i = contactLensFitting_Items.findIndex(item =>
                    val.id ? item.id === val.id : val.uid === item.uid,
                  )
                  const itemProp = `${prefixProp}.corContactLensFitting_Item[${i}]`
                  return (
                    <GridContainer>
                      <GridItem md={11}>
                        <table style={{ width: '100%', margin: '8px 0px' }}>
                          <tr>
                            <td style={{ width: '40%' }}></td>
                            <td style={{ width: '10%' }}></td>
                            <td style={{ width: '10%' }}></td>
                            <td style={{ width: '40%' }}></td>
                          </tr>
                          <tr>
                            <td
                              colspan='2'
                              className={classes.cellStyle}
                              style={{ padding: 4 }}
                            >
                              <div>
                                <span>RE</span>
                                <Button
                                  color='primary'
                                  size='sm'
                                  style={{ marginLeft: 8 }}
                                  onClick={() => {
                                    editScribbleNote(
                                      prefixProp,
                                      'rightScribbleNote',
                                      'rightScribbleNoteFK',
                                      defaultImage,
                                      cavanSize,
                                      imageSize,
                                      thumbnailSize,
                                      position,
                                    )
                                  }}
                                  justIcon
                                >
                                  <Edit />
                                </Button>
                              </div>
                              <div
                                style={{
                                  width: thumbnailDisplaySize.width + 6,
                                  marginTop: 6,
                                  position: 'relative',
                                  left: `calc((100% - ${thumbnailDisplaySize.width}px - 6px) / 2)`,
                                }}
                              >
                                <FastField
                                  name={`${prefixProp}.rightScribbleNote`}
                                  render={args => {
                                    if (
                                      !args.field.value?.thumbnail ||
                                      args.field.value?.thumbnail === ''
                                    ) {
                                      return ''
                                    }
                                    let src = `${base64Prefix}${args.field.value.thumbnail}`
                                    return (
                                      <div>
                                        <img
                                          src={src}
                                          alt={args.field.value.subject}
                                          style={{
                                            maxHeight:
                                              thumbnailDisplaySize.height,
                                            maxWidth:
                                              thumbnailDisplaySize.width,
                                          }}
                                        />
                                      </div>
                                    )
                                  }}
                                />
                              </div>
                            </td>
                            <td
                              colspan='2'
                              className={classes.cellStyle}
                              style={{ padding: 4 }}
                            >
                              <div>
                                <span>LE</span>
                                <Button
                                  color='primary'
                                  size='sm'
                                  style={{ marginLeft: 8 }}
                                  onClick={() => {
                                    editScribbleNote(
                                      prefixProp,
                                      'leftScribbleNote',
                                      'leftScribbleNoteFK',
                                      defaultImage,
                                      cavanSize,
                                      imageSize,
                                      thumbnailSize,
                                      position,
                                    )
                                  }}
                                  justIcon
                                >
                                  <Edit />
                                </Button>
                              </div>
                              <div
                                style={{
                                  width: 260,
                                  marginTop: 6,
                                  position: 'relative',
                                  left: `calc((100% - ${thumbnailDisplaySize.width}px - 6px) / 2)`,
                                }}
                              >
                                <FastField
                                  name={`${prefixProp}.leftScribbleNote`}
                                  render={args => {
                                    if (
                                      !args.field.value?.thumbnail ||
                                      args.field.value?.thumbnail === ''
                                    ) {
                                      return ''
                                    }
                                    const src = `${base64Prefix}${args.field.value.thumbnail}`
                                    return (
                                      <div>
                                        <img
                                          src={src}
                                          alt={args.field.value.subject}
                                          style={{
                                            maxHeight:
                                              thumbnailDisplaySize.height,
                                            maxWidth:
                                              thumbnailDisplaySize.width,
                                          }}
                                        />
                                      </div>
                                    )
                                  }}
                                />
                              </div>
                            </td>
                          </tr>
                          <tr>
                            <td className={classes.cellStyle}>
                              <FastField
                                name={`${prefixProp}.reLensDetails`}
                                render={args => (
                                  <Input.TextArea
                                    placeholder='Brand / BC / DIA / PWR'
                                    maxLength={500}
                                    {...args.field}
                                    bordered={false}
                                    autoSize={{ minRows: 1 }}
                                    style={{ textAlign: 'center' }}
                                  />
                                )}
                              />
                            </td>
                            <td colspan='2' className={classes.centerCellStyle}>
                              Lens Details
                            </td>
                            <td className={classes.cellStyle}>
                              <FastField
                                name={`${prefixProp}.leLensDetails`}
                                render={args => (
                                  <Input.TextArea
                                    placeholder='Brand / BC / DIA / PWR'
                                    maxLength={500}
                                    {...args.field}
                                    bordered={false}
                                    autoSize={{ minRows: 1 }}
                                    style={{ textAlign: 'center' }}
                                  />
                                )}
                              />
                            </td>
                          </tr>
                          <tr>
                            <td className={classes.cellStyle}>
                              <FastField
                                name={`${prefixProp}.reComfort`}
                                render={args => (
                                  <MultipleTextField
                                    label=''
                                    maxLength={500}
                                    {...args}
                                    bordered={false}
                                    autoSize={{ minRows: 1 }}
                                    style={{ textAlign: 'center' }}
                                  />
                                )}
                              />
                            </td>
                            <td colspan='2' className={classes.centerCellStyle}>
                              Comfort
                            </td>
                            <td className={classes.cellStyle}>
                              <FastField
                                name={`${prefixProp}.leComfort`}
                                render={args => (
                                  <MultipleTextField
                                    label=''
                                    maxLength={500}
                                    {...args}
                                    bordered={false}
                                    autoSize={{ minRows: 1 }}
                                    style={{ textAlign: 'center' }}
                                  />
                                )}
                              />
                            </td>
                          </tr>
                          <tr>
                            <td className={classes.cellStyle}>
                              <FastField
                                name={`${prefixProp}.reCoverage`}
                                render={args => (
                                  <MultipleTextField
                                    label=''
                                    maxLength={500}
                                    {...args}
                                    bordered={false}
                                    autoSize={{ minRows: 1 }}
                                    style={{ textAlign: 'center' }}
                                  />
                                )}
                              />
                            </td>
                            <td colspan='2' className={classes.centerCellStyle}>
                              Coverage
                            </td>
                            <td className={classes.cellStyle}>
                              <FastField
                                name={`${prefixProp}.leCoverage`}
                                render={args => (
                                  <MultipleTextField
                                    label=''
                                    maxLength={500}
                                    {...args}
                                    bordered={false}
                                    autoSize={{ minRows: 1 }}
                                    style={{ textAlign: 'center' }}
                                  />
                                )}
                              />
                            </td>
                          </tr>
                          <tr>
                            <td className={classes.cellStyle}>
                              <FastField
                                name={`${prefixProp}.reCentration`}
                                render={args => (
                                  <MultipleTextField
                                    label=''
                                    maxLength={500}
                                    {...args}
                                    bordered={false}
                                    autoSize={{ minRows: 1 }}
                                    style={{ textAlign: 'center' }}
                                  />
                                )}
                              />
                            </td>
                            <td colspan='2' className={classes.centerCellStyle}>
                              Centration
                            </td>
                            <td className={classes.cellStyle}>
                              <FastField
                                name={`${prefixProp}.leCentration`}
                                render={args => (
                                  <MultipleTextField
                                    label=''
                                    maxLength={500}
                                    {...args}
                                    bordered={false}
                                    autoSize={{ minRows: 1 }}
                                    style={{ textAlign: 'center' }}
                                  />
                                )}
                              />
                            </td>
                          </tr>
                          <tr>
                            <td className={classes.cellStyle}>
                              <FastField
                                name={`${prefixProp}.reLagSag`}
                                render={args => (
                                  <MultipleTextField
                                    label=''
                                    maxLength={500}
                                    {...args}
                                    bordered={false}
                                    autoSize={{ minRows: 1 }}
                                    style={{ textAlign: 'center' }}
                                  />
                                )}
                              />
                            </td>
                            <td colspan='2' className={classes.centerCellStyle}>
                              Lag / Sag
                            </td>
                            <td className={classes.cellStyle}>
                              <FastField
                                name={`${prefixProp}.leLagSag`}
                                render={args => (
                                  <MultipleTextField
                                    label=''
                                    maxLength={500}
                                    {...args}
                                    bordered={false}
                                    autoSize={{ minRows: 1 }}
                                    style={{ textAlign: 'center' }}
                                  />
                                )}
                              />
                            </td>
                          </tr>
                          <tr>
                            <td className={classes.cellStyle}>
                              <FastField
                                name={`${prefixProp}.reMovementPGM`}
                                render={args => (
                                  <MultipleTextField
                                    label=''
                                    maxLength={500}
                                    {...args}
                                    bordered={false}
                                    autoSize={{ minRows: 1 }}
                                    style={{ textAlign: 'center' }}
                                  />
                                )}
                              />
                            </td>
                            <td colspan='2' className={classes.centerCellStyle}>
                              Movement (PGM)
                            </td>
                            <td className={classes.cellStyle}>
                              <FastField
                                name={`${prefixProp}.leMovementPGM`}
                                render={args => (
                                  <MultipleTextField
                                    label=''
                                    maxLength={500}
                                    {...args}
                                    bordered={false}
                                    autoSize={{ minRows: 1 }}
                                    style={{ textAlign: 'center' }}
                                  />
                                )}
                              />
                            </td>
                          </tr>
                          <tr>
                            <td className={classes.cellStyle}>
                              <FastField
                                name={`${prefixProp}.reMovementUpgaze`}
                                render={args => (
                                  <MultipleTextField
                                    label=''
                                    maxLength={500}
                                    {...args}
                                    bordered={false}
                                    autoSize={{ minRows: 1 }}
                                    style={{ textAlign: 'center' }}
                                  />
                                )}
                              />
                            </td>
                            <td colspan='2' className={classes.centerCellStyle}>
                              Movement (Upgaze)
                            </td>
                            <td className={classes.cellStyle}>
                              <FastField
                                name={`${prefixProp}.leMovementUpgaze`}
                                render={args => (
                                  <MultipleTextField
                                    label=''
                                    maxLength={500}
                                    {...args}
                                    bordered={false}
                                    autoSize={{ minRows: 1 }}
                                    style={{ textAlign: 'center' }}
                                  />
                                )}
                              />
                            </td>
                          </tr>
                          <tr>
                            <td className={classes.cellStyle}>
                              <FastField
                                name={`${prefixProp}.reMovementPushup`}
                                render={args => (
                                  <MultipleTextField
                                    label=''
                                    maxLength={500}
                                    {...args}
                                    bordered={false}
                                    autoSize={{ minRows: 1 }}
                                    style={{ textAlign: 'center' }}
                                  />
                                )}
                              />
                            </td>
                            <td colspan='2' className={classes.centerCellStyle}>
                              Movement (Pushup)
                            </td>
                            <td className={classes.cellStyle}>
                              <FastField
                                name={`${prefixProp}.leMovementPushup`}
                                render={args => (
                                  <MultipleTextField
                                    label=''
                                    maxLength={500}
                                    {...args}
                                    bordered={false}
                                    autoSize={{ minRows: 1 }}
                                    style={{ textAlign: 'center' }}
                                  />
                                )}
                              />
                            </td>
                          </tr>
                          <tr>
                            <td className={classes.cellStyle}>
                              <FastField
                                name={`${prefixProp}.reVADN`}
                                render={args => (
                                  <MultipleTextField
                                    label=''
                                    maxLength={500}
                                    {...args}
                                    bordered={false}
                                    autoSize={{ minRows: 1 }}
                                    style={{ textAlign: 'center' }}
                                  />
                                )}
                              />
                            </td>
                            <td colspan='2' className={classes.centerCellStyle}>
                              VA (D / N)
                            </td>
                            <td className={classes.cellStyle}>
                              <FastField
                                name={`${prefixProp}.leVADN`}
                                render={args => (
                                  <MultipleTextField
                                    label=''
                                    maxLength={500}
                                    {...args}
                                    bordered={false}
                                    autoSize={{ minRows: 1 }}
                                    style={{ textAlign: 'center' }}
                                  />
                                )}
                              />
                            </td>
                          </tr>
                          <tr>
                            <td className={classes.cellStyle}>
                              <FastField
                                name={`${prefixProp}.reOverRxVA`}
                                render={args => (
                                  <MultipleTextField
                                    label=''
                                    maxLength={500}
                                    {...args}
                                    bordered={false}
                                    autoSize={{ minRows: 1 }}
                                    style={{ textAlign: 'center' }}
                                  />
                                )}
                              />
                            </td>
                            <td colspan='2' className={classes.centerCellStyle}>
                              Over Rx (VA)
                            </td>
                            <td className={classes.cellStyle}>
                              <FastField
                                name={`${prefixProp}.leOverRxVA`}
                                render={args => (
                                  <MultipleTextField
                                    label=''
                                    maxLength={500}
                                    {...args}
                                    bordered={false}
                                    autoSize={{ minRows: 1 }}
                                    style={{ textAlign: 'center' }}
                                  />
                                )}
                              />
                            </td>
                          </tr>
                          <tr>
                            <td className={classes.cellStyle}>
                              <FastField
                                name={`${prefixProp}.reConclusionOfLensFit`}
                                render={args => (
                                  <MultipleTextField
                                    label=''
                                    maxLength={500}
                                    {...args}
                                    bordered={false}
                                    autoSize={{ minRows: 1 }}
                                    style={{ textAlign: 'center' }}
                                  />
                                )}
                              />
                            </td>
                            <td colspan='2' className={classes.centerCellStyle}>
                              Conclusion of lens fit
                            </td>
                            <td className={classes.cellStyle}>
                              <FastField
                                name={`${prefixProp}.leConclusionOfLensFit`}
                                render={args => (
                                  <MultipleTextField
                                    label=''
                                    maxLength={500}
                                    {...args}
                                    bordered={false}
                                    autoSize={{ minRows: 1 }}
                                    style={{ textAlign: 'center' }}
                                  />
                                )}
                              />
                            </td>
                          </tr>
                        </table>
                        <span>Remarks</span>
                        <FastField
                          name={`${itemProp}.remarks`}
                          render={args => (
                            <MultipleTextField
                              label=''
                              maxLength={2000}
                              {...args}
                              autoSize={{ minRows: 3 }}
                            />
                          )}
                        />
                      </GridItem>
                      <GridItem md={1}>
                        {activeItems.length > 1 && (
                          <Button justIcon color='danger'>
                            <Delete
                              onClick={() => {
                                const {
                                  form: { setFieldValue },
                                } = this.arrayHelpers
                                setFieldValue(`${itemProp}.isDeleted`, true)
                              }}
                            />
                          </Button>
                        )}
                      </GridItem>
                    </GridContainer>
                  )
                })
              }}
            />

            <Button
              color='primary'
              size='sm'
              onClick={this.addItem}
              style={{ margin: '8px 0px' }}
            >
              <Add />
              Add New
            </Button>
          </div>
        </GridItem>
      </GridContainer>
    )
  }
}
export default withStyles(style, { name: 'ContactLensFitting' })(
  ContactLensFitting,
)
