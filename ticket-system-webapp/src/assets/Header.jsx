import { Outlet, Link } from 'react-router-dom';
import '../styling/Header.css';

const Header = ({ isLoggedIn }) => {

    return (
      <div>
        <nav id='header_nav'>
          <ul className='pages_list' style={{ display: 'flex', listStyleType: 'none', padding: 0 }}>
            <li style={{ width: '78px', height: '78px'}}>
              <Link to="" style={{ whiteSpace: 'nowrap' }}>Home</Link>
            </li>
            <li style={{ width: '78px', height: '78px'}}>
              <Link to="createWallet" style={{ whiteSpace: 'nowrap' }}>Create Wallet</Link>
            </li>
            <li style={{ width: '78px', height: '78px'}}>
              <Link to="checkBalance" style={{ whiteSpace: 'nowrap' }}>Check Balance</Link>
            </li>
            <li style={{ width: '78px', height: '78px'}}>
              <Link to="purchaseTicket" style={{ whiteSpace: 'nowrap' }}>Purchase Ticket</Link>
            </li>
            <li style={{ width: '78px', height: '78px'}}>
              <Link to="ticketTransfer" style={{ whiteSpace: 'nowrap' }}>Transfer Ticket</Link>
            </li>
            <li style={{ width: '78px', height: '78px'}}>
              <Link to="redeemTicket" style={{ whiteSpace: 'nowrap' }}>Redeem Ticket</Link>
            </li>
          </ul>
        </nav>
        <Outlet />
      </div>
    )
}


export default Header;
