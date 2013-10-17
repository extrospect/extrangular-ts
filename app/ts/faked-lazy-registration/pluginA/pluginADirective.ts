export class PluginADirective {
    public template = '<div></div>';

    constructor(private consoleTextService) {}

    public link = () => {
        this.consoleTextService.writeLine('Plugin A loaded OK!');
        this.consoleTextService.writeLine('Plugin A - Service A registered OK!');
    }
}
