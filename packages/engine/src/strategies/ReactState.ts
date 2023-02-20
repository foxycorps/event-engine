import NanoEvent from "@foxycorps/nanoevent";
import { InputEngine, OutputEngine } from "../core";

interface CommonProperties {
    stateChangeListener: string;
    internalRequestListener: string;
}

interface ReactStateInputProperties extends CommonProperties {
    startingValue?: any;
    keep?: boolean;
    isList?: boolean;
}

interface ReactStateOutputProperties extends CommonProperties { }

export class ReactStateInput extends InputEngine {

    private options: ReactStateInputProperties;
    private state: any;

    constructor(options: ReactStateInputProperties) {
        super("react-state-input");
        this.options = options;
        this.state = options.startingValue ?? options.isList ? [] : undefined
    }

    beforeReady(): void {
        this.registerTypes([
            this.options.stateChangeListener,
            this.options.internalRequestListener
        ])

        this.on(`${this.options.internalRequestListener}:input`, () => {
            // We are going to return our version of the state.
            this.emit(`${this.options.internalRequestListener}:output`, this.state)
        })
    }

    afterRegister(): void {
        this.emit(this.options.stateChangeListener, this.state.props); // Registering the first value
    }

    updateState(newState: any) {
        if (this.options.keep) {
            if (this.options.isList) {
                Array.isArray(this.state) ? this.state.push(newState) : this.state = [this.state, newState];
            } else {
                this.state = {
                    ...this.state,
                    ...newState
                }
            }
        } else {
            this.state = newState
        }

        this.emit(this.options.stateChangeListener, newState);
    }
}

export class ReactStateOutput extends OutputEngine {

    private options: ReactStateOutputProperties;
    private internalEvents: NanoEvent;
    private state: any; // This is our copy of the state.

    constructor(options: ReactStateOutputProperties) {
        super("react-state-output");
        this.options = options;
        this.internalEvents = new NanoEvent();
    }

    beforeReady(): void {
        this.listenTo(`${this.options.internalRequestListener}:output`, (data) => {
            this.state = data;
            this.internalEvents.emit('change', this.state);
        });
        this.listenTo(this.options.stateChangeListener, data => {
            this.state = data;
            this.internalEvents.emit('change', this.state);
        })
    }

    afterRegister(): void {
        this.send(`${this.options.internalRequestListener}:input`, undefined);
    }

    listen(callBack: ((data: unknown) => void)): void {
        this.internalEvents.on('change', callBack);
    }

    rerender() {
        this.internalEvents.emit('change', this.state);
    }
}