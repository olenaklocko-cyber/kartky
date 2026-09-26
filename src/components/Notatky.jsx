import { useState, useEffect } from "react";
import { Button, Input, Popconfirm, Empty, Spin } from "antd";
import {
  LogoutOutlined,
  CloudUploadOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import supabase from "../supabase";
import "./Notatky.css";

function Notatky({ korystuvach, naVykhid }) {
  const [notatky, setNotatky] = useState([]);
  const [tekst, setTekst] = useState("");
  const [zavantazhennya, setZavantazhennya] = useState(true);
  const [nadtyska, setNadtyska] = useState(false);

  const zavantatyNotatky = async () => {
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

  // Завантаження ТІЛЬКИ своїх нотаток
  useEffect(() => {
    if (!korystuvach) return;
    zavantatyNotatky();
  }, [korystuvach]);

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
        <Button
          danger
          icon={<LogoutOutlined />}
          onClick={naVykhid}
          size="large"
        >
          Вийти
        </Button>
      </div>

      {/* Форма */}
      <form className="forma-notatky" onSubmit={dodatyNotatku}>
        <Input.TextArea
          placeholder="Напишіть нотатку..."
          value={tekst}
          onChange={(e) => setTekst(e.target.value)}
          rows={3}
          maxLength={500}
          showCount
        />
        <Button
          type="primary"
          htmlType="submit"
          block
          size="large"
          loading={nadtyska}
          disabled={!tekst.trim()}
          icon={<CloudUploadOutlined />}
        >
          Зберегти в хмару
        </Button>
      </form>

      {/* Список */}
      {zavantazhennya ? (
        <div className="zavantazhennya-notatok">
          <Spin size="large" />
        </div>
      ) : notatky.length === 0 ? (
        <Empty description="Ще немає нотаток. Додайте першу! ✨" />
      ) : (
        <div className="spysok-notatok">
          {notatky.map((n) => (
            <div key={n.id} className="notatka">
              <div className="notatka-verh">
                <span className="notatka-data">
                  {new Date(n.stvoreno).toLocaleDateString("uk-UA")}
                </span>
                <Popconfirm
                  title="Видалити нотатку?"
                  okText="Так"
                  cancelText="Ні"
                  onConfirm={() => vydaluty(n.id)}
                >
                  <Button
                    type="text"
                    danger
                    size="small"
                    icon={<DeleteOutlined />}
                  />
                </Popconfirm>
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
