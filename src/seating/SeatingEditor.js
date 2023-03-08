import React from 'react';
import "./SeatingEditor.css";
import Draggable from 'react-draggable';

export default class SeatingEditor extends React.Component {
  state = {
    furniture: []
  }

  componentDidMount = () => {

    // fetch seating data...
    console.log(this.divElement.clientWidth);

    this.setState({
      furniture: [
        { id: 0, x: 0.3, y: 0.4 },
        { id: 1, x: 0.3, y: 0.6 },
        { id: 2, x: 0.5, y: 0.4 },
        { id: 3, x: 0.5, y: 0.6 },
        { id: 4, x: 0.7, y: 0.4 },
        { id: 5, x: 0.7, y: 0.6 },
      ]
    });
  }

  getWidth = () => {
    return this.divElement?.clientWidth ?? 0;
  }

  stopDrag = (id, element) => {

    const width = this.getWidth();
    const index = this.state.furniture.findIndex(x => x.id === id);
    let furniture = [...this.state.furniture];
    furniture[index].x = element.x / width;
    furniture[index].y = element.y / width;

    // post new coords... maybe debounce too?

    this.setState({ furniture: furniture });
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
          onStop={(_event, element) => this.stopDrag(f.id, element)}>
          <div className="seat-element">
            x: {f.x.toFixed(2)} y: {f.y.toFixed(2)}
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
