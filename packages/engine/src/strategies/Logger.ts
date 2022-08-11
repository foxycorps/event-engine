import { OutputEngine } from "../core";

export class LoggerOutput extends OutputEngine {
    constructor() {
        super('Logger');
    }

    onReady(): void {
        this.getAvailableEvents.forEach((event: string) => {
            this.listenTo(event, (...data: unknown[]) => {
                console.log(`${event} ::`, ...data);
            })
        })
    }
}