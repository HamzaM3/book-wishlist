import { useApi } from "../contexts/Api";
import { useAuthkey } from "../contexts/Authkey";
import { Formik, Form, Field } from "formik";
import { Navigate } from "react-router-dom";

const AddBook = () => {
  const { addBook } = useApi();
  const { connected } = useAuthkey();

  if (!connected) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="sign-in-form">
      <Formik
        initialValues={{
          title: "",
          author: "",
        }}
        onSubmit={async ({ title, author }, { resetForm }) => {
          addBook({ title, author });
          resetForm();
        }}
      >
        <Form>
          <div className="form-title">Add Book</div>
          <div className="form-field">
            <div className="form-label">Title:</div>
            <Field
              id="title"
              name="title"
              placeholder="A book with a lot of wisdom"
            />
          </div>
          <div className="form-field">
            <div className="form-label">Author:</div>
            <Field
              id="author"
              name="author"
              placeholder="Some incredible writer"
            />
          </div>
          <button type="submit">Add Book</button>
        </Form>
      </Formik>
    </div>
  );
};

export default AddBook;
