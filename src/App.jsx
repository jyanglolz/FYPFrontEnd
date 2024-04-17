import "./App.css";
// import "./index.css";
import {BrowserRouter, Route, Routes} from "react-router-dom";
import { useState } from "react";
import NavBar from "./components/navbar.jsx";
import HomePage from "./pages/HomePage.jsx";
import SignUpPage from "./pages/signup.jsx";
import AdminSignUpPage from "./pages/adminsignup.jsx";
import SignInPage from "./pages/signin.jsx";
import VerifyPage from "./pages/verify.jsx";
import TaskPage from "./pages/task.jsx";
import TemplatePage from "./pages/template.jsx";
import AdminPage from "./pages/admin.jsx";
import DashboardPage from "./pages/dashboard.jsx";

const App = () => {
    const [user, setUser] = useState(null);

    const handleLogin = (userData) => {
        setUser(userData);
    };

    const handleLogout = () => {
        // Additional: Perform any actions needed after logout
        setUser(null);
    };

    return (
        <BrowserRouter>
            <NavBar onLogout={handleLogout} />
            <Routes>
                <Route path="/" element={<HomePage/>}/>
                <Route path="/signup" element={<SignUpPage/>}/>
                <Route path="/adminsignup" element={<AdminSignUpPage/>}/>
                <Route path="/signin" element={<SignInPage onLogin={handleLogin} />}/>
                <Route path="/verify" element={<VerifyPage/>}/>
                <Route path="/dashboard" element={<DashboardPage/>}/>
                <Route path="/task" element={<TaskPage/>}/>
                <Route path="/template" element={<TemplatePage/>}/>
                <Route path="/admin" element={<AdminPage/>}/>
            </Routes>
        </BrowserRouter>
    );
}

export default App;
