import { useState } from "react";
import "./FormaVihtuku.css";

function FormaVihtuku({ naDodaty }) {
  const [imya, setImya] = useState("");
  const [ocinka, setOcinka] = useState(0);
  const [tekst, setTekst] = useState("");
  const [pomylky, setPomylky] = useState({});

  // Перевірка форми
  const validacia = () => {
    const noviPomylky = {};

    if (!imya.trim()) {
      noviPomylky.imya = "Введіть ім'я";
    }

    if (ocinka === 0) {
      noviPomylky.ocinka = "Оберіть оцінку";
    }

    if (!tekst.trim()) {
      noviPomylky.tekst = "Напишіть відгук";
    } else if (tekst.trim().length < 10) {
      noviPomylky.tekst = "Мінімум 10 символів";
    }

    setPomylky(noviPomylky);
    return Object.keys(noviPomylky).length === 0;
  };

  // Відправка форми
  const nadislaty = (e) => {
    e.preventDefault();

    if (!validacia()) return;

    naDodaty({
      id: Date.now(),
      imya: imya.trim(),
      ocinka,
      tekst: tekst.trim(),
      data: new Date().toLocaleDateString("uk-UA"),
    });

    // Очищення форми
    setImya("");
    setOcinka(0);
    setTekst("");
    setPomylky({});
  };

  return (
    <form className="forma" onSubmit={nadislaty}>
      <h2>✍️ Залишити відгук</h2>

      {/* Ім'я */}
      <div className="pole">
        <label>Ваше ім'я</label>
        <input
          type="text"
          value={imya}
          onChange={(e) => setImya(e.target.value)}
          placeholder="Наприклад, Олена"
          className={pomylky.imya ? "pomylka" : ""}
        />
        {pomylky.imya && <span className="tekst-pomylky">{pomylky.imya}</span>}
      </div>

      {/* Оцінка зірками */}
      <div className="pole">
        <label>Оцінка</label>
        <div className="zirky">
          {[1, 2, 3, 4, 5].map((zirka) => (
            <button
              key={zirka}
              type="button"
              className={`zirka ${zirka <= ocinka ? "aktyvna" : ""}`}
              onClick={() => setOcinka(zirka)}
            >
              ⭐
            </button>
          ))}
        </div>
        {pomylky.ocinka && (
          <span className="tekst-pomylky">{pomylky.ocinka}</span>
        )}
      </div>

      {/* Текст відгуку */}
      <div className="pole">
        <label>Ваш відгук</label>
        <textarea
          value={tekst}
          onChange={(e) => setTekst(e.target.value)}
          placeholder="Поділіться своїми враженнями..."
          rows={4}
          className={pomylky.tekst ? "pomylka" : ""}
        />
        {pomylky.tekst && <span className="tekst-pomylky">{pomylky.tekst}</span>}
        <span className="lichilnyk-symvoliv">{tekst.length} / 500</span>
      </div>

      <button type="submit" className="knopka-nadislaty">
        Надіслати відгук
      </button>
    </form>
  );
}

export default FormaVihtuku;
