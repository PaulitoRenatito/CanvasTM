import { Circle, Group, Text } from 'react-konva';
import { StateClass } from '../classes/StateClass';
import Konva from 'konva';
import { useState } from 'react';

interface StateProps {
    state: StateClass;
    draggable?: boolean;
    radius: number;
    isEndState?: boolean;
    onClick?(e: any): void;
    onDragMove?(e: any): void;
    dragBoundFunc?(this: Konva.Node, pos: Konva.Vector2d): Konva.Vector2d;
}

function State({ state, draggable = false, radius, isEndState = false, onClick, onDragMove, dragBoundFunc }: StateProps) {

    const [hoverColor, setHoverColor] = useState<string>('black');

    return (
        <Group
            draggable={draggable}
            x={state.position.x}
            y={state.position.y}
            onClick={onClick}
            onDragMove={onDragMove}
            dragBoundFunc={dragBoundFunc}
            onMouseEnter={(_e) => setHoverColor('blue')}
            onMouseLeave={(_e) => setHoverColor('black')}
        >
            <Circle
                radius={radius}
                fill="transparent"
                stroke={hoverColor}
            />
            {isEndState &&
                <Circle
                    radius={(radius * 0.9)}
                    fill="transparent"
                    stroke={hoverColor}
                />
            }
            <Text
                text={state.name}
                x={-radius}
                y={-radius / 10}
                width={radius * 2}
                align='center'
                verticalAlign='middle'
                fill={hoverColor}
            />
        </Group>
    );
};

export default State;