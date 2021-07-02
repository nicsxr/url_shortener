import React, { useEffect, useState } from 'react'
import './App.css';
import {Button} from 'react-bootstrap'
import axios from 'axios';

const CreateResponse = (props) => {
    const [data, setData] = useState('')

    useEffect(() => {
        console.log(props.res)
        setData(props.res.data)
    },[props.res])

    const deleteRecord = () => {
        axios.post('/delete', {
            alias: data.alias,
            secret: data.secret
        }).then((res) => {
            setData(res.data)
            console.log(res)
        }).catch((err) => {
            setData(err)
        })
    }

    if (props.res.status === 201){
        if(!data.alias) return( <h1>{data}</h1>)
        else{
            return(
                <div className="responseDiv">
                    <h1>📝Alias: <b>{data.alias}</b></h1>
                    <h1>🌐URL: <b>{data.url}</b></h1>
                    <h1>🔐Secret: <b>{data.secret}</b></h1>
                    <h1>🤵Creator: <b>{data.creator}</b></h1>
                    <Button variant="danger" onClick={deleteRecord}>Delete</Button>
                </div>
            )
        }
    }else{
        return(
            <div>
                {<h1>{data}</h1>}
            </div>
        )
    }




}

export default CreateResponse 