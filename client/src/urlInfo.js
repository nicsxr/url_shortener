import axios from 'axios'
import React, { useEffect, useState } from 'react'
import CreateResponse from './createResponse'
import {Form, Button, Spinner} from 'react-bootstrap'

const UrlInfo = ({match}) => {
    const [alias, setAlias] = useState(match.params.alias ? match.params.alias : '')
    const [data, setData] = useState('')
    
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
                setData(res.data)
                console.log(res)
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
                <Button className="inputButton mt-3" size="lg" variant="success" type="submit">Submit</Button>
                <br />
            </Form>
            {JSON.stringify(data)}
        </div>
    )
}

export default UrlInfo