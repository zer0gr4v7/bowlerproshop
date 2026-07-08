/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import BallSelector from "./pages/BallSelector";
import ShoeSelector from "./pages/ShoeSelector";
import Disclosure from "./pages/Disclosure";
import Privacy from "./pages/Privacy";
import Guides from "./pages/Guides";
import Partners from "./pages/Partners";
import Category from "./pages/Category";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/find-my-gear" element={<BallSelector />} />
        <Route path="/tools" element={<BallSelector />} />
        <Route path="/tools/bowling-ball-selector" element={<BallSelector />} />
        <Route path="/tools/bowling-shoe-selector" element={<ShoeSelector />} />
        <Route path="/gear/bowling-balls" element={<Category />} />
        <Route path="/gear/bowling-shoes" element={<Category />} />
        <Route path="/gear/bowling-bags" element={<Category />} />
        <Route path="/gear/bowling-accessories" element={<Category />} />
        <Route path="/guides" element={<Guides />} />
        <Route path="/guides/*" element={<Guides />} />
        <Route path="/best/*" element={<Guides />} />
        <Route path="/bowling-equipment" element={<Guides />} />
        <Route path="/bowling-supplies" element={<Guides />} />
        <Route path="/online-bowling-pro-shop" element={<Guides />} />
        <Route path="/start-here" element={<Guides />} />
        <Route path="/bowling-alleys" element={<Partners />} />
        <Route path="/pro-shops" element={<Partners />} />
        <Route path="/partners" element={<Partners />} />
        <Route path="/contact" element={<Partners />} />
        <Route path="/affiliate-disclosure" element={<Disclosure />} />
        <Route path="/disclosure" element={<Disclosure />} />
        <Route path="/privacy-policy" element={<Privacy />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="*" element={<Home />} />
      </Routes>
    </Router>
  );
}
