// apps-frontend/src/App.jsx
import React, { useState } from 'react';
import axios from 'axios';
import { Search, Cpu, BarChart2, Lightbulb, ShieldAlert, Sparkles, CheckCircle2, TrendingUp } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

function App() {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState(null);

  const triggerAgentPipeline = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    
    setLoading(true);
    setResponse(null);

    try {
          const res = await axios.post('http://localhost:8000/api/v1/analyze',
          { query: query },
        { 
          headers: { 
            'Authorization': 'Bearer super-secret-interview-token',
            'Content-Type': 'application/json'
          } 
        }
      );
      setResponse(res.data);
    } catch (err) {
      console.error(err);
      alert("We are experiencing connection issues. Please try again later.");
    }
    setLoading(false);
  };

  return (
    <div style={{ padding: '40px 60px', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif', backgroundColor: '#fdfdfd', minHeight: '100vh', color: '#1e293b' }}>
      
      {/* Premium Elegant Header */}
      <div style={{ textAlign: 'center', marginBottom: '50px' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '12px', background: '#eff6ff', padding: '8px 16px', borderRadius: '20px', color: '#2563eb', fontWeight: '600', fontSize: '14px', marginBottom: '16px' }}>
          <Sparkles size={16} /> Enterprise Edition v1.0
        </div>
        <h1 style={{ margin: '0 0 12px 0', fontSize: '36px', fontWeight: '800', color: '#0f172a', letterSpacing: '-0.02em' }}>
          MarketPulse<span style={{ color: '#2563eb' }}>.ai</span>
        </h1>
        <p style={{ margin: '0', color: '#64748b', fontSize: '18px', fontWeight: '400' }}>Generative Multi-Agent Intelligence Platform for Market Research</p>
      </div>

      {/* Modern High-End Search Input Field */}
      <form onSubmit={triggerAgentPipeline} style={{ maxWidth: '800px', margin: '0 auto 50px auto', display: 'flex', gap: '12px', background: '#fff', padding: '10px', borderRadius: '16px', boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.05), 0 8px 10px -6px rgba(0, 0, 0, 0.05)', border: '1px solid #f1f5f9' }}>
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '12px', paddingLeft: '12px' }}>
          <Search size={22} color="#94a3b8" />
          <input 
            type="text" 
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Describe the industry, niche or product segment you want to analyze..."
            style={{ width: '100%', padding: '12px 0', border: 'none', background: 'transparent', outline: 'none', fontSize: '16px', color: '#334155' }}
            disabled={loading}
          />
        </div>
        <button 
          type="submit" 
          disabled={loading}
          style={{ padding: '0 32px', background: loading ? '#94a3b8' : '#0f172a', color: '#fff', border: 'none', borderRadius: '12px', fontSize: '15px', fontWeight: '600', cursor: loading ? 'not-allowed' : 'pointer', transition: 'all 0.2s', height: '50px' }}
        >
          {loading ? 'Analyzing Intelligence...' : 'Generate Report'}
        </button>
      </form>

      {/* Production Output Presentation Panel */}
      {response && (
        <div style={{ maxWidth: '1100px', margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr', gap: '30px' }}>
          
          {/* Global Alignment Override Block for React Markdown */}
          <style>{`
            .markdown-format { text-align: left !important; }
            .markdown-format p, .markdown-format h1, .markdown-format h2, .markdown-format h3, .markdown-format h4, .markdown-format strong { 
              text-align: left !important; 
              margin-bottom: 12px; 
            }
            .markdown-format ul, .markdown-format ol { 
              padding-left: 24px !important; 
              margin: 12px 0; 
              text-align: left !important; 
            }
            .markdown-format li { 
              margin-bottom: 8px !important; 
              text-align: left !important; 
              list-style-position: outside; 
            }
          `}</style>

          {/* Key Takeaways Cards - Clean business UI */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
            <div style={{ background: '#fff', padding: '24px', borderRadius: '16px', border: '1px solid #f1f5f9', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.02)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px', color: '#2563eb', fontWeight: '700' }}>
                <BarChart2 size={20} /> Market Environment Summary
              </div>
              <div className="markdown-format" style={{ fontSize: '14px', lineHeight: '1.6', color: '#475569', textAlign: 'left' }}>
                <ReactMarkdown>{response.metadata?.research_summary || ""}</ReactMarkdown>
              </div>
            </div>

            <div style={{ background: '#fff', padding: '24px', borderRadius: '16px', border: '1px solid #f1f5f9', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.02)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px', color: '#16a34a', fontWeight: '700' }}>
                <ShieldAlert size={20} /> Competitive Landscapes & Gaps
              </div>
              <div className="markdown-format" style={{ fontSize: '14px', lineHeight: '1.6', color: '#475569', textAlign: 'left' }}>
                <ReactMarkdown>{response.metadata?.competitor_summary || ""}</ReactMarkdown>
              </div>
            </div>
          </div>

          {/*  NEW: Visual Analytics Dashboard
          {response.metadata?.chart_data && (
            <div style={{ background: '#fff', padding: '24px', borderRadius: '16px', border: '1px solid #f1f5f9', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.02)', marginTop: '6px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px', color: '#8b5cf6', fontWeight: '700' }}>
                <TrendingUp size={20} /> Market Trend Visualization
              </div>
              <div style={{ height: '250px', width: '100%' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={(() => {
                    try {
                      let rawData = response.metadata.chart_data || '';
                      let cleanedData = rawData.replace(/```json/g, '').replace(/```/g, '').trim();
                      const parsed = JSON.parse(cleanedData);
                      return Array.isArray(parsed) ? parsed : [];
                    } catch (e) {
                      console.error("Chart JSON Parse Error:", e);
                      return [];
                    }
                  })()}>
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                    <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} label={{ value: 'Trend Volume Index', angle: -90, position: 'insideLeft', offset: -5, style: { textAnchor: 'middle', fill: '#94a3b8', fontSize: 13, fontWeight: 500 } }} />                    <Tooltip cursor={{fill: '#f8fafc'}} contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)'}} />
                    <Bar dataKey="value" fill="#6366f1" radius={[4, 4, 0, 0]}>
  {(() => {
    try {
      const chartData = JSON.parse(response.metadata.chart_data);
      return Array.isArray(chartData) ? chartData.map((entry, index) => (
        <cell key={`cell-${index}`} fill={index % 2 === 0 ? "#6366f1" : "#82ca9d"} />
      )) : null;
    } catch(e) {
      return null;
    }
  })()}
</Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          )} */}

          {/* Core Master Report Section */}
          <div style={{ background: '#fff', padding: '40px', borderRadius: '20px', border: '1px solid #e2e8f0', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.03)' }}>
            <div className="markdown-format" style={{ fontSize: '15px', lineHeight: '1.8', color: '#334155', textAlign: 'left' }}>
              <ReactMarkdown>{response.report}</ReactMarkdown>
            </div>
            
            <div style={{ marginTop: '30px', paddingTop: '20px', borderTop: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: '#94a3b8', fontSize: '13px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#10b981', fontWeight: '500' }}>
                <CheckCircle2 size={16} /> Compiled autonomously by MarketPulse Verified Engines
              </div>
              <div>Analyst ID: {response.triggered_by || 'System User'}</div>
            </div>
          </div>

        </div>
      )}

    </div>
  );
}

export default App;