import { chooseTextByLang } from "@/utils/i18n"
import emitter from '@/utils/emitter'

/**
 * @typedef {{ zh: string, en: string }} TextObject
 * @typedef {{ optionItems: {value: string | number, label: string}[] }} Configs
 * @typedef {function(string, TextObject, Configs?): any} EditorCreator
 */

/** @type {EditorCreator} */
export const createInputTextEditor = function (propName, textObject) {
  return {
    props: {
      optionModel: Object,
    },
    render(h) {
      return (
        <el-form-item label={chooseTextByLang(textObject)}>
          <el-input type="text" v-model={this.optionModel[propName]} />
        </el-form-item>
      )
    }
  }
}

/** @type {EditorCreator} */
export const createInputNumberEditor = function (propName, textObject) {
  return {
    props: {
      optionModel: Object,
    },
    methods: {
      updateValue(newValue) {
        if ((newValue === undefined) || (newValue === null) || isNaN(newValue)) {
          this.optionModel[propName] = null
        } else {
          this.optionModel[propName] = Number(newValue)
        }
      },
    },
    render(h) {
      return (
          <el-form-item label={chooseTextByLang(textObject)}>
            <el-input-number type="text" v-model={this.optionModel[propName]}
                             onChange={this.updateValue} style="width: 100%" />
          </el-form-item>
      )
    }
  }
}

/** @type {EditorCreator} */
export const createBooleanEditor = function (propName, textObject) {
  return {
    props: {
      optionModel: Object,
    },
    render(h) {
      return (
        <el-form-item label={chooseTextByLang(textObject)}>
          <el-switch v-model={this.optionModel[propName]} />
        </el-form-item>
      )
    }
  }
}

/** @type {EditorCreator} */
export const createCheckboxGroupEditor = function (propName, textObject, configs) {
  return {
    props: {
      optionModel: Object,
    },
    render(h) {
      return (
        <el-form-item label={chooseTextByLang(textObject)}>
          <el-checkbox-group v-model={this.optionModel[propName]}>
            {
              configs.optionItems.map(item => {
                return <el-checkbox label={item.value}>{item.label}</el-checkbox>
              })
            }
          </el-checkbox-group>
        </el-form-item>
      )
    }
  }
}


/** @type {EditorCreator} */
export const createRadioGroupEditor = function (propName, textObject, configs) {
  return {
    props: {
      optionModel: Object,
    },
    render(h) {
      return (
        <el-form-item label={chooseTextByLang(textObject)}>
          <el-radio-group v-model={this.optionModel[propName]}>
            {
              configs.optionItems.map(item => {
                return <el-radio label={item.value}>{item.label}</el-radio>
              })
            }
          </el-radio-group>
        </el-form-item>
      )
    }
  }
}

/** @type {EditorCreator} */
export const createRadioButtonGroupEditor = function (propName, textObject, configs) {
  return {
    props: {
      optionModel: Object,
    },
    render(h) {
      return (
          <el-form-item label={chooseTextByLang(textObject)}>
            <el-radio-group v-model={this.optionModel[propName]}>
              {
                configs.optionItems.map(item => {
                  return <el-radio-button label={item.value}>{item.label}</el-radio-button>
                })
              }
            </el-radio-group>
          </el-form-item>
      )
    }
  }
}

/** @type {EditorCreator} */
export const createSelectEditor = function (propName, textObject, configs) {
  return {
    props: {
      optionModel: Object,
    },
    render(h) {
      return (
        <el-form-item label={chooseTextByLang(textObject)}>
          <el-select v-model={this.optionModel[propName]}>
            {
              configs.optionItems.map(item => {
                return <el-option label={item.label} value={item.value} />
              })
            }
          </el-select>
        </el-form-item>
      )
    }
  }
}

export const createEventHandlerEditor = function (eventPropName, eventParams) {
  return {
    props: {
      optionModel: Object,
    },
    mixins: [emitter],
    methods: {
      editEventHandler() {
        this.dispatch('SettingPanel', 'editEventHandler', [eventPropName, [...eventParams]])
      },
    },
    render(h) {
      return (
        <el-form-item label={eventPropName} label-width="150px">
            <el-button type="info" icon="el-icon-edit" plain round onClick={this.editEventHandler}>
            {chooseTextByLang('designer.setting.addEventHandler')}</el-button>
        </el-form-item>
      )
    }
  }
}

export const createEmptyEditor = function () {
  return {
    render() {
      return <div style="display: none" />
    }
  }
}

