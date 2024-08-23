import { EnergyNode } from "./EnergyNode";
import { Socket } from 'visual-modeller-core';

class GridSupplyNode extends EnergyNode {
    constructor(options) {
        options = options || {};
        super(options);
        this.className = 'gridSupplyNode';
        this.type = 'endNode';
        const socketOptions = {};
        socketOptions.name = options.socketName || 'Grid Supply';
        socketOptions.position = options.position || 'right'; // output on right side
        socketOptions.state = options.socketState || {max: Infinity, value:null, valueType: "variable"};
        this.setSocketByIndex(0, new Socket(socketOptions)); // endNode so only one socket
    }
}

export { GridSupplyNode };