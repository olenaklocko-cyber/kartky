import "./Kartka.css";

function Kartka({ obraz, nazva, opys, zhanr, laiky, naLajk }) {
  return (
    <div className="kartka">
      <div className="kartka-obraz">{obraz}</div>
      <div className="kartka-vmist">
        <div className="kartka-verh">
          <span className="kartka-zhanr">{zhanr}</span>
          <button
            className={`kartka-lajk ${laiky > 0 ? "aktivnyj" : ""}`}
            onClick={naLajk}
          >
            ❤️ {laiky}
          </button>
        </div>
        <h2 className="kartka-nazva">{nazva}</h2>
        <p className="kartka-opys">{opys}</p>
      </div>
    </div>
  );
}

export default Kartka;
