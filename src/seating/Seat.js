import React from 'react';
import Draggable from 'react-draggable';
import "./Seat.css";
import * as constants from '../sharedData';

export default class Seat extends React.Component {
  render = () => {
    const key = this.props.f.furn_id;
    const position = {
      x: this.props.f.x * this.props.width,
      y: this.props.f.y * this.props.width,
    };
    const rotation = `${this.props.f.theta}deg`;
    const selected = this.props.selected;
    const group = this.props.group ?? 0;
    const student = this.props.student;

    return (
      <Draggable
        key={key}
        position={position}
        bounds="parent"
        cancel=".rotateHandle"
        {...this.props.dragHandlers}>
        <div className="clear-seat-element">
          <div
            className={`seat-element
                        bg-${constants.tailwindColorOptions[group]}-400
                        ${selected ? "border-2 border-cyan-500" : ""}`}
            style={{ rotate: rotation }}
            tabIndex={0}>

            {
              selected ?
                <div className="rotateHandle w-4 h-4 -translate-x-1/2 absolute -top-8 left-1/2">
                  <Draggable
                    position={{ x: 0, y: 0 }}
                    {...this.props.rotateHandlers}>
                    <div className="w-full h-full absolute z-999"></div>
                  </Draggable>
                  <div className="w-full h-full bg-cyan-500 rounded-full"></div>
                  <div className="w-0.5 h-full bg-cyan-500 absolute top-full left-1/2 -translate-x-1/2"></div>
                </div>
                :
                null
            }

            {student}
          </div>
        </div>
      </Draggable>
    )
  }
}
