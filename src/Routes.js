import React from "react";
import { BrowserRouter, Routes as RouterRoutes, Route } from "react-router-dom";
import ScrollToTop from "./components/ScrollToTop";
import ErrorBoundary from "./components/ErrorBoundary";
import NotFound from "./pages/NotFound";
import Login from './pages/login';
import CameraCapture from './pages/camera-capture';
import StripCompositor from './pages/strip-compositor';
import PhotoEditing from './pages/photo-editing';
import PhotoGallery from './pages/photo-gallery';
import RosePetalsBackground from "./components/RosePetalsBackground";

const Routes = () => {
  return (
    <BrowserRouter>
      <RosePetalsBackground />
      <ErrorBoundary>
        <ScrollToTop />
        <RouterRoutes>
          {/* Root → strip selection if logged in, else login */}
          <Route path="/"                   element={<Login />} />
          <Route path="/login"              element={<Login />} />

          {/* Core photobooth flow */}
          <Route path="/strip-selection"    element={<CameraCapture />} />
          <Route path="/camera-capture"     element={<CameraCapture />} />
          <Route path="/strip-compositor"   element={<StripCompositor />} />

          {/* Photo Editing and Gallery */}
          <Route path="/photo-editing"      element={<PhotoEditing />} />
          <Route path="/photo-gallery"      element={<PhotoGallery />} />

          <Route path="*"                   element={<NotFound />} />
        </RouterRoutes>
      </ErrorBoundary>
    </BrowserRouter>
  );
};

export default Routes;