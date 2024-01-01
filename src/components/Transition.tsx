import { Arrow, Text, Group } from 'react-konva';
import { TransitionClass } from '../classes/TransitionClass';
import { calculateAngle, pointOnCircle } from '../Utils';

interface TransitionProps {
    transition: TransitionClass;
}
function Transition({ transition }: TransitionProps) {

    const angle = calculateAngle(transition.startState.position, transition.endState.position);

    let points;

    const startPosition = pointOnCircle(transition.startState.position, 50, angle);
    const endPosition = pointOnCircle(transition.endState.position, -50, angle);

    if (transition.startState === transition.endState) {
        const loopRadius = 100;

        points = [
            startPosition.x,
            startPosition.y,
            transition.startState.position.x,
            transition.startState.position.y - loopRadius,
            endPosition.x,
            endPosition.y,
        ];
    }
    else {
        points = [startPosition.x, startPosition.y, endPosition.x, endPosition.y];
    }

    const x = (startPosition.x + endPosition.x) / 2;
    const y = (startPosition.y + endPosition.y) / 2;

    const textDistanceAboveArrow = 10;

    const angleInRadians = (angle * Math.PI) / 180;

    const textAdjustedX = x + textDistanceAboveArrow * Math.cos(angleInRadians);
    const textAdjustedY = y + textDistanceAboveArrow * Math.sin(angleInRadians);

    const width = transition.name.length * 6;

    return (
        <Group>
            <Arrow
                points={points}
                tension={1}
                stroke={'black'}
            />
            <Text text={transition.name} x={textAdjustedX} y={textAdjustedY} width={width} align='center' verticalAlign='middle' />
        </Group>
    );
};

export default Transition;