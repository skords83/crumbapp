import React, { useState, useEffect } from 'react';
import { format, addMinutes, differenceInMinutes } from 'date-fns';
import { de } from 'date-fns/locale';
import './BakingScheduler.css';

function BakingScheduler({ recipe, respectNighttime, onStart, onCancel }) {
  const [targetTime, setTargetTime] = useState('');
  const [schedule, setSchedule] = useState([]);
  const [totalDuration, setTotalDuration] = useState(0);
  const [hasNighttimeConflict, setHasNighttimeConflict] = useState(false);

  useEffect(() => {
    // Calculate total duration
    const total = recipe.steps.reduce((sum, step) => sum + step.duration, 0);
    setTotalDuration(total);

    // Set default target time to 18:00 today or tomorrow
    const now = new Date();
    const defaultTarget = new Date();
    defaultTarget.setHours(18, 0, 0, 0);
    
    if (defaultTarget <= now) {
      defaultTarget.setDate(defaultTarget.getDate() + 1);
    }

    const formatted = format(defaultTarget, "yyyy-MM-dd'T'HH:mm");
    setTargetTime(formatted);
  }, [recipe]);

  useEffect(() => {
    if (targetTime) {
      calculateSchedule();
    }
  }, [targetTime]);

  const calculateSchedule = () => {
    const target = new Date(targetTime);
    const scheduledSteps = [];
    let currentTime = target;
    let nighttimeConflict = false;

    // Work backwards from target time
    for (let i = recipe.steps.length - 1; i >= 0; i--) {
      const step = recipe.steps[i];
      const startTime = addMinutes(currentTime, -step.duration);
      
      // Check if step falls in nighttime (22:00 - 6:00)
      if (respectNighttime) {
        const startHour = startTime.getHours();
        const endHour = currentTime.getHours();
        
        if ((startHour >= 22 || startHour < 6) || (endHour >= 22 || endHour < 6)) {
          nighttimeConflict = true;
        }
      }
      
      scheduledSteps.unshift({
        ...step,
        startTime,
        endTime: currentTime,
        stepNumber: i + 1
      });

      currentTime = startTime;
    }

    setSchedule(scheduledSteps);
    setHasNighttimeConflict(nighttimeConflict);
  };

  const formatDuration = (minutes) => {
    if (minutes < 60) {
      return `${minutes} Min`;
    }
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0 ? `${hours}h ${mins}min` : `${hours}h`;
  };

  const getStepIcon = (type) => {
    switch (type) {
      case 'fermentation': return '🫧';
      case 'baking': return '🔥';
      case 'cooling': return '❄️';
      default: return '👨‍🍳';
    }
  };

  const handleStart = () => {
    onStart(recipe, targetTime);
  };

  const startTime = schedule.length > 0 ? schedule[0].startTime : null;
  const now = new Date();
  const canStartNow = startTime && differenceInMinutes(startTime, now) <= 5;

  return (
    <div className="baking-scheduler">
      <div className="scheduler-header">
        <h2>{recipe.name}</h2>
        {recipe.source && <p className="source">Quelle: {recipe.source}</p>}
      </div>

      <div className="time-selector">
        <label>
          <strong>Wann soll das Brot fertig sein?</strong>
        </label>
        <input
          type="datetime-local"
          value={targetTime}
          onChange={(e) => setTargetTime(e.target.value)}
        />
      </div>

      <div className="schedule-summary">
        <div className="summary-item">
          <span className="label">Gesamtdauer:</span>
          <span className="value">{formatDuration(totalDuration)}</span>
        </div>
        {startTime && (
          <div className="summary-item highlight">
            <span className="label">Start:</span>
            <span className="value">
              {format(startTime, 'EEEE, dd.MM.yyyy HH:mm', { locale: de })} Uhr
            </span>
          </div>
        )}
      </div>

      <div className="timeline">
        <h3>Zeitplan</h3>
        {schedule.map((step, index) => (
          <div key={index} className={`timeline-step ${step.type}`}>
            <div className="step-icon">{getStepIcon(step.type)}</div>
            <div className="step-content">
              <div className="step-header">
                <strong>{step.stepNumber}. {step.name}</strong>
                <span className="duration">{formatDuration(step.duration)}</span>
              </div>
              <div className="step-time">
                {format(step.startTime, 'HH:mm', { locale: de })} - {format(step.endTime, 'HH:mm', { locale: de })} Uhr
              </div>
              {step.instructions && (
                <div className="step-instructions">{step.instructions}</div>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="scheduler-actions">
        {!canStartNow && startTime && (
          <div className="warning">
            ⏰ Startzeit liegt {differenceInMinutes(startTime, now) > 0 ? 'in der Zukunft' : 'in der Vergangenheit'}. 
            Du kannst trotzdem starten und wirst an alle Schritte erinnert.
          </div>
        )}

        {respectNighttime && hasNighttimeConflict && (
          <div className="warning nighttime-warning">
            🌙 <strong>Achtung:</strong> Bei dieser Zielzeit sind Aktionen zwischen 22:00 und 6:00 Uhr nötig. 
            Wähle eine andere Fertigzeit oder deaktiviere die Nachtruhe-Option.
          </div>
        )}
        
        <button 
          onClick={handleStart} 
          className="start-button"
          disabled={respectNighttime && hasNighttimeConflict}
        >
          Backen starten
        </button>
        <button onClick={onCancel} className="cancel-button">
          Abbrechen
        </button>
      </div>
    </div>
  );
}

export default BakingScheduler;
