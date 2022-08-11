export type callBack = (...data: unknown[]) => void;
type emptyCallBack = () => void;

type typeAndCallback = (type: string, callback: callBack) => void;
type typeAndData = (type: string, data: unknown) => void;

export interface Common {
    name: string;
    registerEngine: (engine: EventDispatcher) => void;

    beforeReady: () => void;
    onReady: () => void;
    afterReady: () => void;

    beforeRegister: () => void;
    onRegister: () => void;
    afterRegister: () => void;
}

export interface InputEngine extends Common {
    onTick: (destroy: emptyCallBack) => emptyCallBack;

    emit: typeAndData;
    on: typeAndCallback;
    once: typeAndCallback;

    off: (type: string) => void;

    getTypes: Set<string>;
    tickRate: number;
}

export interface OutputEngine extends Common {
    getAvailableEvents: Set<string>;
}

export interface EventDispatcher {

    inputs: InputEngine[];
    outputs: OutputEngine[];

    /**
     * These are some engines that can add some extra functionality to all inputs and outputs.
     */

    availableEvents: Set<string>;

    when: typeAndCallback;
    on: typeAndCallback;
    once: typeAndCallback;

    send: typeAndData;
    emit: typeAndData;
}