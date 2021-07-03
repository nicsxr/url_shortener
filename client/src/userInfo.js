import axios from 'axios'
import React, { useEffect, useState } from 'react'
import UserChart from './userChart'
import {Form, Button, Row, Col} from 'react-bootstrap'

const UserInfo = ({match}) => {
    const [ip, setIP] = useState(match.params.ip ? match.params.ip : '')
    const [err, setErr] = useState('')
    const [userData, setUserData] = useState('')
    const [fullHistoryData, setFullHistoryData] = useState('')
    const [PerSiteHistoryData, setPerSiteHistoryData] = useState('')
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


        if(e)
            e.preventDefault()

        axios.get(`info/user/${ip}`)
        .then((res) => {
                setUserData(res.data.userInfo)
                setFullHistoryData(res.data.fullHistory)
                setPerSiteHistoryData(res.data.perSiteHistory)
                setPerSiteData(res.data.perSiteData)
            })
            .catch((err) => {
                setErr(`User ${ip} not found! 🚫`)
                console.log(err)
            })
    }
    return(
        <div className="create">
            <Form onSubmit={getIPInfo} className="createForm">
                <h1>User statistics</h1>
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
                    {/* <h1 className="mt-2">User statistics for {userData.ip}</h1> */} <br/>
                    <Row className="responseDiv align-items-center">
                        <Col><h1>🤵IP: <b>{userData.ip}</b></h1></Col>
                        <Col><h1>📅First used: <b>{userData.createdAt}</b></h1></Col>
                        <Col><h1>📢Total Visits: <b>{userData.totalVisits}</b></h1></Col>
                    </Row>
                    {fullHistoryData && PerSiteHistoryData && <UserChart PerSiteHistoryData={PerSiteHistoryData} fullHistoryData={fullHistoryData}/>}
                </div>
            }
            {/* TODO: PER SITE DATA TABLE NEEDS TO BE CRETED */}
            {err}
        </div>
    )
}

export default UserInfo