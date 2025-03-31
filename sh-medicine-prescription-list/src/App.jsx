import React from "react";
import { Routes, Route, useNavigate, Navigate } from "react-router-dom";

import Home from "./component/Home";
import Main from "./component/Main";
import ListDetails from "./component/MedicineList/ListDetails";
import NewList from "./component/MedicineList/NewList";

import { AuthContext } from "./component/auth/AuthProvider";
import Registration from "./component/auth/Registration";
import Login from "./component/auth/Login";
import RequireAuth from "./component/auth/RequireAuth";
import _404 from "./component/auth/_403";


function App() {
  const auth = React.useContext(AuthContext);
  const isLoggedIn = localStorage.getItem("accessToken");

  const navigate = useNavigate();

  const handleLogout = () => {
    auth.handleLogout();
    navigate("/", { state: { message: " You have been logged out!" } });
  };

  return (
    <> 
      <Main>
        {isLoggedIn && (
          <a className="dropdown-item" href="#" onClick={handleLogout}>
            Вийти
          </a>
        )}
        <Routes>
          <Route index element={!isLoggedIn ? <Login /> : <Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Registration />} />

          <Route path="*" element={<Navigate to="/forbidden" />} />
          <Route path="/forbidden" element={<_404 />} />
          <Route
            path="/"
            element={
              <RequireAuth>
                <Home />
              </RequireAuth>
            }
          />
          <Route
            path="/:id"
            element={
              <RequireAuth>
                <Home />
              </RequireAuth>
            }
          />
          <Route
            path="/listdetails/:id"
            element={
              <RequireAuth>
                <ListDetails />
              </RequireAuth>
            }
          />
          <Route
            path="/newlist/:id"
            element={
              <RequireAuth>
                <NewList />
              </RequireAuth>
            }
          />
        </Routes>
      </Main>
    </>
  );
}

export default App;
