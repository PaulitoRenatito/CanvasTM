import { Arrow, Text, Group } from 'react-konva';
import { TransitionClass } from '../classes/TransitionClass';
import { calculateAngle, pointOnCircle } from '../Utils';
import Konva from 'konva';
import { Vector2DClass } from '../classes/Vector2DClass';
import { useEffect, useState } from 'react';

interface TransitionProps {
    transition: TransitionClass;
}
function Transition({ transition }: TransitionProps) {

    const [hoverColor, setHoverColor] = useState<string>('black');

    const angle = calculateAngle(transition.startState.position, transition.endState.position);

    const radius = 50;
    const startStateOffset = -50;

    const startStatePoint = pointOnCircle(transition.startState.position, radius, angle);
    const endStatePoint = pointOnCircle(transition.endState.position, startStateOffset, angle);

    const [startPosition, setStartPosition] = useState<Vector2DClass>(startStatePoint);

    const [endPosition, setEndPosition] = useState<Vector2DClass>(endStatePoint);

    const midpoint = new Vector2DClass(
        (startPosition.x + endPosition.x) / 2,
        (startPosition.y + endPosition.y) / 2
    );

    const [arrowMiddle, setArrowMiddle] = useState<Vector2DClass>(midpoint);

    const updatePositions = (newStartPos: Vector2DClass, newEndPos: Vector2DClass, newArrowMiddle: Vector2DClass) => {
        setStartPosition(newStartPos);
        setEndPosition(newEndPos);
        setArrowMiddle(newArrowMiddle);
    };

    useEffect(() => {
        updatePositions(startStatePoint, endStatePoint, midpoint);
    }, [transition]);

    const loopRadius = 100;

    const points = transition.startState === transition.endState
        ?
        [
            startPosition.x,
            startPosition.y,
            transition.startState.position.x,
            transition.startState.position.y - loopRadius,
            endPosition.x,
            endPosition.y,
        ]
        :
        [
            startPosition.x, startPosition.y, arrowMiddle.x, arrowMiddle.y, endPosition.x, endPosition.y
        ];

    function createDragBoundFunc(this: Konva.Node, _pos: Konva.Vector2d): Konva.Vector2d {

        const { x, y } = this.getPosition();

        const stage = this.getStage()!;
        const pointerPosition = stage.getPointerPosition()!;

        if (Math.abs(midpoint.x - pointerPosition.x) <= 20 && Math.abs(midpoint.y - pointerPosition.y) <= 20) {
            updatePositions(startStatePoint, endStatePoint, midpoint);
        }
        else {
            updatePositions(
                pointOnCircle(transition.startState.position, 50, calculateAngle(transition.startState.position, pointerPosition)),
                pointOnCircle(transition.endState.position, 50, calculateAngle(transition.endState.position, pointerPosition)),
                new Vector2DClass(pointerPosition.x, pointerPosition.y)
            );
        }

        return { x, y };
    };

    const textDistanceAboveArrow = -100;

    const angleInRadians = (angle * Math.PI) / 180;

    const textAdjustedX = arrowMiddle.x + textDistanceAboveArrow * angleInRadians;
    const textAdjustedY = arrowMiddle.y + textDistanceAboveArrow * angleInRadians;

    const width = transition.name.length * 6;

    return (
        <Group
            draggable
            dragBoundFunc={createDragBoundFunc}
            onMouseEnter={(_e) => setHoverColor('blue')}
            onMouseLeave={(_e) => setHoverColor('black')}>
            <Arrow
                points={points}
                tension={1}
                stroke={hoverColor}
                strokeWidth={2}
            />
            <Text text={transition.name} x={textAdjustedX} y={textAdjustedY} width={width} align='center' verticalAlign='middle' fill={hoverColor}/>
        </Group>
    );
};

export default Transition;