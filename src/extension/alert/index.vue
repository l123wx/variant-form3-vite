<template>
  <static-content-wrapper :designer="designer" :field="field" :design-state="designState"
                          :parent-widget="parentWidget" :parent-list="parentList" :index-of-parent-list="indexOfParentList">
    <el-alert ref="fieldEditor" :title="field.options.title" :type="field.options.type"
              :description="field.options.description" :closable="field.options.closable"
              :center="field.options.center" :close-text="field.options.closeText"
              :show-icon="field.options.showIcon" :effect="field.options.effect" @close="handleCloseCustomEvent"></el-alert>
  </static-content-wrapper>
</template>

<script>
  import StaticContentWrapper from '@/components/form-designer/form-widget/field-widget/static-content-wrapper'
  import emitter from '@/utils/emitter'
  import i18n from "@/utils/i18n"
  import fieldMixin from "@/components/form-designer/form-widget/field-widget/fieldMixin"

  export default {
    name: "alert-widget",
    componentName: 'FieldWidget',  //必须固定为FieldWidget，用于接收父级组件的broadcast事件
    mixins: [emitter, fieldMixin, i18n],
    props: {
      field: Object,
      parentWidget: Object,
      parentList: Array,
      indexOfParentList: Number,
      designer: Object,

      designState: {
        type: Boolean,
        default: false
      },

      refName: String
    },
    components: {
      StaticContentWrapper,
    },
    created() {
      if (this.designState) return

      this.registerToRefList()
      this.initEventHandler()
    },
    beforeUnmount() {
      if (this.designState) return

      this.unregisterFromRefList()
    },
    methods: {
      handleCloseCustomEvent() {
        if (!!this.field.options.onClose) {
          let changeFn = new Function(this.field.options.onClose)
          
          try {
            changeFn.call(this)
          } catch (err) {
            console.error(`Error form refName: ${this.refName}`)
            console.error(err)
          }
        }
      }
    }
  }
</script>

<style lang="scss" scoped>

</style>
