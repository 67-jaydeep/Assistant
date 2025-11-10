import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import MainLayout from "./components/MainLayout";
import Dashboard from "./pages/Dashboard";
import Tasks from "./pages/Tasks";
import Notes from "./pages/Notes";
import Expenses from "./pages/Expenses";
import Habits from "./pages/Habits";
import Login from "./pages/Login";
import SignUp from "./pages/Signup";
import PrivateRoute from "./components/PrivateRoute";

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />

        {/* Default route redirects to dashboard */}
        <Route
          path="/"
          element={
            <PrivateRoute>
              <MainLayout>
                <Dashboard />
              </MainLayout>
            </PrivateRoute>
          }
        />

        {/* Protected Routes */}
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <MainLayout>
                <Dashboard />
              </MainLayout>
            </PrivateRoute>
          }
        />
        <Route
          path="/tasks"
          element={
            <PrivateRoute>
              <MainLayout>
                <Tasks />
              </MainLayout>
            </PrivateRoute>
          }
        />
        <Route
          path="/notes"
          element={
            <PrivateRoute>
              <MainLayout>
                <Notes />
              </MainLayout>
            </PrivateRoute>
          }
        />
        <Route
          path="/expenses"
          element={
            <PrivateRoute>
              <MainLayout>
                <Expenses />
              </MainLayout>
            </PrivateRoute>
          }
        />
        <Route
          path="/habits"
          element={
            <PrivateRoute>
              <MainLayout>
                <Habits />
              </MainLayout>
            </PrivateRoute>
          }
        />

        {/* Catch-all route */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
