import React, { useEffect, useState } from "react";
import { Stage, Layer, Text, Rect } from "react-konva";
import { socket } from "../socket";

export function Board() {
	const [elements, setElements] = useState([]);

	useEffect(() => {
		const handleBoardState = (serverElements) => {
			setElements(serverElements);
		};

		const handleElementCreated = (element) => {
			console.log("element-created:", element);
			setElements((prev) => [...prev, element]);
		};

		const handleElementUpdated = (element) => {
			console.log("element-updated:", element);
			setElements((prev) =>
				prev.map((el) => (el.id === element.id ? element : el))
			);
		};

		const handleElementDeleted = (elementId) => {
			console.log("element-deleted:", elementId);
			setElements((prev) => prev.filter((el) => el.id !== elementId));
		};

		socket.on("board-state", handleBoardState);
		socket.on("element-created", handleElementCreated);
		socket.on("element-updated", handleElementUpdated);
		socket.on("element-deleted", handleElementDeleted);

		return () => {
			socket.off("board-state", handleBoardState);
			socket.off("element-created", handleElementCreated);
			socket.off("element-updated", handleElementUpdated);
			socket.off("element-deleted", handleElementDeleted);
		};
	}, []);

	const handleCreateElement = (element) => {
		socket.emit("element-create", element);
	};

	const handleUpdateElement = (element) => {
		socket.emit("element-update", element);
	};

	const handleDeleteElement = (elementId) => {
		socket.emit("element-delete", elementId);
	};

	const addRectangle = () => {
		const newElement = {
			id: Date.now().toString(),
			type: "rect",
			x: 100,
			y: 100,
			width: 100,
			height: 100,
			fill: "red",
			isDragging: false,
			onDragStart: handleDragStart,
			onDragEnd: handleDragEnd,
		};
		handleCreateElement(newElement);
	};

	const deleteRectangle = (elementId) => {
		handleDeleteElement(elementId);
	};

	const paintRectangle = (element) => {
		const updatedElement = {
			id: element.id,
			type: "rect",
			x: element.x,
			y: element.y,
			width: 150,
			height: 150,
			fill: "blue",
			isDragging: false,
		};
		handleUpdateElement(updatedElement);
	};

	const printDebugElements = () => {
		socket.emit("debug-print-elements");
	};

	const handleDragStart = (e) => {
		const id = e.target.id();
		setElements(
			elements.map((element) => {
				return {
					...element,
					isDragging: element.id === id,
				};
			})
		);
	};

	const handleDragEnd = (e) => {
		const id = e.target.id();
		const updatedElements = elements.map((element) => {
			if (element.id === id) {
				return {
					...element,
					x: e.target.x(),
					y: e.target.y(),
					isDragging: false,
				};
			}
			return element;
		});
		setElements(updatedElements);

		const movedElement = updatedElements.find(
			(element) => element.id === id
		);
		if (movedElement) {
			handleUpdateElement(movedElement);
		}
	};

	return (
		<div>
			<button onClick={addRectangle}>Add Rectangle</button>
			<button onClick={() => deleteRectangle(elements[0]?.id)}>
				Delete Rectangle
			</button>
			<button
				onClick={() =>
					paintRectangle(
						elements[Math.floor(Math.random() * elements.length)]
					)
				}
			>
				Paint Rectangle
			</button>
			<button onClick={() => printDebugElements()}>
				Debug all Elements
			</button>
			<Stage width={window.innerWidth} height={window.innerHeight}>
				<Layer>
					{elements.map((element) =>
						element.type === "text" ? (
							<Text key={element.id} {...element} />
						) : element.type === "rect" ? (
							<Rect
								key={element.id}
								id={element.id}
								x={element.x}
								y={element.y}
								fill={element.fill}
								height={element.height}
								width={element.width}
								draggable
								shadowColor="black"
								shadowBlur={10}
								shadowOpacity={0.6}
								shadowOffsetX={element.isDragging ? 10 : 5}
								shadowOffsetY={element.isDragging ? 10 : 5}
								scaleX={element.isDragging ? 1.2 : 1}
								scaleY={element.isDragging ? 1.2 : 1}
								onDragStart={handleDragStart}
								onDragEnd={handleDragEnd}
							/>
						) : null
					)}
				</Layer>
			</Stage>
		</div>
	);
}
