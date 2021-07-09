import axios from 'axios'
import React, { useEffect, useState } from 'react'
import UrlChart from './components/urlChart'
import {Form, Button, Row, Col} from 'react-bootstrap'
import TitleComponent from './components/title'

const UrlInfo = ({match}) => {
    document.title = "Alias statistics"
    const [alias, setAlias] = useState(match.params.alias ? match.params.alias : '')
    const [data, setData] = useState('')
    const [fullData, setFullData] = useState('')
    const [uniqueData, setUniqueData] = useState('')
    
    useEffect (()=> {
        if (match.params.alias){
            getUrlInfo()
        }
    }, [])

    const getUrlInfo = (e) => {
        setFullData('')
        setData('')
        console.log(alias)
        if(e)
            e.preventDefault()

        axios.get(`info/url/${alias}`)
        .then((res) => {
                setFullData(res.data.fullResults)
                setUniqueData(res.data.uniqueResults)
                setData(res.data.urlInfo)
            })
            .catch((err) => {
                console.log(err)
                setData(`Alias ${alias} not found! 🚫`)
            })
    }
    return(
        <div className="create">
            <TitleComponent title={document.title}></TitleComponent>
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
                        <Col><h1>🌐URL: </h1> 
                            <a className="urlText" target="_blank" rel="noreferrer" href={data.url}>
                                <b>{data.url.length > 45 ? data.url.slice(0, 44) +'...' : data.url}</b>
                            </a>
                        </Col>
                        <Col><h1>📅Created: <b>{data.createdAt}</b></h1></Col>
                        <Col><h1>📢Total Visits: <b>{data.totalVisits}</b></h1></Col>
                    </Row>
                    <h1 className="mt-2">URL statistics</h1>
                    {data.alias && fullData && <UrlChart fullData={fullData} uniqueData={uniqueData}/>}
                </div>
            }
            {!data.alias && <h1 className="centerText mt-3">{data}</h1>}
        </div>
    )
}

export default UrlInfo