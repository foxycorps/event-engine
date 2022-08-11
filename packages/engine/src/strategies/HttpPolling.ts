import { HttpInput } from "./Http";
import type { Properties as HttpProperties } from './Http';

interface Properties extends HttpProperties {
    // Run a request the moment we are  loaded
    onLoad?: boolean
}

export class HttpPollingInput extends HttpInput {

    private localOptions: Properties;

    constructor(options: Properties) {
        super(options, "http-polling");
        this.localOptions = options;
    }

    afterReady(): void {
        this.emit('statusUpdate', this.status);
        // We are going to start the counter.
        if (this.localOptions.onLoad) {
            this.sendRequest();
        }
    }

    onTick(destroy: (() => void)): (() => void) {
        return () => {
            if (this.status.error !== "") {
                destroy();
            }
            this.sendRequest();
        }
    }
}