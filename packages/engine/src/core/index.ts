import { NanoEvent } from '@foxycorps/nanoevent'
import type { Common, EventDispatcher, InputEngine as InputEngineType, OutputEngine as OutputEngineType } from '../types';

export default class EventEngine extends NanoEvent implements EventDispatcher {
    inputs: InputEngineType[];
    outputs: OutputEngineType[];

    private events: Set<string> = new Set();

    constructor(inputs: InputEngineType[], outputs: OutputEngineType[]) {
        super();
        this.inputs = inputs;
        this.outputs = outputs;

        this.preprocess();
        this.process();
        this.triggerReady();
        this.triggerTick();
    }

    private preprocess(): void {
        [...this.inputs, ...this.outputs].forEach((source: Common) => source.beforeRegister())
    }

    private process(): void {
        for (const output of this.outputs) {
            output.registerEngine(this);
        }

        for (const input of this.inputs) {
            // We are going to check to see if there are any conflicting types...
            const inputTypes = input.getTypes;
            const hasConflicts = [...inputTypes].some((event: string) => this.events.has(event));

            if (hasConflicts) {
                throw new Error(`${input.name} has conflicting event types. Please add a scope if they are required.`);
            }

            this.events = new Set([...this.events, ...inputTypes]);
            input.registerEngine(this);
        }
    }

    private askEngines(engines: Common[], hookName: string): void {
        // We will loop through all the engines, and ask them to fire the hook provided.
        // @ts-ignore
        engines.forEach((source: Common) => source[hookName]());
    }

    private triggerReady(): void {
        // We are going to create a combined list of outputs and inputs.
        // We are adding the outputs first incase an input fires an event straight away.
        let all = [...this.outputs, ...this.inputs];

        // We are going to call the following hooks in this order.
        // - beforeReady
        // - onReady
        // - afterReady
        ["beforeReady", "onReady", "afterReady"].forEach((hook: string) => this.askEngines(all, hook));
    }

    private triggerTick(): void {
        this.inputs.forEach((input: InputEngineType) => {
            // We are going to create a setInterval...
            // we are then going to pass the destroy method to the function
            // called `onTick`
            const ticker = setInterval(() => {
                input.onTick(() => clearInterval(ticker))();
            }, input.tickRate);
        })
    }

    get availableEvents(): Set<string> {
        return this.events;
    }

    when(type: string, callback: (...data: unknown[]) => void): void {
        this.on(type, callback);
    }

    send(type: string, data: unknown): void {
        this.emit(type, data);
    }
}

export { default as OutputEngine } from './output'
export { default as InputEngine } from './input'