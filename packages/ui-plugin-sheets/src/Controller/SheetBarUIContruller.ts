import { BaseMenuItem, BaseUlProps, ColorPicker } from '@univerjs/base-ui';
import { Nullable, Plugin, ACTION_NAMES, CommandManager, SheetActionBase, UIObserver } from '@univerjs/core';
import { SheetBar } from "../View/SheetBar";
import styles from '../View/SheetBar/index.module.less';

interface CustomComponent {
    name: string;
    props?: Record<string, any>;
}

interface SheetUl extends BaseMenuItem {
    locale?: string;
    customLabel?: CustomComponent;
    children?: SheetUl[];
}

interface SheetUlProps extends BaseUlProps {
    index: string;
    color?: Nullable<string>;
    sheetId: string;
}

export class SheetBarUIController {
    protected _sheetBar: SheetBar;

    protected _sheetList: SheetUlProps[];

    protected _sheetUl: SheetUl[];

    protected _sheetIndex: number;

    protected _plugin: Plugin;

    protected _dataId: string;

    protected _menuList: SheetUlProps[];

    protected _refreshSheetBarUI(): void {
        this._sheetBar.setValue({
            sheetList: this._sheetList,
            sheetUl: this._sheetUl,
            menuList: this._menuList,
            addSheet: () => {
                // this._barControl.addSheet();
            },
            selectSheet: (event: Event, data: { item: SheetUlProps }) => {
                this._dataId = data.item.sheetId;
                const sheet = this._plugin.getContext().getUniver().getCurrentUniverSheetInstance().getWorkBook().getSheetBySheetId(this._dataId);
                if (sheet) {
                    sheet.activate();
                }
            },
            contextMenu: (e: MouseEvent) => {
                const target = e.currentTarget as HTMLDivElement;
                this._dataId = target.dataset.id as string;
                //this._barControl.contextMenu(e);
            },
            changeSheetName: (e: Event) => {
                //this._barControl.changeSheetName(e);
            },
            dragEnd: (elements: HTMLDivElement[]) => {
                //this._barControl.dragEnd(elements);
            },
        });
    }

    protected _refreshSheetData(): void {
        const workbook = this._plugin.getContext().getUniver().getCurrentUniverSheetInstance().getWorkBook();
        const sheets = workbook.getSheets();
        this._menuList = sheets.map((sheet, index) => ({
            label: sheet.getName(),
            index: String(index),
            sheetId: sheet.getSheetId(),
            hidden: sheet.isSheetHidden(),
            selected: sheet.getStatus() === 1,
            onClick: (e: MouseEvent) => {
                const target = e.currentTarget as HTMLDivElement;
                this._dataId = target.dataset.id as string;
                sheet.showSheet();
                sheet.activate();
            },
        }));
        this._sheetList = sheets.filter((sheet) => !sheet.isSheetHidden()).map((sheet, index) => ({
            sheetId: sheet.getSheetId(),
            label: sheet.getName(),
            index: String(index),
            selected: sheet.getStatus() === 1,
            color: sheet.getTabColor() as string,
            onDown: (e: MouseEvent) => {
                const target = e.currentTarget as HTMLDivElement;
                this._dataId = target.dataset.id as string;
            },
            onClick: (e: MouseEvent) => {
                const target = e.currentTarget as HTMLDivElement;
                this._dataId = target.dataset.id as string;

                sheet.activate();
            },
        }));
        this._sheetIndex = sheets.findIndex((sheet) => sheet.getStatus() === 1);
        this._dataId = sheets[this._sheetIndex].getSheetId();
    }

    protected _refreshComponent(): void {
        this._sheetUl = this.resetSheetUl(this._sheetUl);
        this._refreshSheetData();
        this._refreshSheetBarUI();
    }

