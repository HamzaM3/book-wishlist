import { Formik, Form, Field } from "formik";
import { Navigate } from "react-router-dom";
import { useApi } from "../contexts/Api";
import { useAuthkey } from "../contexts/Authkey";

const SignUp = () => {
  const { connected } = useAuthkey();
  const { signUp } = useApi();
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
          signUp(username, password);
        }}
      >
        <Form>
          <div className="form-title">Sign Up</div>
          <div className="form-field">
            <div className="form-label">Username:</div>
            <Field id="username" name="username" placeholder="Username"></Field>
          </div>
          <div className="form-field">
            <div className="form-label">Password:</div>
            <Field id="password" name="password" placeholder="Password"></Field>
          </div>
          <button type="submit">Sign up</button>
        </Form>
      </Formik>
    </div>
  );
};

export default SignUp;
