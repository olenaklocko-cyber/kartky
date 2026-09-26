import { BrowserRouter, Routes, Route } from "react-router-dom";
import Golovna from "./pages/Golovna";
import Podrobnosti from "./pages/Podrobnosti";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Головна — каталог фільмів */}
        <Route path="/" element={<Golovna />} />

        {/* Сторінка деталей фільму */}
        <Route path="/film/:id" element={<Podrobnosti />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
