export class PluginAServiceA {
    constructor(private consoleTextService) {
    }

    public writeMessage(msg) {
        this.consoleTextService.writeLine(msg);
    }
}
