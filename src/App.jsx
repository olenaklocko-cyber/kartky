import { useState, useEffect } from "react";
import { HashRouter, Routes, Route } from "react-router-dom";
import { ConfigProvider } from "antd";
import ukUA from "antd/locale/uk_UA";
import Golovna from "./pages/Golovna";
import Podrobnosti from "./pages/Podrobnosti";
import Dashbord from "./pages/Dashbord";
import pochatkoviFilmy from "./data/filmy";

// Короткий опис (перші ~250 символів, щоб картки були рівні)
const korotko = (tekst) =>
  tekst.length > 250 ? `${tekst.slice(0, tekst.lastIndexOf(" ", 250))}…` : tekst;

function App() {
  // Стан живе в App — його бачать і головна, і дашборд
  const [laiky, setLaiky] = useState({});
  const [vihtuky, setVihtuky] = useState([]);
  // Список фільмів — сюди додаються нові та видаляються нелюбі
  const [filmy, setFilmy] = useState(pochatkoviFilmy);
  // Тиждень 4: стан завантаження даних з публічного API
  const [zavantazhennya, setZavantazhennya] = useState(true);

  // Завантаження даних каталогу з публічного API (Wikipedia REST)
  useEffect(() => {
    const zavantazhytyZApi = async () => {
      try {
        const rezultaty = await Promise.all(
          pochatkoviFilmy.map(async (film) => {
            if (!film.wiki) return null;
            try {
              const adresa =
                "https://uk.wikipedia.org/api/rest_v1/page/summary/" +
                encodeURIComponent(film.wiki.replace(/ /g, "_"));
              const vidpovid = await fetch(adresa);
              if (!vidpovid.ok) return null;
              const dani = await vidpovid.json();
              return {
                id: film.id,
                opys: dani.extract ? korotko(dani.extract) : film.opys,
                poster:
                  (dani.thumbnail || dani.originalimage)?.source ||
                  film.poster,
              };
            } catch {
              return null; // один фільм не завантажився — не заважає іншим
            }
          })
        );

        const onovlennya = {};
        rezultaty.filter(Boolean).forEach((r) => {
          onovlennya[r.id] = r;
        });

        setFilmy((p) =>
          p.map((f) => (onovlennya[f.id] ? { ...f, ...onovlennya[f.id] } : f))
        );
      } finally {
        // Навіть без інтернету показуємо статичні дані
        setZavantazhennya(false);
      }
    };

    zavantazhytyZApi();
  }, []);

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

  // Поки дані з API грузяться — показуємо завантаження
  if (zavantazhennya) {
    return (
      <div className="zavantazhennya-sejchas">
        <div className="spinner"></div>
        <p>Завантаження даних з API...</p>
      </div>
    );
  }

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
