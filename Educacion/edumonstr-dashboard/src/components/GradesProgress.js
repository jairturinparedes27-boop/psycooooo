// GradesProgress.js
import React from 'react';
import { ProgressBar } from 'react-bootstrap';

export default function GradesProgress() {
  return (
    <div className="mb-3">
      <h5>Calificaciones</h5>
      <ProgressBar now={84} label={`84%`} />
    </div>
  );
}
