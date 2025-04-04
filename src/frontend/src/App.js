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
import { Login } from "./components/login";
import { Register } from "./components/register";

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
						<li>
							<Link to="/login">Login</Link>
						</li>
						<li>
							<Link to="/register">Register</Link>
						</li>
					</ul>
				</nav>

				<Routes>
					<Route path="/" element={<Navigate to="/board" />} />
					<Route path="/board/:boardId" element={<Board />} />
					<Route path="/user" element={<Users />} />
					<Route path="/login" element={<Login />} />
					<Route path="/register" element={<Register />} />
				</Routes>
			</div>
		</Router>
	);
}

export default App;
