import { useApi } from "../contexts/Api";
import { useAuthkey } from "../contexts/Authkey";
import { Outlet, Link } from "react-router-dom";

const Root = () => {
  const { authkey, connected } = useAuthkey();
  const { signIn, logOut } = useApi();

  return (
    <div className="container">
      <nav className="header">
        <Link to="/">
          <h1 className="title">Secure book wishlist</h1>
        </Link>
        <div className="header-buttons">
          {!connected ? (
            <>
              <Link to="signin">
                <div className="header-button sign-in">Sign In</div>
              </Link>
              <Link to="signup">
                <div className="header-button sign-up">Sign Up</div>
              </Link>
            </>
          ) : (
            <div className="header-button log-out" onClick={() => logOut()}>
              Log Out
            </div>
          )}
        </div>
      </nav>
      <div className="content">
        <Outlet />
      </div>
    </div>
  );
};

export default Root;
