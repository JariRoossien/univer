import { BorderInfo } from '@univerjs/base-sheets';
import { BaseSelectChildrenProps, BaseSelectProps, BaseTextButtonProps, ColorPicker } from '@univerjs/base-ui';
import { BorderType, DEFAULT_STYLES, HorizontalAlign, IKeyValue, Tools, UIObserver, VerticalAlign, WrapStrategy } from '@univerjs/core';
import { SheetUIPlugin } from '..';
import { DefaultToolbarConfig, SheetToolbarConfig, SHEET_UI_PLUGIN_NAME } from '../Basics';
import { ColorSelect, LineBold, LineColor, Toolbar } from '../View';
import { BORDER_LINE_CHILDREN, BORDER_SIZE_CHILDREN, FONT_FAMILY_CHILDREN, FONT_SIZE_CHILDREN, HORIZONTAL_ALIGN_CHILDREN, MERGE_CHILDREN, TEXT_ROTATE_CHILDREN, TEXT_WRAP_CHILDREN, VERTICAL_ALIGN_CHILDREN } from '../View/ToolBar/Const';
import styles from '../View/ToolBar/index.module.less';

// 继承基础下拉属性,添加国际化
export interface BaseToolbarSelectChildrenProps extends BaseSelectChildrenProps {
    suffixLocale?: string;
    children?: BaseToolbarSelectChildrenProps[];
}

export interface BaseToolbarSelectProps extends BaseSelectProps {
    suffixLocale?: string;
    children?: BaseToolbarSelectChildrenProps[];
}

enum ToolbarType {
    SELECT,
    BUTTON,
}

export interface IToolbarItemProps extends BaseToolbarSelectProps, BaseTextButtonProps {
    show?: boolean; //是否显示按钮
    toolbarType?: ToolbarType;
    tooltip?: string; //tooltip文字
    border?: boolean;
}


export class ToolbarUIController {
    private _plugin: SheetUIPlugin;

    private _toolbar: Toolbar;

    private _toolList: IToolbarItemProps[];

    private _config: SheetToolbarConfig;

    private _lineColor: LineColor;

    private _lineBold: LineBold;

    private _colorSelect1: ColorSelect;

    private _colorSelect2: ColorSelect;

    private _borderInfo: BorderInfo = {
        type: BorderType.TOP,
        color: '#000',
        style: 1
    } //存储边框信息

