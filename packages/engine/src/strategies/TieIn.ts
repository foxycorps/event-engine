import NanoEvent from '@foxycorps/nanoevent';
import { OutputEngine } from '../core';

interface Props {
    listeners: string[];
}

export class TieIn extends OutputEngine {

    private options: Props;
    private internalEvents: NanoEvent;

    constructor(options: Props) {
        super('tie-in');
        this.options = options;
        this.internalEvents = new NanoEvent();
    }

    beforeReady(): void {
        // we will go through and create listeners for them all...
        // we will then tie it to the internal event listener.
        this.options.listeners.forEach((listener: string) => {
            this.listenTo(listener, (data: any) => {
                this.internalEvents.emit(listener, data);
            })
        })
    }

    listen(listener: string, callback: (data: any) => void) {
        this.internalEvents.on(listener, callback);
    }
}