import style from "./Loader.module.css";

const Loader = () => {
  return (
    <div
      className={style.loader}
      style={{
        width: "max(1cap, 20px)",
      }}
    ></div>
  );
};

export default Loader;
