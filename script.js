let audio = new Audio('./audio.mp3')

function App() {
    // State Hooks
    const [session, setSession] = React.useState(25)
    const [breakSess, setBreakSess] = React.useState(5)
    const [display, setDispaly] = React.useState(25 * 60)
    const [timerOn, setTimerOn] = React.useState(false)
    const [breakOn, setBreakOn] = React.useState(false)

    const playAudio = () => {
        audio.play()
        audio.currentTime = 0
    }

    // break length
    const incrementBreak = () => {
        if (timerOn) {
            return
        }
        else if (breakSess >= 60) {
            setBreakSess(breakSess)
        }
        else {
            setBreakSess(breakSess + 1)
        }
    }

    const decrementBreak = () => {
        if (timerOn) {
            return
        }
        else if (breakSess <= 1) {
            setBreakSess(breakSess)
        }
        else {
            setBreakSess(breakSess - 1)
        }
    }

    // session length
    const incrementSession = () => {
        if (timerOn) {
            return
        }
        else if (session >= 60) {
            setSession(session)
            setDispaly(display)
        }
        else {
            setSession(session + 1)
            setDispaly(display + 60)
        }
        console.log(breakOn, timerOn)
    }

    const decrementSession = () => {
        if (timerOn) {
            return
        }
        else if (session <= 1) {
            setSession(session)
        }
        else {
            setDispaly(display - 60)
            setSession(session - 1)
        }
    }

    // Play/Pause Button Functionality
    const controlTime = () => {
        let sec = 1000
        let date = new Date().getTime()
        let next = date + sec
        let breakOnVar = breakOn

        if (!timerOn) {
            let interval = setInterval(() => {
                date = new Date().getTime()
                if (date > next) {
                    setDispaly((prev) => {
                        if (prev == 0 && !breakOnVar) {
                            playAudio()
                            breakOnVar = true
                            setBreakOn(true)
                            return breakSess * 60
                        }
                        else if (prev == 0 && breakOnVar) {
                            playAudio()
                            breakOnVar = false
                            setBreakOn(false)
                            return session * 60
                        }
                        return prev - 1
                    })
                }
            }, sec)
            localStorage.clear()
            localStorage.setItem('id', interval)
            console.log(breakOn, timerOn)
        }
        if (timerOn) {
            clearInterval(localStorage.getItem('id'))
        }

        // cool trick to toggle true/false
        setTimerOn(!timerOn)
    }

    // Reset Button
    const reset = () => {
        setSession(25)
        setBreakSess(5)
        setDispaly(25 * 60)
        setTimerOn(false)
        setBreakOn(false)
        clearInterval(localStorage.getItem('id'))
        audio.currentTime = 0
        audio.pause()
    }

    return (
        <div className="container">
            <div className="title">
                <h1>Pomodoro Clock Timer</h1>
            </div>
            <BreakSession
                breakSess={breakSess}
                session={session}
                incrementBreak={incrementBreak}
                decrementBreak={decrementBreak}
                incrementSession={incrementSession}
                decrementSession={decrementSession}
            />
            <Timer
                session={session}
                display={display}
                breakOn={breakOn}
            />
            <Button
                timer={timerOn}
                controlTime={controlTime}
                reset={reset}
                display={display}
            />
            <Author />
        </div>
    )
}

function BreakSession({ breakSess, session, incrementBreak, decrementBreak, incrementSession, decrementSession }) {
    return (
        <div className="session">
            <div id="break-label">
                <h3>Break Length</h3>
                <div className="timeWrapper">
                    <button
                        id="break-decrement"
                        onClick={decrementBreak}
                    >
                        <i className="fas fa-minus"></i>
                    </button>

                    <div id="break-length">
                        {breakSess}
                    </div>

                    <button
                        id="break-increment"
                        onClick={incrementBreak}
                    >
                        <i className="fas fa-plus"></i>
                    </button>
                </div>
            </div>

            <div id="session-label">
                <h3>Session Length</h3>
                <div className="timeWrapper">
                    <button
                        id="session-decrement"
                        onClick={decrementSession}
                    >
                        <i className="fas fa-minus"></i>
                    </button>

                    <div id="session-length">{session}</div>

                    <button
                        id="session-increment"
                        onClick={incrementSession}
                    >
                        <i className="fas fa-plus"></i>
                    </button>
                </div>
            </div>
        </div>
    )
}

function Timer({ display, breakOn }) {
    const aaa = (time) => {
        const min = Math.floor(time / 60)
        const sec = time % 60

        return (
            (min < 10 ? '0' + min : min) +
            ':' +
            (sec < 10 ? '0' + sec : sec)
        )
    }

    return (
        <div className="time-wrapper">
            <div id="timer-label">
                <h1>{!breakOn ? "Session" : "Break has begun"}</h1>
            </div>
            <div id="time-left">
                <h4>{aaa(display)}</h4>
            </div>
        </div>

    )
}

function Button({ timer, reset, controlTime }) {
    return (
        <div className="time-button">
            <button
                id="start_stop"
                type="button"
                onClick={controlTime}
            >
                {timer ?
                    (<i className="fas fa-pause fa-2x"></i>) :
                    (<i className="fas fa-play fa-2x"></i>)}
            </button>
            <button
                id="reset"
                type="button"
                onClick={reset}
            >
                <i className="fas fa-redo fa-2x"></i>
            </button>
        </div>
    )
}

function Author() {
    return (
        <div className="author">
            <h5>Made by</h5>
            <a href="https://codepen.io/your-work/" target='_blank'><h4>George Shalamberidze</h4></a>
        </div>
    )
}

ReactDOM.render(<App />, document.getElementById('root'))

