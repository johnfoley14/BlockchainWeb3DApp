import { Outlet, Link } from 'react-router-dom';
import '../styling/Header.css';
import PropTypes from 'prop-types';


const Header = ({ isLoggedIn }) => {

    return (
      <div>
        <nav id='header_nav'>
          <ul className='pages_list'>
            <li style={{ width: '78px', height: '78px'}}>
              <Link to="">Home</Link>
            </li>
            <li style={{ width: '78px', height: '78px'}}>
              <Link to="data">Data</Link>
            </li>
            <li style={{ width: '78px', height: '78px'}}>
              <Link to="salim">Salim GUI</Link>
            </li>
          </ul>
        </nav>
        <Outlet />
      </div>
    )
}

Header.propTypes = {
  isLoggedIn: PropTypes.bool.isRequired,
};

export default Header;
