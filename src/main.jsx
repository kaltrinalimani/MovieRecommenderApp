import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.scss";
import { persistor, store } from "./store/store";
import { Provider } from "react-redux"; // Importing the Provider component from react-redux to make the store available to the entire app
import { PersistGate } from "redux-persist/integration/react"; // Importing the PersistGate component to delay rendering until rehydration is complete

ReactDOM.createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <PersistGate loading={"loading"} persistor={persistor}>
      <App />
    </PersistGate>
  </Provider>
);
