import style from "./CircularProgress.module.css";

const CircularProgress = ({ progress = 0 }: { progress?: number }) => {
  return (
    <div
      className={style.circularProgress}
      style={{
        width: "max(1cap, 20px)",
        height: "max(1cap, 20px)",
        background: `conic-gradient(from 0deg, #fff ${progress}%, transparent ${
          progress * 1.7
        }%)`,
      }}
    ></div>
  );
};

export default CircularProgress;
