import { InputEngine } from "../core";
// @ts-ignore
import axios from 'axios';
import NanoEvent from "@foxycorps/nanoevent";

type methodType = "get" | "put" | "post" | "delete" | "patch";

export interface Properties {
    /** URL to send the request to */
    url: string;
    /** Method of the request */
    method?: methodType;
    /** Body */
    body?: unknown;
    /** Type for when the request is received */
    receivedEvent: string;
    /** Type for when the request is sent */
    sentEvent: string;
    /** Type for when the request fails */
    failureEvent: string;
    /** Tick rate */
    tickingRate?: number;
}

interface StatusInformation {
    loading: boolean;
    body: unknown;
    error?: string;
}

export class HttpInput extends InputEngine {

    protected options: Properties = {
        method: 'get',
        body: {},
        url: "",
        receivedEvent: "",
        sentEvent: "",
        failureEvent: "",
        tickingRate: 1000
    };
    protected internalEventSystem = new NanoEvent();
    protected status: StatusInformation = {
        loading: true,
        body: {},
        error: ""
    }

    constructor(options: Properties, name: string = "http") {
        super(name);
        this.options = {
            ...this.options,
            ...options
        };
        this.setup();
    }

    setup(): void {
        const externalEvents = [`${this.options.receivedEvent}`, `${this.options.sentEvent}`, `${this.options.failureEvent}`];

        this.registerTypes(['statusUpdate', ...externalEvents]);

        externalEvents.forEach((event: string) => {
            this.internalEventSystem.on(event, (data: any) => {
                this.status = {
                    ...this.status,
                    ...data
                }
                this.emit('statusUpdate', this.status);
                this.emit(event, data);
            })
        })
    }

    beforeRegister(): void {
        this.setTickRate(this.options.tickingRate as number)
    }

    onReady(): void {
        this.emit('statusUpdate', this.status);
    }

    afterReady(): void {
        this.sendRequest();
    }

    protected sendRequest() {
        this.internalEventSystem.emit(`${this.options.sentEvent}`, { loading: true });

        axios[this.options.method!](this.options.url).then((data: any) => {
            this.internalEventSystem.emit(`${this.options.receivedEvent}`, data.data);
        }).catch((error: any) => {
            this.internalEventSystem.emit(`${this.options.failureEvent}`, { error: error?.msg ?? error?.message ?? error })
        }).finally(() => {
            this.internalEventSystem.emit(`*`, { loading: false })
        })
    }


}