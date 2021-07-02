import axios from 'axios'
import React, { useState } from 'react'
import CreateResponse from './createResponse'
import {Form, Button, Spinner} from 'react-bootstrap'

const Create = () => {
    const [url, setUrl] = useState('')
    const [alias, setAlias] = useState('')
    const [secret, setSecret] = useState('')
    const [isSubmitted, setSubmitted] = useState(false)
    const [isResponseReceived, setResponseReceived] = useState(false)
    const [response, setResponse] = useState('')
    const [wantsAlias, setWantsAlias] = useState(true)
    const [wantsSecret, setWantsSecret] = useState(false)

    const sendCreateRequest = async(e) => {
        e.preventDefault()
        setResponseReceived(false)
        setSubmitted(true)
        setResponse('')
        console.log('ex de')
        let res = await axios.post('/create', {
            'url': url,
            'alias': wantsAlias ? alias : '',
            'secret': wantsSecret ? secret : '',
        })
        setResponse(res)
        setSubmitted(false)
        setResponseReceived(true)
    }
    return(
        <div className="create">
            <h2>Create new shortlink</h2>
            <Form onSubmit={sendCreateRequest} className="createForm">
                <div>
                    <Form.Label column="lg">URL</Form.Label>
                    <Form.Control className="inputField" size="lg" type="text" placeholder="URL" value={url} onChange={(e) => setUrl(e.target.value)}/>
                    <br />
                    <Form.Label column="lg">Custom Alias</Form.Label>
                    <Form.Control className="inputField" size="lg" type="text" placeholder="Custom Alias" disabled={!wantsAlias} value={alias} onChange={(e) => setAlias(e.target.value)}/>
                    <br />
                    <Form.Label column="lg">Custom Secret</Form.Label>
                    <Form.Control className="inputField" size="lg" type="text" placeholder="Custom Secret" disabled={!wantsSecret} value={secret} onChange={(e) => setSecret(e.target.value)}/>
                    <br />
                </div>
                <div className="d-flex justify-content-around">
                    <Form.Check checked={wantsAlias} type="checkbox" label="Use Custom Alias" onChange={(e) => {
                        console.log(wantsAlias)
                        setWantsAlias(!wantsAlias)
                        setAlias('')
                    }}/>
                    <Form.Check checked={wantsSecret} type="checkbox" label="Use Custom Secret" onChange={(e) => {
                        setWantsSecret(!wantsSecret)
                        setSecret('')
                    }}/>
                </div>
                <Button className="inputButton mt-3" size="lg" variant="primary" type="submit">Submit</Button>
                <br />
            </Form>
            <br />
            {isSubmitted && !isResponseReceived ?  <Spinner animation='border'/> : <h1></h1>}
            {isResponseReceived && <CreateResponse res={response}/>}
        </div>
    )

}

export default Create 