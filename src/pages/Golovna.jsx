import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import supabase from "../supabase";
import Kartka from "../components/Kartka";
import FormaVihtuku from "../components/FormaVihtuku";
import Vihtuk from "../components/Vihtuk";
import Notatky from "../components/Notatky";
import Vhid from "../components/Vhid";
import filmy from "../data/filmy";
import "./Golovna.css";

function Golovna() {
  const [korystuvach, setKorystuvach] = useState(null);
  const [zavantazhennya, setZavantazhennya] = useState(true);

  const [poshuk, setPoshuk] = useState("");
  const [aktyvnyjZhanr, setAktyvnyjZhanr] = useState("Усі");
  const [laiky, setLaiky] = useState({});
  const [vihtuky, setVihtuky] = useState([]);

  // Перевірка чи користувач увійшов
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setKorystuvach(session?.user || null);
      setZavantazhennya(false);
    });

    // Слухач змін авторизації
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      setKorystuvach(session?.user || null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const naVykhid = async () => {
    await supabase.auth.signOut();
    setKorystuvach(null);
  };

  const zhanry = ["Усі", ...new Set(filmy.map((f) => f.zhanr))];

  const naLajk = (id) => {
    setLaiky((p) => ({ ...p, [id]: (p[id] || 0) + 1 }));
  };

  const dodatyVihtuk = (novyi) => {
    setVihtuky((p) => [novyi, ...p]);
  };

  const filtrivaniFilmy = filmy.filter((film) => {
    const spodobaetsya = film.nazva
      .toLowerCase()
      .includes(poshuk.toLowerCase());
    const zhannyj = aktyvnyjZhanr === "Усі" || film.zhanr === aktyvnyjZhanr;
    return spodobaetsya && zhannyj;
  });

  if (zavantazhennya) {
    return (
      <div className="zavantazhennya-sejchas">
        <div className="spinner"></div>
        <p>Завантаження...</p>
      </div>
    );
  }

  // Якщо не увійшов — показуємо форму входу
  if (!korystuvach) {
    return <Vhid naAvthentyfikovano={setKorystuvach} />;
  }

  return (
    <div className="golovna">
      <header className="zaholovok">
        <h1>🎬 Мій каталог фільмів</h1>
        <p>Клікни на картку щоб побачити деталі фільму</p>
      </header>

      {/* Панель керування */}
      <div className="panel">
        <input
          type="text"
          className="poshuk"
          placeholder="🔍 Пошук за назвою..."
          value={poshuk}
          onChange={(e) => setPoshuk(e.target.value)}
        />
        <div className="filtry">
          {zhanry.map((zhanr) => (
            <button
              key={zhanr}
              className={`filtr-btn ${
                aktyvnyjZhanr === zhanr ? "aktyvnyj" : ""
              }`}
              onClick={() => setAktyvnyjZhanr(zhanr)}
            >
              {zhanr}
            </button>
          ))}
        </div>
      </div>

      <p className="lichilnyk">
        Знайдено: {filtrivaniFilmy.length} з {filmy.length}
      </p>

      {/* Сітка карток */}
      <main className="sitka">
        {filtrivaniFilmy.length > 0 ? (
          filtrivaniFilmy.map((film) => (
            <Link
              key={film.id}
              to={`/film/${film.id}`}
              className="link-kartky"
            >
              <Kartka
                obraz={film.obraz}
                nazva={film.nazva}
                opys={film.opys}
                zhanr={film.zhanr}
                laiky={laiky[film.id] || 0}
                naLajk={(e) => {
                  e.preventDefault();
                  naLajk(film.id);
                }}
              />
            </Link>
          ))
        ) : (
          <div className="nichogo">😔 Нічого не знайдено</div>
        )}
      </main>

      {/* Відгуки */}
      <section className="sekciya-vihtukiv">
        <h2 className="zagolovok-sekciyi">💬 Відгуки глядачів</h2>
        <FormaVihtuku naDodaty={dodatyVihtuk} />
        <div className="spysok-vihtukiv">
          {vihtuky.length === 0 ? (
            <p className="nemae-vihtukiv">
              Ще немає відгуків. Будьте першим! ✨
            </p>
          ) : (
            vihtuky.map((v) => (
              <Vihtuk
                key={v.id}
                imya={v.imya}
                ocinka={v.ocinka}
                tekst={v.tekst}
                data={v.data}
              />
            ))
          )}
        </div>
      </section>

      {/* Нотатки — тільки для авторизованих */}
      <Notatky korystuvach={korystuvach} naVykhid={naVykhid} />
    </div>
  );
}

export default Golovna;
