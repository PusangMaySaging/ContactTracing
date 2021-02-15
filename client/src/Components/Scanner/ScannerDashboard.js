import React, { useState, useEffect,useRef } from 'react';
import QrReader from 'react-qr-scanner';
import { Redirect } from 'react-router-dom'
import axios from 'axios';




function ScannerDashboard({  }) {
    const [findScan, setScan] = useState(false)
    const [user, setUser] = useState({
        room: "NONE"
    });
    function handleError() {
        console.log("ERROR")
    }
    function handleHandleScan(result) {
        if (result !== null && findScan === false) {
            let qrCode = result.text;
            setScan(true);
            sendData(qrCode);
        }
    }
    const scannerMessageRef = useRef();
    async function sendData(qrCode) {
        const {data} = await axios.post('http://localhost:5000/room/createlog', { qrCode: qrCode,location:user.room})
        if(data === "OK"){
            scannerMessageRef.current.innerText= "QR CODE SUCCESSFULLY SCANNED"
            setTimeout(()=>{
                setScan(false);
                scannerMessageRef.current.innerText= "Ready to Scan Again"
            },3000)
        }
    }
    
    useEffect(() => {
      
        let unmount = false;
        async function fetchUserData() {
            try{
            const { data } = await axios.post('http://localhost:5000/user', {}, { withCredentials: true })
            if (!unmount) setUser(data)
            }
            catch (error) {
                console.log(error)
            }
        }
        fetchUserData()
        return () => {
            unmount = true
        }
    }, []);
        return (
            JSON.parse(localStorage.getItem('auth')).bool && JSON.parse(localStorage.getItem('auth')).role === "Scanner"  ? (
            <div>
                <div className="scanner-info">
                    <span className="org">{user.room}</span><br></br>
                    <span className="username">{user.username}</span>
                </div>
                <div className="scanner-wrapper">
                    <span ref={scannerMessageRef}>Ready to Scan</span>
                    <QrReader
                        onScan={handleHandleScan}
                        onError={handleError}
                        className="scanner"
                    ></QrReader>
                    <div className=""></div>
                </div>
            </div>
            ): (<Redirect to="/"></Redirect>)
        );
}

export default ScannerDashboard;