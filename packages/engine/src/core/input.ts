import type { InputEngine as InputEngineType, EventDispatcher, callBack } from '../types';

export default class InputEngine implements InputEngineType {

    private eventTypes: Set<string> = new Set();
    private engineInstance!: EventDispatcher;
    private tickingRate: number = 1000;

    constructor(public name: string) { }

    get getTypes(): Set<string> {
        return this.eventTypes
    }


    get tickRate(): number {
        return this.tickingRate
    }

    protected registerTypes(types: string[]): void {
        this.eventTypes = new Set([...this.eventTypes, ...types]);
    }

    protected setTickRate(newRate: number): void {
        this.tickingRate = newRate;
    }

    registerEngine(engineInstance: EventDispatcher) {
        this.engineInstance = engineInstance;
        this.onRegister();
        this.afterRegister();
    }

    onTick(_: (() => void)): (() => void) {
        return () => { };
    }

    emit(type: string, data: unknown): void {
        this.engineInstance.emit(type, data);
    }

    on(type: string, callback: callBack): void {
        this.engineInstance.on(type, callback);
    }

    once(type: string, callback: callBack): void {
        this.engineInstance.once(type, callback);
    }

    off(type: string): void {
        // this.engineInstance.off(type)
    }

    beforeReady(): void { }
    onReady(): void { }
    afterReady(): void { }
    beforeRegister(): void { }
    onRegister(): void { }
    afterRegister(): void { }
}