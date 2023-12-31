import { useEffect, useState } from "react";
import { StateClass } from "../classes/StateClass";
import { TransitionClass } from "../classes/TransitionClass";
import { Vector2DClass } from "../classes/Vector2DClass";
import { Layer, Stage } from "react-konva";
import State from "./State";
import Transition from "./Transition";

export function Canvas() {

    const [states, setStates] = useState<StateClass[]>([]);
    const [transitions, setTransitions] = useState<TransitionClass[]>([]);

    var state1 = new StateClass('1', new Vector2DClass(300, 200));
    var state2 = new StateClass('2', new Vector2DClass(300, 500));
    var state3 = new StateClass('3', new Vector2DClass(600, 500));

    var transition1 = new TransitionClass('t1', state1, state2);
    var transition2 = new TransitionClass('t2', state3, state2);

    useEffect(() => {
        setStates([state1, state2, state3]);
        setTransitions([transition1, transition2]);
    }, []);

    const handleStateDragMove = (e: any, index: number) => {
        // Atualizar a posição do State durante o arrasto
        const updatedStates = [...states];
        updatedStates[index] = new StateClass(updatedStates[index].name, new Vector2DClass(e.target.x(), e.target.y()));
        setStates(updatedStates);
    
        // Recalcular transições
        const updatedTransitions = transitions.map((transition) => {
          if (transition.startState === states[index]) {
            // Atualizar a posição de início da transição
            return new TransitionClass(transition.name, updatedStates[index], transition.endState);
          } else if (transition.endState === states[index]) {
            // Atualizar a posição de término da transição
            return new TransitionClass(transition.name, transition.startState, updatedStates[index]);
          }
          return transition;
        });
    
        setTransitions(updatedTransitions);
      };

    return (
        <Stage width={window.innerWidth / 2} height={800} style={{ backgroundColor: 'white' }}>
            <Layer>
                {states.map((state, index) => (
                    <State key={state.name} state={state} draggable={true} onDragMove={(e) => handleStateDragMove(e, index)}/>
                ))}
                {transitions.map((transition) => (
                    <Transition key={transition.name} transition={transition} />
                ))}
            </Layer>
        </Stage>
    )
}