import { addCustomWidgetSchema } from '@/components/form-designer/widget-panel/widgetsConfig'

import schema from "./schema"

import Component from './index.vue'

export default (app) => {
    /**
     * 加载字段组件步骤：
     * 1. 加载组件Json Schema;
     * 2. 全局注册字段组件，字段组件设计期和运行期共用，故仅需注册一个组件；
     * 3. 全局注册属性编辑器组件（基本属性、高级属性、事件属性）；
     * 4. 注册字段组件的代码生成器；
     * 5. 加载完毕。
     */
    addCustomWidgetSchema(schema) //加载组件Json Schema
    /* -------------------------------------------------- */
    app.component(Component.name, Component) //注册组件
}
