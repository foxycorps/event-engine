declare module '@foxycorps/nanoevent' {

    declare type callBack = (...data: unknown[]) => void;

    export class NanoEvent {
        constructor();

        remover(type: string, pos: number): void;

        on(type: string, callback: callBack): (() => void);
        once(type: string, callback: callBack): void;

        emit(type: string, ...data: unknown[]): void;
    }

    export { };
}