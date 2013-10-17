export class PluginADirective {
    public template = '<div>Check Em</div>';

    constructor(private consoleTextService) {

    }

    public link = (scope) => {
        this.consoleTextService.writeLine('Plugin A loaded OK!');
        this.consoleTextService.writeLine('Plugin A - Service A registered OK!');
    }
}
