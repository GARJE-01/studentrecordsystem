import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

// Document title
document.title = "Student Records Management System";

createRoot(document.getElementById("root")!).render(<App />);
