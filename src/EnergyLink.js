import { Link } from 'visual-modeller-core';

class EnergyLink extends Link {
    constructor(options) {
        super(options);
    }

    setFlux() {
        const socket1 = this.socket1;
        const state1 = socket1.state;
        const socket2 = this.socket2;
        const state2 = socket2.state;

        //console.log(socket1, socket2);

        if (state1.valueType == state2.valueType) {
            console.log("warning - both sockets for this link have the same valueType", this);
        }

        if (state2.valueType == "variable" && (state1.valueType == "constraint" || state1.valueType == "target")) {
            if (state1.value <= state2.max) {
                this.state.value = state1.value;
            } else {
                console.log("problem - variable value exceeds constraint max", this);
            }
        }

        if (state1.valueType == "variable" && (state2.valueType == "constraint" || state2.valueType == "target")) {
            if (state2.value <= state1.max) {
                this.state.value = state2.value;
            } else {
                console.log("problem - variable value exceeds constraint max", this);
            }
        }

    }

}

export { EnergyLink };