import {buildClassAttr, buildContainerWidget, buildFieldWidget} from '@/utils/sfc-generator'

export default (cw, formConfig) => {
    const wop = cw.options
    //const headerAttr = `header="${wop.label}"`
    const classAttr = buildClassAttr(cw)
    const styleAttr = !!wop.cardWidth
        ? `style="{width: ${wop.cardWidth} !important}"`
        : ''
    const shadowAttr = `shadow="${wop.shadow}"`
    const vShowAttr = !!wop.hidden ? `v-show="false"` : ''

    const cardTemplate = `<div class="card-container">
    <el-card ${classAttr} ${styleAttr} ${shadowAttr} ${vShowAttr}>
      <template #header>
        <div class="clear-fix">
          <span>${wop.label}</span>
          ${
              !!wop.showFold
                  ? `<i class="float-right el-icon-arrow-down"></i>`
                  : ''
          }
        </div>
      </template>
      ${cw.widgetList
          .map(wItem => {
              if (wItem.category === 'container') {
                  return buildContainerWidget(wItem, formConfig)
              } else {
                  return buildFieldWidget(wItem, formConfig)
              }
          })
          .join('')}
    </el-card>
  </div>`

    return cardTemplate
}
