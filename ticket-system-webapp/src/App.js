import './App.css';
import { BrowserRouter, Routes, Route} from 'react-router-dom';
import Header from './assets/Header';
import HomePage from './pages/Home';
import CreateWalletPage from './pages/CreateWallet';
import CheckBalancePage from './pages/CheckBalance';
import PurchaseTicketPage from './pages/PurchaseTicket';
import TransferTicketPage from './pages/TransferTicket';




function App() {
  
  return (
    <div className="App">
      <BrowserRouter>
        <Header/> 
        <Routes>
          <Route index element={<HomePage/>} />
          <Route path="createWallet" element={<CreateWalletPage/>} />
          <Route path="checkBalance" element={<CheckBalancePage/>} />
          <Route path="purchaseTicket" element={<PurchaseTicketPage/>} />
          <Route path="ticketTransfer" element={<TransferTicketPage/>} />
        </Routes>
    </BrowserRouter>
    </div>
  );
}

export default App;
