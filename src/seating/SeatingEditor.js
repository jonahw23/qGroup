import React from 'react';
import "./SeatingEditor.css";
import Draggable from 'react-draggable';

export default class SeatingEditor extends React.Component {
  state = {
    furniture: [],
    mode: "movement",
    furn_id: 0,
    draggable: undefined,
    width: 0,
  }

  componentDidMount = () => {

    fetch('http://127.0.0.1:5000/api/users/3/class/1/seating/1/furniture/get_furniture_loc', {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    })
      .then(res => { return res.json() })
      .then(json => { this.setState({ furniture: json }) });

    window.addEventListener("resize", () => {
      this.setState({ width: this.getWidth() });
    });

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

    const body = {
      new_x: furniture[index].x,
      new_y: furniture[index].y,
      new_theta: furniture[index].theta,
    };

    fetch(`http://127.0.0.1:5000/api/users/3/class/1/seating/1/furniture/${furn_id}/move_furn`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })

    this.setState({ furniture: furniture });
  }

  onDragRotate = (event, furn_id) => {
    const rect = this.state.draggable.node.getBoundingClientRect();

    // Mouse position
    const x = event.clientX - (rect.left + rect.width / 2);
    const y = event.clientY - (rect.top + rect.height / 2);

    let angle = Math.atan2(y, x);

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

    const body = {
      furn_type: "seat",
      x: x, y: y, theta: theta
    };

    fetch('http://127.0.0.1:5000/api/users/3/class/1/seating/1/new_furniture', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    })
      .then(res => { return res.json() })
      .then(res => {
        let furniture = [...this.state.furniture];
        furniture.push({
          furn_id: res.furn_id,
          x: x, y: y, theta: theta
        })
        this.setState({ furniture: furniture })
      })

  }

  render = () => {

    const furnitureElements = this.state.furniture.map(f => {
      const width = this.getWidth();
      const selected = this.state.furn_id === f.furn_id;

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
                : null
              }

              id: {f.furn_id} x: {f.x.toFixed(2)} y: {f.y.toFixed(2)}
            </div>
          </div>
        </Draggable>
      )
    });

    return (
      <div className="h-full flex flex-col">

        <div className="p-5 bg-gray-200">
          {"Mode: " + this.state.mode}
        </div>

        <div
          className="seating-container border-solid border border-slate-200 flex-1"
          ref={e => { this.divElement = e }}
          tabIndex={0}
          onClick={e => { if (this.state.mode === "place") { this.addSeat(e) } }}
          onKeyDown={this.onKeyPressed}
        >
          {furnitureElements}
        </div>

      </div>
    );
  }
}
