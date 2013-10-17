export class AppDirective {
    public template = '<div ng-repeat="text in textLog">' +
        '<span class="consoleText">{{text}}</span></div>' +
        '<div><table><tr><td>{{inputPromptText}}</td><td>' +
        '<span class="consoleText">{{currentCommand}}</span>' +
        '<span class="blink">&nbsp;</span>' +
        '</td></tr></table></div>';
    public controller = 'AppController';
}
