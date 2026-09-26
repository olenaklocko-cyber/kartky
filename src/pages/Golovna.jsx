import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Input, Button, Space, Modal, message } from "antd";
import {
  SearchOutlined,
  BarChartOutlined,
  MessageFilled,
  PlusOutlined,
} from "@ant-design/icons";
import supabase from "../supabase";
import Kartka from "../components/Kartka";
import FormaVihtuku from "../components/FormaVihtuku";
import Vihtuk from "../components/Vihtuk";
import Notatky from "../components/Notatky";
import Vhid from "../components/Vhid";
import { poshuk as zbuduvatyPoshuk } from "../data/filmy";
import "./Golovna.css";

const { TextArea } = Input;

function Golovna({
  filmy,
  dodatyFilm,
  laiky,
  vihtuky,
  naLajk,
  dodatyVihtuk,
}) {
  const [korystuvach, setKorystuvach] = useState(null);
  const [zavantazhennya, setZavantazhennya] = useState(true);

  const [poshuk, setPoshuk] = useState("");
  const [aktyvnyjZhanr, setAktyvnyjZhanr] = useState("Усі");

  // Модалка додавання фільму
  const [modalka, setModalka] = useState(false);
  const [novaNazva, setNovaNazva] = useState("");
  const [novyyZhanr, setNovyyZhanr] = useState("");
  const [novyyOpys, setNovyyOpys] = useState("");
  const [novyyPoster, setNovyyPoster] = useState("");
  const [novyyVideo, setNovyyVideo] = useState("");

  const navigate = useNavigate();

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

  const filtrivaniFilmy = filmy.filter((film) => {
    const spodobaetsya = film.nazva
      .toLowerCase()
      .includes(poshuk.toLowerCase());
    const zhannyj = aktyvnyjZhanr === "Усі" || film.zhanr === aktyvnyjZhanr;
    return spodobaetsya && zhannyj;
  });

  // Закриття модалки та очищення форми
  const zakrytyModalku = () => {
    setModalka(false);
    setNovaNazva("");
    setNovyyZhanr("");
    setNovyyOpys("");
    setNovyyPoster("");
    setNovyyVideo("");
  };

  // Додавання нового фільму
  const pidtyktyDodyaty = () => {
    const nazva = novaNazva.trim();
    if (!nazva) {
      message.warning("Вкажіть назву фільму");
      return;
    }
    dodatyFilm({
      id: Date.now(),
      obraz: "🎬",
      nazva,
      opys: novyyOpys.trim() || "Опис поки що відсутній.",
      zhanr: novyyZhanr.trim() || "Інше",
      poster: novyyPoster.trim(),
      youtube: novyyVideo.trim() || zbuduvatyPoshuk(nazva),
      dyvytysya: zbuduvatyPoshuk(nazva),
    });
    message.success(`Фільм «${nazva}» додано до каталогу!`);
    zakrytyModalku();
  };

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
        <div className="zaholovok-verh">
          <div>
            <h1>🎬 Мій каталог фільмів</h1>
            <p>Клікни на картку щоб побачити деталі фільму</p>
          </div>
          <Space wrap>
            <Button
              icon={<PlusOutlined />}
              size="large"
              onClick={() => setModalka(true)}
            >
              Додати фільм
            </Button>
            <Button
              type="primary"
              size="large"
              icon={<BarChartOutlined />}
              onClick={() => navigate("/dashbord")}
            >
              Дашборд
            </Button>
          </Space>
        </div>
      </header>

      {/* Панель керування */}
      <div className="panel">
        <Input
          className="poshuk"
          size="large"
          prefix={<SearchOutlined />}
          allowClear
          placeholder="Пошук за назвою..."
          value={poshuk}
          onChange={(e) => setPoshuk(e.target.value)}
        />
        <Space wrap>
          {zhanry.map((zhanr) => (
            <Button
              key={zhanr}
              type={aktyvnyjZhanr === zhanr ? "primary" : "default"}
              onClick={() => setAktyvnyjZhanr(zhanr)}
            >
              {zhanr}
            </Button>
          ))}
        </Space>
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
                poster={film.poster}
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
        <h2 className="zagolovok-sekciyi">
          <MessageFilled style={{ color: "#764ba2" }} /> Відгуки глядачів
        </h2>
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

      {/* Модалка додавання фільму */}
      <Modal
        title="➕ Додати фільм до каталогу"
        open={modalka}
        onOk={pidtyktyDodyaty}
        onCancel={zakrytyModalku}
        okText="Додати"
        cancelText="Скасувати"
      >
        <div className="forma-filmu">
          <label>
            Назва фільму *
            <Input
              placeholder="Наприклад: Матриця"
              value={novaNazva}
              onChange={(e) => setNovaNazva(e.target.value)}
            />
          </label>
          <label>
            Жанр
            <Input
              placeholder="Наприклад: Фантастика"
              value={novyyZhanr}
              onChange={(e) => setNovyyZhanr(e.target.value)}
            />
          </label>
          <label>
            Опис
            <TextArea
              rows={3}
              placeholder="Коротко про фільм..."
              value={novyyOpys}
              onChange={(e) => setNovyyOpys(e.target.value)}
            />
          </label>
          <label>
            Посилання на постер (необов'язково)
            <Input
              placeholder="https://... (якщо порожньо — буде емодзі 🎬)"
              value={novyyPoster}
              onChange={(e) => setNovyyPoster(e.target.value)}
            />
          </label>
          <label>
            Посилання на відео (необов'язково)
            <Input
              placeholder="YouTube-посилання (якщо порожньо — автоматичний пошук)"
              value={novyyVideo}
              onChange={(e) => setNovyyVideo(e.target.value)}
            />
          </label>
        </div>
      </Modal>
    </div>
  );
}

export default Golovna;