    constructor(plugin: SheetUIPlugin, config?: SheetToolbarConfig) {
        this._plugin = plugin;

        this._config = Tools.deepMerge({}, DefaultToolbarConfig, config);

        this._toolList = [
            {
                toolbarType: 1,
                tooltip: 'toolbar.undo',
                name: 'undo',
                customLabel: {
                    name: 'ForwardIcon',
                },
                show: this._config.undo,
                onClick: () => this.setUndo(),
            },
            {
                toolbarType: 1,
                tooltip: 'toolbar.redo',
                customLabel: {
                    name: 'BackIcon',
                },
                name: 'redo',
                show: this._config.redo,
                onClick: () => this.setRedo(),
            },
            {
                type: 0,
                tooltip: 'toolbar.font',
                className: styles.selectLabelString,
                name: 'font',
                show: this._config.font,
                border: true,
                onClick: (fontFamily: string) => {
                    this.setFontFamily(fontFamily);
                },
                children: FONT_FAMILY_CHILDREN,
            },
            {
                type: 1,
                tooltip: 'toolbar.fontSize',
                label: String(DEFAULT_STYLES.fs),
                name: 'fontSize',
                show: this._config.fontSize,
                onClick: (fontSize: number) => {
                    this.setFontSize(fontSize);
                },
                onKeyUp: (fontSize: number) => {
                    this.setFontSize(fontSize);
                },
                children: FONT_SIZE_CHILDREN,
            },
            {
                toolbarType: 1,
                tooltip: 'toolbar.bold',
                customLabel: {
                    name: 'BoldIcon',
                },
                active: false,
                name: 'bold',
                show: this._config.bold,
                onClick: (isBold: boolean) => {
                    this.setFontWeight(isBold);
                },
            },
            {
                toolbarType: 1,
                tooltip: 'toolbar.italic',
                customLabel: {
                    name: 'ItalicIcon',
                },
                name: 'italic',
                show: this._config.italic,
                onClick: (isItalic: boolean) => {
                    this.setFontStyle(isItalic)
                },
            },
            {
                toolbarType: 1,
                tooltip: 'toolbar.strikethrough',
                customLabel: {
                    name: 'DeleteLineIcon',
                },
                name: 'strikethrough',
                show: this._config.strikethrough,
                onClick: (isStrikethrough: boolean) => {
                    this.setStrikeThrough(isStrikethrough)
                },
            },
            {
                toolbarType: 1,
                tooltip: 'toolbar.underline',
                customLabel: {
                    name: 'UnderLineIcon',
                },
                name: 'underline',
                show: this._config.underline,
                onClick: (isUnderLine: boolean) => {
                    this.setUnderline(isUnderLine)
                },
            },
            {
                type: 5,
                tooltip: 'toolbar.textColor.main',
                customLabel: {
                    name: SHEET_UI_PLUGIN_NAME + ColorSelect.name,
                    props: {
                        getComponent: (ref: ColorSelect) => {
                            this._colorSelect1 = ref
                        },
                        customLabel: {
                            name: 'TextColorIcon',
                        },
                    },
                },
                hideSelectedIcon: true,
                className: styles.selectColorPickerParent,
                children: [
                    {
                        customLabel: {
                            name: SHEET_UI_PLUGIN_NAME + ColorPicker.name,
                            props: {

                                onClick: (color: string, e: MouseEvent) => {
                                    this._colorSelect1.setColor(color);
                                    this.setFontColor(color)
                                },
                            },
                        },
                        className: styles.selectColorPicker,
                    },
                ],
                name: 'textColor',
                show: this._config.textColor,
            },
            {
                type: 5,
                tooltip: 'toolbar.fillColor.main',
                customLabel: {
                    name: SHEET_UI_PLUGIN_NAME + ColorSelect.name,
                    props: {
                        getComponent: (ref: ColorSelect) => {
                            this._colorSelect2 = ref
                        },
                        customLabel: {
                            name: 'FillColorIcon',
                        },
                    },
                },
                hideSelectedIcon: true,
                className: styles.selectColorPickerParent,
                children: [
                    {
                        customLabel: {
                            name: SHEET_UI_PLUGIN_NAME + ColorPicker.name,
                            props: {
                                onClick: (color: string, e: MouseEvent) => {
                                    this._colorSelect2.setColor(color);
                                    this.setBackground(color)
                                }
                            },
                        },
                        className: styles.selectColorPicker,
                    },
                ],
                name: 'fillColor',
                show: this._config.fillColor,
            },
            {
                type: 3,
                display: 1,
                show: this._config.border,
                tooltip: 'toolbar.border.main',
                className: styles.selectDoubleString,
                onClick: (value: string) => {
                    this._borderInfo.type = value as BorderType
                    this.setBorder()
                },
                name: 'border',
                children: [
                    ...BORDER_LINE_CHILDREN,
                    {
                        customLabel: {
                            name: SHEET_UI_PLUGIN_NAME + LineColor.name,
                            props: {
                                label: 'borderLine.borderColor',
                                getComponent: (ref: LineColor) => this._lineColor = ref
                            },
                        },
                        unSelectable: true,
                        className: styles.selectColorPickerParent,
                        children: [
                            {
                                customLabel: {
                                    name: SHEET_UI_PLUGIN_NAME + ColorPicker.name,
                                    props: {
                                        onClick: (color: string, e: MouseEvent) => {
                                            this._lineColor.setColor(color)
                                            this._borderInfo.color = color
                                        },
                                    },
                                },
                                className: styles.selectColorPicker,
                                onClick: (...arg) => {
                                    arg[0].stopPropagation();
                                },
                            },
                        ],
                    },
                    {
                        customLabel: {
                            name: SHEET_UI_PLUGIN_NAME + LineBold.name,
                            props: {
                                label: 'borderLine.borderSize',
                                getComponent: (ref: LineBold) => this._lineBold = ref
                            },
                        },
                        onClick: (...arg) => {
                            arg[0].stopPropagation()
                            this._lineBold.setImg(BORDER_SIZE_CHILDREN[arg[2]].customLabel?.name)
                            this._borderInfo.style = arg[1]
                        },
                        className: styles.selectLineBoldParent,
                        unSelectable: true,
                        children: BORDER_SIZE_CHILDREN,
                    },
                ],
            },
            {
                type: 5,
                tooltip: 'toolbar.mergeCell.main',
                customLabel: {
                    name: 'MergeIcon',
                },
                show: this._config.mergeCell,
                onClick: (value: string) => {
                    this.setMerge(value);
                },
                name: 'mergeCell',
                children: MERGE_CHILDREN,
            },
            {
                type: 3,
                tooltip: 'toolbar.horizontalAlignMode.main',
                className: styles.selectDoubleString,
                display: 1,
                name: 'horizontalAlignMode',
                show: this._config.horizontalAlignMode,
                onClick: (value: HorizontalAlign) => {
                    this.setHorizontalAlignment(value);
                },
                children: HORIZONTAL_ALIGN_CHILDREN,
            },
            {
                type: 3,
                tooltip: 'toolbar.verticalAlignMode.main',
                className: styles.selectDoubleString,
                display: 1,
                name: 'verticalAlignMode',
                show: this._config.verticalAlignMode,
                onClick: (value: VerticalAlign) => {
                    this.setVerticalAlignment(value);
                },
                children: VERTICAL_ALIGN_CHILDREN,
            },
            {
                type: 3,
                className: styles.selectDoubleString,
                tooltip: 'toolbar.textWrapMode.main',
                display: 1,
                name: 'textWrapMode',
                show: this._config.textWrapMode,
                onClick: (value: WrapStrategy) => {
                    this.setWrapStrategy(value);
                },
                children: TEXT_WRAP_CHILDREN,
            },
            {
                type: 3,
                className: styles.selectDoubleString,
                name: 'textRotateMode',
                tooltip: 'toolbar.textRotateMode.main',
                display: 1,
                show: this._config.textRotateMode,
                onClick: (value: number | string) => {
                    this.setTextRotation(value);
                },
                children: TEXT_ROTATE_CHILDREN,
            },
        ];

        this._initialize();
    }

