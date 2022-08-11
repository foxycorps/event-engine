import type { EventDispatcher, OutputEngine as OutputEngineType, callBack } from "../types";

export default class OutputEngine implements OutputEngineType {

    private engineInstance!: EventDispatcher;

    constructor(public name: string) { }

    registerEngine(engineInstance: EventDispatcher) {
        this.engineInstance = engineInstance;
        this.onRegister();
        this.afterRegister();
    }

    get getAvailableEvents(): Set<string> {
        return this.engineInstance.availableEvents;
    }

    /** Ready events */
    beforeReady(): void { };
    onReady(): void { };
    afterReady(): void { };

    /** Registration events */
    beforeRegister(): void { }
    onRegister(): void { }
    afterRegister(): void { }

    protected when(type: string, callback: callBack): void {
        this.listenTo(type, callback);
    }
    protected on(type: string, callback: callBack): void {
        this.listenTo(type, callback)
    }
    protected listenTo(type: string, callback: callBack): void {
        this.engineInstance.when(type, callback);
    }

    protected emit(type: string, data: unknown): void {
        this.send(type, data);
    }
    protected send(type: string, data: unknown): void {
        this.engineInstance.send(type, data);
    }

}