    constructor(plugin: Plugin) {
        let that = this;
        this._plugin = plugin;
        this._sheetUl = [
            {
                locale: 'sheetConfig.delete',
                onClick: () => {
                    that.setUIObserve('onDeleteSheet', { name: 'deleteSheet', value: this._dataId });
                },
            },
            {
                locale: 'sheetConfig.copy',
                onClick: () => {
                    that.setUIObserve('onCopySheet', { name: 'copySheet' });
                },
            },
            {
                locale: 'sheetConfig.rename',
                onClick: () => {
                    that.setUIObserve('onRemoveSheet', { name: 'removeSheet' });
                },
            },
            {
                locale: 'sheetConfig.changeColor',
                border: true,
                className: styles.selectColorPickerParent,
                children: [
                    {
                        customLabel: {
                            name: this._plugin.getPluginName() + ColorPicker.name,
                            props: {
                                onClick: (color: string) => {
                                    that.setUIObserve('onSheetColor', { name: 'sheetColor', value: color });
                                },
                                lang: {
                                    collapseLocale: 'colorPicker.collapse',
                                    changeLocale: 'colorPicker.change',
                                    customColorLocale: 'colorPicker.customColor',
                                    cancelColorLocale: 'colorPicker.cancelColor',
                                    confirmColorLocale: 'colorPicker.confirmColor',
                                },
                            },
                        },
                        className: styles.selectColorPicker,
                    },
                ],
            },
            {
                locale: 'sheetConfig.hide',
                onClick: () => {
                    that.setUIObserve('onHideSheet', { name: 'hideSheet', value: this._dataId });
                },
            },
            {
                locale: 'sheetConfig.unhide',
                onClick: () => {
                    that.setUIObserve('onUnHideSheet', { name: 'hideSheet', value: this._dataId });

                },
                border: true,
            },
            {
                locale: 'sheetConfig.moveLeft',
                onClick: () => {
                    that.setUIObserve('onToLeftSheet', { name: 'toLeftSheet' });
                },
            },
            {
                locale: 'sheetConfig.moveRight',
                onClick: () => {
                    that.setUIObserve('onToRightSheet', { name: 'toRightSheet' });
                },
            },
        ];
        CommandManager.getActionObservers().add((event) => {
            const action = event.action as SheetActionBase<any>;
            const data = event.data;
            const workbook = action.getWorkBook();
            const unitId = workbook.getUnitId();
            const currentWorkbook = this._plugin.getContext().getUniver().getCurrentUniverSheetInstance().getWorkBook();
            const currentUnitId = currentWorkbook.getUnitId();
            if (unitId === currentUnitId) {
                switch (data.actionName) {
                    case ACTION_NAMES.SET_SHEET_ORDER_ACTION:
                    case ACTION_NAMES.INSERT_SHEET_ACTION:
                    case ACTION_NAMES.SET_TAB_COLOR_ACTION:
                    case ACTION_NAMES.REMOVE_SHEET_ACTION:
                    case ACTION_NAMES.SET_WORKSHEET_NAME_ACTION:
                    case ACTION_NAMES.SET_WORKSHEET_ACTIVATE_ACTION:
                    case ACTION_NAMES.SET_WORKSHEET_STATUS_ACTION: {
                        // update data;
                        this._refreshSheetData();
                        // set ui bar sheetList;
                        this._refreshSheetBarUI();
                        break;
                    }
                }
            }
        });
    }

    getComponent = (ref: SheetBar) => {
        this._sheetBar = ref;
        this._refreshComponent();
    };

    resetLabel(label: string[] | string) {
        const locale = this._plugin.getContext().getLocale();

        let str = '';

        if (label instanceof Array) {
            label.forEach((item) => {
                if (item.includes('.')) {
                    str += locale.get(item);
                } else {
                    str += item;
                }
            });
        } else {
            if (label.includes('.')) {
                str = locale.get(label);
            } else {
                str += label;
            }
        }

        return str;
    }

    findLocale(obj: any) {
        for (let k in obj) {
            if (k === 'locale') {
                obj.label = this.resetLabel(obj[k]);
            } else if (k.endsWith('Locale')) {
                const index = k.indexOf('Locale');
                obj[k.slice(0, index)] = this.resetLabel(obj[k]);
            } else if (!obj[k].$$typeof) {
                if (Object.prototype.toString.call(obj[k]) === '[object Object]') {
                    this.findLocale(obj[k]);
                } else if (Object.prototype.toString.call(obj[k]) === '[object Array]') {
                    obj[k] = this.resetSheetUl(obj[k]);
                }
            }
        }

        return obj;
    }

    setUIObserve<T>(type: string, msg: UIObserver<T>) {
        this._plugin.getContext().getObserverManager().requiredObserver<UIObserver<T>>(type, 'core').notifyObservers(msg);
    }

    getSheetBar(): SheetBar {
        return this._sheetBar;
    }

    getDataId(): string {
        return this._dataId;
    }

    getSheetList(): SheetUlProps[] {
        return this._sheetList;
    }

    getMenuList(): SheetUlProps[] {
        return this._menuList;
    }

    resetSheetUl(sheetUl: SheetUl[]) {
        for (let i = 0; i < sheetUl.length; i++) {
            let item = sheetUl[i];
            item = this.findLocale(item);

            if (item.children) {
                item.children = this.resetSheetUl(item.children);
            }
        }
        return sheetUl;
    }

    selectSheet() {

    }

    deleteSheet() {

    }

    sortMenu(index: number, hidden?: boolean, hideIndex?: number) {

    }

    copySheet() {

    }

    addSheet(position?: string, config?: SheetUlProps): void {
        this.setUIObserve('onAddSheet', {
            name: 'addSheet',
            value: {
                position,
                config
            }
        });
    }

    reNameSheet() {
        this._sheetBar.reNameSheet(this._dataId);
    }

    hideSheet() {

    }

    unHideSheet() {
        this._sheetBar.ref.current.showSelect();
    }

    moveSheet(direct: string) {

    }

    changeSheetName(e: Event) {

    }

    contextMenu(e: MouseEvent) {
        this._sheetBar.contextMenu(e);
    }

    dragEnd(element: HTMLDivElement[]) {
        let list: SheetUlProps[] = [];
        Array.from(element).forEach((node: any) => {
            const item = this._sheetList.find((ele) => ele.sheetId === node.dataset.id);
            if (item) {
                list.push(item);
            }
        });
        this._sheetList = list;
        this._sheetBar.setValue({
            sheetList: list,
        });
    }
}