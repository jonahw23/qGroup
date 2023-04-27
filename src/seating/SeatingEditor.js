import React from 'react';
import { HandRaisedIcon, PlusIcon } from '@heroicons/react/24/outline'
import * as api from "../api.js";
import Seat from "./Seat.js";

export default class SeatingEditor extends React.Component {
  state = {
    furniture: [],
    students: [],
    furn_groups: [],

    width: 0,

    selected: [],
    select_corner: undefined,

    mode: "select",
  }

  componentDidMount = () => {

    this.getData();

    this.setState({ width: this.divElement?.clientWidth ?? 0 });
    window.addEventListener("resize", () => {
      this.setState({ width: this.divElement?.clientWidth ?? 0 });
    });

  }

  getData = () => {

    api.call("GET", "/users/6/class/8/seating/1/furniture/get_furniture_loc")
      .then(json => { this.setState({ furniture: json }) });
    api.call("GET", "/users/6/class/8/seating/1/furniture_groups")
      .then(json => { this.setState({ furn_groups: json }) });
    api.call("GET", "/users/6/class/8/seating/1/students")
      .then(json => { this.setState({ students: json }) });

  }


  // Buttons

  mapStudents = () => {
    api.call("POST", "/users/6/class/8/seating/1/students")
      .then(() => { this.getData(); });
  }
  clearStudents = () => {
    api.call("DELETE", "/users/6/class/8/seating/1/students")
      .then(() => { this.getData(); });
  }
  mapFurniture = () => {
    const num_groups = this.props.groups.length;
    api.call("POST", "/users/6/class/8/seating/1/group_furn",
      { num_groups: num_groups })
      .then(() => { this.getData(); });
  }
  addSeat = (e) => {
    const bounds = this.divElement.getBoundingClientRect();

    if (e.clientX === undefined) { return }
    const x = (e.clientX - bounds.left) / bounds.width;
    const y = (e.clientY - bounds.top) / bounds.width;
    const theta = 0;

    api.call("POST", "/users/6/class/8/seating/1/new_furniture",
      {
        furn_type: "seat",
        x: x, y: y, theta: theta
      })
      .then(json => {
        let furniture = [...this.state.furniture];
        furniture.push({
          furn_id: json.furn_id,
          x: x, y: y, theta: theta
        });
        this.setState({ furniture: furniture });
      })
  }


  // Mouse & keyboard

  onMouseDown = (event) => {
    if (this.state.mode === "place") {
      this.addSeat(event);
    }
    else {
      if (event.target === this.divElement) {
        const rect = this.divElement.getBoundingClientRect();

        const x = event.clientX ?? event.touches[0].clientX;
        const y = event.clientY ?? event.touches[0].clientY;

        this.setState({
          select_corner: {
            x: (x - rect.left) / this.state.width,
            y: (y - rect.top) / this.state.width
          }
        });
      }
    }
  }
  onMouseMove = (event) => {
    if (this.state.select_corner) {
      const rect = this.divElement.getBoundingClientRect();

      const c = this.state.select_corner;
      let x = event.clientX ?? event.touches[0].clientX;
      let y = event.clientY ?? event.touches[0].clientY;
      x = (x - rect.left) / this.state.width;
      y = (y - rect.top) / this.state.width;

      const x1 = Math.min(c.x, x); const x2 = Math.max(c.x, x);
      const y1 = Math.min(c.y, y); const y2 = Math.max(c.y, y);

      this.setState({
        selected: [
          ...this.state.furniture
            .filter(f =>
              x1 < f.x && f.x < x2 &&
              y1 < f.y && f.y < y2)
            .map(x => x.furn_id)
        ]
      });
    }
  }
  onMouseUp = (event) => {
    this.setState({ select_corner: undefined });
  }

