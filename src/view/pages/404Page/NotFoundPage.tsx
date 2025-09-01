import Button from "../../components/Button/Button";
import "./NotFoundPage.css";

const NotFoundPage = () => {
  return (
    <div className="page-404 section-page">
      <div className="icon">404</div>

      <div className="err-message">
        <h3>Route Not Found!</h3>
        <p>The page you are looking for does not exist.</p>
        <Button href="/" theme="borderd">
          Go Home
        </Button>
      </div>
    </div>
  );
};

export default NotFoundPage;
