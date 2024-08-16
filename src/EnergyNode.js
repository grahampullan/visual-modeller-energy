import { Node } from 'visual-modeller-core';

class EnergyNode extends Node {
    constructor(options) {
        options = options || {};
        super(options);
    }

    setConstraints(){
        return;
    }
    
    updateState(){
        return;
    }
}


export { EnergyNode };