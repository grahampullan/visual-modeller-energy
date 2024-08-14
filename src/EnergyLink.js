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

        if (state1.constraint) {
            if (state2.constraint) {
                console.log('problem - both sockets have constraints', this);
            } else {
                if (state1.value <= state2.max) {
                    this.state.value = state1.value;
                }
            }
        }

        if (state2.constraint) {
            if (state1.constraint) {
                console.log('problem - both sockets have constraints', this);
            } else {
                if (state2.value <= state1.max) {
                    this.state.value = state2.value;
                }
            }
        }

    }

}

export { EnergyLink };