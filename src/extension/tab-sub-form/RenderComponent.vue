<template>
    <container-item-wrapper :widget="widget">
        <div
            :key="widget.id"
            class="tab-container"
            v-show="!widget.options.hidden"
        >
            <el-tabs
                :model-value="0"
                type="border-card"
                :ref="widget.id"
                :class="[customClass]"
                :closable="!widget.options.disabled && rowIdData.length > 1"
                :addable="!widget.options.disabled"
                @tab-add="addSubFormRow"
                @tab-remove="deleteSubFormRow"
            >
                <el-tab-pane
                    v-for="(subFormRowId, sfrIdx) in rowIdData"
                    :key="subFormRowId"
                    :label="widget.options.tabLabelName + String(sfrIdx + 1)"
                    :name="sfrIdx"
                >
                    <template v-for="(subWidget, swIdx) in widget.widgetList">
                        <template
                            v-if="'container' === subWidget.category"
                            :key="
                                'container_' + subWidget.id + '_' + subFormRowId
                            "
                        >
                            <component
                                :refName="subWidget.options.name + '@row' + subFormRowId"
                                :sub-form-prop="`${subFormProp}${widget.options.name}.${sfrIdx}.`"
                                :sub-form-model="subForm[sfrIdx]"
                                :is="getComponentByContainer(subWidget)"
                                :widget="subWidget"
                                :field="fieldSchemaData[sfrIdx][swIdx]"
                                :key="fieldSchemaData[sfrIdx][swIdx].id"
                                :parent-list="widget.widgetList"
                                :index-of-parent-list="swIdx"
                                :parent-widget="widget"
                            >
                                <!-- 递归传递插槽！！！ -->
                                <template
                                    v-for="slot in Object.keys($slots)"
                                    v-slot:[slot]="scope"
                                >
                                    <slot
                                        :name="slot"
                                        v-bind="scope"
                                    />
                                </template>
                            </component>
                        </template>
                        <template
                            v-else
                            :key="subWidget.id + '_' + subFormRowId"
                        >
                            <component
                                :refName="subWidget.options.name + '@row' + subFormRowId"
                                :sub-form-prop="`${subFormProp}${widget.options.name}.${sfrIdx}.`"
                                :sub-form-model="subForm[sfrIdx]"
                                :is="subWidget.type + '-widget'"
                                :field="fieldSchemaData[sfrIdx][swIdx]"
                                :designer="null"
                                :key="fieldSchemaData[sfrIdx][swIdx].id"
                                :parent-list="widget.widgetList"
                                :index-of-parent-list="swIdx"
                                :parent-widget="widget"
                            >
                                <!-- 递归传递插槽！！！ -->
                                <template
                                    v-for="slot in Object.keys($slots)"
                                    v-slot:[slot]="scope"
                                >
                                    <slot
                                        :name="slot"
                                        v-bind="scope"
                                    />
                                </template>
                            </component>
                        </template>
                    </template>
                </el-tab-pane>
            </el-tabs>
        </div>
    </container-item-wrapper>
</template>

