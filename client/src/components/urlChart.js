import React, { useEffect, useState } from 'react'
import { Line } from 'react-chartjs-2'

const UrlChart = (props) => {
    const [data, setData] = useState('')
    useEffect (()=> {
        console.log(props)
        setData({
            labels: props.data.map(o => o.date),
            datasets: [{
              label: 'Visits Per Day',
              data: props.data.map(o => o.visits),
              borderColor: 'rgb(75, 192, 192)',
            }]
        })
    }, [])



    return(
        <div className="container">
            <Line
                options={{responsive: true}}
                data={data}
            />
        </div>
    )
}

export default UrlChart