import { EnergyNode } from "./EnergyNode";
import { Socket } from 'visual-modeller-core';

class GridSupplyNode extends EnergyNode {
    constructor(options) {
        super(options);
        this.class = 'endNode';
        this.type = 'gridSupply';
        const socketOptions = {};
        socketOptions.name = options.name || 'Grid Supply';
        socketOptions.linkId = options.linkId || '';
        socketOptions.position = options.position || 'right'; // output on right side
        socketOptions.state = options.state || {max: Infinity, value:null, constraint: false};
        console.log(this);
        this.setSocketByIndex(0, new Socket(socketOptions)); // endNode so only one socket
    }
}

export { GridSupplyNode };