import axios from 'axios'
import React, { useEffect, useRef, useState } from 'react'
import UrlChart from './urlChart'
import {Form, Button, Container, Row, Col} from 'react-bootstrap'

const UrlInfo = ({match}) => {
    const [alias, setAlias] = useState(match.params.alias ? match.params.alias : '')
    const [data, setData] = useState('')
    const [historyData, setHistoryData] = useState('')
    
    useEffect (()=> {
        if (match.params.alias){
            getUrlInfo()
        }
    }, [])

    const getUrlInfo = (e) => {
        console.log(alias)
        if(e)
            e.preventDefault()

        axios.get(`info/url/${alias}`)
        .then((res) => {
                setHistoryData(res.data.slice(1))
                console.log(historyData)
                setData(res.data[0])
            })
            .catch((err) => {
                setData(err)
                console.log(err)
            })
    }
    return(
        <div className="create">
            <Form onSubmit={getUrlInfo} className="createForm">
                <div>
                    <Form.Label column="lg">Custom Alias</Form.Label>
                    <Form.Control className="inputField" size="lg" type="text" placeholder="Alias" value={alias} onChange={(e) => setAlias(e.target.value)}/>
                    <br />
                </div>
                <Button className="inputButton mt-3 mb-3" size="lg" variant="success" type="submit">Submit</Button>
                <br />
            </Form>
            {
                data.alias &&
                <div>
                    <Row className="responseDiv align-items-center">
                        <Col><h1>📝Alias: <b>{data.alias}</b></h1></Col>
                        <Col><h1>🌐URL: </h1> <a className="urlText" target="_blank" href={data.url}><b>{data.url.length > 45 ? data.url.slice(0, 44) +'...' : data.url}</b></a></Col>
                        <Col><h1>📅Created: <b>{data.createdAt}</b></h1></Col>
                        <Col><h1>📢Total Visits: <b>{data.totalVisits}</b></h1></Col>
                    </Row>
                </div>
            }
            {JSON.stringify(data)}
            {data.alias && historyData && <UrlChart data={historyData}/>}
        </div>
    )
}

export default UrlInfo