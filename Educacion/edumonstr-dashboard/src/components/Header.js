// Header.js
import React from 'react';
import { Navbar } from 'react-bootstrap';

export default function Header() {
  return (
    <Navbar bg="light" className="justify-content-end px-4">
      <Navbar.Text>
        Jair Turing 👨‍🎓
      </Navbar.Text>
    </Navbar>
  );
}
