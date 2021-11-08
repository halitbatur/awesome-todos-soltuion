import { format } from 'date-fns';
import ReactNotification from 'react-notifications-component';
import 'react-notifications-component/dist/theme.css';

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

  return (
    <header>
      <ReactNotification />
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
        <div style={{ fontSize: '2rem' }}>{date.weekday}</div>
      </div>
    </header>
  );
}
