import React, { useState, useEffect } from 'react';
import { format, addMinutes, differenceInMinutes, isPast } from 'date-fns';
import { de } from 'date-fns/locale';
import './TimerManager.css';

function TimerManager({ schedule, onComplete }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [completedSteps, setCompletedSteps] = useState([]);

  const recipe = schedule.recipe;
  const steps = recipe.steps;

  useEffect(() => {
    // Request notification permission if not already granted
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }

    // Initialize timer
    const timer = setInterval(() => {
      if (!isPaused) {
        updateTimer();
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [currentStep, isPaused]);

  const updateTimer = () => {
    if (currentStep >= steps.length) {
      return;
    }

    const step = steps[currentStep];
    const now = new Date();
    const stepEndTime = new Date(schedule.startedAt);
    
    // Calculate end time for current step
    let minutesToAdd = 0;
    for (let i = 0; i <= currentStep; i++) {
      minutesToAdd += steps[i].duration;
    }
    const endTime = addMinutes(stepEndTime, minutesToAdd);

    const remaining = differenceInMinutes(endTime, now);
    setTimeRemaining(remaining);

    // Check if step is complete
    if (remaining <= 0 && !completedSteps.includes(currentStep)) {
      handleStepComplete();
    }

    // Send notification 5 minutes before step ends
    if (remaining === 5 && !completedSteps.includes(currentStep)) {
      sendNotification(`⏰ Noch 5 Minuten bis "${step.name}"`, 
        'Bereite dich auf den nächsten Schritt vor.');
    }
  };

  const handleStepComplete = () => {
    const step = steps[currentStep];
    
    // Send notification
    sendNotification(`✅ ${step.name} abgeschlossen!`, 
      currentStep < steps.length - 1 
        ? `Nächster Schritt: ${steps[currentStep + 1].name}` 
        : 'Dein Brot ist fertig!');

    // Play sound (if browser supports it)
    playNotificationSound();

    setCompletedSteps([...completedSteps, currentStep]);

    // Auto-advance to next step after 3 seconds
    setTimeout(() => {
      if (currentStep < steps.length - 1) {
        setCurrentStep(currentStep + 1);
      }
    }, 3000);
  };

  const sendNotification = (title, body) => {
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(title, {
        body,
        icon: '/logo192.png',
        badge: '/logo192.png',
        vibrate: [200, 100, 200],
        tag: 'brotzeit-reminder'
      });
    }
  };

  const playNotificationSound = () => {
    // Create a simple beep sound
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.frequency.value = 800;
    oscillator.type = 'sine';

    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);

    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.5);
  };

  const formatTime = (minutes) => {
    if (minutes < 0) return '00:00';
    
    const hours = Math.floor(Math.abs(minutes) / 60);
    const mins = Math.abs(minutes) % 60;
    
    return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
  };

  const getStepIcon = (type) => {
    switch (type) {
      case 'fermentation': return '🫧';
      case 'baking': return '🔥';
      case 'cooling': return '❄️';
      default: return '👨‍🍳';
    }
  };

  const getCurrentStepProgress = () => {
    if (currentStep >= steps.length) return 100;
    
    const step = steps[currentStep];
    const elapsed = step.duration - timeRemaining;
    return Math.max(0, Math.min(100, (elapsed / step.duration) * 100));
  };

  const handleSkipStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
      setCompletedSteps([...completedSteps, currentStep]);
    } else {
      onComplete();
    }
  };

  const handlePreviousStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const isAllComplete = currentStep >= steps.length || (currentStep === steps.length - 1 && timeRemaining <= 0);

  return (
    <div className="timer-manager">
      <div className="recipe-header">
        <h2>{recipe.name}</h2>
        <div className="progress-overview">
          Schritt {Math.min(currentStep + 1, steps.length)} von {steps.length}
        </div>
      </div>

      {!isAllComplete ? (
        <>
          <div className="current-step">
            <div className="step-icon-large">{getStepIcon(steps[currentStep].type)}</div>
            <h3>{steps[currentStep].name}</h3>
            
            <div className="timer-display">
              <div className={`time ${timeRemaining <= 0 ? 'complete' : ''}`}>
                {timeRemaining <= 0 ? '✅ Fertig!' : formatTime(timeRemaining)}
              </div>
              <div className="time-label">
                {timeRemaining > 0 ? 'verbleibend' : ''}
              </div>
            </div>

            <div className="progress-bar">
              <div 
                className="progress-fill" 
                style={{ width: `${getCurrentStepProgress()}%` }}
              />
            </div>

            <div className="step-instructions">
              {steps[currentStep].instructions}
            </div>
          </div>

          <div className="timer-controls">
            <button 
              onClick={handlePreviousStep}
              disabled={currentStep === 0}
              className="control-btn"
            >
              ← Zurück
            </button>
            
            <button 
              onClick={() => setIsPaused(!isPaused)}
              className="control-btn pause-btn"
            >
              {isPaused ? '▶️ Fortsetzen' : '⏸️ Pausieren'}
            </button>
            
            <button 
              onClick={handleSkipStep}
              className="control-btn"
            >
              Weiter →
            </button>
          </div>

          <div className="upcoming-steps">
            <h4>Kommende Schritte</h4>
            {steps.slice(currentStep + 1, currentStep + 4).map((step, index) => (
              <div key={index} className="upcoming-step">
                <span className="step-icon">{getStepIcon(step.type)}</span>
                <span className="step-name">{step.name}</span>
                <span className="step-duration">{step.duration} Min</span>
              </div>
            ))}
          </div>
        </>
      ) : (
        <div className="completion-screen">
          <div className="celebration">🎉</div>
          <h3>Glückwunsch!</h3>
          <p>Dein {recipe.name} ist fertig!</p>
          <button onClick={onComplete} className="complete-btn">
            Zum Hauptmenü
          </button>
        </div>
      )}

      <div className="emergency-actions">
        <button onClick={onComplete} className="abort-btn">
          Backvorgang abbrechen
        </button>
      </div>
    </div>
  );
}

export default TimerManager;
