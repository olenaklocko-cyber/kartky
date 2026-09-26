import { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ConfigProvider } from "antd";
import ukUA from "antd/locale/uk_UA";
import Golovna from "./pages/Golovna";
import Podrobnosti from "./pages/Podrobnosti";
import Dashbord from "./pages/Dashbord";

function App() {
  // Стан живе в App — його бачать і головна, і дашборд
  const [laiky, setLaiky] = useState({});
  const [vihtuky, setVihtuky] = useState([]);

  const naLajk = (id) => {
    setLaiky((p) => ({ ...p, [id]: (p[id] || 0) + 1 }));
  };

  const dodatyVihtuk = (novyi) => {
    setVihtuky((p) => [novyi, ...p]);
  };

  return (
    <ConfigProvider
      locale={ukUA}
      theme={{
        token: {
          colorPrimary: "#667eea",
          colorInfo: "#667eea",
          borderRadius: 10,
        },
      }}
    >
      <BrowserRouter>
        <Routes>
          {/* Головна — каталог фільмів */}
          <Route
            path="/"
            element={
              <Golovna
                laiky={laiky}
                vihtuky={vihtuky}
                naLajk={naLajk}
                dodatyVihtuk={dodatyVihtuk}
              />
            }
          />

          {/* Сторінка деталей фільму */}
          <Route path="/film/:id" element={<Podrobnosti />} />

          {/* Дашборд — статистика та графіки */}
          <Route
            path="/dashbord"
            element={
              <Dashbord laiky={laiky} vihtuky={vihtuky} naLajk={naLajk} />
            }
          />
        </Routes>
      </BrowserRouter>
    </ConfigProvider>
  );
}

export default App;
