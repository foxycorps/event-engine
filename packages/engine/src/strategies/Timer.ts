import { InputEngine } from "../core";
import process from 'process';

interface Properties {
    stateChangeListener: string;
    broadcastEvent: string;
}

interface State {
    time: [number, number],
    final: string
}

export class TimerInput extends InputEngine {
    private options: Properties;
    private state: State = {
        time: [0, 0],
        final: ""
    };

    constructor(options: Properties) {
        super("timer-input");
        this.options = options;
    }

    beforeReady(): void {
        this.registerTypes([
            this.options.stateChangeListener,
            this.options.broadcastEvent
        ]);

        this.on(`${this.options.stateChangeListener}:start`, () => {
            this.state.time = process.hrtime();
        });

        this.on(`${this.options.stateChangeListener}:stop`, () => {
            this.state.final = Number(process.hrtime(this.state.time)[1] / 1000000).toFixed(3)
            // We will now broadcast this event.
            this.emit(this.options.broadcastEvent, this.state.final);
        })
    }
}