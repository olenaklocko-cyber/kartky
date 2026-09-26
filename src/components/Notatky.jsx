import { useState, useEffect } from "react";
import supabase from "../supabase";
import "./Notatky.css";

function Notatky({ korystuvach, naVykhid }) {
  const [notatky, setNotatky] = useState([]);
  const [tekst, setTekst] = useState("");
  const [zavantazhennya, setZavantazhennya] = useState(true);
  const [nadtyska, setNadtyska] = useState(false);

  // Завантаження ТІЛЬКИ своїх нотаток
  useEffect(() => {
    if (!korystuvach) return;
    zavantatyNotatky();
  }, [korystuvach]);

  const zavantatyNotatky = async () => {
    setZavantazhennya(true);
    const { data, error } = await supabase
      .from("notatky")
      .select("*")
      .order("stvoreno", { ascending: false });

    if (error) {
      console.log("Помилка:", error.message);
    } else {
      setNotatky(data || []);
    }
    setZavantazhennya(false);
  };

  // Додавання нотатки
  const dodatyNotatku = async (e) => {
    e.preventDefault();
    if (!tekst.trim()) return;

    setNadtyska(true);
    const { data, error } = await supabase
      .from("notatky")
      .insert([{ tekst: tekst.trim(), user_id: korystuvach.id }])
      .select();

    if (error) {
      alert("Не вдалося зберегти: " + error.message);
    } else {
      setNotatky((p) => [data[0], ...p]);
      setTekst("");
    }
    setNadtyska(false);
  };

  // Видалення
  const vydaluty = async (id) => {
    const { error } = await supabase.from("notatky").delete().eq("id", id);
    if (!error) setNotatky((p) => p.filter((n) => n.id !== id));
  };

  return (
    <div className="notatky">
      <div className="notatky-shapka">
        <div>
          <h2>☁️ Мої нотатки</h2>
          <p className="pidzagolovok">Ваш email: {korystuvach.email}</p>
        </div>
        <button className="knopka-vykhodu" onClick={naVykhid}>
          🚪 Вийти
        </button>
      </div>

      {/* Форма */}
      <form className="forma-notatky" onSubmit={dodatyNotatku}>
        <textarea
          placeholder="Напишіть нотатку..."
          value={tekst}
          onChange={(e) => setTekst(e.target.value)}
          rows={3}
        />
        <button type="submit" disabled={nadtyska || !tekst.trim()}>
          {nadtyska ? "Збереження..." : "☁️ Зберегти в хмару"}
        </button>
      </form>

      {/* Список */}
      {zavantazhennya ? (
        <div className="zavantazhennya-notatok">⏳ Завантаження...</div>
      ) : notatky.length === 0 ? (
        <div className="nemae-notatok">
          Ще немає нотаток. Додайте першу! ✨
        </div>
      ) : (
        <div className="spysok-notatok">
          {notatky.map((n) => (
            <div key={n.id} className="notatka">
              <div className="notatka-verh">
                <span className="notatka-data">
                  {new Date(n.stvoreno).toLocaleDateString("uk-UA")}
                </span>
                <button
                  className="notatka-vydaluty"
                  onClick={() => vydaluty(n.id)}
                >
                  🗑️
                </button>
              </div>
              <p className="notatka-tekst">{n.tekst}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Notatky;
