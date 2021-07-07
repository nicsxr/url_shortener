import axios from 'axios'
import React, { useEffect, useState } from 'react'
import UserChart from './components/userChart'
import {Form, Button, Row, Col} from 'react-bootstrap'
import TitleComponent from './components/title'

const UserInfo = ({match}) => {
    document.title = "User statistics"
    
    const [ip, setIP] = useState(match.params.ip ? match.params.ip : '')
    const [err, setErr] = useState('')
    const [userData, setUserData] = useState('')
    const [fullHistoryData, setFullHistoryData] = useState('')
    const [perSiteHistoryData, setPerSiteHistoryData] = useState('')
    const [perSiteData, setPerSiteData] = useState('')
    
    useEffect (()=> {
        if (match.params.ip){
            getIPInfo()
        }
    }, [])

    const getIPInfo = (e) => {
        // reset info
        setUserData('')
        setFullHistoryData('')
        setPerSiteHistoryData('')
        setPerSiteData('')
        setErr('')


        if(e)
            e.preventDefault()

        axios.get(`info/user/${ip}`)
        .then((res) => {
                setUserData(res.data.userInfo)
                setFullHistoryData(res.data.fullHistory)
                setPerSiteHistoryData(res.data.perSiteHistory)
                setPerSiteData(res.data.perSiteData)
                //console.log(perSiteData)
            })
            .catch((err) => {
                setErr(`User ${ip} not found! 🚫`)
                console.log(err)
            })
    }
    return(
        <div className="create">
            <TitleComponent title={document.title}></TitleComponent>
            <Form onSubmit={getIPInfo} className="createForm">
                <div>
                    <Form.Label column="lg">User's IP</Form.Label>
                    <Form.Control className="inputField" size="lg" type="text" placeholder="IP" value={ip} onChange={(e) => setIP(e.target.value)}/>
                    <br />
                </div>
                <Button className="inputButton mt-3 mb-3" size="lg" variant="success" type="submit">Submit</Button>
                <br />
            </Form>
            {
                userData.ip &&
                <div>
                    <Row className="responseDiv align-items-center">
                        <Col><h1>🤵IP: <b>{userData.ip}</b></h1></Col>
                        <Col><h1>📅First used: <b>{userData.createdAt}</b></h1></Col>
                        <Col><h1>📢Total Visits: <b>{userData.totalVisits}</b></h1></Col>
                    </Row>
                    {fullHistoryData && perSiteHistoryData && perSiteData && <UserChart perSiteData={perSiteData} perSiteHistoryData={perSiteHistoryData} fullHistoryData={fullHistoryData}/>}
                </div>
            }
            {/* TODO: PER SITE DATA TABLE NEEDS TO BE CRETED */}
            <h1 className="centerText mt-3">{err}</h1>
        </div>
    )
}

export default UserInfo