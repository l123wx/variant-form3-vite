export const getFormWidgetData = widgetList => {
    const _formModel = {}

    widgetList.forEach(widgetItem => {
        if (widgetItem.category === 'container') {
            if (widgetItem.type === 'grid') {
                if (!!widgetItem.cols) {
                    Object.assign(
                        _formModel,
                        getFormWidgetData(widgetItem.cols)
                    )
                }
            } else if (widgetItem.type === 'table') {
                if (!!widgetItem.rows) {
                    Object.assign(
                        _formModel,
                        ...widgetItem.rows.map(item =>
                            !!item.cols ? getFormWidgetData(item.cols) : {}
                        )
                    )
                }
            } else if (
                widgetItem.type === 'grid-col' ||
                widgetItem.type === 'table-cell'
            ) {
                if (!!widgetItem.widgetList) {
                    Object.assign(
                        _formModel,
                        getFormWidgetData(widgetItem.widgetList)
                    )
                }
            } else if (widgetItem.type === 'tab') {
                if (!!widgetItem.tabs) {
                    Object.assign(
                        _formModel,
                        ...widgetItem.tabs.map(item =>
                            !!item.widgetList
                                ? getFormWidgetData(item.widgetList)
                                : {}
                        )
                    )
                }
            } else if (widgetItem.type === 'sub-form') {
                if (widgetItem.options.showBlankRow) {
                    _formModel[widgetItem.options.name] = [
                        getFormWidgetData(widgetItem.widgetList)
                    ]
                } else {
                    _formModel[widgetItem.options.name] = []
                }
            } else if (widgetItem.type === 'tab-sub-form') {
                if (widgetItem.options.showBlankRow) {
                    _formModel[widgetItem.options.name] = [
                        getFormWidgetData(widgetItem.widgetList)
                    ]
                } else {
                    _formModel[widgetItem.options.name] = []
                }
            }
        } else if (!!widgetItem.formItemFlag) {
            _formModel[widgetItem.options.name] =
                widgetItem.options.defaultValue
        }
    })

    return _formModel
}
