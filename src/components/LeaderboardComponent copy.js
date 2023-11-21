import React, { useEffect, useState } from 'react';
import GameApiClient from '../services/GameApiClient';

function LeaderboardComponent(props) {
    const [topTenList, setTopTenList] = useState([]);

    let getFirstTenUsers = () => {
        GameApiClient.leaderBoard().then(res => {
            if (res.ok) {
                let boardList = [];
                res.json().then(data => {
                    data.forEach(item => {
                        boardList.push(item);
                    });
                    setTopTenList(boardList);
                })
            }
        })
    }

    useEffect(() => {
        getFirstTenUsers();
    }, [props.flag]);

    return (
        <table>
            <thead>
            <tr>
                <th>사용자 ID</th>
                <th>점수</th>
            </tr>
            </thead>
            <tbody>
            {topTenList.map(a =>
                <tr key={a.userId}>
                    <td>{a.userId}</td>
                    <td>{a.totalScore}</td>
                </tr>
            )}
            </tbody>
        </table>
    );
}

export default LeaderboardComponent;