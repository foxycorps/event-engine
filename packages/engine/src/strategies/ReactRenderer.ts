import NanoEvent from "@foxycorps/nanoevent"
// @ts-ignore
import React from 'react';
import { InputEngine, OutputEngine } from "../core";

interface Dictionary<T> {
    [key: string]: T
}

interface CommonProperties {
    propsListener: string;
    componentListener: string;
}

interface ReactInputProperties extends CommonProperties {
    starterProps: Dictionary<any>;
    starterComponent: string | React.ReactNode;
    holdProps: boolean
}

interface ReactInputState {
    props: Dictionary<any>
}

export class ReactInput extends InputEngine {
    private options: ReactInputProperties;
    private state: ReactInputState;

    constructor(options: ReactInputProperties) {
        super("react-input");
        this.options = options;
        this.state = {
            props: {
                ...(options.starterProps ?? {})
            }
        }
    }

    beforeReady(): void {
        this.registerTypes([
            this.options.componentListener,
            this.options.propsListener
        ])
    }

    onReady(): void {
        this.propsUpdater(this.options.starterProps);
        this.componentUpdater(this.options.starterComponent);
    }

    propsUpdater(newProps: any): void {
        this.state.props = {
            ...(this.options.holdProps && this.state.props),
            ...newProps
        }

        this.emit(this.options.propsListener, this.state.props);
    }

    get props(): Dictionary<any> {
        return this.state.props
    }

    componentUpdater(componentName: string | React.ReactNode): void {
        this.emit(this.options.componentListener, componentName);
    }
}

interface ReactOutputProperties extends CommonProperties {
    component?: React.ReactNode;
    loadingComponent: React.ReactNode;
    stateChangeListener: string;
}

interface ReactOutputState {
    component: React.ReactNode | undefined;
    props: Dictionary<any>;
}

export class ReactOutput extends OutputEngine {
    private options: ReactOutputProperties;
    private state: ReactOutputState;

    private internalEvents: NanoEvent;

    constructor(options: ReactOutputProperties) {
        super("react-output");
        this.options = options;
        this.internalEvents = new NanoEvent();
        this.state = {
            component: undefined,
            props: {}
        }
    }

    private buildComponent(): any {
        return React.createElement(this.state.component as any, { ...this.state.props });
    }

    updateComponent(): void {
        this.internalEvents.emit(this.options.stateChangeListener, this.buildComponent());
    }

    beforeReady(): void {
        this.state.component = this.options.loadingComponent;
        this.updateComponent();
    }

    onReady(): void {
        this.listenTo(this.options.componentListener, (newComponentName: unknown) => {
            this.state.component = newComponentName as any;
            this.updateComponent();
        });
        this.listenTo(this.options.propsListener, (newComponentProps: any) => {
            this.state.props = newComponentProps;
            this.updateComponent();
        })
    }

    afterReady(): void {
        // Checking to see if a component is defined here...
        // if it is, we can assume that the input source is not going to change it
        if (this.options.component != null) {
            this.state.component = this.options.component;
            this.updateComponent();
        }
    }

    onUpdate(callback: ((data: unknown) => void)): void {
        this.internalEvents.on(this.options.stateChangeListener, (data: unknown) => {
            callback(data);
        });
    }

    requestLatest(callback: ((data: unknown) => void)): void {
        callback(this.buildComponent())
    }
}