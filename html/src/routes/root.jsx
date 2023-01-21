import axios from "axios";
import { signUp } from "../api";

const Root = () => {
  return (
    <button onClick={() => signUp("ussddda3dder2", "password1")}>
      Test the api
    </button>
  );
};

export default Root;
