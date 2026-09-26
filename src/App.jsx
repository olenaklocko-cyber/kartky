import { useState } from "react";
import { HashRouter, Routes, Route } from "react-router-dom";
import { ConfigProvider } from "antd";
import ukUA from "antd/locale/uk_UA";
import Golovna from "./pages/Golovna";
import Podrobnosti from "./pages/Podrobnosti";
import Dashbord from "./pages/Dashbord";
import pochatkoviFilmy from "./data/filmy";

function App() {
  // Стан живе в App — його бачать і головна, і дашборд
  const [laiky, setLaiky] = useState({});
  const [vihtuky, setVihtuky] = useState([]);
  // Список фільмів — сюди додаються нові та видаляються нелюбі
  const [filmy, setFilmy] = useState(pochatkoviFilmy);

  const naLajk = (id) => {
    setLaiky((p) => ({ ...p, [id]: (p[id] || 0) + 1 }));
  };

  const dodatyVihtuk = (novyi) => {
    setVihtuky((p) => [novyi, ...p]);
  };

  const dodatyFilm = (novyi) => {
    setFilmy((p) => [...p, novyi]);
  };

  const vydalutyFilm = (id) => {
    setFilmy((p) => p.filter((f) => f.id !== id));
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
      <HashRouter>
        <Routes>
          {/* Головна — каталог фільмів */}
          <Route
            path="/"
            element={
              <Golovna
                filmy={filmy}
                dodatyFilm={dodatyFilm}
                vydalutyFilm={vydalutyFilm}
                laiky={laiky}
                vihtuky={vihtuky}
                naLajk={naLajk}
                dodatyVihtuk={dodatyVihtuk}
              />
            }
          />

          {/* Сторінка деталей фільму */}
          <Route
            path="/film/:id"
            element={
              <Podrobnosti filmy={filmy} vydalutyFilm={vydalutyFilm} />
            }
          />

          {/* Дашборд — статистика та графіки */}
          <Route
            path="/dashbord"
            element={
              <Dashbord
                filmy={filmy}
                vydalutyFilm={vydalutyFilm}
                laiky={laiky}
                vihtuky={vihtuky}
                naLajk={naLajk}
              />
            }
          />
        </Routes>
      </HashRouter>
    </ConfigProvider>
  );
}

export default App;
