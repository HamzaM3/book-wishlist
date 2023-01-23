import { useApi } from "../contexts/Api";
import { useAuthkey } from "../contexts/Authkey";
import { Outlet, Link } from "react-router-dom";

const Root = () => {
  const { authkey, connected } = useAuthkey();
  const { signIn, logOut } = useApi();

  return (
    <div>
      <nav>
        <Link to="/">
          <h5>Secure book wishlist</h5>
        </Link>
        {connected ? (
          <div>
            <Link to="signin">
              <button>Sign In</button>
            </Link>
            <Link to="signup">
              <button>Sign Up</button>
            </Link>
          </div>
        ) : (
          <div>
            <button onClick={() => logOut()}>Log Out</button>
          </div>
        )}
      </nav>

      <Outlet />
    </div>
  );
};

export default Root;
