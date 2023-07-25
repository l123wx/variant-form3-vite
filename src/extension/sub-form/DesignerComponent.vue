<template>
    <container-wrapper :designer="designer" :widget="widget" :parent-widget="parentWidget" :parent-list="parentList"
        :index-of-parent-list="indexOfParentList">
        <div :key="widget.id" class="sub-form-container" v-show="!widget.options.hidden" @click.stop="selectWidget(widget)"
            :class="[selected ? 'selected' : '']">
            <el-form class="el-form--label-top">
                <div class="sub-form-table">
                    <draggable :list="widget.widgetList" item-key="id" v-bind="{
                        group: 'dragGroup',
                        ghostClass: 'ghost',
                        animation: 200
                    }" handle=".drag-handler" tag="transition-group" :component-data="{ name: 'fade' }"
                        @add="evt => onContainerDragAdd(evt, widget.widgetList)" @update="onContainerDragUpdate"
                        :move="checkContainerMove">
                        <template #item="{ element: subWidget, index: swIdx }">
                            <div class="sub-form-table-column" :style="{ width: subWidget.options.columnWidth }">
                                <template v-if="'container' === subWidget.category">
                                    <component :is="subWidget.type + '-widget'" :widget="subWidget" :designer="designer"
                                        :key="subWidget.id" :parent-list="widget.widgetList" :index-of-parent-list="swIdx"
                                        :parent-widget="widget"></component>
                                </template>
                                <template v-else>
                                    <component :is="subWidget.type + '-widget'" :field="subWidget" :designer="designer"
                                        :key="subWidget.id" :parent-list="widget.widgetList" :index-of-parent-list="swIdx"
                                        :parent-widget="widget" :design-state="true"></component>
                                </template>
                            </div>
                        </template>
                    </draggable>
                </div>
            </el-form>
        </div>
    </container-wrapper>
</template>

<script>
import containerMixin from '@/components/form-designer/form-widget/container-widget/containerMixin'
import ContainerWrapper from '@/components/form-designer/form-widget/container-widget/container-wrapper'
import FieldComponents from '@/components/form-designer/form-widget/field-widget/index'
import refMixinDesign from "@/components/form-designer/refMixinDesign"
import SvgIcon from '@/components/svg-icon/index'

export default {
    name: 'sub-form-widget',
    componentName: 'ContainerWidget',
    mixins: [refMixinDesign, containerMixin],
    inject: ['refList'],
    components: {
        ContainerWrapper,
        ...FieldComponents,
        SvgIcon
    },
    props: {
        widget: Object,
        parentWidget: Object,
        parentList: Array,
        indexOfParentList: Number,
        designer: Object
    },
    computed: {
        selected() {
            return this.widget.id === this.designer.selectedId
        }
    }
}
</script>

<style lang="scss" scoped>
.sub-form-container {
    padding: 8px;
    margin-bottom: 18px;
    border: 1px dashed #336699;
    text-align: left; //IE浏览器强制居左对齐

    &.selected {
        outline: 2px solid $--color-primary !important;
    }

    :deep(.el-row.header-row) {
        padding-bottom: 0;
    }

    .sub-form-table {
        min-height: 68px;

        .row-number-span {
            margin-left: 16px;
        }
    }

    :deep(.ghost) {
        content: "";
        font-size: 0;
        height: 74px;
        width: 1px;
        box-sizing: border-box;
        display: inline-block;
        background: #409EFF;
        border: 2px solid #409EFF;
        outline-width: 0;
        vertical-align: top;
        padding: 0;
        margin: 0;
        overflow: hidden;
    }
}


div.sub-form-table-column {
    display: inline-block;

    :deep(.el-form-item__content) {
        margin-left: 0 !important;
    }
}

div.sub-form-table-column.hide-label {
    :deep(.el-form-item__label) {
        display: none;
    }
}
</style>
