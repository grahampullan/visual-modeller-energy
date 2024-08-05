import { Node, Socket } from 'visual-modeller-core';

class ControllerNode extends Node {
    constructor(options) {
        super(options);
        this.class = 'controlNode';
        this.type = 'controller';
        this.inputSocketOrder = options.inputSocketOrder || [];
        this.outputSocketOrder = options.outputSocketOrder || [];
    }
    
}

export { SolarPVNode };