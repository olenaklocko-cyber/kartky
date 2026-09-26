import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Card,
  Row,
  Col,
  Statistic,
  Button,
  Empty,
  Tag,
  Alert,
  Modal,
  List,
  Avatar,
  Rate,
} from "antd";
import {
  ArrowLeftOutlined,
  HeartFilled,
  MessageFilled,
  VideoCameraOutlined,
  StarFilled,
  BarChartOutlined,
  RightOutlined,
} from "@ant-design/icons";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
  CartesianGrid,
} from "recharts";
import filmy from "../data/filmy";
import "./Dashbord.css";

const FARBY = ["#667eea", "#764ba2", "#ff6b81", "#f6b93b", "#2ed573", "#54a0ff"];

function Dashbord({ laiky, vihtuky, naLajk }) {
  const navigate = useNavigate();
  // Яка картка статистики відкрита: null | filmy | laiky | vihtuky | ocinka
  const [vidkryty, setVidkryty] = useState(null);

  // Дані для графіка лайків — міняється разом з laiky
  const daniLajkiv = filmy.map((f) => ({
    nazva: f.nazva,
    laiky: laiky[f.id] || 0,
  }));

  // Розподіл фільмів за жанрами
  const zhanryMap = {};
  filmy.forEach((f) => {
    zhanryMap[f.zhanr] = (zhanryMap[f.zhanr] || 0) + 1;
  });
  const daniZhanriv = Object.entries(zhanryMap).map(([nazva, kilkist]) => ({
    nazva,
    kilkist,
  }));

  // Розподіл відгуків за оцінками — міняється разом з vihtuky
  const daniOcinkok = [1, 2, 3, 4, 5].map((o) => ({
    nazva: `${o} ${o === 1 ? "зірка" : o < 5 ? "зірки" : "зірок"}`,
    kilkist: vihtuky.filter((v) => v.ocinka === o).length,
  }));

  // Статистика
  const vsiLajky = Object.values(laiky).reduce((s, n) => s + n, 0);
  const serednyaOcinka = vihtuky.length
    ? (vihtuky.reduce((s, v) => s + v.ocinka, 0) / vihtuky.length).toFixed(1)
    : 0;

  // Дані для модалок
  const filmyPosortovani = [...filmy]
    .map((f) => ({ ...f, kilkistLaikiv: laiky[f.id] || 0 }))
    .sort((a, b) => b.kilkistLaikiv - a.kilkistLaikiv);
  const maksLaikiv = Math.max(...filmyPosortovani.map((f) => f.kilkistLaikiv), 1);

  // Заголовки модалок
  const zagolovky = {
    filmy: `🎬 Усі фільми (${filmy.length})`,
    laiky: `❤️ Рейтинг лайків — хто лідер?`,
    vihtuky: `💬 Відгуки (${vihtuky.length})`,
    ocinka: `⭐ Середня оцінка ${serednyaOcinka} / 5`,
  };

  // Вміст модалок
  const vmistModalky = () => {
    if (vidkryty === "filmy") {
      return (
        <List
          dataSource={filmy}
          renderItem={(f) => (
            <List.Item
              className="spysok-ryadok"
              onClick={() => {
                setVidkryty(null);
                navigate(`/film/${f.id}`);
              }}
            >
              <List.Item.Meta
                avatar={
                  <img className="spysok-poster" src={f.poster} alt="" />
                }
                title={f.nazva}
                description={
                  <>
                    <Tag color="geekblue">{f.zhanr}</Tag>{" "}
                    <span className="spysok-laiky">
                      <HeartFilled style={{ color: "#ff6b81" }} />{" "}
                      {laiky[f.id] || 0}
                    </span>
                  </>
                }
              />
              <RightOutlined style={{ color: "#bbb" }} />
            </List.Item>
          )}
        />
      );
    }

    if (vidkryty === "laiky") {
      if (vsiLajky === 0) {
        return (
          <Empty description="Поки що лайків немає. Натисніть ♥ у каталозі!" />
        );
      }
      return (
        <div className="rejtyng-laikiv">
          {filmyPosortovani.map((f, i) => (
            <div key={f.id} className="rejtyng-ryadok">
              <span className="rejtyng-misto">
                {i === 0 ? "👑" : `${i + 1}.`}
              </span>
              <span className="rejtyng-nazva">{f.nazva}</span>
              <div className="rejtyng-smuzhok">
                <div
                  className="rejtyng-zapovnennya"
                  style={{
                    width: `${(f.kilkistLaikiv / maksLaikiv) * 100}%`,
                    background: FARBY[i % FARBY.length],
                  }}
                />
              </div>
              <span className="rejtyng-chyslo">
                <HeartFilled style={{ color: "#ff6b81" }} />{" "}
                {f.kilkistLaikiv}
              </span>
            </div>
          ))}
        </div>
      );
    }

    if (vidkryty === "vihtuky") {
      if (vihtuky.length === 0) {
        return (
          <Empty
            description={
              <span>
                Ще немає відгуків.{" "}
                <Link to="/" onClick={() => setVidkryty(null)}>
                  Залиште перший
                </Link>
                !
              </span>
            }
          />
        );
      }
      return (
        <List
          dataSource={vihtuky}
          renderItem={(v) => (
            <List.Item>
              <List.Item.Meta
                avatar={<Avatar style={{ background: "#667eea" }}>{v.imya[0]}</Avatar>}
                title={
                  <>
                    {v.imya} <Rate disabled value={v.ocinka} />{" "}
                    <span className="vihtuk-data">{v.data}</span>
                  </>
                }
                description={v.tekst}
              />
            </List.Item>
          )}
        />
      );
    }

    if (vidkryty === "ocinka") {
      if (vihtuky.length === 0) {
        return <Empty description="Немає оцінок — станьте першим!" />;
      }
      return (
        <div className="rejtyng-laikiv">
          <div className="serednya-velyka">
            {serednyaOcinka} <span>/ 5</span>
          </div>
          {[5, 4, 3, 2, 1].map((o) => {
            const kilkist = vihtuky.filter((v) => v.ocinka === o).length;
            const chastka = (kilkist / vihtuky.length) * 100;
            return (
              <div key={o} className="rejtyng-ryadok">
                <span className="rejtyng-misto">{o} ★</span>
                <div className="rejtyng-smuzhok">
                  <div
                    className="rejtyng-zapovnennya"
                    style={{
                      width: `${chastka}%`,
                      background: "#f6b93b",
                    }}
                  />
                </div>
                <span className="rejtyng-chyslo">{kilkist}</span>
              </div>
            );
          })}
        </div>
      );
    }

    return null;
  };

  return (
    <div className="dashbord">
      <div className="dashbord-shapka">
        <div>
          <h1>
            <BarChartOutlined /> Дашборд
          </h1>
          <p>Статистика каталогу та графіки за вашими даними</p>
        </div>
        <Link to="/">
          <Button icon={<ArrowLeftOutlined />} size="large">
            До каталогу
          </Button>
        </Link>
      </div>

      {/* Статистика — натискаються! */}
      <Row gutter={[16, 16]} className="statystyka">
        <Col xs={12} md={6}>
          <Card
            className="stat-kartka"
            onClick={() => setVidkryty("filmy")}
            hoverable
          >
            <Statistic
              title="Фільмів"
              value={filmy.length}
              prefix={<VideoCameraOutlined />}
            />
            <span className="stat-pidkazka">
              Подивитись список <RightOutlined />
            </span>
          </Card>
        </Col>
        <Col xs={12} md={6}>
          <Card
            className="stat-kartka"
            onClick={() => setVidkryty("laiky")}
            hoverable
          >
            <Statistic
              title="Лайків"
              value={vsiLajky}
              prefix={<HeartFilled style={{ color: "#ff6b81" }} />}
            />
            <span className="stat-pidkazka">
              Рейтинг фільмів <RightOutlined />
            </span>
          </Card>
        </Col>
        <Col xs={12} md={6}>
          <Card
            className="stat-kartka"
            onClick={() => setVidkryty("vihtuky")}
            hoverable
          >
            <Statistic
              title="Відгуків"
              value={vihtuky.length}
              prefix={<MessageFilled style={{ color: "#764ba2" }} />}
            />
            <span className="stat-pidkazka">
              Читати відгуки <RightOutlined />
            </span>
          </Card>
        </Col>
        <Col xs={12} md={6}>
          <Card
            className="stat-kartka"
            onClick={() => setVidkryty("ocinka")}
            hoverable
          >
            <Statistic
              title="Середня оцінка"
              value={serednyaOcinka}
              precision={1}
              suffix="/ 5"
              prefix={<StarFilled style={{ color: "#f6b93b" }} />}
            />
            <span className="stat-pidkazka">
              Розподіл оцінок <RightOutlined />
            </span>
          </Card>
        </Col>
      </Row>

      {/* Модалка зі деталями */}
      <Modal
        title={zagolovky[vidkryty]}
        open={vidkryty !== null}
        onCancel={() => setVidkryty(null)}
        footer={
          <Button type="primary" onClick={() => setVidkryty(null)}>
            Закрити
          </Button>
        }
        width={560}
      >
        {vmistModalky()}
      </Modal>

      {/* Графік 1 — лайки за фільмами */}
      <Card
        className="grafik-kartka"
        title={
          <>
            <HeartFilled style={{ color: "#ff6b81" }} /> Лайки за фільмами
          </>
        }
      >
        <Alert
          type="info"
          showIcon
          message="Живий графік: натисніть кнопку під діаграмою — і стовпчик одразу виросте!"
          className="pidkazka"
        />
        <div className="grafik">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={daniLajkiv}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="nazva"
                angle={-20}
                textAnchor="end"
                height={70}
                interval={0}
                fontSize={12}
              />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="laiky" name="Лайки">
                {daniLajkiv.map((_, i) => (
                  <Cell key={i} fill={FARBY[i % FARBY.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="knopky-lajkiv">
          {filmy.map((f) => (
            <Button
              key={f.id}
              icon={<HeartFilled />}
              onClick={() => naLajk(f.id)}
            >
              {f.nazva} · {laiky[f.id] || 0}
            </Button>
          ))}
        </div>
      </Card>

      <Row gutter={[16, 16]}>
        {/* Графік 2 — жанри */}
        <Col xs={24} lg={12}>
          <Card
            className="grafik-kartka"
            title={
              <>
                <VideoCameraOutlined style={{ color: "#667eea" }} /> Фільми за
                жанрами
              </>
            }
          >
            <div className="grafik">
              <ResponsiveContainer width="100%" height={280}>
                <PieChart>
                  <Pie
                    data={daniZhanriv}
                    dataKey="kilkist"
                    nameKey="nazva"
                    outerRadius={100}
                    label
                  >
                    {daniZhanriv.map((_, i) => (
                      <Cell key={i} fill={FARBY[i % FARBY.length]} />
                    ))}
                  </Pie>
                  <Legend />
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </Col>

        {/* Графік 3 — оцінки відгуків */}
        <Col xs={24} lg={12}>
          <Card
            className="grafik-kartka"
            title={
              <>
                <StarFilled style={{ color: "#f6b93b" }} /> Оцінки відгуків
              </>
            }
          >
            {vihtuky.length === 0 ? (
              <Empty
                description={
                  <span>
                    Ще немає відгуків.{" "}
                    <Link to="/">Додайте перший</Link> — і графік оживе!
                  </span>
                }
              />
            ) : (
              <div className="grafik">
                <ResponsiveContainer width="100%" height={280}>
                  <BarChart data={daniOcinkok}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="nazva" fontSize={12} />
                    <YAxis allowDecimals={false} />
                    <Tooltip />
                    <Bar dataKey="kilkist" name="Кількість" fill="#f6b93b" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </Card>
        </Col>
      </Row>

      {/* Підказка про дані */}
      <Alert
        type="success"
        showIcon
        className="pidkazka"
        message="Усі дані спільні з головною сторінкою"
        description={
          <>
            Поставте лайк у <Tag color="purple">каталозі</Tag> або залиште
            відгук — поверніться сюди, і діаграми будуть іншими. Дані живуть у
            стані застосунку (React useState), тож переживають перехід між
            сторінками.
          </>
        }
      />
    </div>
  );
}

export default Dashbord;
