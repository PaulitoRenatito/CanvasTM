import { Circle, Group, Text } from 'react-konva';
import { StateClass } from '../classes/StateClass';

interface StateProps {
    state: StateClass;
    draggable?: boolean;
    onClick?(e: any): void;
    onDragMove?(e: any): void;
}

function State({ state, draggable = false, onClick, onDragMove }: StateProps) {

    const radius = 50;

    return (
        <Group draggable={draggable} x={state.position.x} y={state.position.y} onClick={onClick} onDragMove={onDragMove} >
            <Circle radius={radius} fill="transparent" stroke={'black'} />
            <Text text={state.name} x={-radius} y={-radius / 10} width={radius * 2} align='center' verticalAlign='middle' />
        </Group>
    );
};

export default State;