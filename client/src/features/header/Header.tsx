import { format } from 'date-fns';
import ReactNotification from 'react-notifications-component';
import logo from '../../assets/logo.svg';
import 'react-notifications-component/dist/theme.css';
import './Header.css';
import { useTypedSelector } from '../../app/store';
import { selectIsAuthenticated, selectIsLogginIn } from '../auth/authSlice';
import { Auth } from '../auth/Auth';

const parse = (nd: Date) => {
  return {
    date: nd,
    day: format(nd, 'dd'),
    dayDisplay: format(nd, 'd'),
    month: format(nd, 'MM'),
    monthDisplay: format(nd, 'MMM'),
    year: format(nd, 'y'),
    weekday: format(nd, 'EEEE'),
  };
};

export function Header() {
  const date = parse(new Date());
  const isAuthenticated = useTypedSelector(selectIsAuthenticated);
  const isLogginIn = useTypedSelector(selectIsLogginIn);

  return (
    <header>
      <ReactNotification />
      <Navbar />
      <div className="header-container">
        <div
          style={{ display: 'flex', alignItems: 'center', fontSize: '1.5rem' }}
        >
          <div style={{ margin: '0 10px', fontSize: '5rem' }}>
            {date.dayDisplay}
          </div>
          <div>
            <div>{date.monthDisplay}</div>
            <div>{date.year}</div>
          </div>
        </div>
        <div>
          {!isLogginIn && !isAuthenticated && (
            <p style={{ fontSize: '1rem' }}>
              Your todos are saved in the browser only!
              <br /> Sign in to save in the database
            </p>
          )}
        </div>
        <div style={{ fontSize: '2rem' }}>{date.weekday}</div>
      </div>
    </header>
  );
}

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="logo">
        <h2>Awesome Todos</h2>
        <img src={logo} alt="Awesome Todos" title="Awesome Todos" />
      </div>
      <div>
        <Auth />
      </div>
    </nav>
  );
};
