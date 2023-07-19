import { addContainerWidgetSchema } from '@/components/form-designer/widget-panel/widgetsConfig'
import * as PERegister from '@/components/form-designer/setting-panel/propertyRegister'
import * as PEFactory from '@/components/form-designer/setting-panel/property-editor-factory.jsx'

import { registerCWGenerator } from '@/utils/sfc-generator'

import Component from './index.vue'
import CardItem from './card-item'
import schema from './schema'
import templateGenerator from './sfc-generator'

export default app => {
    /**
     * 加载容器组件步骤：
     * 1. 加载组件Json Schema;
     * 2. 全局注册容器组件，容器组件有两种状态——设计期和运行期，故需要注册两个组件；
     * 3. 全局注册属性编辑器组件（基本属性、高级属性、事件属性）；
     * 4. 注册容器组件的代码生成器；
     * 5. 加载完毕。
     */
    addContainerWidgetSchema(schema) //加载组件Json Schema
    /* -------------------------------------------------- */
    app.component(Component.name, Component) //注册设计期的容器组件
    app.component(CardItem.name, CardItem) //注册运行期的容器组件
    /* -------------------------------------------------- */
    PERegister.registerCPEditor(
        app,
        'card-folded',
        'card-folded-editor',
        PEFactory.createBooleanEditor(
            'folded',
            {
                zh: '是否收起',
                en: 'Folded'
            }
        )
    )

    PERegister.registerCPEditor(
        app,
        'card-showFold',
        'card-showFold-editor',
        PEFactory.createBooleanEditor(
            'showFold',
            {
                zh: '显示折叠按钮',
                en: 'Show Fold'
            }
        )
    )

    PERegister.registerCPEditor(
        app,
        'card-cardWidth',
        'card-cardWidth-editor',
        PEFactory.createInputTextEditor(
            'cardWidth',
            {
                zh: '卡片宽度',
                en: 'Width Of Card'
            }
        )
    )

    let shadowOptions = [
        { label: 'never', value: 'never' },
        { label: 'hover', value: 'hover' },
        { label: 'always', value: 'always' }
    ]
    PERegister.registerCPEditor(
        app,
        'card-shadow',
        'card-shadow-editor',
        PEFactory.createSelectEditor(
            'shadow',
            {
                zh: '显示阴影',
                en: 'Shadow'
            },
            {
                optionItems: shadowOptions
            }
        )
    )
    /* -------------------------------------------------- */
    registerCWGenerator('card', templateGenerator) //注册容器组件的代码生成器
    /* -------------------------------------------------- */
    /* 容器组件加载完毕 end */
}
