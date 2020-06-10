import React, { PureComponent } from 'react'
import _ from 'lodash'
import { FormattedMessage } from 'umi/locale'
import Yup from '@/utils/yup'
import {
    withFormikExtend,
    FastField,
    GridContainer,
    GridItem,
    TextField,
    CodeSelect,
    DateRangePicker,
} from '@/components'

const styles = (theme) => ({})

@withFormikExtend({
    mapPropsToValues: ({ settingCaseDescription }) =>
        settingCaseDescription.entity || settingCaseDescription.default,
    validationSchema: Yup.object().shape({
        code: Yup.string().required(),
        displayValue: Yup.string().required(),
        caseTypeFK: Yup.string().required(),
        effectiveDates: Yup.array().of(Yup.date()).min(2).required(),
    }),
    handleSubmit: (values, { props, resetForm }) => {
        const { effectiveDates, ...restValues } = values
        const { dispatch, onConfirm } = props
        dispatch({
            type: 'settingCaseDescription/upsert',
            payload: {
                ...restValues,
                effectiveStartDate: effectiveDates[0],
                effectiveEndDate: effectiveDates[1],
                caseTypeFKNavigation: null,
            },
        }).then((r) => {
            if (r) {
                resetForm()
                if (onConfirm) onConfirm()
                dispatch({
                    type: 'settingCaseDescription/query',
                })
                dispatch({
                    type: 'codetable/fetchCodes',
                    payload: {
                        code: 'ctcasetype',
                        filter: { 
                            'caseTypeFKNavigation.IsActive': true,
                        },
                    },
                })
            }
        })
    },
    displayName: 'CaseDescriptionDetail',
})
class Detail extends PureComponent {
    state = {}

    render() {
        const { props } = this
        const { theme, footer, settingCaseDescription } = props
        // console.log('detail', props)
        return (
            <React.Fragment>
                <div style={{ margin: theme.spacing(1) }}>
                    <GridContainer>
                        <GridItem md={6}>
                            <FastField
                                name='code'
                                render={(args) => (
                                    <TextField
                                        label='Code'
                                        autoFocus
                                        {...args}
                                        disabled={!!settingCaseDescription.entity}
                                    />
                                )}
                            />
                        </GridItem>
                        <GridItem md={6}>
                            <FastField
                                name='displayValue'
                                render={(args) => <TextField label='Display Value' {...args} />}
                            />
                        </GridItem>
                        <GridItem md={6}>
                            <FastField
                                name='effectiveDates'
                                render={(args) => {
                                    return (
                                        <DateRangePicker
                                            label='Effective Start Date'
                                            label2='End Date'
                                            {...args}
                                        />
                                    )
                                }}
                            />
                        </GridItem>
                        <GridItem md={6}>
                            <FastField
                                name='caseTypeFK'
                                render={(args) => (
                                    <CodeSelect
                                        label='Case Type'
                                        code='CTCaseType'
                                        {...args}
                                    />
                                )}
                            />
                        </GridItem>
                        <GridItem md={12}>
                            <FastField
                                name='description'
                                render={(args) => {
                                    return (
                                        <TextField
                                            label='Description'
                                            multiline
                                            rowsMax={4}
                                            {...args}
                                        />
                                    )
                                }}
                            />
                        </GridItem>
                    </GridContainer>
                </div>
                {footer &&
                    footer({
                        onConfirm: props.handleSubmit,
                        confirmBtnText: 'Save',
                        confirmProps: {
                            disabled: false,
                        },
                    })}
            </React.Fragment>
        )
    }
}

export default Detail
