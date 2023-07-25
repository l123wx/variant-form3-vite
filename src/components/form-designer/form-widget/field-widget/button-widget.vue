<template>
  <static-content-wrapper :designer="designer" :field="field" :design-state="designState" :display-style="field.options.displayStyle"
                     :parent-widget="parentWidget" :parent-list="parentList" :index-of-parent-list="indexOfParentList">
    <el-button ref="fieldEditor" :type="field.options.type" :size="widgetSize"
               :plain="field.options.plain" :round="field.options.round"
               :circle="field.options.circle" :icon="field.options.icon"
               :disabled="field.options.disabled"
               @click="handleButtonWidgetClick">
      {{field.options.label}}</el-button>
  </static-content-wrapper>
</template>

<script>
  import StaticContentWrapper from './static-content-wrapper'
  import emitter from '@/utils/emitter'
  import i18n, {translate} from "@/utils/i18n";
  import fieldMixin from "@/components/form-designer/form-widget/field-widget/fieldMixin";

  export default {
    name: "button-widget",
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

      designState: {
        type: Boolean,
        default: false
      },

      refName: String
    },
    components: {
      StaticContentWrapper,
    },
    computed: {

    },
    beforeCreate() {
      /* 这里不能访问方法和属性！！ */
    },

    created() {
      if (this.designState) return

      /* 注意：子组件mounted在父组件created之后、父组件mounted之前触发，故子组件mounted需要用到的prop
         需要在父组件created中初始化！！ */
      this.registerToRefList()
      this.initEventHandler()

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

    }

  }
</script>

<style lang="scss" scoped>
  @import "../../../../styles/global.scss"; //* static-content-wrapper已引入，还需要重复引入吗？ *//

</style>
