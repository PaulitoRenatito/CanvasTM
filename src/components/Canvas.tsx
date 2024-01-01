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

  const [isDraggingTransition, setIsDraggingTransition] = useState<boolean>(false);
  const [draggingTransition, setDraggingTransition] = useState<TransitionClass | null>(null);

  var state1 = new StateClass('1', new Vector2DClass(300, 200));
  var state2 = new StateClass('2', new Vector2DClass(300, 500));
  var state3 = new StateClass('3', new Vector2DClass(600, 500));

  var transition1 = new TransitionClass('t1', state1, state2);
  var transition2 = new TransitionClass('t2', state3, state2);

  useEffect(() => {
    setStates([state1, state2, state3]);
    setTransitions([transition1, transition2]);
  }, []);

  const handleCanvasDoubleClick = (e: any) => {

    if (e.evt.shiftKey || isDraggingTransition) return;

    // Verifique se o clique ocorreu dentro do canvas
    const stage = e.target.getStage();
    if (stage) {
      const pointerPosition = stage.getPointerPosition();

      // Crie um novo estado com base na posição do clique
      const newState = new StateClass('NewState', new Vector2DClass(pointerPosition.x, pointerPosition.y));

      // Atualize o estado para incluir o novo estado
      setStates((prevStates) => [...prevStates, newState]);

      // Lógica adicional, se necessário, como a atualização de transições
    }
  };

  const handleStateClick = (state: StateClass, e: any) => {

    // Verifique se a tecla Shift está pressionada
    if (isDraggingTransition) {

      const stage = e.target.getStage();

      const pointerPosition = Vector2DClass.fromKonvaVector2D(stage.getPointerPosition());
      const endState = states.find((state) => state.isPointInside(pointerPosition));

      // Se encontrarmos um estado de destino, crie uma transição
      if (endState) {
        console.log(endState);
        const newTransition = new TransitionClass('NewTransition', draggingTransition!.startState, endState);
        setTransitions((prevTransitions) => [...prevTransitions, newTransition]);
      }

      // Limpe o estado de arrastar transição
      setDraggingTransition(null);
      setIsDraggingTransition(false);
    }
    else if (e.evt.shiftKey) {
      // Registre o estado de início da transição
      setIsDraggingTransition(true);
      setDraggingTransition(
        new TransitionClass(
          'dragging',
          state,
          state
        )
      );
    }
  };

  const handleStageClick = (e: any) => {
    if (isDraggingTransition) {
      // Limpe o estado de arrastar transição
      setDraggingTransition(null);
      setIsDraggingTransition(false);
    }
  }

  const handleMouseMove = (e: any) => {

    if (!isDraggingTransition) return;

    const stage = e.target.getStage();
    const pointerPosition = Vector2DClass.fromKonvaVector2D(stage.getPointerPosition());

    const endState = states.find((state) => state.isPointInside(pointerPosition));

    if (endState) {
      setDraggingTransition(
        new TransitionClass(
          'dragging',
          draggingTransition!.startState,
          endState
        )
      );
    }
    else {
      setDraggingTransition(
        new TransitionClass(
          'dragging',
          draggingTransition!.startState,
          new StateClass(
            'dragging',
            new Vector2DClass(
              pointerPosition.x,
              pointerPosition.y))));
    }
  };

  const handleStateDragMove = (e: any, index: number) => {

    if (e.evt.shiftKey || isDraggingTransition) return;

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
    <Stage
      width={window.innerWidth / 2}
      height={800}
      onDblClick={handleCanvasDoubleClick}
      onMouseMove={handleMouseMove}
      onClick={handleStageClick}
      style={{ backgroundColor: 'white' }}>
      <Layer>
        {states.map((state, index) => (
          <State
            key={state.name}
            state={state}
            draggable={true}
            onClick={(e) => handleStateClick(state, e)}
            onDragMove={(e) => handleStateDragMove(e, index)} />
        ))}
        {transitions.map((transition) => (
          <Transition key={transition.name} transition={transition} />
        ))}
        {isDraggingTransition && <Transition key={'dragging'} transition={draggingTransition!} />}
      </Layer>
    </Stage>
  )
}