import { useParams, useNavigate } from "react-router-dom";
import { Button, Tag, Descriptions, Result } from "antd";
import {
  ArrowLeftOutlined,
  PlayCircleOutlined,
  HeartOutlined,
  ShareAltOutlined,
} from "@ant-design/icons";
import filmy from "../data/filmy";
import "./Podrobnosti.css";

function Podrobnosti() {
  const { id } = useParams();
  const navigate = useNavigate();
  const film = filmy.find((f) => f.id === Number(id));

  if (!film) {
    return (
      <div className="podrobnosti">
        <Result
          status="404"
          title="404"
          subTitle="😕 Фільм не знайдено"
          extra={
            <Button
              type="primary"
              icon={<ArrowLeftOutlined />}
              onClick={() => navigate("/")}
            >
              Назад до списку
            </Button>
          }
        />
      </div>
    );
  }

  return (
    <div className="podrobnosti">
      <Button
        icon={<ArrowLeftOutlined />}
        size="large"
        onClick={() => navigate("/")}
      >
        Назад до списку
      </Button>

      <div className="kartka-filmu">
        {/* Зображення */}
        <div className="zobrazhennya-filmu">
          {film.poster ? (
            <img
              className="poster-filmu"
              src={film.poster}
              alt={film.nazva}
            />
          ) : (
            <span className="emoji">{film.obraz}</span>
          )}
        </div>

        {/* Інформація */}
        <div className="info-filmu">
          <Tag color="geekblue" className="zhanr-tag">
            {film.zhanr}
          </Tag>
          <h1>{film.nazva}</h1>
          <p className="opys">{film.opys}</p>

          {/* Деталі */}
          <Descriptions
            column={2}
            bordered
            size="small"
            className="detali-tablycia"
          >
            <Descriptions.Item label="📅 Рік">
              {film.rik || "2024"}
            </Descriptions.Item>
            <Descriptions.Item label="⭐ Рейтинг">
              {film.rejtyng || "8.5"} / 10
            </Descriptions.Item>
            <Descriptions.Item label="🎬 Жанр">
              {film.zhanr}
            </Descriptions.Item>
            <Descriptions.Item label="⏱️ Тривалість">
              {film.trivalist || "120 хв"}
            </Descriptions.Item>
          </Descriptions>

          {/* Кнопки дій */}
          <div className="diyi">
            <Button
              type="primary"
              size="large"
              icon={<PlayCircleOutlined />}
              href={film.youtube}
              target="_blank"
              rel="noreferrer"
            >
              Дивитись на YouTube
            </Button>
            <Button size="large" icon={<HeartOutlined />}>
              В обране
            </Button>
            <Button size="large" icon={<ShareAltOutlined />}>
              Поділитись
            </Button>
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
