import { OutputEngine } from "../core";
import type { callBack } from "../types";

export class MockerOutput extends OutputEngine {

    private callbackMap: Map<string, callBack> = new Map();

    constructor(cbMap: Map<string, callBack>) {
        super("mocker");
        this.callbackMap = cbMap;
    }

    onReady(): void {
        // We are going to get every eventType... and we are going to listen to them all.
        this.getAvailableEvents.forEach((event: string): void => {
            this.listenTo(event, (...data: unknown[]) => {
                if (this.callbackMap.has(event)) {
                    // @ts-ignore ...// it should have it, if it is in here
                    this.callbackMap.get(event)(...data);
                }
            })
        })
    }
}