  onStartDrag = (f) => {
    if (this.state.selected.length <= 1) {
      this.setState({ selected: [f.furn_id] });
    }
  }
  onDrag = (f, draggable) => {
    let furniture = [...this.state.furniture];
    let anchor = { ...furniture.find(x => x.furn_id === f.furn_id) };

    this.state.selected.forEach(id => {
      const index = furniture.findIndex(x => x.furn_id === id);
      const offset_x = this.state.furniture[index].x - anchor.x;
      const offset_y = this.state.furniture[index].y - anchor.y;

      furniture[index].x = draggable.x / this.state.width + offset_x;
      furniture[index].y = draggable.y / this.state.width + offset_y;
    });

    this.setState({ furniture: furniture });
  }
  onStopDrag = (f) => {
    this.state.selected.forEach(id => {
      const index = this.state.furniture.findIndex(x => x.furn_id === id);
      api.call("PUT", `/users/6/class/8/seating/1/furniture/${id}/move_furn`,
        {
          new_x: this.state.furniture[index].x,
          new_y: this.state.furniture[index].y,
          new_theta: this.state.furniture[index].theta,
        });
    })
  }

  onRotate = (f, event) => {
    // NOTE: this is real janky
    const rect = event.target.parentElement.parentElement.getBoundingClientRect();

    let x = event.clientX ?? event.touches[0].clientX;
    let y = event.clientY ?? event.touches[0].clientY;
    x -= rect.left + rect.width / 2;
    y -= rect.top + rect.height / 2;
    const angle = Math.atan2(y, x);

    let furniture = [...this.state.furniture];
    const index = furniture.findIndex(x => x.furn_id === f.furn_id);
    furniture[index].theta = 90 + angle * (180 / Math.PI);
    this.setState({ furniture: furniture });
  }


  // Render

  render = () => {

    const seats = this.state.furniture.map(f => {
      const student = this.state.students.find(x => x.furn_id === f.furn_id);
      const name = student ? `${student.first_name} ${student.last_name}` : "";

      return (
        <Seat
          f={f}
          width={this.state.width}
          selected={this.state.selected.indexOf(f.furn_id) >= 0}
          group={this.state.furn_groups.find(x => x.furn_id === f.furn_id)?.table_group_id}
          student={name}
          dragHandlers={{
            onStart: (e, draggable) => this.onStartDrag(f),
            onDrag: (e, draggable) => this.onDrag(f, draggable),
            onStop: (e, draggable) => this.onStopDrag(f),
          }}
          rotateHandlers={{
            onDrag: (e, draggable) => this.onRotate(f, e),
            onStop: (e, draggable) => this.onStopDrag(f),
          }} />
      );
    });

    return (
      <div className="h-full flex flex-col" >

        <div className="p-5 bg-gray-200 flex gap-2 items-center text-sm">

          <HandRaisedIcon
            className={`block h-8 w-8 p-1 cursor-pointer rounded
                        ${this.state.mode === "select" ? "bg-slate-400" : "hover:bg-slate-300"}`}
            onClick={() => this.setState({ mode: "select" })} />
          <PlusIcon
            className={`block h-8 w-8 p-1 cursor-pointer rounded
                        ${this.state.mode === "place" ? "bg-slate-400" : "hover:bg-slate-300"}`}
            onClick={() => this.setState({ mode: "place" })} />

          <div className="flex-1" />

          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            onClick={() => { this.mapFurniture() }}>
            Group furniture
          </button>
          <button
            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
            onClick={() => { this.clearStudents() }}>
            Clear students
          </button>
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            onClick={() => { this.mapStudents() }}>
            Assign students
          </button>

        </div>

        <div
          className="relative border-solid border border-slate-200 flex-1"
          ref={e => { this.divElement = e }}
          onMouseDown={e => this.onMouseDown(e)} onTouchStart={e => this.onMouseDown(e)}
          onMouseMove={e => this.onMouseMove(e)} onTouchMove={e => this.onMouseMove(e)}
          onMouseUp={e => this.onMouseUp(e)} onTouchEnd={e => this.onMouseUp(e)}
          tabIndex={0}>

          {seats}

        </div>

      </div>
    );
  }
}