<script>
    import emitter from '@/utils/emitter'
    import i18n from '@/utils/i18n'
    import { deepClone, generateId } from '@/utils/util'
    import refMixin from '@/components/form-render/refMixin'
    import ContainerItemWrapper from '@/components/form-render/container-item/container-item-wrapper'
    import containerItemMixin from '@/components/form-render/container-item/containerItemMixin'
    import FieldComponents from '@/components/form-designer/form-widget/field-widget/index'
    import { getFormWidgetData } from '@/components/form-render/util.js'

    export default {
        name: 'tab-sub-form-item',
        componentName: 'ContainerItem',
        mixins: [emitter, i18n, refMixin, containerItemMixin],
        components: {
            ContainerItemWrapper,
            ...FieldComponents
        },
        props: {
            widget: Object,

            subFormModel: {
                type: Object,
                default: undefined
            },
            subFormProp: {
                type: String,
                default: ''
            },
        },
        inject: ['refList', 'sfRefList'],
        data() {
            return {
                fieldSchemaData: [],
                rowIdData: []
            }
        },
        computed: {
            subForm() {
                return this.subFormModel[this.widget.options.name]
            }
        },
        created() {
            this.initRefList()
            this.registerSubFormToRefList()
            this.initRowIdData()
            this.initFieldSchemaData()
            this.initEventHandler()
        },
        mounted() {
            this.handleSubFormFirstRowAdd()
        },
        beforeUnmount() {
            this.unregisterFromRefList()
        },
        methods: {
            registerSubFormToRefList() {
                if (this.widget.type === 'tab-sub-form') {
                    this.sfRefList[this.widget.options.name] = this
                }
            },

            initRowIdData() {
                if (this.widget.type === 'tab-sub-form') {
                    this.rowIdData.splice(0, this.rowIdData.length) //清除数组必须用splice，length=0不会响应式更新！！
                    if (!!this.subForm && this.subForm.length > 0) {
                        this.rowIdData.push(...this.subForm.map(() => 'id' + generateId()))
                    }
                }
            },

            addToRowIdData() {
                this.rowIdData.push('id' + generateId())
            },

            deleteFromRowIdData(rowIndex) {
                this.rowIdData.splice(rowIndex, 1)
            },

            initFieldSchemaData() {
                //初始化fieldSchemaData！！！
                if (this.widget.type !== 'tab-sub-form') {
                    return
                }

                let rowLength = this.rowIdData.length
                this.fieldSchemaData.splice(0, this.fieldSchemaData.length) //清除数组必须用splice，length=0不会响应式更新！！
                if (rowLength > 0) {
                    for (let i = 0; i < rowLength; i++) {
                        let fieldSchemas = []
                        this.widget.widgetList.forEach(swItem => {
                            fieldSchemas.push(this.cloneFieldSchema(swItem))
                        })
                        this.fieldSchemaData.push(fieldSchemas)
                    }
                }
            },

            addToFieldSchemaData(rowIndex) {
                let fieldSchemas = []
                this.widget.widgetList.forEach(swItem => {
                    fieldSchemas.push(this.cloneFieldSchema(swItem))
                })

                if (rowIndex === undefined) {
                    this.fieldSchemaData.push(fieldSchemas)
                } else {
                    this.fieldSchemaData.splice(rowIndex, 0, fieldSchemas)
                }
            },

            deleteFromFieldSchemaData(rowIndex) {
                this.fieldSchemaData.splice(rowIndex, 1)
            },

            cloneFieldSchema(fieldWidget) {
                let newFieldSchema = deepClone(fieldWidget)
                newFieldSchema.id = fieldWidget.type + generateId()
                return newFieldSchema
            },

            initEventHandler() {
                if (this.widget.type !== 'tab-sub-form') {
                    return
                }

                this.on$('setFormData', (newFormData) => {
                    this.initRowIdData(false)
                    this.initFieldSchemaData()

                    let subFormData = newFormData[this.widget.options.name] || []
                    setTimeout(() => {  //延时触发SubFormRowChange事件, 便于更新计算字段！！
                        this.handleSubFormRowChange(subFormData)
                    }, 800)
                })
            },


            handleSubFormFirstRowAdd() {
                if (this.widget.type !== 'tab-sub-form') {
                    return
                }

                if (
                    !!this.widget.options.showBlankRow &&
                    this.rowIdData.length === 1
                ) {
                    let oldSubFormData =
                        this.subFormModel[this.widget.options.name] || []
                    this.handleSubFormRowAdd(oldSubFormData, this.rowIdData[0])
                    this.handleSubFormRowChange(oldSubFormData)
                }
            },

            addSubFormRow() {
                let newSubFormDataRow = getFormWidgetData(this.widget.widgetList)

                let oldSubFormData =
                    this.subFormModel[this.widget.options.name] || []
                oldSubFormData.push(newSubFormDataRow)
                
                this.addToRowIdData()
                this.addToFieldSchemaData()

                this.handleSubFormRowAdd(
                    oldSubFormData,
                    this.rowIdData[oldSubFormData.length - 1]
                )
                this.handleSubFormRowChange(oldSubFormData)
            },

            deleteSubFormRow(formRowIndex) {
                this.$confirm(
                    `删除标签页 "${
                        this.widget.options.tabLabelName +
                        String(formRowIndex + 1)
                    }"？`,
                    this.i18nt('render.hint.prompt'),
                    {
                        confirmButtonText: this.i18nt('render.hint.confirm'),
                        cancelButtonText: this.i18nt('render.hint.cancel')
                    }
                )
                    .then(() => {
                        let oldSubFormData =
                            this.subFormModel[this.widget.options.name] || []
                        let deletedDataRow = deepClone(
                            oldSubFormData[formRowIndex]
                        )
                        oldSubFormData.splice(formRowIndex, 1)
                        this.deleteFromRowIdData(formRowIndex)
                        this.deleteFromFieldSchemaData(formRowIndex)

                        this.handleSubFormRowDelete(
                            oldSubFormData,
                            deletedDataRow
                        )
                        this.handleSubFormRowChange(oldSubFormData)
                    })
                    .catch(err => {
                        console.error(err)
                    })
            },

            handleSubFormRowChange(subFormData) {
                if (!!this.widget.options.onSubFormTabChange) {
                    let customFunc = new Function(
                        'subFormData',
                        this.widget.options.onSubFormTabChange
                    )

                    try {
                        customFunc.call(this, subFormData)
                    } catch (err) {
                        console.error(err)
                    }
                }
            },

            handleSubFormRowAdd(subFormData, newRowId) {
                if (!!this.widget.options.onSubFormTabAdd) {
                    let customFunc = new Function(
                        'subFormData',
                        'newRowId',
                        this.widget.options.onSubFormTabAdd
                    )

                    try {
                        customFunc.call(this, subFormData, newRowId)
                    } catch (err) {
                        console.error(err)
                    }
                }
            },

            handleSubFormRowAdd(subFormData, newRowId) {
                if (!!this.widget.options.onSubFormTabAdd) {
                    let customFunc = new Function(
                        'subFormData',
                        'newRowId',
                        this.widget.options.onSubFormTabAdd
                    )

                    try {
                        customFunc.call(this, subFormData, newRowId)
                    } catch (err) {
                        console.error(err)
                    }
                }
            },

            handleSubFormRowDelete(subFormData, deletedDataRow) {
                if (!!this.widget.options.onSubFormTabDelete) {
                    let customFunc = new Function(
                        'subFormData',
                        'deletedDataRow',
                        this.widget.options.onSubFormTabDelete
                    )

                    try {
                        customFunc.call(this, subFormData, deletedDataRow)
                    } catch (err) {
                        console.error(err)
                    }
                }
            }
        }
    }
</script>

<style lang="scss" scoped></style>
