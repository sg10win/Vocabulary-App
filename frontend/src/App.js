import React, { useState, useEffect } from "react";
import "./App.css";


//const API_URL = "http://127.0.0.1:8000";
const API_URL = "https://vocabularyappapi-production.up.railway.app";  

const WordTable = () => {
    const [words, setWords] = useState([]);
    const [visibleSentences, setVisibleSentences] = useState({});
    
    useEffect(() => {
        fetch(`${API_URL}/words`)
            .then(response => response.json())
            .then(data => setWords(data))
            .catch(error => console.error("Error fetching words:", error));
    }, []);

    const toggleSentence = (word) => {
        setVisibleSentences(prev => ({
            ...prev,
            [word]: !prev[word]
        }));
    };

    const updateState = async (word, state) => {
        try {
            await fetch(`${API_URL}/update_word?word=${word}&state=${state}`, {
                method: "POST"
            });

            setWords(prevWords =>
                prevWords.map(w =>
                    w.Word === word ? { ...w, std_state: state } : w
                )
            );
        } catch (error) {
            console.error("Error updating word state:", error);
        }
    };

    return (
        <div className="container">
            <h1>Study Words</h1>
            <table className="word-table">
                <thead>
                    <tr>
                        <th className='wordcol'>Word</th>
                        <th className='trancol'>Translation</th>
                        <th className='actioncol'>Actions</th>
                    </tr>
                </thead>
                <tbody>

                    {words.map((wordItem) => (
                        <React.Fragment key={wordItem.Word}>
                            <tr>
                                <td>{wordItem.Word}</td>
                                <td>{wordItem.Translation}</td>
                                <td className="action-cell">
                                    <div className="button-row">
                                        <button className="btn btn-toggle" onClick={() => toggleSentence(wordItem.Word)}>
                                            {visibleSentences[wordItem.Word] ? "🔼" : "🔽"}
                                        </button>
                                        <button 
                                            className={`btn btn-unknown ${wordItem.std_state === 0 ? "active" : ""}`} 
                                            onClick={() => updateState(wordItem.Word, 0)}
                                        >
                                            ❌
                                        </button>
                                        <button 
                                            className={`btn btn-known ${wordItem.std_state === 1 ? "active" : ""}`} 
                                            onClick={() => updateState(wordItem.Word, 1)}
                                        >
                                            ✔
                                        </button>
                                        
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <td colSpan="3">
                                    <div className={`sentence-container ${visibleSentences[wordItem.Word] ? "show" : ""}`}>
                                        <div className="sentence">{wordItem.Sentence}</div>
                                    </div>
                                </td>
                            </tr>
                        </React.Fragment>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default WordTable;
