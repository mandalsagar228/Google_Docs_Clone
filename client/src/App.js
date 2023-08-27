import Editor from "./Component/Editor";
import "./App.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { v4 as uuid } from "uuid";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate replace to={`/docs/${uuid()}`} />} />
        <Route path="/docs/:id" element={<Editor />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
