import { css } from "@emotion/react";

const welcomeStyle = css`
  font-weight: 600;
  font-size: 40px;
  text-align: right;
`;

const Welcome = () => {
  return <div css={welcomeStyle}>Create your secure book wishlist !</div>;
};

export default Welcome;
