import { EnergyNode } from "./EnergyNode";

class ControllerNode extends EnergyNode {
    constructor(options) {
        options = options || {};
        options.className = 'controllerNode';
        super(options);
        if (options.inputSocketOrder){
            this.setSocketOrderByName({position: 'left', order:options.inputSocketOrder});
        }
        if (options.outputSocketOrder){
            this.setSocketOrderByName({position: 'right', order:options.outputSocketOrder});
        }
        this.type = 'controllerNode';
        this.displayConfig.colorIndex = 1;
    }

    setFluxTargets(){
        const controllerInputSockets = this.leftSockets;
        const controllerOutputSockets = this.rightSockets;
        const inputConnectedSockets = controllerInputSockets.map( s => s.otherSocket);
        const outputConnectedSockets = controllerOutputSockets.map( s => s.otherSocket);
       
        let totalInput = inputConnectedSockets.filter( s => s.state.valueType == "constraint").reduce((acc, s) => acc + s.state.value, 0);
        let totalOutput = outputConnectedSockets.filter( s => s.state.valueType == "constraint").reduce((acc, s) => acc + s.state.value, 0);
        
        if (totalInput >= totalOutput){ // more supply than demand
            outputConnectedSockets.forEach( s => {
                if (s.state.valueType == "constraint"){
                    const controllerSocket = s.otherSocket;
                    controllerSocket.state.value = null;
                    controllerSocket.state.valueType = "variable";
                    controllerSocket.state.max = Infinity;
                    totalInput -= s.state.value;
                }
            });
            outputConnectedSockets.forEach( s => {
                if (s.state.valueType == "variable"){
                    const controllerSocket = s.otherSocket;
                    const targetValue = Math.min(totalInput, s.state.max);
                    controllerSocket.state.value = targetValue;
                    controllerSocket.state.valueType = "target";
                    totalInput -= targetValue;
                }
            });
            inputConnectedSockets.forEach( s => {
                if (s.state.valueType == "constraint"){
                    const controllerSocket = s.otherSocket;
                    controllerSocket.state.value = null;
                    controllerSocket.state.valueType = "variable";
                    controllerSocket.state.max = Infinity;
                }
                if (s.state.valueType == "variable"){
                    const controllerSocket = s.otherSocket;
                    controllerSocket.state.value = 0.;
                    controllerSocket.state.valueType = "target";
                }
            });
        } else { // more demand than supply
            inputConnectedSockets.forEach( s => {
                if (s.state.valueType == "constraint"){
                    const controllerSocket = s.otherSocket;
                    controllerSocket.state.value = null;
                    controllerSocket.state.valueType = "variable";
                    controllerSocket.state.max = Infinity;
                    totalOutput -= s.state.value;
                }
            });
            inputConnectedSockets.forEach( s => {
                if (s.state.valueType == "variable"){
                    const controllerSocket = s.otherSocket;
                    const targetValue = Math.min(totalOutput, s.state.max);
                    controllerSocket.state.value = targetValue;
                    controllerSocket.state.valueType = "target";
                    totalOutput -= targetValue;
                }
            });
            outputConnectedSockets.forEach( s => {
                if (s.state.valueType == "constraint"){
                    const controllerSocket = s.otherSocket;
                    controllerSocket.state.value = null;
                    controllerSocket.state.valueType = "variable";
                    controllerSocket.state.max = Infinity;
                }
                if (s.state.valueType == "variable"){
                    const controllerSocket = s.otherSocket;
                    controllerSocket.state.value = 0.;
                    controllerSocket.state.valueType = "target";
                }
            });
        }
    }

}



export { ControllerNode };