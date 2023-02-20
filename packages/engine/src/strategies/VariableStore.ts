import { InputEngine, OutputEngine } from "../core";

interface Settings {
    listenerPrefix: string;
}

export class VariableStoreInput extends InputEngine {
    private props: Settings;
    constructor(props: Settings) {
        super('VariableStore-Input');
        this.props = props;
    }

    onReady(): void { }

    public update(name: string, data: any): void {
        this.emit(`${this.props.listenerPrefix}.${name}`, data);
    }
}

export class VariableStoreOutput extends OutputEngine {
    private props: Settings;
    private state: Record<string, any> = {};
    constructor(props: Settings) {
        super('VariableStore-Output')
        this.props = props;
    }

    get State(): Record<string, any> {
        return this.state;
    }

    onReady(): void {
    }

    public on(name: string, callback: (...data: any) => void): void {
        this.listenTo(`${this.props.listenerPrefix}.${name}`, (...data: any) => {
            callback(...data);
            this.state[name] = data;
        })
    }

}