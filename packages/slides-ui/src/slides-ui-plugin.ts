import { IUniverInstanceService, LocaleService, Plugin, PluginType, Tools } from '@univerjs/core';
import { ComponentManager } from '@univerjs/ui';
import { Inject, Injector } from '@wendellhu/redi';

import type { ISlidesUIPluginConfig } from './basics';
import { DefaultSlideUIConfig } from './basics';
import { SLIDE_UI_PLUGIN_NAME } from './basics/const/plugin-name';
import type { IToolbarItemProps } from './controllers';
import { AppUIController } from './controllers/app-ui-controller';
import { SlideUIController } from './controllers/slide-ui.controller';
import { zhCN } from './locale';

export class SlidesUIPlugin extends Plugin {
    static override type = PluginType.Slide;

    private _appUIController?: AppUIController;

    private _config: ISlidesUIPluginConfig;

    private _componentManager?: ComponentManager;

    constructor(
        config: Partial<ISlidesUIPluginConfig> = {},
        @Inject(Injector) override readonly _injector: Injector,
        @Inject(LocaleService) private readonly _localeService: LocaleService,
        @IUniverInstanceService private readonly _currentUniverService: IUniverInstanceService
    ) {
        super(SLIDE_UI_PLUGIN_NAME);
        this._config = Tools.deepMerge({}, DefaultSlideUIConfig, config);

        this.initializeDependencies();
    }

    getConfig() {
        return this._config;
    }

    override onStarting(): void {
        this._localeService.load({
            zhCN,
        });
    }

    override onReady(): void {
        this._markSlideAsFocused();
    }

    getAppUIController() {
        return this._appUIController;
    }

    getComponentManager() {
        return this._componentManager;
    }

    addToolButton(config: IToolbarItemProps) {
        this._appUIController!.getSlideContainerController().getToolbarController().addToolbarConfig(config);
    }

    deleteToolButton(name: string) {
        this._appUIController!.getSlideContainerController().getToolbarController().deleteToolbarConfig(name);
    }

    private initializeDependencies(): void {
        this._injector.add([ComponentManager]);
        this._injector.add([SlideUIController]);

        this._componentManager = this._injector.get(ComponentManager);
        this._appUIController = this._injector.createInstance(AppUIController, this._config);
    }

    private _markSlideAsFocused() {
        const currentService = this._currentUniverService;
        const c = currentService.getCurrentUniverSlideInstance();
        currentService.focusUniverInstance(c.getUnitId());
    }
}