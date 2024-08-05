import { Node, Socket } from 'visual-modeller-core';

class LoadNode extends Node {
    constructor(options) {
        super(options);
        this.class = 'endNode';
        this.type = 'loadNode';
        const socketOptions = {};
        socketOptions.name = options.name || 'Load';
        socketOptions.linkId = options.linkId || '';
        socketOptions.position = options.position || 'left'; // input on left side
        socketOptions.state = options.state || {max: null, value:null, constraint: true, timeVarying: false, timeSeries: null};
        this.addSocketByIndex(0, socketOptions); // endNode so only one socket
    }
}

export { LoadNode };