import { useApi } from "../contexts/Api";
import { useAuthkey } from "../contexts/Authkey";
import { Outlet, Link } from "react-router-dom";
import { css } from "@emotion/react";

const layoutStyle = css`
  margin: 0;
  padding: 0;

  min-height: 100vh;
  background: #ec8c4b;

  font-family: sans-serif;

  display: flex;
  flex-direction: column;
  align-items: stretch;
  justify-content: stretch;
`;

const headerStyle = css`
  padding: 20px 30px;
  border-bottom: 1px solid #3a2212;

  font-size: 20px;

  display: flex;
  justify-content: space-between;
  align-items: center;

  flex-grow: 0;
  flex-shrink: 0;
`;

const titleStyle = css`
  margin: 0;
  font-weight: 800;
  font-size: 24px;
  font-family: sans-serif;
`;

const buttonsGroupStyle = css`
  font-size: 18px;
  display: flex;
  gap: 20px;
  cursor: pointer;
`;

const buttonStyle = (background) => css`
  border: 1px solid #3a2212;
  border-radius: 10px;
  padding: 5px 10px;
  background: ${background};
`;

const contentStyle = css`
  padding: 20px 0;

  flex-grow: 1;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const Root = () => {
  const { authkey, connected } = useAuthkey();
  const { signIn, logOut } = useApi();

  return (
    <div css={layoutStyle}>
      <nav css={headerStyle}>
        <Link to="/">
          <h1 css={titleStyle}>Secure book wishlist</h1>
        </Link>
        <div css={buttonsGroupStyle}>
          {!connected ? (
            <>
              <Link to="signin">
                <div css={buttonStyle("#ebae9b")}>Sign In</div>
              </Link>
              <Link to="signup">
                <div css={buttonStyle("#ffe6d3")}>Sign Up</div>
              </Link>
            </>
          ) : (
            <>
              <Link to="addbook">
                <div css={buttonStyle("#ffe6d3")}>Add Book</div>
              </Link>
              <div css={buttonStyle("#ebae9b")} onClick={() => logOut()}>
                Log Out
              </div>
            </>
          )}
        </div>
      </nav>
      <div css={contentStyle}>
        <Outlet />
      </div>
    </div>
  );
};

export default Root;
