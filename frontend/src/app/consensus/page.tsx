'use client';

import { useState, useEffect } from 'react';

export default function ConsensusMonitor() {
    const [powStatus, setPowStatus] = useState({
        mining: false,
        currentHash: '',
        attempts: 0,
        difficulty: 4,
        lastBlock: '',
        progress: 0
    });

    const [validators] = useState([
        { name: 'Oracle_FlightData', stake: 10000, status: 'active', lastValidation: 'IST->GYD (2m ago)' },
        { name: 'Oracle_Weather', stake: 5000, status: 'standby', lastValidation: 'JFK->LAX (5m ago)' },
        { name: 'Oracle_Airline', stake: 3000, status: 'standby', lastValidation: 'ORD->MIA (8m ago)' },
    ]);

    const [consensusStats] = useState({
        totalPolicies: 24,
        settledToday: 12,
        avgConsensusTime: '4.2s',
        efficiency: '74%'
    });

    // Simulate PoW mining animation
    useEffect(() => {
        const miningInterval = setInterval(() => {
            if (Math.random() > 0.7) {
                setPowStatus(prev => ({
                    ...prev,
                    mining: true,
                    attempts: 0,
                    progress: 0
                }));

                const attemptInterval = setInterval(() => {
                    setPowStatus(prev => {
                        const newAttempts = prev.attempts + 1;
                        const newProgress = Math.min((newAttempts / 100) * 100, 95);

                        if (Math.random() > 0.95 && newAttempts > 10) {
                            const successHash = '0x0000' + Math.random().toString(36).substr(2, 12);
                            clearInterval(attemptInterval);

                            return {
                                ...prev,
                                mining: false,
                                lastBlock: successHash,
                                currentHash: successHash,
                                attempts: newAttempts,
                                progress: 100
                            };
                        }

                        return {
                            ...prev,
                            currentHash: '0x' + Math.random().toString(36).substr(2, 16),
                            attempts: newAttempts,
                            progress: newProgress
                        };
                    });
                }, 100);

                setTimeout(() => clearInterval(attemptInterval), 3000);
            }
        }, 8000);

        return () => clearInterval(miningInterval);
    }, []);

    const totalStake = validators.reduce((sum, v) => sum + v.stake, 0);

    return (
        <div style={{
            minHeight: '100vh',
            background: 'linear-gradient(to bottom right, #0f172a, #1e1b4b, #0f172a)',
            color: 'white',
            padding: '24px'
        }}>
            {/* Header */}
            <div style={{ maxWidth: '1280px', margin: '0 auto 32px' }}>
                <h1 style={{
                    fontSize: '36px',
                    fontWeight: 'bold',
                    background: 'linear-gradient(to right, #818cf8, #a78bfa)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    marginBottom: '8px'
                }}>
                    Hybrid Consensus Monitor
                </h1>
                <p style={{ color: '#94a3b8', marginLeft: '0' }}>
                    Real-time visualization of PoW + PoS consensus mechanisms
                </p>

                <div style={{
                    marginTop: '16px',
                    padding: '12px',
                    backgroundColor: 'rgba(99, 102, 241, 0.1)',
                    border: '1px solid rgba(99, 102, 241, 0.2)',
                    borderRadius: '8px'
                }}>
                    <p style={{ fontSize: '14px', color: '#a5b4fc' }}>
                        <strong>Note:</strong> This is an educational demonstration of PoW/PoS principles applied to FlightGuard's architecture.
                    </p>
                </div>
            </div>

            {/* Stats Overview */}
            <div style={{
                maxWidth: '1280px',
                margin: '0 auto 32px',
                display: 'grid',
                gridTemplateColumns: 'repeat(4, 1fr)',
                gap: '16px'
            }}>
                <div style={{
                    backgroundColor: 'rgba(30, 41, 59, 0.5)',
                    backdropFilter: 'blur(12px)',
                    border: '1px solid #334155',
                    borderRadius: '12px',
                    padding: '16px'
                }}>
                    <div style={{ fontSize: '12px', color: '#94a3b8', marginBottom: '8px' }}>Total Policies</div>
                    <div style={{ fontSize: '30px', fontWeight: 'bold' }}>{consensusStats.totalPolicies}</div>
                </div>

                <div style={{
                    backgroundColor: 'rgba(30, 41, 59, 0.5)',
                    backdropFilter: 'blur(12px)',
                    border: '1px solid #334155',
                    borderRadius: '12px',
                    padding: '16px'
                }}>
                    <div style={{ fontSize: '12px', color: '#94a3b8', marginBottom: '8px' }}>Settled Today</div>
                    <div style={{ fontSize: '30px', fontWeight: 'bold', color: '#4ade80' }}>{consensusStats.settledToday}</div>
                </div>

                <div style={{
                    backgroundColor: 'rgba(30, 41, 59, 0.5)',
                    backdropFilter: 'blur(12px)',
                    border: '1px solid #334155',
                    borderRadius: '12px',
                    padding: '16px'
                }}>
                    <div style={{ fontSize: '12px', color: '#94a3b8', marginBottom: '8px' }}>Avg Consensus</div>
                    <div style={{ fontSize: '30px', fontWeight: 'bold', color: '#facc15' }}>{consensusStats.avgConsensusTime}</div>
                </div>

                <div style={{
                    backgroundColor: 'rgba(30, 41, 59, 0.5)',
                    backdropFilter: 'blur(12px)',
                    border: '1px solid #334155',
                    borderRadius: '12px',
                    padding: '16px'
                }}>
                    <div style={{ fontSize: '12px', color: '#94a3b8', marginBottom: '8px' }}>Efficiency Gain</div>
                    <div style={{ fontSize: '30px', fontWeight: 'bold', color: '#a78bfa' }}>{consensusStats.efficiency}</div>
                </div>
            </div>

            {/* Main Panels */}
            <div style={{
                maxWidth: '1280px',
                margin: '0 auto',
                display: 'grid',
                gridTemplateColumns: 'repeat(2, 1fr)',
                gap: '24px'
            }}>

                {/* PoW Mining Panel */}
                <div style={{
                    backgroundColor: 'rgba(30, 41, 59, 0.5)',
                    backdropFilter: 'blur(12px)',
                    border: '1px solid #334155',
                    borderRadius: '12px',
                    padding: '24px'
                }}>
                    <div style={{ marginBottom: '24px' }}>
                        <h2 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '4px' }}>
                            Proof of Work Layer
                        </h2>
                        <p style={{ fontSize: '14px', color: '#94a3b8' }}>Immutable Policy Storage</p>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ color: '#94a3b8' }}>Status:</span>
                            <span style={{
                                padding: '4px 12px',
                                borderRadius: '999px',
                                fontSize: '14px',
                                fontWeight: '500',
                                backgroundColor: powStatus.mining ? 'rgba(249, 115, 22, 0.2)' : 'rgba(34, 197, 94, 0.2)',
                                color: powStatus.mining ? '#fb923c' : '#4ade80'
                            }}>
                                {powStatus.mining ? 'Mining...' : 'Idle'}
                            </span>
                        </div>

                        <div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', marginBottom: '8px' }}>
                                <span style={{ color: '#94a3b8' }}>Mining Progress</span>
                                <span>{powStatus.progress.toFixed(0)}%</span>
                            </div>
                            <div style={{
                                height: '12px',
                                backgroundColor: '#334155',
                                borderRadius: '999px',
                                overflow: 'hidden'
                            }}>
                                <div style={{
                                    height: '100%',
                                    background: 'linear-gradient(to right, #f97316, #fbbf24)',
                                    width: `${powStatus.progress}%`,
                                    transition: 'width 0.3s'
                                }} />
                            </div>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px' }}>
                                <span style={{ color: '#94a3b8' }}>Difficulty:</span>
                                <span style={{ fontFamily: 'monospace' }}>{'0'.repeat(powStatus.difficulty)} (4 leading zeros)</span>
                            </div>

                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px' }}>
                                <span style={{ color: '#94a3b8' }}>Attempts:</span>
                                <span style={{ fontFamily: 'monospace', color: '#fb923c' }}>{powStatus.attempts}</span>
                            </div>

                            <div>
                                <div style={{ color: '#94a3b8', fontSize: '14px', marginBottom: '4px' }}>Current Hash:</div>
                                <div style={{
                                    backgroundColor: 'rgba(15, 23, 42, 0.5)',
                                    padding: '8px',
                                    borderRadius: '4px',
                                    fontFamily: 'monospace',
                                    fontSize: '12px',
                                    wordBreak: 'break-all'
                                }}>
                                    {powStatus.currentHash || '0x0000000000000000'}
                                </div>
                            </div>

                            {powStatus.lastBlock && (
                                <div>
                                    <div style={{ color: '#94a3b8', fontSize: '14px', marginBottom: '4px' }}>Last Block Mined:</div>
                                    <div style={{
                                        backgroundColor: 'rgba(34, 197, 94, 0.1)',
                                        border: '1px solid rgba(34, 197, 94, 0.2)',
                                        padding: '8px',
                                        borderRadius: '4px',
                                        fontFamily: 'monospace',
                                        fontSize: '12px',
                                        wordBreak: 'break-all',
                                        color: '#4ade80'
                                    }}>
                                        {powStatus.lastBlock}
                                    </div>
                                </div>
                            )}
                        </div>

                        <div style={{
                            paddingTop: '16px',
                            borderTop: '1px solid #334155',
                            fontSize: '12px',
                            color: '#64748b'
                        }}>
                            PoW ensures policy immutability through cryptographic proof
                        </div>
                    </div>
                </div>

                {/* PoS Validation Panel */}
                <div style={{
                    backgroundColor: 'rgba(30, 41, 59, 0.5)',
                    backdropFilter: 'blur(12px)',
                    border: '1px solid #334155',
                    borderRadius: '12px',
                    padding: '24px'
                }}>
                    <div style={{ marginBottom: '24px' }}>
                        <h2 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '4px' }}>
                            Proof of Stake Layer
                        </h2>
                        <p style={{ fontSize: '14px', color: '#94a3b8' }}>Fast Claim Validation</p>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        {validators.map((validator, index) => {
                            const stakePercentage = ((validator.stake / totalStake) * 100).toFixed(1);
                            const isActive = validator.status === 'active';

                            return (
                                <div
                                    key={index}
                                    style={{
                                        padding: '16px',
                                        borderRadius: '8px',
                                        border: isActive ? '1px solid rgba(168, 85, 247, 0.3)' : '1px solid #334155',
                                        backgroundColor: isActive ? 'rgba(168, 85, 247, 0.1)' : 'rgba(15, 23, 42, 0.3)',
                                        transition: 'all 0.3s'
                                    }}
                                >
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            <div style={{
                                                width: '8px',
                                                height: '8px',
                                                borderRadius: '999px',
                                                backgroundColor: isActive ? '#a78bfa' : '#64748b',
                                                animation: isActive ? 'pulse 2s infinite' : 'none'
                                            }} />
                                            <span style={{ fontWeight: '500' }}>{validator.name}</span>
                                        </div>
                                        <span style={{
                                            fontSize: '12px',
                                            padding: '4px 8px',
                                            borderRadius: '4px',
                                            backgroundColor: isActive ? 'rgba(168, 85, 247, 0.2)' : '#334155',
                                            color: isActive ? '#c4b5fd' : '#94a3b8'
                                        }}>
                                            {validator.status}
                                        </span>
                                    </div>

                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px' }}>
                                            <span style={{ color: '#94a3b8' }}>Stake:</span>
                                            <span style={{ fontFamily: 'monospace' }}>{validator.stake.toLocaleString()} FGT</span>
                                        </div>

                                        <div>
                                            <div style={{
                                                display: 'flex',
                                                justifyContent: 'space-between',
                                                fontSize: '12px',
                                                color: '#64748b',
                                                marginBottom: '4px'
                                            }}>
                                                <span>Selection Probability</span>
                                                <span>{stakePercentage}%</span>
                                            </div>
                                            <div style={{
                                                height: '8px',
                                                backgroundColor: '#334155',
                                                borderRadius: '999px',
                                                overflow: 'hidden'
                                            }}>
                                                <div style={{
                                                    height: '100%',
                                                    backgroundColor: isActive ? '#a78bfa' : '#64748b',
                                                    width: `${stakePercentage}%`,
                                                    transition: 'all 0.3s'
                                                }} />
                                            </div>
                                        </div>

                                        <div style={{ fontSize: '12px', color: '#64748b' }}>
                                            Last: {validator.lastValidation}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    <div style={{
                        paddingTop: '16px',
                        marginTop: '16px',
                        borderTop: '1px solid #334155'
                    }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', marginBottom: '8px' }}>
                            <span style={{ color: '#94a3b8' }}>Total Stake:</span>
                            <span style={{ fontFamily: 'monospace', fontWeight: 'bold' }}>{totalStake.toLocaleString()} FGT</span>
                        </div>
                        <div style={{ fontSize: '12px', color: '#64748b' }}>
                            PoS enables rapid claim settlement through stake-weighted validation
                        </div>
                    </div>
                </div>
            </div>

            {/* Hybrid Benefits */}
            <div style={{ maxWidth: '1280px', margin: '24px auto 0' }}>
                <div style={{
                    background: 'linear-gradient(to right, rgba(249, 115, 22, 0.1), rgba(168, 85, 247, 0.1), rgba(99, 102, 241, 0.1))',
                    border: '1px solid #334155',
                    borderRadius: '12px',
                    padding: '24px'
                }}>
                    <h3 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '16px' }}>
                        Hybrid Consensus Benefits
                    </h3>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px' }}>
                        <div>
                            <div style={{ fontSize: '14px', color: '#94a3b8', marginBottom: '4px' }}>Security (PoW)</div>
                            <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#fb923c' }}>Immutable</div>
                            <div style={{ fontSize: '12px', color: '#64748b', marginTop: '4px' }}>
                                Cryptographic proof ensures policy integrity
                            </div>
                        </div>
                        <div>
                            <div style={{ fontSize: '14px', color: '#94a3b8', marginBottom: '4px' }}>Speed (PoS)</div>
                            <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#a78bfa' }}>3-4 seconds</div>
                            <div style={{ fontSize: '12px', color: '#64748b', marginTop: '4px' }}>
                                Fast claim validation without heavy computation
                            </div>
                        </div>
                        <div>
                            <div style={{ fontSize: '14px', color: '#94a3b8', marginBottom: '4px' }}>Efficiency</div>
                            <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#4ade80' }}>74% faster</div>
                            <div style={{ fontSize: '12px', color: '#64748b', marginTop: '4px' }}>
                                vs pure PoW consensus mechanism
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
