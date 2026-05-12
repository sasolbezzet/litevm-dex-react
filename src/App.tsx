import React from 'react';
import { Button } from './components/Button';

export default function App() {
  return (
    <div className="app">
      <h1>LiteVM DEX Frontend</h1>
      <Button onClick={() => alert('Hello from LiteVM!')}>
        Interact
      </Button>
    </div>
  );
}