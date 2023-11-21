import React from "react";
import 'bootstrap/dist/css/bootstrap.min.css';

function LastAttemptsComponent(props) {
    return (
        <table className="table">
            <thead>
            <tr>
                <th>답안 ID</th>
                <th>사용자</th>
                <th>컴퓨터</th>
                <th>결과</th>
            </tr>
            </thead>
            <tbody>
            {props.lastAttempts.map(a =>
                <tr key={a.id} className={a.outcome === '승'? 'table-success' : a.outcome === '패'? 'table-danger' : 'table-warning' }>
                    <td>{a.id}</td>
                    <td>{a.user}</td>
                    <td>{a.opponent}</td>
                    <td>{a.outcome}</td>
                </tr>
            )}
            </tbody>
        </table>
    );
}

export default LastAttemptsComponent;