import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import PrivateRoute from './PrivateRoute';
import SignIn from '../SignIn/SignIn';
import SignUp from '../SignUp/SignUp';
import HeaderBar from '../DashBoard/HeaderBar';
import DashBoard from '../DashBoard/Dashboard';
import Posts from '../DashBoard/Posts';
import Preview from '../DashBoard/Preview';

function Routing() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<SignUp />} />
        <Route path="/signin" element={<SignIn />} />
        <Route element={<PrivateRoute />}>
        <Route path="/dashboard" element={<HeaderBar />}>
          <Route path="display" element={<DashBoard />} />
          <Route path="posts" element={<Posts />} />
        </Route>
        <Route path="/preview/:postId" element={<Preview />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default Routing;