    private _initialize() {
        this._plugin.getComponentManager().register(SHEET_UI_PLUGIN_NAME + ColorSelect.name, ColorSelect)
        this._plugin.getComponentManager().register(SHEET_UI_PLUGIN_NAME + ColorPicker.name, ColorPicker)
        this._plugin.getComponentManager().register(SHEET_UI_PLUGIN_NAME + LineColor.name, LineColor)
        this._plugin.getComponentManager().register(SHEET_UI_PLUGIN_NAME + LineBold.name, LineBold)
    }

    // 获取Toolbar组件
    getComponent = (ref: Toolbar) => {
        this._toolbar = ref;
        this.setToolbar();
    };

    // 增加toolbar配置
    addToolbarConfig(config: IToolbarItemProps) {
        const index = this._toolList.findIndex((item) => item.name === config.name);
        if (index > -1) {
            this._toolList.push(config);
        }
    }

    // 删除toolbar配置
    deleteToolbarConfig(name: string) {
        const index = this._toolList.findIndex((item) => item.name === name);
        if (index > -1) {
            this._toolList.splice(index, 1);
        }
    }

    // 刷新toolbar
    setToolbar() {
        this._toolbar.setToolbar(this._toolList);
    }

    setUIObserve<T>(msg: UIObserver<T>) {
        this._plugin.getContext().getObserverManager().requiredObserver<UIObserver<T>>('onUIChangeObservable', 'core').notifyObservers(msg);
    }

    setUndo() {
        const msg = {
            name: 'undo',
        };
        this.setUIObserve(msg);
    }

    setRedo() {
        const msg = {
            name: 'redo',
        };
        this.setUIObserve(msg);
    }

    setFontFamily(fontFamily: string) {
        const msg = {
            name: 'fontFamily',
            value: fontFamily,
        };
        this.setUIObserve(msg);
    }

    setFontSize(fontSize: number) {
        const msg = {
            name: 'fontSize',
            value: fontSize,
        };
        this.setUIObserve<number>(msg);
    }

    setFontWeight(isBold: boolean) {
        const msg = {
            name: 'fontWeight',
            value: isBold,
        };
        this.setUIObserve<boolean>(msg);
    }

    setFontStyle(isItalic: boolean) {
        const msg = {
            name: 'fontStyle',
            value: isItalic,
        };
        this.setUIObserve<boolean>(msg);
    }

    setStrikeThrough(isStrikethrough: boolean) {
        const msg = {
            name: 'strikeThrough',
            value: isStrikethrough,
        };
        this.setUIObserve<boolean>(msg);
    }

    setUnderline(isUnderLine: boolean) {
        const msg = {
            name: 'underLine',
            value: isUnderLine,
        };
        this.setUIObserve<boolean>(msg);
    }

    setFontColor(color: string) {
        const msg = {
            name: 'fontColor',
            value: color,
        };
        this.setUIObserve(msg);
    }

    setBackground(color: string) {
        const msg = {
            name: 'background',
            value: color,
        };
        this.setUIObserve(msg);
    }


    setMerge(value: string) {
        const msg = {
            name: 'merge',
            value,
        };
        this.setUIObserve(msg);
    }

    setTextRotation(value: string | number) {
        const msg = {
            name: 'textRotation',
            value,
        };
        this.setUIObserve(msg);
    }

    setWrapStrategy(value: WrapStrategy) {
        const msg = {
            name: 'wrapStrategy',
            value,
        };
        this.setUIObserve<number>(msg);
    }

    setVerticalAlignment(value: VerticalAlign) {
        const msg = {
            name: 'verticalAlignment',
            value,
        };
        this.setUIObserve<number>(msg);
    }

    setHorizontalAlignment(value: HorizontalAlign) {
        const msg = {
            name: 'horizontalAlignment',
            value,
        };
        this.setUIObserve<number>(msg);
    }

    setBorder() {
        const msg = {
            name: 'borderInfo',
            value: this._borderInfo,
        };
        this.setUIObserve<IKeyValue>(msg);
    }
}
