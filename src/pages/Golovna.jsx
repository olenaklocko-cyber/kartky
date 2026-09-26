import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Input, Button, Space, Modal, message, Alert, Card } from "antd";
import {
  SearchOutlined,
  BarChartOutlined,
  MessageFilled,
  PlusOutlined,
  GlobalOutlined,
  CloudDownloadOutlined,
} from "@ant-design/icons";
import supabase from "../supabase";
import Kartka from "../components/Kartka";
import FormaVihtuku from "../components/FormaVihtuku";
import Vihtuk from "../components/Vihtuk";
import Notatky from "../components/Notatky";
import Vhid from "../components/Vhid";
import { poshuk as zbuduvatyPoshuk, novyiId } from "../data/filmy";
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

  // Пошук фільмів в інтернеті (через Wikipedia)
  const [internetPoshuk, setInternetPoshuk] = useState("");
  const [internetRezultaty, setInternetRezultaty] = useState([]);
  const [shukayut, setShukayut] = useState(false);
  const [pomylka, setPomylka] = useState("");

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
      id: novyiId(),
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

  // Пошук фільмів в інтернеті (Wikipedia — відкрите API, без ключів)
  const shukatyVInterneti = async () => {
    const zapyt = internetPoshuk.trim();
    if (!zapyt) {
      message.warning("Введіть назву для пошуку в інтернеті");
      return;
    }
    setShukayut(true);
    setPomylka("");
    setInternetRezultaty([]);
    try {
      const shukaty = async (host, zapit) => {
        const url =
          `https://${host}/w/api.php?action=query&generator=search` +
          `&gsrsearch=${encodeURIComponent(zapit)}` +
          "&gsrlimit=6&prop=pageimages|extracts&piprop=thumbnail" +
          "&pithumbsize=400&pilicense=any" +
          "&exintro=1&explaintext=1&exsentences=2&format=json&origin=*";
        const vidpovid = await fetch(url);
        const dani = await vidpovid.json();
        return dani?.query?.pages ? Object.values(dani.query.pages) : [];
      };

      // Послідовність спроб: англійська → англ. без «film» → українська
      let storinky = await shukaty("en.wikipedia.org", `${zapyt} film`);
      if (storinky.length === 0) {
        storinky = await shukaty("en.wikipedia.org", zapyt);
      }
      if (storinky.length === 0) {
        storinky = await shukaty("uk.wikipedia.org", zapyt);
      }

      setInternetRezultaty(
        storinky.map((s) => ({
          nazva: s.title.replace(/ \(.*\)$/, ""),
          opys: s.extract || "Опис з Вікіпедії.",
          poster: s.thumbnail?.source || "",
        }))
      );
      if (storinky.length === 0) {
        setPomylka("Нічого не знайдено. Спробуйте іншу назву.");
      }
    } catch {
      setPomylka("Не вдалося з'єднатися з інтернетом. Спробуйте ще раз.");
    } finally {
      setShukayut(false);
    }
  };

  // Додавання фільму з результатів інтернет-пошуку
  const dodatyZInternetu = (rezultat) => {
    dodatyFilm({
      id: novyiId(),
      obraz: "🎬",
      nazva: rezultat.nazva,
      opys: rezultat.opys,
      zhanr: "Інше",
      poster: rezultat.poster,
      youtube: zbuduvatyPoshuk(rezultat.nazva),
      dyvytysya: zbuduvatyPoshuk(rezultat.nazva),
    });
    message.success(`«${rezultat.nazva}» додано до каталогу!`);
    setInternetRezultaty((p) => p.filter((r) => r.nazva !== rezultat.nazva));
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

      {/* 🔍 Розширений пошук в інтернеті */}
      <div className="internet-poshuk">
        <h2 className="zagolovok-sekciyi">
          <GlobalOutlined style={{ color: "#667eea" }} /> Знайти фільм в
          інтернеті
        </h2>
        <div className="internet-panel">
          <Input
            size="large"
            prefix={<SearchOutlined />}
            allowClear
            placeholder="Введіть назву фільму для пошуку в інтернеті..."
            value={internetPoshuk}
            onChange={(e) => setInternetPoshuk(e.target.value)}
            onPressEnter={shukatyVInterneti}
          />
          <Button
            type="primary"
            size="large"
            icon={<CloudDownloadOutlined />}
            loading={shukayut}
            onClick={shukatyVInterneti}
          >
            Знайти в інтернеті
          </Button>
        </div>

        {pomylka && <Alert type="warning" showIcon message={pomylka} />}

        {internetRezultaty.length > 0 && (
          <div className="internet-rezultaty">
            {internetRezultaty.map((r) => (
              <Card
                key={r.nazva}
                className="internet-kartka"
                hoverable
                cover={
                  r.poster ? (
                    <img
                      className="internet-poster"
                      src={r.poster}
                      alt={r.nazva}
                    />
                  ) : (
                    <div className="internet-poster-nema">🎬</div>
                  )
                }
              >
                <h3>{r.nazva}</h3>
                <p className="internet-opys">{r.opys}</p>
                <Button
                  type="primary"
                  block
                  icon={<PlusOutlined />}
                  onClick={() => dodatyZInternetu(r)}
                >
                  Додати до каталогу
                </Button>
              </Card>
            ))}
          </div>
        )}
      </div>

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
