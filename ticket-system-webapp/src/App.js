import './App.css';
import { BrowserRouter, Routes, Route} from 'react-router-dom';
import Header from './assets/Header';
import HomePage from './pages/Home';
import CreateWalletPage from './pages/CreateWallet';
import CheckBalancePage from './pages/CheckBalance';
import PurchaseTicketPage from './pages/PurchaseTicket';
import TransferTicketPage from './pages/TransferTicket';
import { ticketAddress } from './utils/ticketAddress';
import { useState } from 'react';

function App() {

  const [userWalletAddress, setUserWalletAddress] = useState('0x6Fc02B71f5DECD64426Cf710F43Ec93EEdD13390');  
  const [ticketContractAddress, setTicketContractAddress] = useState('0x3864B4FfEbF030f65D6F2d5FF3C5DfA585d0DE93');
  
  return (
    <div className="App">
      <BrowserRouter>
        <Header/> 
        <Routes>
          <Route index element={<HomePage/>} />
          <Route path="createWallet" element={<CreateWalletPage/>} />
          <Route path="checkBalance" element={<CheckBalancePage walletAddress={userWalletAddress} setWalletAddress={setUserWalletAddress} ticketAddress={ticketAddress}/>} />
          <Route path="purchaseTicket" element={<PurchaseTicketPage userWalletAddress={userWalletAddress} ticketContractAddress={ticketContractAddress}/>} />
          <Route path="ticketTransfer" element={<TransferTicketPage/>} />
        </Routes>
    </BrowserRouter>
    </div>
  );
}

export default App;
