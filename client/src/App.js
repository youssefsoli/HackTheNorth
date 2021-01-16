// import './App.css';
import React, { useEffect, useRef, useState } from 'react';
import Webcam from 'react-webcam';
import * as posenet from '@tensorflow-models/posenet';
import FlappyBird from './games/FlappyBird';
import useNet from './useLoadNet';

function App() {
    const webcamRef = useRef(null);
    const canvasRef = useRef(null);
    const net = useNet({
        inputResolution: { width: 160, height: 120 },
        scale: 0.8,
    });
    const [pose, setPose] = useState(false);

    useEffect(() => {
        if (!net) return () => {}
        if ([net].some(elem => elem instanceof Error)) return () => {}

        //  Load posenet
        const runPosenet = async () => {
            setInterval(() => {
                detect(net);
            }, 50);
        };
        console.log(net);
        runPosenet();
    }, [net]);

    const detect = async net => {
        if (
            typeof webcamRef.current !== 'undefined' &&
            webcamRef.current !== null &&
            webcamRef.current.video.readyState === 4 &&
            net !== null
        ) {
            // Get Video Properties
            const video = webcamRef.current.video;
            const videoWidth = webcamRef.current.video.videoWidth;
            const videoHeight = webcamRef.current.video.videoHeight;

            // Set video width
            webcamRef.current.video.width = videoWidth;
            webcamRef.current.video.height = videoHeight;

            // Make Detections
            const pose = await net.estimateSinglePose(video);
            setPose(pose);
        }
    };

    return (
        <div className="App">
            <header className="App-header">
                <Webcam
                    ref={webcamRef}
                    style={{
                        position: 'absolute',
                        marginLeft: 'auto',
                        marginRight: 'auto',
                        left: 0,
                        right: 0,
                        textAlign: 'center',
                        zindex: 9,
                        width: 640,
                        height: 480,
                    }}
                />

                <canvas
                    ref={canvasRef}
                    style={{
                        position: 'absolute',
                        marginLeft: 'auto',
                        marginRight: 'auto',
                        left: 0,
                        right: 0,
                        textAlign: 'center',
                        zindex: 9,
                        width: 640,
                        height: 480,
                    }}
                />
                <FlappyBird
                    pose={pose}
                    style={{
                        position: 'absolute',
                        marginLeft: 'auto',
                        marginRight: 'auto',
                        left: 0,
                        right: 0,
                        textAlign: 'center',
                        zindex: 9,
                        width: 640,
                        height: 480,
                    }}
                />
            </header>
        </div>
    );
}

export default App;
