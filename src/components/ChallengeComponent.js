import React, { useEffect, useState } from "react";
import RpsApiClient from "../services/RpsApiClient";
import LastAttemptsComponent from './LastAttemptsComponent';
import StatsComponent from './StatsComponent';
import LeaderboardComponent from './LeaderboardComponent'
import 'bootstrap/dist/css/bootstrap.min.css';

function ChallengeComponent() {
    const [userChoice, setUserChoice] = useState('');
    const [user, setUser] = useState('');
    const [message, setMessage] = useState('');
    const [lastAttempts, setLastAttempts] = useState([]);
    const [userId, setUserId] = useState('');
    const [actionFlag, setActionFlag] = useState(1);


    let handleChangeName = (event) => {
        setUser(event.target.value);
    }

    let getImageSource = (index) => {
        let img_src = "";
        switch(index) {
            case '0':
                img_src = '/image/rps.png';
                break;
            case '가위':
                img_src = '/image/scissors.png';
                break;
            case '바위':
                img_src = '/image/rock.png';
                break;
            case '보':
                img_src = '/image/paper.png';
                break;
            default:
                img_src = '/image/rps.png';
        }
        return img_src;
    }

    let handleChangeImage = () => {
        let choice = document.querySelector('#rps');
        let user_image = document.querySelector('#userImage');
        user_image.src = getImageSource(choice.options[choice.selectedIndex].value);
        setUserChoice(choice.options[choice.selectedIndex].value);
    }

    let handleChangeOpponentImage = (oppChoice) => {
        let oppo_image = document.querySelector('#opponentImage');
        oppo_image.src = getImageSource(oppChoice);
    }

    let updateLastAttempts = (userAlias) => {
        RpsApiClient.getAttempts(userAlias).then(res => {
            if (res.ok) {
                let attempts = [];
                res.json().then(data => {
                    data.forEach(item => {
                        attempts.push(item);
                    });
                    setLastAttempts(attempts);
                })
            }
        })
    }

    let handleSubmitResult = (event) => {
        RpsApiClient.sendChoise(user, userChoice)
            .then(res => {
                if (res.ok) {
                    res.json().then(json => {
                        setUserId(json.userId);
                        setActionFlag(actionFlag * -1);
                        console.log("json.userId: " + json.userId);
                        console.log("actionFlag: " + actionFlag);
                        if (json.outcome === '승') {
                            updateMessage("이겼습니다!");
                        } else if (json.outcome === '패') {
                            updateMessage("졌습니다! 그래도 포기하지 마세요!");
                        }else {
                            updateMessage("비겼습니다! 다시 한 번 도전해 보세요!");
                        }
                        handleChangeOpponentImage(json.opponent);
                        updateLastAttempts(user);
                    });
                } else {
                   updateMessage("Error: server error or not available");
                }
            });
    }

    let updateMessage = (m)=> {
        setMessage(m);
    }

    useEffect(() => {
        let choice = document.querySelector('#rps');
        let user = document.querySelector('#user');
        choice.selectedIndex = "0";
        user.value = "";
        let user_image = document.querySelector('#userImage');
        user_image.src = '/image/rps.png';
        let computer_choice = document.querySelector('#opponentImage');
        computer_choice.src = '/image/rps.png';
    }, []);

    return (
        <div className="container">
            <div className="row">
                <div className="col-md-12">
                    <h1>가위 바위 보 게임</h1>
                </div>
            </div>
            <div className="row">
                <div className="col-md-6">
                    <h2>오늘의 도전</h2>
                    <label htmlFor="rps">당신의 선택: </label>
                    <select name="rps_choice" id="rps" onChange={handleChangeImage} className="selectpicker">
                        <option value="0">선택</option>
                        <option value="가위">가위</option>
                        <option value="바위">바위</option>
                        <option value="보">보</option>
                    </select>
                    <img id="userImage" src="" width="55" height="65" alt="사용자선택"/>
                    <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
                    <label htmlFor="opponentImage">컴퓨터 선택: </label>
                    <img id="opponentImage" src="" width="55" height="65" alt="컴퓨터선택" /><br/>
                    <form id="attempt-form">
                        <div className="form-group">
                            <label htmlFor="user">닉네임:</label>
                            <input type="text" name="user-alias" id="user" className="form-control"
                            value={user} onChange={handleChangeName} />
                        </div>
                        <input type="button" value="확인" onClick={handleSubmitResult} className="btn btn-outline-success"/>
                    </form>
                    <div className="card text-dark bg-info">
                        <div className="card-body">
                        <h5 className="card-title">결과</h5>
                        <p className="card-text result-message">{message}</p>
                        </div>
                    </div>
                    <StatsComponent id={userId} flag={actionFlag}/>
                </div>
                <div className="col-md-6">
                    <h3>리더보드</h3>
                    <LeaderboardComponent flag={actionFlag}/>
                    <div>
                        <h2>최근 답안</h2>
                        {lastAttempts.length > 0 &&
                            <LastAttemptsComponent lastAttempts={lastAttempts}/>
                        }
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ChallengeComponent;