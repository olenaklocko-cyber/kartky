import { useState } from "react";
import supabase from "../supabase";
import "./Vhid.css";

function Vhid({ naAvthentyfikovano }) {
  const [rezhym, setRezhym] = useState("vhid"); // "vhid" або "reestraciya"
  const [email, setEmail] = useState("");
  const [parol, setParol] = useState("");
  const [pomylka, setPomylka] = useState("");
  const [nadislano, setNadislano] = useState(false);
  const [zavantazhennya, setZavantazhennya] = useState(false);

  const nadislaty = async (e) => {
    e.preventDefault();
    setPomylka("");
    setZavantazhennya(true);

    try {
      if (rezhym === "reestraciya") {
        // Реєстрація
        const { data, error } = await supabase.auth.signUp({
          email,
          password: parol,
        });
        if (error) throw error;
        if (data.user) {
          setNadislano(true);
        }
      } else {
        // Вхід
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password: parol,
        });
        if (error) throw error;
        naAvthentyfikovano(data.user);
      }
    } catch (err) {
      setPomylka(perekladPomylky(err.message));
    }
    setZavantazhennya(false);
  };

  return (
    <div className="vhid-obolonka">
      <div className="vhid-kartka">
        <div className="vhid-zagolovok">
          <h1>🔐 Вхід до акаунта</h1>
          <p>Увійдіть щоб зберігати свої нотатки</p>
        </div>

        {nadislano ? (
          <div className="povedinka">
            <span className="ikona">📧</span>
            <h2>Перевірте пошту!</h2>
            <p>Ми надіслали вам лист для підтвердження email.</p>
            <button
              className="knopka"
              onClick={() => {
                setNadislano(false);
                setRezhym("vhid");
              }}
            >
              Повернутись до входу
            </button>
          </div>
        ) : (
          <>
            {/* Перемикач режимів */}
            <div className="rezhymy">
              <button
                className={`rezhym ${rezhym === "vhid" ? "aktyvnyj" : ""}`}
                onClick={() => setRezhym("vhid")}
              >
                Увійти
              </button>
              <button
                className={`rezhym ${
                  rezhym === "reestraciya" ? "aktyvnyj" : ""
                }`}
                onClick={() => setRezhym("reestraciya")}
              >
                Реєстрація
              </button>
            </div>

            <form onSubmit={nadislaty}>
              <div className="pole">
                <label>Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  required
                />
              </div>

              <div className="pole">
                <label>Пароль</label>
                <input
                  type="password"
                  value={parol}
                  onChange={(e) => setParol(e.target.value)}
                  placeholder="Мінімум 6 символів"
                  minLength={6}
                  required
                />
              </div>

              {pomylka && <div className="pomylka">{pomylka}</div>}

              <button
                type="submit"
                className="knopka-golovna"
                disabled={zavantazhennya}
              >
                {zavantazhennya
                  ? "Зачекайте..."
                  : rezhym === "vhid"
                  ? "Увійти"
                  : "Зареєструватися"}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}

// Переклад помилок українською
function perekladPomylky(message) {
  const pomylky = {
    "Invalid login credentials": "Невірний email або пароль",
    "User already registered": "Користувач вже зареєстрований",
    "Password should be at least 6 characters":
      "Пароль має бути мінімум 6 символів",
    "Email not confirmed": "Email не підтверджено. Перевірте пошту",
    "Unable to validate email address: invalid format":
      "Невірний формат email",
    "Signup requires a valid password": "Введіть пароль",
  };
  return pomylky[message] || message;
}

export default Vhid;
