import { EnergyNode } from "./EnergyNode";
import { Socket } from 'visual-modeller-core';

class GridExportNode extends EnergyNode {
    constructor(options) {
        options = options || {};
        options.className = 'gridExportNode';
        super(options);
        this.type = 'endNode';
        const socketOptions = {};
        socketOptions.name = options.socketName || 'Grid Export';
        socketOptions.position = options.position || 'left';
        socketOptions.state = options.socketState || {max: Infinity, value:null, valueType: "variable"};
        this.setSocketByIndex(0, new Socket(socketOptions));
        this.displayConfig.colorIndex = 3;
    }
}

export { GridExportNode };