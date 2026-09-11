import { BrowserRouter, Route, Routes } from "react-router-dom";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Home from "./pages/Home";
import Transactions from "./pages/Transactions";
import AddMoney from "./pages/AddMoney";
import SendMoney from "./pages/SendMoney";
import { AuthProvider } from "./context/AuthContext";

function App() {


  return <>
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<Signup />} path="/signup" />
          <Route element={<Login />} path="/login" />
          <Route element={<Home />} path="/" />
          <Route element={<Transactions />} path="/transactions" />
          <Route element={<AddMoney />} path="/add-money" />
          <Route element={<SendMoney />} path="/send" />

        </Routes>
      </BrowserRouter>
    </AuthProvider>
  </>;
}

export default App;
