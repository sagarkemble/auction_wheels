import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import ProtectedRoute from './components/shared/ProtectedRoute';
import { ToastProvider } from './hooks/useToast';
import { ToastContainer } from './components/shared/Toast';

// Public pages
import Home from './pages/public/Home';
import Auctions from './pages/public/Auctions';
import AuctionDetail from './pages/public/AuctionDetail';
import Vehicles from './pages/public/Vehicles';
import VehicleDetail from './pages/public/VehicleDetail';
import NotFound from './pages/NotFound';

// Auth pages
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';

// Dashboards
import AdminDashboard from './pages/admin/Dashboard';
import AdminApprovals from './pages/admin/Approvals';
import VendorDashboard from './pages/vendor/Dashboard';
import CreateAuction from './pages/vendor/CreateAuction';
import SellerDashboard from './pages/seller/Dashboard';
import ListVehicle from './pages/seller/ListVehicle';
import BuyerDashboard from './pages/buyer/Dashboard';

function App() {
  return (
    <ToastProvider>
      <Router>
        <div className="min-h-screen bg-background">
          <Header />
          <main>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Home />} />
              <Route path="/auctions" element={<Auctions />} />
              <Route path="/auctions/:id" element={<AuctionDetail />} />
              <Route path="/vehicles" element={<Vehicles />} />
              <Route path="/vehicles/:id" element={<VehicleDetail />} />

              {/* Auth Routes */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

              {/* Admin Routes */}
              <Route
                path="/admin/dashboard"
                element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <AdminDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/approvals"
                element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <AdminApprovals />
                  </ProtectedRoute>
                }
              />

              {/* Vendor Routes */}
              <Route
                path="/vendor/dashboard"
                element={
                  <ProtectedRoute allowedRoles={['vendor']}>
                    <VendorDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/vendor/create-auction"
                element={
                  <ProtectedRoute allowedRoles={['vendor']}>
                    <CreateAuction />
                  </ProtectedRoute>
                }
              />

              {/* Seller Routes */}
              <Route
                path="/seller/dashboard"
                element={
                  <ProtectedRoute allowedRoles={['seller']}>
                    <SellerDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/seller/list-vehicle"
                element={
                  <ProtectedRoute allowedRoles={['seller']}>
                    <ListVehicle />
                  </ProtectedRoute>
                }
              />

              {/* Buyer Routes */}
              <Route
                path="/buyer/dashboard"
                element={
                  <ProtectedRoute allowedRoles={['buyer']}>
                    <BuyerDashboard />
                  </ProtectedRoute>
                }
              />

              {/* 404 Route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
          <Footer />
          <ToastContainer />
        </div>
      </Router>
    </ToastProvider>
  );
}

export default App;
