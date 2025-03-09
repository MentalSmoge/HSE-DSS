import React from "react";
import {
	BrowserRouter as Router,
	Routes,
	Route,
	Link,
	Navigate,
} from "react-router-dom";
import { Board } from "./components/board";
import Users from "./components/users";

function App() {
	return (
		<Router>
			<div className="App">
				<nav>
					<ul>
						<li>
							<Link to="/board">Board</Link>
						</li>
						<li>
							<Link to="/user">Users</Link>
						</li>
					</ul>
				</nav>

				<Routes>
					<Route path="/" element={<Navigate to="/board" />} />
					<Route path="/board" element={<Board />} />
					<Route path="/user" element={<Users />} />
				</Routes>
			</div>
		</Router>
	);
}

export default App;
