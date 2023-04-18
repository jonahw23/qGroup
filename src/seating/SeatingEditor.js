import React from 'react';
import { HandRaisedIcon, PlusIcon } from '@heroicons/react/24/outline'
import "./SeatingEditor.css";
import * as api from "../api.js";
import Draggable from 'react-draggable';

export default class SeatingEditor extends React.Component {
  state = {
    furniture: [],
    students: [],
    mode: "movement",
    furn_id: 0,
    draggable: undefined,
    width: 0,
  }

  componentDidMount = () => {

    this.getData();

    window.addEventListener("resize", () => {
      this.setState({ width: this.getWidth() });
    });

  }

  getData = () => {

    api.call("GET", "/users/3/class/1/seating/1/furniture/get_furniture_loc")
      .then(json => { this.setState({ furniture: json }) });
    api.call("GET", "/users/3/class/1/seating/1/students")
      .then(json => { this.setState({ students: json }) });

  }

  getWidth = () => {
    return this.divElement?.clientWidth ?? 0;
  }

  onKeyPressed = (e) => {
    if (e.key === 'n') {
      this.setState({ mode: this.state.mode === "place" ? "movement" : "place" });
    }
  }

  onStart = (furn_id, draggable) => {
    this.setState({ furn_id: furn_id, draggable: draggable });
  }

  onStop = (furn_id, draggable) => {
    let furniture = [...this.state.furniture];
    const index = furniture.findIndex(x => x.furn_id === furn_id);

    if (draggable) {
      furniture[index].x = draggable.x / this.getWidth();
      furniture[index].y = draggable.y / this.getWidth();
    }

    api.call("PUT", `/users/3/class/1/seating/1/furniture/${furn_id}/move_furn`,
      {
        new_x: furniture[index].x,
        new_y: furniture[index].y,
        new_theta: furniture[index].theta,
      })

    this.setState({ furniture: furniture });
  }

  onDragRotate = (event, furn_id) => {
    const rect = this.state.draggable.node.getBoundingClientRect();

    // Mouse position
    let x, y;
    if (event.type === "mousemove") {
      x = event.clientX;
      y = event.clientY;
    } else if (event.type === "touchmove") {
      x = event.touches[0].clientX;
      y = event.touches[0].clientY;
    }
    x -= rect.left + rect.width / 2;
    y -= rect.top + rect.height / 2;

    const angle = Math.atan2(y, x);

    let furniture = [...this.state.furniture];
    const index = furniture.findIndex(x => x.furn_id === furn_id);

    furniture[index].theta = 90 + angle * (180 / Math.PI);
    this.setState({ furniture: furniture });
  }

  addSeat = (e) => {

    const bounds = this.divElement.getBoundingClientRect();

    const x = (e.clientX - bounds.left) / bounds.width;
    const y = (e.clientY - bounds.top) / bounds.width;
    const theta = 0;

    api.call("POST", "/users/3/class/1/seating/1/new_furniture",
      {
        furn_type: "seat",
        x: x, y: y, theta: theta
      })
      .then(json => {
        let furniture = [...this.state.furniture];
        furniture.push({
          furn_id: json.furn_id,
          x: x, y: y, theta: theta
        })
        this.setState({ furniture: furniture })
      })

  }

  mapStudents = () => {
    api.call("POST", "/users/3/class/1/seating/1/students")
      .then(() => { this.getData(); });
  }
  clearStudents = () => {
    api.call("DELETE", "/users/3/class/1/seating/1/students")
      .then(() => { this.getData(); });
  }

  render = () => {

    const furnitureElements = this.state.furniture.map(f => {
      const width = this.getWidth();
      const selected = this.state.furn_id === f.furn_id;
      const student = this.state.students
        .filter(x => x.furn_id === f.furn_id)
        .map(student => student ? `${student.first_name} ${student.last_name}` : "")
        .join(", ");

      return (
        <Draggable
          key={f.furn_id}
          position={{
            x: f.x * width,
            y: f.y * width
          }}
          bounds="parent"
          onStart={(_e, draggable) => { return this.onStart(f.furn_id, draggable) }}
          onStop={(_e, draggable) => { return this.onStop(f.furn_id, draggable) }}
          cancel=".rotateHandle"
        >
          <div className="clear-seat-element">
            <div
              className={`seat-element ${selected ? "border-2 border-cyan-500" : ""}`}
              style={{ rotate: (f.theta ? f.theta : 0) + "deg" }}
              tabIndex={0}
            >

              {selected ?
                <div className="rotateHandle w-4 h-4 -translate-x-1/2 absolute -top-8 left-1/2">
                  <Draggable
                    position={{ x: 0, y: 0 }}
                    onDrag={(e) => { return this.onDragRotate(e, f.furn_id) }}
                    onStop={(_e) => { return this.onStop(f.furn_id) }}
                  >
                    <div className="w-full h-full absolute z-999"></div>
                  </Draggable>
                  <div className="w-full h-full bg-cyan-500 rounded-full"></div>
                  <div className="w-0.5 h-full bg-cyan-500 absolute top-full left-1/2 -translate-x-1/2"></div>
                </div>
                : null}

              {student}
            </div>
          </div>
        </Draggable>
      )
    });

    return (
      <div className="h-full flex flex-col"
        onKeyDown={this.onKeyPressed}>

        <div className="p-5 bg-gray-200 flex gap-2 items-center text-sm">

          <HandRaisedIcon
            className={`block h-8 w-8 p-1 cursor-pointer rounded
                        ${this.state.mode === "movement" ? "bg-slate-400" : "hover:bg-slate-300"}`}
            onClick={() => this.setState({ mode: "movement" })} />
          <PlusIcon
            className={`block h-8 w-8 p-1 cursor-pointer rounded
                        ${this.state.mode === "place" ? "bg-slate-400" : "hover:bg-slate-300"}`}
            onClick={() => this.setState({ mode: "place" })} />

          <div className="flex-1" />

          <button
            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
            onClick={() => { this.clearStudents() }}
          >Clear students</button>
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            onClick={() => { this.mapStudents() }}
          >Assign students</button>
        </div>

        <div
          className="relative border-solid border border-slate-200 flex-1"
          ref={e => { this.divElement = e }}
          tabIndex={0}
          onClick={e => { if (this.state.mode === "place") { this.addSeat(e) } }}
        >
          {furnitureElements}
        </div>

      </div>
    );
  }
}
