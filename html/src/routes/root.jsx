import axios from "axios";
import { signIn } from "../api";

const Root = () => {
  return (
    <button onClick={() => signIn("user2", "password1")}>Test the api</button>
  );
};

export default Root;
