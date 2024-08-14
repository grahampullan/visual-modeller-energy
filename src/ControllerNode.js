import { EnergyNode } from "./EnergyNode";

class ControllerNode extends EnergyNode {
    constructor(options) {
        super(options);
        this.class = 'controlNode';
        this.type = 'controller';
        this.inputSocketOrder = options.inputSocketOrder || [];
        this.outputSocketOrder = options.outputSocketOrder || [];
    }

}

export { ControllerNode };