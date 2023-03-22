import React from 'react';
import "./SeatingEditor.css";
import Draggable from 'react-draggable';

export default class SeatingEditor extends React.Component {
  state = {
    furniture: [],
    mode: "movement",
    id: 0,
  }

  componentDidMount = () => {

    fetch('http://127.0.0.1:5000/api/users/3/class/1/seating/1/furniture/get_furniture_loc', {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    })
      .then(res => { return res.json() })
      .then(json => { this.setState({ furniture: json }) });

  }

  getWidth = () => {
    return this.divElement?.clientWidth ?? 0;
  }

  onDrag = (id, element) => {

    let furniture = [...this.state.furniture];
    const index = furniture.findIndex(x => x.furn_id === id);
    const mode = this.state.mode;

    this.setState({ furniture: furniture, id: index });

    if (mode !== "movement") {
      // This prevents movement while rotating or adding
      throw new Error('No Drag');
    }

  }

  stopDrag = (id, element) => {

    let furniture = [...this.state.furniture];
    const width = this.getWidth();
    const index = furniture.findIndex(x => x.furn_id === id);
    const mode = this.state.mode;

    if (mode === "movement") {
      furniture[index].x = element.x / width;
      furniture[index].y = element.y / width;
    }

    const body = {
      new_x: furniture[index].x,
      new_y: furniture[index].y,
      new_theta: furniture[index].theta,
    };

    fetch(`http://127.0.0.1:5000/api/users/3/class/1/seating/1/furniture/${id}/move_furn`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })

    this.setState({ furniture: furniture, id: index });

  }

  onKeyPressed = (e) => {
    if (e.key === 'r') {
      this.setState({ mode: this.state.mode === "rotate" ? "movement" : "rotate" });
    } else if (e.key === 'n') {
      this.setState({ mode: this.state.mode === "place" ? "movement" : "place" });
    }
  }

  onMouseMove = (e) => {
    const mode = this.state.mode;
    const index = this.state.id;

    let furniture = [...this.state.furniture];

    const target = e.target;

    // Get the bounding rectangle of target
    const rect = target.getBoundingClientRect();

    // Mouse position
    const x = e.clientX - (rect.left + rect.width / 2);
    const y = e.clientY - (rect.top + rect.height / 2);

    let angle = Math.atan2(y, x);

    if (mode === "rotate" && e.clientX > rect.left && e.clientX < rect.right && e.clientY < rect.bottom && e.clientY > rect.top) {
      furniture[index].theta = 90 + angle * (180 / Math.PI)//(furniture[index].theta?furniture[index].theta:0) + 10*(angle - dAngle) 
    }
  }

  addSeat = (e) => {

    const bounds = this.divElement?.getBoundingClientRect() ?? 0;

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
      return (
        <Draggable
          key={f.id}
          position={{
            x: f.x * width,
            y: f.y * width
          }}
          bounds="parent"
          onStop={(_event, element) => this.stopDrag(f.furn_id, element)}
          onDrag={(_event, element) => this.onDrag(f.furn_id, element)}
        >
          <div className="clear-seat-element">
            <div
              className="seat-element"
              style={{ rotate: (f.theta ? f.theta : 0) + "deg" }}
              onMouseMove={this.onMouseMove}
              tabIndex={0}
            >
              id: {f.furn_id} x: {f.x.toFixed(2)} y: {f.y.toFixed(2)}
            </div>
          </div>
        </Draggable>
      )
    });

    return (
      <div className="h-full">

        <div>{"Mode: " + this.state.mode}</div>

        <div className="seating-container h-full" ref={e => { this.divElement = e }}
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
