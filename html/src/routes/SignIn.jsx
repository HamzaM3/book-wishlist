import { Formik, Form, Field } from "formik";
import { Navigate } from "react-router-dom";
import * as yup from "yup";
import { useApi } from "../contexts/Api";
import { useAuthkey } from "../contexts/Authkey";

const SignIn = () => {
  const { connected } = useAuthkey();
  const { signIn } = useApi();
  if (connected) {
    return <Navigate to="/" replace />;
  }
  return (
    <div className="sign-in-form">
      <Formik
        initialValues={{
          username: "",
        }}
        onSubmit={async ({ username, password }) => {
          signIn(username, password);
        }}
      >
        <Form>
          <div className="form-title">Sign In</div>
          <div className="form-field">
            <div className="form-label">Username:</div>
            <Field id="username" name="username" placeholder="Username"></Field>
          </div>
          <div className="form-field">
            <div className="form-label">Password:</div>
            <Field id="password" name="password" placeholder="Password"></Field>
          </div>
          <button type="submit">Sign in</button>
        </Form>
      </Formik>
    </div>
  );
};

export default SignIn;
