import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './LandingPage.css';
import "./ZentroAnimation.css";

export default function ZentroAnimation() {
  const containerRef = useRef(null);

  useEffect(() => {
    const text = "ZENTRO";
    const container = containerRef.current;
    container.innerHTML = "";

    text.split("").forEach((char, index) => {
      const span = document.createElement("span");
      span.textContent = char;
      span.classList.add("letter");
      container.appendChild(span);

      setTimeout(() => {
        span.style.animation = `jumpIn 0.6s ease forwards`;
      }, index * 200);
    });
  }, []);

  return (
    <div className="zentro-page">
      <div className="zentro-container" ref={containerRef}></div>
    </div>
  );
}