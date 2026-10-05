import { Routes, Route } from "react-router-dom";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/courses" element={<div className="p-8">Courses page (coming next)</div>} />
      <Route
        path="/instructor/dashboard"
        element={<div className="p-8">Instructor dashboard (coming next)</div>}
      />
    </Routes>
  );
}

export default App;