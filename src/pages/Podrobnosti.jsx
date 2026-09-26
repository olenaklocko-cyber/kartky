import { useParams, Link } from "react-router-dom";
import filmy from "../data/filmy";
import "./Podrobnosti.css";

function Podrobnosti() {
  const { id } = useParams();
  const film = filmy.find((f) => f.id === Number(id));

  if (!film) {
    return (
      <div className="podrobnosti">
        <div className="stan">
          <p className="pomylka-tekst">😕 Фільм не знайдено</p>
          <Link to="/" className="knopka-nazad">
            ← Назад до списку
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="podrobnosti">
      <Link to="/" className="knopka-nazad">
        ← Назад до списку
      </Link>

      <div className="kartka-filmu">
        {/* Зображення */}
        <div className="zobrazhennya-filmu">
          <span className="emoji">{film.obraz}</span>
        </div>

        {/* Інформація */}
        <div className="info-filmu">
          <span className="zhanr">{film.zhanr}</span>
          <h1>{film.nazva}</h1>
          <p className="opys">{film.opys}</p>

          {/* Деталі */}
          <div className="detali">
            <div className="detal">
              <span className="detal-icon">📅</span>
              <div>
                <span className="detal-nazva">Рік випуску</span>
                <strong>{film.rik || "2024"}</strong>
              </div>
            </div>
            <div className="detal">
              <span className="detal-icon">⭐</span>
              <div>
                <span className="detal-nazva">Рейтинг</span>
                <strong>{film.rejtyng || "8.5"} / 10</strong>
              </div>
            </div>
            <div className="detal">
              <span className="detal-icon">🎬</span>
              <div>
                <span className="detal-nazva">Жанр</span>
                <strong>{film.zhanr}</strong>
              </div>
            </div>
            <div className="detal">
              <span className="detal-icon">⏱️</span>
              <div>
                <span className="detal-nazva">Тривалість</span>
                <strong>{film.trivalist || "120 хв"}</strong>
              </div>
            </div>
          </div>

          {/* Кнопки дій */}
          <div className="diyi">
            <button className="knopka-diyi primary">▶ Дивитись</button>
            <button className="knopka-diyi">❤️ В обране</button>
            <button className="knopka-diyi">📤 Поділитись</button>
          </div>
        </div>
      </div>

      {/* Секція "Про фільм" */}
      <section className="sekciya-pro-film">
        <h2>📋 Про фільм</h2>
        <p>
          {film.opys} Цей фільм належить до жанру{" "}
          <strong>{film.zhanr}</strong> та є одним з улюблених у каталозі.
          Дивіться, оцінюйте та залишайте свої відгуки!
        </p>
      </section>
    </div>
  );
}

export default Podrobnosti;
