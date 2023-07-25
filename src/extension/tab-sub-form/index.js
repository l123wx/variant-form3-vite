import { addContainerWidgetSchema } from "@/components/form-designer/widget-panel/widgetsConfig"
import * as PERegister from '@/components/form-designer/setting-panel/propertyRegister'
import * as PEFactory from '@/components/form-designer/setting-panel/property-editor-factory.jsx'

import DesignerComponent from './DesignerComponent.vue'
import RenderComponent from "./RenderComponent.vue"
import schema from "./schema"

export default app => {
    /**
     * 加载容器组件步骤：
     * 1. 加载组件Json Schema;
     * 2. 全局注册容器组件，容器组件有两种状态——设计期和运行期，故需要注册两个组件；
     * 3. 全局注册属性编辑器组件（基本属性、高级属性、事件属性）；
     * 4. 注册容器组件的代码生成器；
     * 5. 加载完毕。
     */
    addContainerWidgetSchema(schema)
    /* -------------------------------------------------- */
    app.component(DesignerComponent.name, DesignerComponent) //注册设计期的容器组件
    app.component(RenderComponent.name, RenderComponent) //注册运行期的容器组件
    /* -------------------------------------------------- */

    PERegister.registerCPEditor(
        app,
        'tabLabelName',
        'tab-label-name-editor',
        PEFactory.createInputTextEditor(
            'tabLabelName',
            {
                zh: '标签名称',
                en: 'Tab Label Name'
            }
        )
    )
}