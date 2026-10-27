'use client';

import React, { useState } from 'react';
import { getTopicVideo, formatTimestamp, buildEmbedUrl } from '@/data/video-index';
import { TopicCaseStudy } from '@/data/topic-case-studies';

interface Props {
  lessonSlug: string;
  topicSlug: string;
  topicTitle: string;
  color: string;
  caseStudy?: TopicCaseStudy;
  isInstructorMode?: boolean;
}

export default function TopicVideoLabSlide({
  lessonSlug,
  topicSlug,
  topicTitle,
  color,
  caseStudy,
  isInstructorMode = false,
}: Props) {
  const existingVideoRef = getTopicVideo(lessonSlug, topicSlug);
  const [customVideoId, setCustomVideoId] = useState<string>('');
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTimeSec, setCurrentTimeSec] = useState<number>(0);
  const [activeChapterIdx, setActiveChapterIdx] = useState<number>(0);

  const videoChapters = [
    {
      timeSec: 0,
      timestamp: '00:00',
      title: 'Bench Safety & Power Isolation',
      desc: 'Verify 24VDC PSU polarity, protective earth (PE < 10Ω), and emergency-stop circuit continuity before energizing the rack.',
      hardware: 'Siemens SITOP 24VDC / 5A Power Supply, Fluke Multimeter',
    },
    {
      timeSec: 105,
      timestamp: '01:45',
      title: 'Field Terminal Wiring & I/O Loop Check',
      desc: 'Connect sinking/sourcing discrete sensors and 4–20 mA transmitters to S7-1200 front screw terminals (DI %I0.0..%I0.7).',
      hardware: 'Inductive Proximity Sensor, 24VDC Pushbuttons, Terminal Blocks',
    },
    {
      timeSec: 210,
      timestamp: '03:30',
      title: 'TIA Portal Project Download & CPU RUN',
      desc: 'Compile hardware configuration, establish PROFINET connection, download user program to load memory, and switch CPU to RUN mode.',
      hardware: 'Siemens SIMATIC S7-1200 CPU 1214C DC/DC/DC, TIA Portal V18',
    },
    {
      timeSec: 315,
      timestamp: '05:15',
      title: 'Real-Time Signal Monitoring & Fault Injection',
      desc: 'Inspect Watch Table registers online, simulate mechanical sensor failure, and verify PLC fault diagnostic interrupts (OB82).',
      hardware: 'Digital Storage Oscilloscope, Signal Generator, Watch Table',
    },
  ];

  const effectiveVideoId = customVideoId.trim() || existingVideoRef?.video.id;

  const handleSelectChapter = (idx: number) => {
    setActiveChapterIdx(idx);
    setCurrentTimeSec(videoChapters[idx].timeSec);
    setIsPlaying(true);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'space-between' }}>
      {/* Top Header */}
      <div style={{ borderBottom: '1px solid #e2e8f0', paddingBottom: '8px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '2px' }}>
            <span style={{ width: 4, height: 16, background: '#dc2626', borderRadius: 99 }} />
            <span style={{ fontSize: '11px', fontWeight: 800, color: '#dc2626', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              PRACTICAL HANDS-ON VIDEO DEMONSTRATION & LAB PROTOCOL
            </span>
          </div>
          <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#0f172a', margin: 0 }}>
            Laboratory Video Walkthrough: {topicTitle}
          </h2>
        </div>

        {isInstructorMode && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <input
              type="text"
              placeholder="Paste YouTube ID or URL..."
              value={customVideoId}
              onChange={(e) => setCustomVideoId(e.target.value)}
              style={{
                fontSize: '11px',
                padding: '4px 8px',
                borderRadius: '6px',
                border: '1px solid #cbd5e1',
                width: '180px',
              }}
            />
            <span style={{ fontSize: '11px', color: '#64748b' }}>Custom Video</span>
          </div>
        )}
      </div>

      {/* Main 2-Column Layout: 16:9 Video Player on Left, Lab Protocol & Checklist on Right */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.25fr 1fr', gap: '20px', flex: 1, alignItems: 'stretch', margin: '10px 0' }}>
        {/* Left Column: 16:9 Video Stage */}
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', background: '#0f172a', borderRadius: '12px', padding: '16px', color: '#ffffff', boxShadow: '0 4px 18px rgba(0,0,0,0.12)' }}>
          {effectiveVideoId ? (
            /* Real YouTube / Video Player */
            <div style={{ position: 'relative', width: '100%', height: '78%', borderRadius: '8px', overflow: 'hidden', background: '#000000' }}>
              <iframe
                src={`https://www.youtube-nocookie.com/embed/${effectiveVideoId}?autoplay=1&rel=0&modestbranding=1`}
                title={`Laboratory Video: ${topicTitle}`}
                style={{ width: '100%', height: '100%', border: 'none' }}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          ) : (
            /* Broadcast-Quality Industrial Lab Video Stage */
            <div style={{
              position: 'relative',
              width: '100%',
              height: '75%',
              borderRadius: '8px',
              background: 'radial-gradient(ellipse at center, #1e293b 0%, #090d16 100%)',
              border: '1px solid #334155',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '16px',
              overflow: 'hidden',
            }}>
              {/* Virtual Screen Display */}
              <div style={{ textAlign: 'center', zIndex: 2 }}>
                <div style={{
                  width: 58,
                  height: 58,
                  borderRadius: '50%',
                  background: isPlaying ? '#0284c7' : '#dc2626',
                  color: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '24px',
                  margin: '0 auto 12px auto',
                  cursor: 'pointer',
                  boxShadow: '0 0 25px rgba(220,38,38,0.4)',
                  transition: 'all 0.2s ease',
                }}
                onClick={() => setIsPlaying(!isPlaying)}
                >
                  {isPlaying ? '⏸' : '▶'}
                </div>

                <div style={{ fontSize: '13.5px', fontWeight: 800, color: '#f8fafc', marginBottom: '4px' }}>
                  {isPlaying ? 'NOW PLAYING LAB DEMO' : 'LAB DEMONSTRATION READY'}
                </div>
                <div style={{ fontSize: '11px', color: '#94a3b8', maxWidth: '380px', margin: '0 auto', lineHeight: 1.4 }}>
                  {videoChapters[activeChapterIdx].title} — {videoChapters[activeChapterIdx].hardware}
                </div>
              </div>

              {/* Oscilloscope Background Waveform Effect */}
              <div style={{
                position: 'absolute',
                inset: 0,
                opacity: 0.15,
                backgroundImage: 'linear-gradient(#38bdf8 1px, transparent 1px), linear-gradient(90deg, #38bdf8 1px, transparent 1px)',
                backgroundSize: '24px 24px',
              }} />

              {/* Status Indicator */}
              <div style={{
                position: 'absolute',
                bottom: 12,
                left: 16,
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontSize: '11px',
                color: '#38bdf8',
                fontFamily: 'monospace',
              }}>
                <span style={{ width: 8, height: 8, borderRadius: '50%', background: isPlaying ? '#22c55e' : '#f59e0b', display: 'inline-block' }} />
                <span>{videoChapters[activeChapterIdx].timestamp} / 07:30 · 1080p 60fps</span>
              </div>
            </div>
          )}

          {/* Interactive Chapter Timeline Scrub Bar */}
          <div style={{ marginTop: '12px' }}>
            <div style={{ fontSize: '10.5px', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '6px' }}>
              Interleaved Video Lab Checkpoints (Click to Seek):
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '6px' }}>
              {videoChapters.map((chap, idx) => {
                const isActive = activeChapterIdx === idx;
                return (
                  <button
                    key={idx}
                    onClick={() => handleSelectChapter(idx)}
                    style={{
                      padding: '6px 8px',
                      borderRadius: '6px',
                      border: isActive ? '1.5px solid #38bdf8' : '1px solid #334155',
                      background: isActive ? '#0284c7' : '#1e293b',
                      color: '#ffffff',
                      fontSize: '10.5px',
                      fontWeight: 700,
                      cursor: 'pointer',
                      textAlign: 'left',
                      transition: 'all 0.15s ease',
                    }}
                  >
                    <div style={{ color: isActive ? '#f8fafc' : '#38bdf8', fontSize: '9.5px', fontFamily: 'monospace' }}>
                      {chap.timestamp}
                    </div>
                    <div style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {chap.title}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: Practical Instructions & Checklist */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', justifyContent: 'space-between' }}>
          {/* Active Step Details */}
          <div style={{ background: '#f8fafc', border: '1.5px solid #cbd5e1', borderRadius: '10px', padding: '14px 16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
              <span style={{ fontSize: '11px', fontWeight: 800, color: '#0284c7', textTransform: 'uppercase' }}>
                Active Lab Phase: Step {activeChapterIdx + 1} of 4
              </span>
              <span style={{ fontSize: '11px', fontWeight: 800, fontFamily: 'monospace', color: '#64748b' }}>
                {videoChapters[activeChapterIdx].timestamp}
              </span>
            </div>
            <h4 style={{ margin: '0 0 6px 0', fontSize: '13.5px', fontWeight: 800, color: '#0f172a' }}>
              {videoChapters[activeChapterIdx].title}
            </h4>
            <p style={{ margin: 0, fontSize: '12px', color: '#334155', lineHeight: 1.6 }}>
              {videoChapters[activeChapterIdx].desc}
            </p>
          </div>

          {/* Hardware Bill of Materials */}
          <div style={{ background: '#ffffff', border: '1.5px solid #e2e8f0', borderRadius: '10px', padding: '12px 16px' }}>
            <span style={{ fontSize: '10.5px', fontWeight: 800, color: '#0f172a', textTransform: 'uppercase', display: 'block', marginBottom: '6px' }}>
              🛠️ Test Bench Hardware & Instrumentation Deployed:
            </span>
            <ul style={{ margin: 0, paddingLeft: '16px', fontSize: '11.5px', color: '#475569', lineHeight: 1.5, display: 'flex', flexDirection: 'column', gap: '3px' }}>
              <li>• <strong>PLC Controller:</strong> SIMATIC S7-1200 CPU 1214C DC/DC/DC (14 DI / 10 DO / 2 AI)</li>
              <li>• <strong>Power Distribution:</strong> SITOP Power Supply 24VDC 5A with isolated PE grounding</li>
              <li>• <strong>Instrumentation:</strong> Digital Multimeter, 4–20 mA loop calibrator, Dual-trace Oscilloscope</li>
              <li>• <strong>Engineering Software:</strong> TIA Portal V18 with SIMATIC STEP 7 Professional</li>
            </ul>
          </div>

          {/* Operational Safety Warning */}
          <div style={{ background: '#fef2f2', border: '1.5px solid #fca5a5', borderRadius: '8px', padding: '10px 14px', fontSize: '11.5px', color: '#991b1b', lineHeight: 1.5 }}>
            ⚡ <strong>Laboratory Safety Rule:</strong> Never wire discrete inputs while the 24VDC power rail is live. Always verify the common reference terminal (1M) is strapped to 0VDC before downloading logic.
          </div>
        </div>
      </div>
    </div>
  );
}
