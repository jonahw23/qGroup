import { useEffect, useState, useRef } from "react";
import { ArrowsPointingInIcon, ArrowsPointingOutIcon, HandRaisedIcon, PlusIcon } from '@heroicons/react/24/outline'
import * as api from "../api.js";
import Seat from "./Seat.js";
import { FullScreen, useFullScreenHandle } from "react-full-screen";
import { useAuth0 } from "@auth0/auth0-react";

export default function SeatingEditor({ classId: class_id, groups }) {

  const { user } = useAuth0();

  let [furniture, setFurniture] = useState([]);
  let [students, setStudents] = useState([]);
  let [furn_groups, setFurnGroups] = useState([]);
  let [width, setWidth] = useState(0);
  let [selected, setSelected] = useState([]);
  let [select_corner, setSelectCorner] = useState(undefined);
  let [mouse_pos, setMousePos] = useState({});
  let [mode, setMode] = useState("select");

  let divElement = useRef(null);
  const fsHandle = useFullScreenHandle();

  const api_base = path => {
    const id = api.user_id(user);
    return `/users/${id}/class/${class_id}/seating/${id}` + path;
  }



  useEffect(() => {

    getData();

    setWidth(divElement.current?.clientWidth ?? 0);
    window.addEventListener("resize", () => {
      console.log(divElement)
      setWidth(divElement.current?.clientWidth ?? width);
    });

  }, [])

  const getData = () => {
    api.call("GET", api_base("/furniture/get_furniture_loc"))
      .then(json => { setFurniture(json) });
    api.call("GET", api_base("/furniture_groups"))
      .then(json => { setFurnGroups(json) });
    api.call("GET", api_base("/students"))
      .then(json => { setStudents(json) });
  }

  const mapStudents = () => {
    api.call("POST", api_base("/students"))
      .then(() => { getData(); });
  }
  const clearStudents = () => {
    api.call("DELETE", api_base("/students"))
      .then(() => { getData(); });
  }
  const mapFurniture = () => {
    const num_groups = groups.length;
    api.call("POST", api_base("/group_furn"),
      { num_groups: num_groups })
      .then(() => { getData(); });
  }
  const deleteFurniture = () => {
    selected.forEach(id => {
      api.call("DELETE", api_base(`/furniture/${id}`));
    })
    setFurniture([...furniture].filter(f => !selected.includes(f.furn_id)))
    setSelected([])
  }

  const addSeat = (e) => {
    const bounds = divElement.current.getBoundingClientRect();

    if (e.clientX === undefined) { return }
    const x = (e.clientX - bounds.left) / bounds.width;
    const y = (e.clientY - bounds.top) / bounds.width;
    const theta = 0;

    api.call("POST", api_base("/new_furniture"),
      {
        furn_type: "seat",
        x: x, y: y, theta: theta
      })
      .then(json => {
        let furn = [...furniture];
        furn.push({
          furn_id: json.furn_id,
          x: x, y: y, theta: theta
        });
        setFurniture(furn);
      })
  }

  const onMouseDown = (event) => {
    if (mode === "place") {
      addSeat(event);
    }
    else {
      if (event.target === divElement.current) {
        const rect = divElement.current.getBoundingClientRect();

        const x = event.clientX ?? event.touches[0].clientX;
        const y = event.clientY ?? event.touches[0].clientY;
        setMousePos({ x: x - rect.left, y: y - rect.top });

        setSelectCorner({
          x: (x - rect.left) / width,
          y: (y - rect.top) / width
        });
      }
    }
  }
  const onMouseMove = (event) => {
    if (select_corner) {
      const rect = divElement.current.getBoundingClientRect();

      const c = select_corner;
      let x = event.clientX ?? event.touches[0].clientX;
      let y = event.clientY ?? event.touches[0].clientY;
      x = x - rect.left;
      y = y - rect.top;
      setMousePos({ x: x, y: y });
      x = x / width;
      y = y / width;

      const x1 = Math.min(c.x, x); const x2 = Math.max(c.x, x);
      const y1 = Math.min(c.y, y); const y2 = Math.max(c.y, y);

      setSelected([
        ...furniture
          .filter(f =>
            x1 < f.x && f.x < x2 &&
            y1 < f.y && f.y < y2)
          .map(x => x.furn_id)
      ]);
    }
  }
  const onMouseUp = (event) => {
    setSelectCorner(undefined);
  }

  const onStartDrag = (f) => {
    if (selected.length <= 1 || !selected.includes(f.furn_id)) {
      setSelected([f.furn_id]);
    }
  }
  const onDrag = (f, draggable) => {
    let furn = [...furniture];
    let anchor = { ...furn.find(x => x.furn_id === f.furn_id) };

    selected.forEach(id => {
      const index = furn.findIndex(x => x.furn_id === id);
      const offset_x = furn[index].x - anchor.x;
      const offset_y = furn[index].y - anchor.y;

      furn[index].x = draggable.x / width + offset_x;
      furn[index].y = draggable.y / width + offset_y;
    });

    setFurniture(furn);
  }
  const onStopDrag = (f) => {
    selected.forEach(id => {
      const index = furniture.findIndex(x => x.furn_id === id);
      api.call("PUT", `/users/6/class/8/seating/1/furniture/${id}/move_furn`,
        {
          new_x: furniture[index].x,
          new_y: furniture[index].y,
          new_theta: furniture[index].theta,
        });
    })
  }

  const onRotate = (f, event) => {
    const rect = divElement.current.getBoundingClientRect();
    const seatRect = document.querySelector(".seat-element").getBoundingClientRect();

    let x = event.clientX ?? event.touches[0].clientX;
    let y = event.clientY ?? event.touches[0].clientY;
    x -= rect.left + f.x * width + seatRect.width / 2;
    y -= rect.top + f.y * width + seatRect.height / 2;
    const angle = Math.atan2(y, x);

    let furn = [...furniture];
    const index = furn.findIndex(x => x.furn_id === f.furn_id);
    furn[index].theta = 90 + angle * (180 / Math.PI);
    setFurniture(furn);
  }



  const seats = furniture.map(f => {
    const student = students.find(x => x.furn_id === f.furn_id);
    const name = student ? `${student.first_name} ${student.last_name}` : "";

    return (
      <Seat
        f={f}
        width={width}
        selected={selected.indexOf(f.furn_id) >= 0}
        group={furn_groups.find(x => x.furn_id === f.furn_id)?.table_group_id}
        student={name}
        dragHandlers={{
          onStart: (e, draggable) => onStartDrag(f),
          onDrag: (e, draggable) => onDrag(f, draggable),
          onStop: (e, draggable) => onStopDrag(f),
        }}
        rotateHandlers={{
          onDrag: (e, draggable) => onRotate(f, e),
          onStop: (e, draggable) => onStopDrag(f),
        }} />
    );
  });

  const selectbox =
    select_corner ? {
      x1: select_corner.x * width,
      y1: select_corner.y * width,
      x2: mouse_pos.x,
      y2: mouse_pos.y,
    } : { x1: 0, y1: 0, x2: 0, y2: 0, };

  return (
    <div className="h-full flex flex-col">

      <div className="p-5 bg-gray-200 flex gap-2 items-center text-sm">
        <HandRaisedIcon
          className={`block h-8 w-8 p-1 cursor-pointer rounded
                        ${mode === "select" ? "bg-slate-400" : "hover:bg-slate-300"}`}
          onClick={() => setMode("select")} />
        <PlusIcon
          className={`block h-8 w-8 p-1 cursor-pointer rounded
                        ${mode === "place" ? "bg-slate-400" : "hover:bg-slate-300"}`}
          onClick={() => setMode("place")} />

        <div className="flex-1" />

        <button
          className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
          onClick={() => { deleteFurniture() }}>
          Delete selected furniture
        </button>

        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          onClick={() => { mapFurniture() }}>
          Group furniture
        </button>
        <button
          className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
          onClick={() => { clearStudents() }}>
          Clear students
        </button>
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          onClick={() => { mapStudents() }}>
          Assign students
        </button>

        {
          fsHandle.active ?
            <ArrowsPointingInIcon
              className={`block h-8 w-8 p-1 cursor-pointer rounded hover:bg-slate-300`}
              onClick={fsHandle.exit} />
            :
            <ArrowsPointingOutIcon
              className={`block h-8 w-8 p-1 cursor-pointer rounded hover:bg-slate-300`}
              onClick={fsHandle.enter} />
        }
      </div>

      <FullScreen
        handle={fsHandle}
        className="relative border-solid border border-slate-200 flex-1 bg-white">
        <div
          className="h-full"
          ref={divElement}
          onMouseDown={e => onMouseDown(e)} onTouchStart={e => onMouseDown(e)}
          onMouseMove={e => onMouseMove(e)} onTouchMove={e => onMouseMove(e)}
          onMouseUp={e => onMouseUp(e)} onTouchEnd={e => onMouseUp(e)}
          tabIndex={0}>

          {seats}

          <div
            className="bg-sky-500/30"
            style={{
              position: "absolute",
              top: Math.min(selectbox.y1, selectbox.y2),
              left: Math.min(selectbox.x1, selectbox.x2),
              width: Math.abs(selectbox.x2 - selectbox.x1),
              height: Math.abs(selectbox.y2 - selectbox.y1),
            }}></div>

        </div>
      </FullScreen>

    </div>
  );

}
