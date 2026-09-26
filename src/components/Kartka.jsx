import { Card, Button, Tag } from "antd";
import { HeartFilled, HeartOutlined } from "@ant-design/icons";
import "./Kartka.css";

function Kartka({ obraz, poster, nazva, opys, zhanr, laiky, naLajk }) {
  return (
    <Card
      className="kartka"
      hoverable
      cover={
        <div className="kartka-obraz">
          {poster ? (
            <img className="kartka-poster" src={poster} alt={nazva} />
          ) : (
            obraz
          )}
        </div>
      }
      actions={[
        <Tag key="zhanr" color="geekblue" className="kartka-zhanr-tag">
          {zhanr}
        </Tag>,
        <Button
          key="lajk"
          type={laiky > 0 ? "primary" : "text"}
          danger={laiky > 0}
          icon={laiky > 0 ? <HeartFilled /> : <HeartOutlined />}
          onClick={naLajk}
        >
          {laiky}
        </Button>,
      ]}
    >
      <h2 className="kartka-nazva">{nazva}</h2>
      <p className="kartka-opys">{opys}</p>
    </Card>
  );
}

export default Kartka;
