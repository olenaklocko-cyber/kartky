import "./Vihtuk.css";

function Vihtuk({ imya, ocinka, tekst, data }) {
  return (
    <div className="vihtuk">
      <div className="vihtuk-verh">
        <div className="vihtuk-avatare">👤</div>
        <div>
          <h3 className="vihtuk-imya">{imya}</h3>
          <span className="vihtuk-data">{data}</span>
        </div>
        <div className="vihtuk-ocinka">
          {"⭐".repeat(ocinka)}
        </div>
      </div>
      <p className="vihtuk-tekst">{tekst}</p>
    </div>
  );
}

export default Vihtuk;
