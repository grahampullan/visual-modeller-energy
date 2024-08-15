import { EnergyNode } from "./EnergyNode";
import { Socket } from 'visual-modeller-core';

class GridSupplyNode extends EnergyNode {
    constructor(options) {
        super(options);
        this.class = 'endNode';
        this.type = 'gridSupply';
        const socketOptions = {};
        socketOptions.name = options.socketName || 'Grid Supply';
        socketOptions.position = options.position || 'right'; // output on right side
        socketOptions.state = options.socketState || {max: Infinity, value:null, valueType: "variable"};
        this.setSocketByIndex(0, new Socket(socketOptions)); // endNode so only one socket
    }
}

export { GridSupplyNode };