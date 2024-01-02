import { useState } from "react";
import { StateClass } from "../classes/StateClass";
import { TransitionClass } from "../classes/TransitionClass";
import { Vector2DClass } from "../classes/Vector2DClass";
import { Layer, Stage } from "react-konva";
import State from "./State";
import Transition from "./Transition";
import Konva from 'konva';

import './canvas.css'

export function Canvas() {

  const [states, setStates] = useState<StateClass[]>([]);
  const [transitions, setTransitions] = useState<TransitionClass[]>([]);

  const [isDraggingTransition, setIsDraggingTransition] = useState<boolean>(false);
  const [draggingTransition, setDraggingTransition] = useState<TransitionClass | null>(null);

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
      console.log("TESTE");

      setDraggingTransition(
        new TransitionClass(
          ' ',
          draggingTransition!.startState,
          endState
        )
      );
    }
    else {
      setDraggingTransition(
        new TransitionClass(
          ' ',
          draggingTransition!.startState,
          new StateClass(
            ' ',
            new Vector2DClass(
              pointerPosition.x,
              pointerPosition.y
            )
          )
        )
      );
    }
  };

  const handleStateDragMove = (e: any, index: number) => {
    if (e.evt.shiftKey || isDraggingTransition) return;

    const updatedStates = [...states];
    const draggedState = updatedStates[index];
    const { x, y } = e.target.position();

    updatedStates[index] = new StateClass(
      draggedState.name,
      new Vector2DClass(x, y)
    );

    setStates(updatedStates);

    // Recalcular transições
    const updatedTransitions = transitions.map((transition) => {
      const isStart = transition.startState === states[index];
      const isEnd = transition.endState === states[index];

      return new TransitionClass(
        transition.name,
        isStart ? updatedStates[index] : transition.startState,
        isEnd ? updatedStates[index] : transition.endState
      );
    });

    setTransitions(updatedTransitions);
  };

  const createDragBoundFunc = (index: number) => {
    return function (this: Konva.Node, pos: Konva.Vector2d): Konva.Vector2d {
      const updatedStates = [...states];
      let { x, y } = pos;

      let alignedStateX = null;
      let alignedStateY = null;

      updatedStates.forEach((state, i) => {
        if (i !== index) {
          if (Math.abs(x - state.position.x) <= 50) alignedStateX = state.position.x;
          if (Math.abs(y - state.position.y) <= 50) alignedStateY = state.position.y;
        }
      });

      x = alignedStateX ?? x;
      y = alignedStateY ?? y;

      return { x, y };
    };
  };

  return (
    <Stage
      className="canvas"
      width={window.innerWidth / 2}
      height={800}
      onDblClick={handleCanvasDoubleClick}
      onMouseMove={handleMouseMove}
      onClick={handleStageClick}>
      <Layer>
        {states.map((state, index) => (
          <State
            key={`state-${index}`}
            state={state}
            draggable={true}
            onClick={(e) => handleStateClick(state, e)}
            onDragMove={(e) => handleStateDragMove(e, index)}
            dragBoundFunc={createDragBoundFunc(index)} />
        ))}
        {transitions.map((transition, index) => (
          <Transition key={`transition-${index}`} transition={transition} />
        ))}
        {isDraggingTransition && <Transition key={'dragging'} transition={draggingTransition!} />}
      </Layer>
    </Stage>
  )
}