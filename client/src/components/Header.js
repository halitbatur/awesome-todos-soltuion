import React from 'react';

export default function Header({ activeTodos }) {
  return (
    <header>
      <div>
        <h2
          style={{
            marginBottom: 0,
            fontSize: '2rem',
          }}
        >
          {new Date().toDateString()}
        </h2>
      </div>
      <div>
        <h4
          style={{
            color: 'teal',
            marginTop: 0,
            fontWeight: 400,
          }}
        >
          Active TODOs: <strong>{activeTodos}</strong>
        </h4>
      </div>
    </header>
  );
}
