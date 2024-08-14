import { EnergyNode } from "./EnergyNode";
import { Socket } from 'visual-modeller-core';

class GridExportNode extends EnergyNode {
    constructor(options) {
        super(options);
        this.class = 'endNode';
        this.type = 'gridExport';
        const socketOptions = {};
        socketOptions.name = options.name || 'Grid Export';
        socketOptions.linkId = options.linkId || '';
        socketOptions.position = options.position || 'left';
        socketOptions.state = options.state || {max: Infinity, value:null, constraint: false};
        this.addSocketByIndex(0, new Socket(socketOptions));
    }
}

export { GridExportNode };