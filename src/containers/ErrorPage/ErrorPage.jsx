import { useRouteError } from "react-router-dom";

export default function ErrorPage() {
  const error = useRouteError();
  console.error(error);

  return (
    <div id="error-page">
      <h1>oops!</h1>
      <p>sorry, an unexpected error has occurred</p>
      <p>
        <i>{error.status + ": " + error.statusText}</i>
      </p>
    </div>
  );
}