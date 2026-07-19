import React, { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { onAuthStateChanged } from 'firebase/auth';
import { collection, doc, onSnapshot } from 'firebase/firestore';
import { auth, db } from './firebase';
import { MonthlyChart } from './MonthlyChart';
import './analytics.css';

let root;

function Analytics({ close }) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [stats, setStats] = useState([]);
  const [month, setMonth] = useState(
    () => new Date(new Date().getFullYear(), new Date().getMonth(), 1)
  );

  useEffect(() => onAuthStateChanged(auth, setUser), []);

  useEffect(() => {
    if (!user) return;

    const unsubscribeProfile = onSnapshot(
      doc(db, 'users', user.uid),
      snapshot => setProfile(snapshot.data() || {})
    );

    const unsubscribeStats = onSnapshot(
      collection(db, 'users', user.uid, 'dailyStats'),
      snapshot =>
        setStats(snapshot.docs.map(item => ({ id: item.id, ...item.data() })))
    );

    return () => {
      unsubscribeProfile();
      unsubscribeStats();
    };
  }, [user]);

  const isCurrentMonth =
    month.getFullYear() === new Date().getFullYear() &&
    month.getMonth() === new Date().getMonth();

  const shiftMonth = amount =>
    setMonth(value => new Date(value.getFullYear(), value.getMonth() + amount, 1));

  return (
    <div className="analytics-overlay">
      <section className="analytics-page">
        <header>
          <div>
            <p className="eyebrow">ANALYTICS</p>
            <h1>Monthly study analysis</h1>
            <p className="muted">
              Select any month to review each day’s laptop and offline progress.
            </p>
          </div>

          <button className="secondary" onClick={close}>
            ← Dashboard
          </button>
        </header>

        <article className="card chart-card analytics-chart">
          <div className="section-head">
            <div>
              <p className="eyebrow">DAY-WISE PROGRESS</p>
              <h2>Study hours by date</h2>
            </div>

            <span className="goal-key">
              — Daily goal: {profile?.dailyGoal || 8}h
            </span>
          </div>

          <div className="month-switcher">
            <button
              className="secondary"
              onClick={() => shiftMonth(-1)}
            >
              ← Previous
            </button>

            <strong>
              {month.toLocaleDateString([], {
                month: 'long',
                year: 'numeric'
              })}
            </strong>

            <button
              className="secondary"
              disabled={isCurrentMonth}
              onClick={() => shiftMonth(1)}
            >
              Next →
            </button>
          </div>

          <MonthlyChart
            stats={stats}
            goal={profile?.dailyGoal || 8}
            month={month}
          />
        </article>

        <div className="chart-legend">
          <span className="pink">8h+</span>
          <span className="dark-green">7–7.9h</span>
          <span className="green">5–6.9h</span>
          <span className="orange">4–4.9h</span>
          <span className="red">2–3.9h</span>
          <span className="dark-red">Below 2h</span>
        </div>
      </section>
    </div>
  );
}

function openAnalytics() {
  let host = document.getElementById('analytics-root');

  if (!host) {
    host = document.createElement('div');
    host.id = 'analytics-root';
    document.body.append(host);
    root = createRoot(host);
  }

  root.render(
    <Analytics
      close={() => {
        root.unmount();
        host.remove();
        root = null;
      }}
    />
  );
}

function addAnalyticsButton() {
  const sidebar = document.querySelector('.app aside');

  if (!sidebar || sidebar.querySelector('[data-analytics-nav]')) return;

  const button = document.createElement('button');
  button.className = 'nav';
  button.dataset.analyticsNav = 'true';
  button.textContent = 'Analytics';
  button.addEventListener('click', openAnalytics);

  const logout = sidebar.querySelector('.logout');
  sidebar.insertBefore(button, logout || null);
}

new MutationObserver(addAnalyticsButton).observe(document.body, {
  childList: true,
  subtree: true
});

addAnalyticsButton(); 