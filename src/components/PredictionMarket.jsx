import React, { useState, useEffect, useRef } from 'react';
import { ArrowUp, ArrowDown, Check, X, Info, TrendingUp, Clock, Award, Send, BarChart, Zap, User, Bot } from 'lucide-react';

const AIPredictionMarketplace = () => {
  // State for the application
  const [balance, setBalance] = useState(1000);
  const [predictions, setPredictions] = useState([]);
  const [userBets, setUserBets] = useState({});
  const [betAmount, setBetAmount] = useState(100);
  const [showRules, setShowRules] = useState(false);
  const [timeToNextPrediction, setTimeToNextPrediction] = useState(60); // seconds
  const [showHistory, setShowHistory] = useState(false);
  const [showDetailedAnalysis, setShowDetailedAnalysis] = useState(false);
  const [selectedPrediction, setSelectedPrediction] = useState(null);
  const [chatMessages, setChatMessages] = useState([
    { sender: 'system', text: 'Welcome to DegenAI Prediction Market! Ready to bet against the machine?' },
    { sender: 'system', text: 'Current hot prediction: BTC looking bullish!' },
  ]);
  const [currentMessage, setCurrentMessage] = useState('');
  const chatEndRef = useRef(null);

  // Sample prediction data
  const sampleData = [
    {
      id: 1,
      token: 'BTC',
      direction: 'up',
      confidence: 72,
      timeframe: '1 hour',
      timestamp: new Date().getTime(),
      result: null,
      reasoning: 'Recent market sentiment is positive with increasing trading volume and key resistance levels being tested.',
      technicalAnalysis: {
        rsi: '58.3 (neutral with bullish divergence)',
        macd: 'MACD line crossing above signal line',
        volume: '32% increase in the last 4 hours'
      },
      onChainMetrics: {
        exchangeOutflows: '$142M net outflow in last 6 hours',
        whaleActivity: '3 whale accumulation transactions detected',
        networkHashrate: '2.4% increase in the last 24 hours'
      },
      sentiment: {
        socialMedia: '76% positive mentions across Twitter/X and Reddit',
        news: '4 positive headlines from major publications in last 2 hours',
        fearGreedIndex: '65 (Greed)'
      },
      status: 'active',
      aiAvatar: Math.floor(Math.random() * 5) + 1,
      betsCorrect: 145,
      betsIncorrect: 87
    }
  ];

  // Initialize with sample predictions
  useEffect(() => {
    setPredictions(sampleData);
  }, []);
  
  // Auto-scroll chat to bottom when new messages arrive
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);
  
  // Countdown timer for next prediction
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeToNextPrediction(prev => {
        if (prev <= 1) {
          generateNewPrediction();
          return 60;
        }
        return prev - 1;
      });
    }, 1000);
    
    return () => clearInterval(timer);
  }, []);

  // Generate a new AI prediction
  const generateNewPrediction = () => {
    const tokens = ['BTC', 'ETH', 'SOL', 'ADA', 'DOT', 'DOGE', 'SHIB', 'AVAX', 'PEPE', 'LINK'];
    const randomToken = tokens[Math.floor(Math.random() * tokens.length)];
    const randomDirection = Math.random() > 0.5 ? 'up' : 'down';
    const randomConfidence = Math.floor(Math.random() * 30) + 50;
    
    const newPrediction = {
      id: predictions.length + 1,
      token: randomToken,
      direction: randomDirection,
      confidence: randomConfidence,
      timeframe: '1 hour',
      timestamp: new Date().getTime(),
      result: null,
      reasoning: 'Market analysis indicates potential movement based on technical indicators and sentiment.',
      technicalAnalysis: {
        rsi: `${Math.floor(Math.random() * 30) + 40}.${Math.floor(Math.random() * 10)} (neutral)`,
        macd: 'MACD line showing momentum',
        volume: `${Math.floor(Math.random() * 50) + 20}% increase in volume`
      },
      onChainMetrics: {
        exchangeFlows: `$${Math.floor(Math.random() * 200) + 50}M net flow`,
        whaleActivity: `${Math.floor(Math.random() * 5) + 1} whale transactions detected`,
        networkActivity: `${Math.floor(Math.random() * 20) + 10}% change in activity`
      },
      sentiment: {
        socialMedia: `${Math.floor(Math.random() * 30) + 60}% positive mentions`,
        news: `${Math.floor(Math.random() * 5) + 1} positive headlines`,
        fearGreedIndex: `${Math.floor(Math.random() * 40) + 40} (Neutral)`
      },
      status: 'active',
      aiAvatar: Math.floor(Math.random() * 5) + 1,
      betsCorrect: Math.floor(Math.random() * 100) + 50,
      betsIncorrect: Math.floor(Math.random() * 80) + 30
    };
    
    setPredictions(prev => [newPrediction, ...prev]);
    setChatMessages(prev => [...prev, { 
      sender: 'ai', 
      text: `New prediction: ${newPrediction.token} will go ${newPrediction.direction.toUpperCase()} in the next hour! Confidence: ${newPrediction.confidence}%` 
    }]);
  };

  // Place a bet
  const placeBet = (predictionId, onCorrect) => {
    if (balance < betAmount) {
      alert("Insufficient balance!");
      return;
    }
    
    setBalance(prev => prev - betAmount);
    setUserBets(prev => ({
      ...prev,
      [predictionId]: {
        amount: betAmount,
        onCorrect: onCorrect,
        timestamp: new Date().getTime(),
        outcome: null,
        won: null
      }
    }));
    
    setPredictions(prevPredictions => 
      prevPredictions.map(pred => {
        if (pred.id === predictionId) {
          return {
            ...pred,
            betsCorrect: onCorrect ? pred.betsCorrect + 1 : pred.betsCorrect,
            betsIncorrect: !onCorrect ? pred.betsIncorrect + 1 : pred.betsIncorrect
          };
        }
        return pred;
      })
    );
    
    setChatMessages(prev => [...prev, { 
      sender: 'system', 
      text: `You bet ${betAmount} $DEGEN that AI will be ${onCorrect ? 'RIGHT' : 'WRONG'}!` 
    }]);
  };

  // Add funds
  const addFunds = () => {
    setBalance(prev => prev + 1000);
    setChatMessages(prev => [...prev, { 
      sender: 'system', 
      text: `You added 1000 $DEGEN tokens to your balance! Current balance: ${balance + 1000}` 
    }]);
  };

  // Format time
  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString();
  };

  // Send chat message
  const sendChatMessage = () => {
    if (!currentMessage.trim()) return;
    
    setChatMessages(prev => [...prev, { 
      sender: 'user', 
      text: currentMessage 
    }]);
    
    setTimeout(() => {
      const aiResponses = [
        "This is just a demo, but in the full version I'd respond to your market questions!",
        "WAGMI! Keep betting on these predictions!",
        "Remember, this is a game about predicting if I'm right or wrong, not financial advice!",
        "I analyze tons of market data to make these predictions, but I can still be wrong!",
        "Did you see that last BTC prediction? Pure alpha!"
      ];
      
      setChatMessages(prev => [...prev, { 
        sender: 'ai', 
        text: aiResponses[Math.floor(Math.random() * aiResponses.length)] 
      }]);
    }, 1000);
    
    setCurrentMessage('');
  };

  // Handle Enter key press
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      sendChatMessage();
    }
  };

  // Show prediction details
  const showPredictionDetails = (prediction) => {
    setSelectedPrediction(prediction);
    setShowDetailedAnalysis(true);
  };

  // Get active and completed predictions
  const activePrediction = predictions.find(pred => pred.status === 'active');
  const completedPredictions = predictions.filter(pred => pred.status === 'completed');

  return (
    <div className="min-h-screen bg-gray-900 p-4">
      <div className="max-w-5xl mx-auto">
        <header className="bg-gradient-to-r from-purple-800 to-blue-800 text-white p-4 rounded-lg shadow-lg mb-6 border border-purple-500">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold flex items-center">
                <Zap size={28} className="text-yellow-400 mr-2" />
                DegenAI Prediction Market
              </h1>
              <p className="text-blue-200">Bet against the machine, win magic internet money</p>
            </div>
            <div className="text-right">
              <div className="bg-black bg-opacity-50 p-3 rounded-lg border border-green-500 shadow-lg shadow-green-500/30">
                <p className="text-xl font-bold text-green-400">{balance} $DEGEN</p>
                <button 
                  onClick={addFunds} 
                  className="mt-2 bg-green-600 text-white text-sm py-1 px-2 rounded hover:bg-green-700 transition-all hover:scale-105"
                >
                  + Ape In More
                </button>
              </div>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Main prediction area */}
          <div className="md:col-span-2">
            <div className="bg-black bg-opacity-70 rounded-lg shadow-lg border border-purple-600 p-4 mb-6">
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center">
                  <Clock size={20} className="text-purple-400 mr-2" />
                  <span className="font-medium text-white">Next prediction: </span>
                  <span className="ml-2 text-2xl font-bold text-yellow-400">{timeToNextPrediction}s</span>
                </div>
                <div className="flex gap-2">
                  <button 
                    onClick={() => setShowHistory(!showHistory)}
                    className="flex items-center bg-purple-800 hover:bg-purple-700 text-white py-1 px-3 rounded text-sm border border-purple-500 transition-all"
                  >
                    <BarChart size={16} className="mr-1" />
                    History
                  </button>
                  <button 
                    onClick={() => setShowRules(!showRules)}
                    className="flex items-center bg-blue-800 hover:bg-blue-700 text-white py-1 px-3 rounded text-sm border border-blue-500 transition-all"
                  >
                    <Info size={16} className="mr-1" />
                    How to Play
                  </button>
                </div>
              </div>

              {showRules && (
                <div className="mt-3 p-3 bg-gray-800 rounded text-sm text-gray-200 border border-gray-700 mb-4">
                  <h3 className="font-bold mb-2 text-yellow-400">HOW TO PLAY:</h3>
                  <ol className="list-decimal ml-5 space-y-1">
                    <li>Every hour, DegenAI predicts if a token will go UP or DOWN</li>
                    <li>You bet if the AI will be RIGHT or WRONG (not on the price)</li>
                    <li>Correct bets DOUBLE your money, wrong bets LOSE everything</li>
                    <li>Top players appear on the weekly leaderboard</li>
                    <li>This is gambling. Don't bet what you can't afford to lose!</li>
                  </ol>
                </div>
              )}

              {/* Current active prediction */}
              {activePrediction && (
                <div className="bg-gradient-to-r from-blue-900 to-purple-900 rounded-lg p-5 border border-blue-400 shadow-lg mb-6 relative overflow-hidden">
                  <div className="absolute top-0 right-0 bg-black bg-opacity-70 text-xs text-white px-2 py-1 rounded-bl">
                    AI #{activePrediction.aiAvatar}
                  </div>

                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                      <div className="bg-black bg-opacity-50 p-2 rounded-lg border border-gray-700 mr-3">
                        <span className="text-3xl font-mono font-bold text-white">{activePrediction.token}</span>
                      </div>
                      <div>
                        <div className="text-xs text-gray-400 mb-1">TIMEFRAME</div>
                        <div className="bg-black bg-opacity-50 px-2 py-1 rounded text-xs text-white border border-gray-700">
                          {activePrediction.timeframe}
                        </div>
                      </div>
                    </div>

                    <div className="text-center">
                      <div className="text-xs text-gray-400 mb-1">PREDICTION</div>
                      {activePrediction.direction === 'up' ? (
                        <div className="bg-green-900 bg-opacity-70 px-4 py-2 rounded-lg border border-green-600 text-green-400 font-bold flex items-center">
                          <ArrowUp size={20} className="mr-1" />
                          UP
                        </div>
                      ) : (
                        <div className="bg-red-900 bg-opacity-70 px-4 py-2 rounded-lg border border-red-600 text-red-400 font-bold flex items-center">
                          <ArrowDown size={20} className="mr-1" />
                          DOWN
                        </div>
                      )}
                    </div>

                    <div className="text-center">
                      <div className="text-xs text-gray-400 mb-1">CONFIDENCE</div>
                      <div className="bg-black bg-opacity-50 px-3 py-2 rounded-lg border border-yellow-600">
                        <span className="text-xl font-bold text-yellow-400">{activePrediction.confidence}%</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-black bg-opacity-50 p-3 rounded-lg border border-gray-700 mb-6">
                    <div className="text-xs text-gray-400 mb-1 flex justify-between items-center">
                      <span>AI REASONING:</span>
                      <button 
                        className="text-xs bg-blue-900 hover:bg-blue-800 px-2 py-1 rounded text-blue-200 flex items-center"
                        onClick={() => showPredictionDetails(activePrediction)}
                      >
                        Show Analysis Details
                      </button>
                    </div>
                    <p className="text-white text-sm italic mb-1">"{activePrediction.reasoning}"</p>
                  </div>

                  {/* Community stats */}
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="bg-green-900 bg-opacity-30 rounded-lg p-3 border border-green-700 relative">
                      <div className="absolute top-0 right-0 bg-green-900 text-xs text-white px-2 py-1 rounded-bl">
                        {Math.round((activePrediction.betsCorrect / (activePrediction.betsCorrect + activePrediction.betsIncorrect)) * 100)}%
                      </div>
                      <p className="text-xs text-gray-400 mb-1">PLAYERS BETTING AI IS RIGHT</p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="w-6 h-6 rounded-full bg-green-700 text-white flex items-center justify-center mr-2">
                            <User size={12} />
                          </div>
                          <span className="text-green-400 text-xl font-bold">{activePrediction.betsCorrect}</span>
                        </div>
                        <div className="text-green-400 font-bold flex items-center">
                          <Check size={16} className="mr-1" />
                          RIGHT
                        </div>
                      </div>
                    </div>

                    <div className="bg-red-900 bg-opacity-30 rounded-lg p-3 border border-red-700 relative">
                      <div className="absolute top-0 right-0 bg-red-900 text-xs text-white px-2 py-1 rounded-bl">
                        {Math.round((activePrediction.betsIncorrect / (activePrediction.betsCorrect + activePrediction.betsIncorrect)) * 100)}%
                      </div>
                      <p className="text-xs text-gray-400 mb-1">PLAYERS BETTING AI IS WRONG</p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="w-6 h-6 rounded-full bg-red-700 text-white flex items-center justify-center mr-2">
                            <User size={12} />
                          </div>
                          <span className="text-red-400 text-xl font-bold">{activePrediction.betsIncorrect}</span>
                        </div>
                        <div className="text-red-400 font-bold flex items-center">
                          <X size={16} className="mr-1" />
                          WRONG
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3 justify-center mb-2">
                    <div className="w-full sm:w-1/3">
                      <input
                        type="number"
                        min="10"
                        max={balance}
                        value={betAmount}
                        onChange={(e) => setBetAmount(parseInt(e.target.value))}
                        className="w-full p-3 bg-black bg-opacity-70 border border-gray-600 rounded-lg text-white text-xl font-mono"
                      />
                    </div>
                    <button
                      onClick={() => placeBet(activePrediction.id, true)}
                      className="w-full sm:w-1/3 bg-green-600 text-white py-3 px-4 rounded-lg font-bold text-lg hover:bg-green-700 border border-green-500 transition-all hover:scale-105 flex items-center justify-center"
                      disabled={userBets[activePrediction.id]}
                    >
                      <Check size={20} className="mr-2" />
                      AI IS RIGHT
                    </button>
                    <button
                      onClick={() => placeBet(activePrediction.id, false)}
                      className="w-full sm:w-1/3 bg-red-600 text-white py-3 px-4 rounded-lg font-bold text-lg hover:bg-red-700 border border-red-500 transition-all hover:scale-105 flex items-center justify-center"
                      disabled={userBets[activePrediction.id]}
                    >
                      <X size={20} className="mr-2" />
                      AI IS WRONG
                    </button>
                  </div>

                  {userBets[activePrediction.id] && (
                    <div className="bg-blue-900 bg-opacity-50 p-3 rounded-lg border border-blue-600 text-center mt-3">
                      <p className="text-blue-200">
                        You bet {userBets[activePrediction.id].amount} $DEGEN that the AI will be {userBets[activePrediction.id].onCorrect ? 'correct' : 'incorrect'}!
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* AI Prediction History */}
              {showHistory && (
                <div className="bg-black bg-opacity-70 rounded-lg p-4 border border-gray-700 mb-6">
                  <div className="flex items-center mb-3">
                    <BarChart size={20} className="text-purple-400 mr-2" />
                    <h2 className="text-xl font-bold text-white">AI Prediction History</h2>
                  </div>
                  
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm text-gray-200">
                      <thead className="bg-gray-800 text-gray-400">
                        <tr>
                          <th className="p-2 text-left">Token</th>
                          <th className="p-2 text-left">Direction</th>
                          <th className="p-2 text-left">Time</th>
                          <th className="p-2 text-left">Result</th>
                          <th className="p-2 text-left">Analysis</th>
                          <th className="p-2 text-left">Community</th>
                          <th className="p-2 text-left">Your Bet</th>
                        </tr>
                      </thead>
                      <tbody>
                        {completedPredictions.map(pred => {
                          const userBet = userBets[pred.id];
                          return (
                            <tr key={pred.id} className="border-t border-gray-700">
                              <td className="p-2 font-mono">{pred.token}</td>
                              <td className="p-2">
                                {pred.direction === 'up' ? (
                                  <span className="text-green-400 flex items-center">
                                    <ArrowUp size={14} className="mr-1" />UP
                                  </span>
                                ) : (
                                  <span className="text-red-400 flex items-center">
                                    <ArrowDown size={14} className="mr-1" />DOWN
                                  </span>
                                )}
                              </td>
                              <td className="p-2">{formatTime(pred.timestamp)}</td>
                              <td className="p-2">
                                {pred.result === 'correct' ? (
                                  <span className="text-green-400 flex items-center">
                                    <Check size={14} className="mr-1" />Correct
                                  </span>
                                ) : (
                                  <span className="text-red-400 flex items-center">
                                    <X size={14} className="mr-1" />Wrong
                                  </span>
                                )}
                              </td>
                              <td className="p-2">
                                <button 
                                  onClick={() => showPredictionDetails(pred)}
                                  className="text-xs bg-blue-900 hover:bg-blue-800 px-2 py-1 rounded text-blue-200"
                                >
                                  View Analysis
                                </button>
                              </td>
                              <td className="p-2">
                                <div className="flex items-center text-xs">
                                  <div className="w-4 h-4 bg-green-800 rounded-sm flex items-center justify-center mr-1">
                                    <Check size={10} className="text-green-400" />
                                  </div>
                                  <span className="text-green-400 mr-2">{pred.betsCorrect}</span>
                                  <div className="w-4 h-4 bg-red-800 rounded-sm flex items-center justify-center mr-1">
                                    <X size={10} className="text-red-400" />
                                  </div>
                                  <span className="text-red-400">{pred.betsIncorrect}</span>
                                </div>
                              </td>
                              <td className="p-2">
                                {userBet ? (
                                  <span className={userBet.won ? "text-green-400" : "text-red-400"}>
                                    {userBet.amount} on {userBet.onCorrect ? "RIGHT" : "WRONG"} ({userBet.won ? "WON" : "LOST"})
                                  </span>
                                ) : (
                                  <span className="text-gray-500">No bet</span>
                                )}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Your betting history */}
              <div className="bg-black bg-opacity-70 rounded-lg p-4 border border-gray-700">
                <div className="flex items-center mb-3">
                  <Award size={20} className="text-yellow-400 mr-2" />
                  <h2 className="text-xl font-bold text-white">Your Betting Stats</h2>
                </div>
                
                {Object.keys(userBets).length > 0 ? (
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div className="bg-blue-900 bg-opacity-40 p-3 rounded-lg border border-blue-700">
                      <div className="text-xs text-gray-400 mb-1">TOTAL BETS</div>
                      <div className="text-2xl font-bold text-white">{Object.keys(userBets).length}</div>
                    </div>
                    <div className="bg-green-900 bg-opacity-40 p-3 rounded-lg border border-green-700">
                      <div className="text-xs text-gray-400 mb-1">WIN RATE</div>
                      <div className="text-2xl font-bold text-green-400">
                        {Object.values(userBets).filter(bet => bet.outcome).length > 0 
                          ? Math.round(
                              (Object.values(userBets).filter(bet => bet.won).length / 
                              Object.values(userBets).filter(bet => bet.outcome).length) * 100
                            )
                          : 0}%
                      </div>
                    </div>
                  </div>
                ) : (
                  <p className="text-gray-400 italic text-center">No bets placed yet. Start betting!</p>
                )}
              </div>
            </div>
          </div>

          {/* Chat section */}
          <div className="md:col-span-1">
            <div className="bg-black bg-opacity-70 rounded-lg p-4 border border-gray-700 h-[calc(100vh-2rem)] flex flex-col">
              <div className="flex items-center mb-4">
                <Send size={20} className="text-purple-400 mr-2" />
                <h2 className="text-xl font-bold text-white">Live Chat</h2>
              </div>
              
              <div className="flex-1 overflow-y-auto mb-4 space-y-2">
                {chatMessages.map((message, index) => {
                  if (message.sender === 'system') {
                    return (
                      <div key={index} className="bg-gray-800 text-gray-200 rounded py-2 px-3 mb-2 text-sm">
                        <span className="font-bold text-yellow-400">SYSTEM:</span> {message.text}
                      </div>
                    );
                  } else if (message.sender === 'ai') {
                    return (
                      <div key={index} className="flex mb-2">
                        <div className="w-8 h-8 rounded-full bg-purple-600 text-white flex items-center justify-center mr-2">
                          <Bot size={16} />
                        </div>
                        <div className="bg-purple-900 text-gray-100 rounded-lg py-2 px-3 max-w-[80%] text-sm">
                          {message.text}
                        </div>
                      </div>
                    );
                  } else {
                    return (
                      <div key={index} className="flex mb-2 justify-end">
                        <div className="bg-green-600 text-white rounded-lg py-2 px-3 max-w-[80%] text-sm">
                          {message.text}
                        </div>
                        <div className="w-8 h-8 rounded-full bg-green-700 text-white flex items-center justify-center ml-2">
                          <User size={16} />
                        </div>
                      </div>
                    );
                  }
                })}
                <div ref={chatEndRef} />
              </div>
              
              <div className="flex gap-2">
                <input
                  type="text"
                  value={currentMessage}
                  onChange={(e) => setCurrentMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Type your message..."
                  className="flex-1 bg-gray-800 text-white rounded-lg px-3 py-2 border border-gray-700 focus:outline-none focus:border-purple-500"
                />
                <button
                  onClick={sendChatMessage}
                  className="bg-purple-600 text-white rounded-lg px-4 py-2 hover:bg-purple-700 transition-all"
                >
                  Send
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIPredictionMarketplace; 