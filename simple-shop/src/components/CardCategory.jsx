export default function CardCategory(props) {
  const { category } = props;
  return (
    <div className="container">
      <div className="card" style={{ width: "6rem", height: "10rem" }}>
        <img
          src={category.imgUrl}
          className="card-img-top"
          alt={category.name}
        />
        <div className="card-body">
          <h6 className="card-title text-center"
          style={{ fontSize: "0.8rem" }}
          >{category.name}</h6>
        </div>
      </div>
    </div>
  );
}
