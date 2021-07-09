import React, { useEffect, useState } from 'react'
import { Line } from 'react-chartjs-2'

const UrlChart = (props) => {
    const [data, setData] = useState('')
    useEffect (()=> {
        console.log(props)
        setData({
            labels: props.fullData.map(o => o.date),
            datasets: [{
              label: 'Total visits per day',
              data: props.fullData.map(o => o.visits),
              borderColor: 'rgb(50,205,50)',
            },
            {
                label: 'Unique visits per day',
                data: props.uniqueData.map(o => o.visits),
                borderColor: 'rgb(255, 0, 0)',
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