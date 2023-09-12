<template>
    <form-item-wrapper :prop-name="propName" :designer="designer" :field="field" :rules="rules" :design-state="designState"
        :parent-widget="parentWidget" :parent-list="parentList" :index-of-parent-list="indexOfParentList">
        <div class="full-width-input">
            <el-cascader ref="fieldEditor" :options="cityList" v-model="fieldModel"
                :disabled="field.options.disabled" :size="widgetSize" :clearable="field.options.clearable"
                :filterable="field.options.filterable"
                :placeholder="field.options.placeholder || i18nt('render.hint.selectPlaceholder')"
                :show-all-levels="showFullPath"
                :props="{ checkStrictly: field.options.checkStrictly, multiple: field.options.multiple, expandTrigger: 'hover' }"
                @focus="handleFocusCustomEvent" @blur="handleBlurCustomEvent" @change="handleChangeEvent">
            </el-cascader>
        </div>
    </form-item-wrapper>
</template>
  
<script>
import emitter from '@/utils/emitter'
import i18n from "@/utils/i18n";
import fieldMixin from "@/components/form-designer/form-widget/field-widget/fieldMixin";
import FormItemWrapper from '@/components/form-designer/form-widget/field-widget/form-item-wrapper'
import cityList from './city.json'

export default {
    name: "area-cascader-widget",
    componentName: 'FieldWidget',  //必须固定为FieldWidget，用于接收父级组件的broadcast事件
    mixins: [emitter, fieldMixin, i18n],
    props: {
        field: Object,
        parentWidget: Object,
        parentList: Array,
        indexOfParentList: Number,
        designer: Object,
        
        subFormModel: {
            type: Object,
            default: undefined
        },
        subFormProp: {
            type: String,
            default: ''
        },

        designState: {
            type: Boolean,
            default: false
        },

        refName: String
    },
    components: {
        FormItemWrapper,
    },
    data() {
        return {
            oldFieldValue: null, //field组件change之前的值
            fieldModel: null,
            rules: [],
        }
    },
    computed: {
        showFullPath() {
            return (this.field.options.showAllLevels === undefined) || !!this.field.options.showAllLevels
        },
        cityList() {
            return cityList
        }
    },
    beforeCreate() {
        /* 这里不能访问方法和属性！！ */
    },

    created() {
        if (this.designState) return

        /* 注意：子组件mounted在父组件created之后、父组件mounted之前触发，故子组件mounted需要用到的prop
           需要在父组件created中初始化！！ */
        this.initOptionItems()
        this.initFieldModel()
        this.registerToRefList()
        this.initEventHandler()
        this.buildFieldRules()

        this.handleOnCreated()
    },

    mounted() {
        if (this.designState) return

        this.handleOnMounted()
    },

    beforeUnmount() {
        if (this.designState) return

        this.unregisterFromRefList()
    }
}
</script>
  
<style lang="scss" scoped>
@import "@/styles/global.scss";
/* form-item-wrapper已引入，还需要重复引入吗？ */

.full-width-input {
    width: 100% !important;

    :deep(.el-cascader) {
        width: 100% !important;
    }
}
</style>
  