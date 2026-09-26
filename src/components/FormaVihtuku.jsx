import { useState } from "react";
import { Input, Button, Rate, Alert } from "antd";
import { SendOutlined } from "@ant-design/icons";
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
        <Input
          size="large"
          value={imya}
          onChange={(e) => setImya(e.target.value)}
          placeholder="Наприклад, Олена"
          status={pomylky.imya ? "error" : ""}
        />
        {pomylky.imya && (
          <span className="tekst-pomylky">{pomylky.imya}</span>
        )}
      </div>

      {/* Оцінка зірками — antd Rate */}
      <div className="pole">
        <label>Оцінка</label>
        <Rate
          value={ocinka}
          onChange={setOcinka}
          style={{ fontSize: 32 }}
        />
        {pomylky.ocinka && (
          <span className="tekst-pomylky">{pomylky.ocinka}</span>
        )}
      </div>

      {/* Текст відгуку */}
      <div className="pole">
        <label>Ваш відгук</label>
        <Input.TextArea
          value={tekst}
          onChange={(e) => setTekst(e.target.value)}
          placeholder="Поділіться своїми враженнями..."
          rows={4}
          maxLength={500}
          showCount
          status={pomylky.tekst ? "error" : ""}
        />
        {pomylky.tekst && (
          <span className="tekst-pomylky">{pomylky.tekst}</span>
        )}
      </div>

      {Object.keys(pomylky).length > 0 && (
        <Alert
          type="error"
          showIcon
          message="Виправте помилки у формі"
          className="forma-pomylka"
        />
      )}

      <Button
        type="primary"
        size="large"
        htmlType="submit"
        block
        icon={<SendOutlined />}
      >
        Надіслати відгук
      </Button>
    </form>
  );
}

export default FormaVihtuku;
