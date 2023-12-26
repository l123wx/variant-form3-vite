# Variant Form 3 For Vue 3.x
![image](https://ks3-cn-beijing.ksyuncs.com/vform-static/img/vform_demo.gif)



本项目由 [VForm 3 开源版本](https://github.com/vform666/variant-form3-vite)改造而来，修改了部分底层实现逻辑，不与原有 VForm3 兼容

### 安装依赖
```
npm install
```

### 开发调试
```
npm run serve
```

### 生产打包

```
npm run build
```

### 表单设计器 + 表单渲染器打包
```
npm run lib
```

### 表单渲染器打包
```
npm run lib-render
```

### 浏览器兼容性
```Chrome（及同内核的浏览器如QQ浏览器、360浏览器等等），Firefox，Safari```

### 在Vue 3.x项目中使用

```js
import { createApp } from 'vue'
import App from './App.vue'

import ElementPlus from 'element-plus'  //引入element-plus库
import 'element-plus/dist/index.css'  //引入element-plus样式

// Vue3表单组件
import VForm3 from '@/components/vform/designer.umd.js'
import '@/components/vform/designer.style.css'

const app = createApp(App)
app.use(ElementPlus)  //全局注册element-plus
app.use(VForm3)  //全局注册VForm 3(同时注册了v-form-designer和v-form-render组件)

app.mount('#app')
```

注意：由于打包时VForm不会把element-plus的代码一起打包，所以在使用的时候必须全局导入element-plus

#### 3. 在Vue 3.x模板中使用表单设计器组件
```vue
<template>
	<v-form-designer ref="vfdRef"></v-form-designer>
</template>

<script setup>
	const vfdRef = ref(null)
	
	onMounted(() => {
		// vfdRef.value.setFormJson({...})
        // vfdRef.value.getFormJson()
	})
</script>

<style lang="scss">
    body {
        margin: 0;  /* 如果页面出现垂直滚动条，则加入此行CSS以消除之 */
    }
</style>
```

#### 4. 在Vue 3.x模板中使用表单渲染器组件
```vue
<template>
<div>
 <v-form-render :option-data="optionData" ref="vFormRef">
 </v-form-render>
 <el-button type="primary" @click="submitForm">Submit</el-button>
</div>
</template>
<script setup>
    import { ref, reactive } from 'vue'
    import { ElMessage } from 'element-plus'

    const optionData = reactive({})
    const vFormRef = ref(null)

    const submitForm = () => {
        try {
            const formData = await vFormRef.value.getFormData()
            console.log(JSON.stringify(formData))
        } catch(error) {
            // Form Validation failed
            ElMessage.error(error)
        }
    }

    onMounted(() => {
        vFormRef.value.setFormJson({...})
        nextTick(() => {
            vFormRef.value.setFormData({...})
        })
    })
</script>
```

## 使用教程

### setFormData()

```js
/**
 * @param {boolean} ifUpdateWhenExist 当表单字段有值的时候是否更新该字段
 */
setFormData(formData, ifUpdateWhenExist = true)
```

当 ifUpdateWhenExist 为 false 时，当表单中的某个字段已经有值时，不会修改这个字段\

### setHidden()

使用这个方法可以控制组件的显隐，当组件隐藏时，必填校验规则不会再进行校验，重新将组件显示时，会恢复校验

```js
// 在当前组件的事件中直接使用this调用
this.setHidden(value > 10)

// 使用 getWidgetRef 方法调用其他组件的方法
this.getWidgetRef('otherExampleFieldRefName').setHidden(value > 10)
```

### 回显其他表单的字段

可以通过在表单的 onFormCreated 事件中使用 setFormData 方法实现这个需求。要注意的是，每次加载表单时都会执行 onFormCreated 回调，如果只希望第一次打开表单的时候回显某些字段，可以将 ifUpdateWhenExist 设置为 false，这样在修改过这些字段后就不会再赋值了。

```js
;(async () => {
    try {
        // 调用接口获取表单数据
        // 为了共用项目中的请求方法，可以将请求方法挂载到 Vue 实例上
        const formData = await this.fetchFormData('')

        if (!formData) return

        this.setFormData({
            exampleField: formData.exampleField
        }, false)
    } catch (err) {
        console.error(err)
    }
})()
```

### 动态加载选项

在组件的 onCreated 事件中：

```js
;(async () => {
    this.setLoading(true)
    this.loadOptions([])

    try {
        // 通过接口获取选项
        const { data } = await this.request({
            methods: 'get',
            url: 'exampleApi'
        })

        // 配置选项
        this.loadOptions(
            data.map(item => ({
                label: item.customName,
                value: item.id
            }))
        )
    } finally {
        this.setLoading(false)
    }
})()
```

### 字段联动

如果是只涉及到一个字段，直接在这个字段组件的 onChange 事件中处理：

```js
this.getWidgetRef('otherExampleFieldRefName').setHidden(value > 10)
```

如果是多个字段直接的联动，建议在 表单的 onFormDataChange 中处理：

```js
;(async () => {
    if (
        // 判断本次修改的是不是需要处理的字段，当所有涉及的字段都不为空时才执行下面的逻辑
        (
            fieldName[0] === 'field1' ||
            fieldName[0] === 'field2'
        ) && (
            formModel.field1 !== '' &&
            formModel.field2 !== ''
        )
    ) {
        console.log(field1 + field2)
    }
})()
```

### 文件上传设置 url 和 header

在文件上传的 onCreated 事件中：

```js
// this.baseURL 和 this.getToken 是挂载到 Vue 实例上的全局变量
this.setWidgetOption('uploadURL', this.baseURL + "/common/upload")
this.setUploadHeader('Authorization', 'Bearer ' + this.getToken())
```
