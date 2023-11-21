import React, { useEffect, useState } from 'react';
import GameApiClient from '../services/GameApiClient';

function StatsComponent(props) {
    const [userId, setUserID] = useState('');
    const [score, setScore] = useState('');
    const [badges, setBadges] = useState([]);

    let refreshStats = (id) => {
        GameApiClient.getStats(id).then(
            res => {
                if(res.ok) {
                    res.json().then(json =>{
                        setUserID(json.userId);
                        setScore(json.score);
                        setBadges(json.badges);
                    })
                } else {
                    console.log('Error mapping user id');
                    setScore('데이터를 가져오지 못했습니다!');
                }
                
            }
        );
    }

    useEffect(() => {
        refreshStats(props.id);
    }, [props.flag]);

    return (
        <div>
            <h3>통계</h3>
            <table>
            <tbody>
                <tr>
                    <td>사용자 ID:</td>
                    <td>{userId}</td>
                </tr>
                <tr>
                    <td>점수:</td>
                    <td>{score}</td>
                </tr>
                <tr>
                    <td>배지:</td>
                    <td>{badges.map(b => <span className="badge" key={b}>{b}</span>)}</td>
                </tr>
                </tbody>
            </table>
        </div>
    );
}

export default StatsComponent;
