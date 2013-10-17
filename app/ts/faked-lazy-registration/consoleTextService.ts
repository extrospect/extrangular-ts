export class ConsoleTextService {
    private currentId = 0;
    private listeners = [];

    public writeLine(text) {
        var i = 0,
            len = this.listeners.length;
        for(; i < len; i++) {
            if(this.listeners[i].fn.call(this.listeners[i].scope || this, text) === false) {
                break;
            }
        }
    }
    public addListener(listener, scope?) {
        var id = ++this.currentId,
            listenerObj;

        listenerObj = {
            id: id,
            fn: listener,
            scope: scope
        };

        this.listeners.push(listenerObj);

        return () => {
            var i = 0,
                len = this.listeners.length;
            for(; i < len; i++) {
                if(this.listeners[i].id === id) {
                    this.listeners.splice(i, 1);
                    break;
                }
            }
        };
    }
}
