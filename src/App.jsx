import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { OffersProvider } from './context/OffersContext'
import OfferView from './pages/OfferView'
import OfferManage from './pages/OfferManage'
import OfferEdit from './pages/OfferEdit'

function App() {
  return (
    <OffersProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/offer/:id" element={<OfferView />} />
          <Route path="/manage/offer" element={<OfferManage />} />
          <Route path="/manage/offer/:id" element={<OfferEdit />} />
          <Route path="/" element={<Navigate to="/manage/offer" replace />} />
        </Routes>
      </BrowserRouter>
    </OffersProvider>
  )
}

export default App

