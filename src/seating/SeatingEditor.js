import React from 'react';
import "./SeatingEditor.css";
import Draggable from 'react-draggable';

export default class SeatingEditor extends React.Component {
  state = {
    furniture: [],
    rotate: 0,
  }

  componentDidMount = () => {

    // fetch seating data...
    console.log(this.divElement.clientWidth);

    this.setState({
      furniture: [
        { id: 0, x: 0.2, y: 0.2, theta: 45 },
        { id: 1, x: 0.2, y: 0.4, theta: 0 },
        { id: 2, x: 0.4, y: 0.2, theta: 0 },
        { id: 3, x: 0.4, y: 0.4, theta: 0 },
        { id: 4, x: 0.6, y: 0.2, theta: 0 },
        { id: 5, x: 0.6, y: 0.4, theta: 0 },
      ]
    });
  }

  getWidth = () => {
    return this.divElement?.clientWidth ?? 0;
  }

  onDrag = (id, element) => {

    const index = this.state.furniture.findIndex(x => x.id === id);
    const rotate = this.state.rotate
    let furniture = [...this.state.furniture];

    this.setState({ furniture: furniture });

    if (rotate) {
      furniture[index].theta = (furniture[index].theta ? furniture[index].theta : 0) + 1

      throw new Error('No Drag');

    } else {

    }

  }


  stopDrag = (id, element) => {

    const width = this.getWidth();
    const index = this.state.furniture.findIndex(x => x.id === id);
    const rotate = this.state.rotate

    let furniture = [...this.state.furniture];
    if (!rotate) {
      furniture[index].x = element.x / width;
      furniture[index].y = element.y / width;
    } else {
      //this.setState({ rotate: 0 });
    }

    // post new coords... maybe debounce too?

    this.setState({ furniture: furniture });
  }

  onKeyPressed = (e) => {
    this.setState({ rotate: !this.state.rotate });
  }


  render = () => {
    const furnitureElements = this.state.furniture.map(f => {
      const width = this.getWidth();
      return (
        <Draggable
          //disabled = {this.state.rotate}
          key={f.id}
          position={{
            x: f.x * width,
            y: f.y * width
          }}
          data={this.state.data}
          bounds="parent"
          onClick={() => console.log("click")}
          onStop={(_event, element) => this.stopDrag(f.id, element)}
          onDrag={(_event, element) => this.onDrag(f.id, element)}
        >
          <div className="clear-seat-element">
            <div className="seat-element" style={{ rotate: (f.theta ? f.theta : 0) + "deg" }} onKeyDown={this.onKeyPressed} tabIndex={0}>
              x: {f.x.toFixed(2)} y: {f.y.toFixed(2)}
            </div>
          </div>
        </Draggable>
      )
    })

    return (
      <div className="seating-container" ref={e => { this.divElement = e }}>
        {furnitureElements}
      </div>
    );
  }
}
