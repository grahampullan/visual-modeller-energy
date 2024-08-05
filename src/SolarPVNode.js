import { Node, Socket } from 'visual-modeller-core';

class SolarPVNode extends Node {
    constructor(options) {
        super(options);
        this.class = 'endNode';
        this.type = 'solarPVNode';
        const socketOptions = {};
        socketOptions.name = options.name || 'Solar PV';
        socketOptions.linkId = options.linkId || '';
        socketOptions.position = options.position || 'right'; // output on right side
        socketOptions.state = options.state || {max: null, value:null, constraint: true, timeVarying: false, timeSeries: null};
        this.addSocketByIndex(0, socketOptions); // endNode so only one socket
    }
}

export { SolarPVNode };