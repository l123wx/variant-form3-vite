<template>
  <form-item-wrapper :prop-name="propName" :designer="designer" :field="field" :rules="rules" :design-state="designState"
                     :parent-widget="parentWidget" :parent-list="parentList" :index-of-parent-list="indexOfParentList">
    <!--
    <vue-editor ref="fieldEditor" v-model="fieldModel" :editor-toolbar="customToolbar"
                :disabled="field.options.disabled" :placeholder="field.options.placeholder"
                @text-change="handleRichEditorChangeEvent"
                @focus="handleRichEditorFocusEvent" @blur="handleRichEditorBlurEvent">
    </vue-editor>
    -->

    <div>
      <quill-editor
              v-model:value="fieldModel"
              :options="editorOption"
              :disabled="field.options.disabled"
              @blur="handleRichEditorBlurEvent"
              @focus="handleRichEditorFocusEvent"
              @change="handleRichEditorChangeEvent"
              :style="!!field.options.contentHeight ? `height: ${field.options.contentHeight};`: ''"></quill-editor>
    </div>

  </form-item-wrapper>
</template>

<script>
  import FormItemWrapper from './form-item-wrapper'
  import emitter from '@/utils/emitter'
  import i18n, {translate} from "@/utils/i18n";
  import {deepClone} from "@/utils/util";
  import fieldMixin from "@/components/form-designer/form-widget/field-widget/fieldMixin";

  import { Quill, quillEditor } from 'vue3-quill'

  export default {
    name: "rich-editor-widget",
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

      // VueEditor: resolve => { //懒加载！！
      //   require(['vue2-editor'], ({VueEditor}) => resolve(VueEditor))
      // }
      quillEditor,
    },
    data() {
      return {
        oldFieldValue: null, //field组件change之前的值
        fieldModel: null,
        rules: [],

        customToolbar: [], //富文本编辑器自定义工具栏
        valueChangedFlag: false, //vue2-editor数据值是否改变标志
      }
    },
    computed: {
      editorOption() {
        return {
          placeholder: this.field.options.placeholder,
          modules: {
            //toolbar: this.customToolbar
          }
        }
      },

    },
    beforeCreate() {
      /* 这里不能访问方法和属性！！ */
    },

    created() {
      if (this.designState) return
      
      /* 注意：子组件mounted在父组件created之后、父组件mounted之前触发，故子组件mounted需要用到的prop
         需要在父组件created中初始化！！ */
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
    },

    methods: {
      handleRichEditorChangeEvent() {
        this.valueChangedFlag = true
        this.syncUpdateFormModel(this.fieldModel)
      },

      handleRichEditorFocusEvent() {
        this.oldFieldValue = deepClone(this.fieldModel)
      },

      handleRichEditorBlurEvent() {
        if (this.valueChangedFlag) {
          this.emitFieldDataChange(this.fieldModel, this.oldFieldValue)
          this.valueChangedFlag = false
        }
      },

    }
  }
</script>

<style lang="scss" scoped>
  @import "../../../../styles/global.scss"; /* form-item-wrapper已引入，还需要重复引入吗？ */

  .full-width-input {
    width: 100% !important;
  }

</style>
