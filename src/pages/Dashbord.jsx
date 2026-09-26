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
  Table,
} from "antd";
import {
  ArrowLeftOutlined,
  HeartFilled,
  MessageFilled,
  VideoCameraOutlined,
  StarFilled,
  BarChartOutlined,
  PlayCircleOutlined,
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
  const zhanryData = Object.keys(zhanryMap);
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

  // Таблиця фільмів
  const kolonky = [
    {
      title: "",
      dataIndex: "obraz",
      key: "obraz",
      width: 60,
      render: (obraz, record) =>
        record.poster ? (
          <img className="tablycia-poster" src={record.poster} alt="" />
        ) : (
          <span className="tablycia-obraz">{obraz}</span>
        ),
    },
    {
      title: "Назва",
      dataIndex: "nazva",
      key: "nazva",
      sorter: (a, b) => a.nazva.localeCompare(b.nazva, "uk"),
    },
    {
      title: "Жанр",
      dataIndex: "zhanr",
      key: "zhanr",
      filters: zhanryData.map((z) => ({ text: z, value: z })),
      onFilter: (value, record) => record.zhanr === value,
      render: (zhanr) => <Tag color="geekblue">{zhanr}</Tag>,
    },
    {
      title: "Лайки",
      key: "laiky",
      width: 100,
      sorter: (a, b) => a.laiky - b.laiky,
      defaultSortOrder: "descend",
      render: (_, record) => (
        <span className="tablycia-lajky">
          <HeartFilled style={{ color: "#ff6b81" }} /> {record.laiky}
        </span>
      ),
    },
    {
      title: "",
      key: "diya",
      width: 110,
      render: (_, record) => (
        <Button
          type="primary"
          size="small"
          icon={<PlayCircleOutlined />}
          href={record.youtube}
          target="_blank"
          rel="noreferrer"
          onClick={(e) => e.stopPropagation()}
        >
          Дивитись
        </Button>
      ),
    },
  ];

  const daniTablyci = filmy.map((f) => ({
    ...f,
    laiky: laiky[f.id] || 0,
  }));

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

      {/* Статистика */}
      <Row gutter={[16, 16]} className="statystyka">
        <Col xs={12} md={6}>
          <Card>
            <Statistic
              title="Фільмів"
              value={filmy.length}
              prefix={<VideoCameraOutlined />}
            />
          </Card>
        </Col>
        <Col xs={12} md={6}>
          <Card>
            <Statistic
              title="Лайків"
              value={vsiLajky}
              prefix={<HeartFilled style={{ color: "#ff6b81" }} />}
            />
          </Card>
        </Col>
        <Col xs={12} md={6}>
          <Card>
            <Statistic
              title="Відгуків"
              value={vihtuky.length}
              prefix={<MessageFilled style={{ color: "#764ba2" }} />}
            />
          </Card>
        </Col>
        <Col xs={12} md={6}>
          <Card>
            <Statistic
              title="Середня оцінка"
              value={serednyaOcinka}
              precision={1}
              suffix="/ 5"
              prefix={<StarFilled style={{ color: "#f6b93b" }} />}
            />
          </Card>
        </Col>
      </Row>

      {/* Перелік фільмів */}
      <Card
        className="grafik-kartka"
        title={
          <>
            <VideoCameraOutlined style={{ color: "#667eea" }} /> Усі фільми (
            {filmy.length}) — можна сортувати та фільтрувати
          </>
        }
      >
        <Table
          columns={kolonky}
          dataSource={daniTablyci}
          rowKey="id"
          pagination={false}
          onRow={(record) => ({
            onClick: () => navigate(`/film/${record.id}`),
            style: { cursor: "pointer" },
          })}
        />
      </Card>

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
