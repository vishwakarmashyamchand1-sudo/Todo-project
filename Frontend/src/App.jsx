import { Route, Routes } from "react-router";

import HomePage from "./pages/HomePage";
import CreatePage from "./pages/CreatePage";
import NoteDetailPage from "./pages/NoteDetailPage";

const App = () => {
  return (
    <div className="relative h-full w-full">
      {/* Option 2: Purple AI Style Background */}
      <div className="absolute inset-0 -z-10 h-full w-full min-h-screen bg-gradient-to-br from-[#1a0b2e] via-[#3b1d6e] to-[#0f0524]" />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/create" element={<CreatePage />} />
        <Route path="/note/:id" element={<NoteDetailPage />} />
      </Routes>
    </div>
  );
};
export default App;