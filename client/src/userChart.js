import React, { useEffect, useState } from 'react'
import { Line } from 'react-chartjs-2'
import { Dropdown, DropdownButton } from 'react-bootstrap'

const UserChart = (props) => {
    const [data, setData] = useState('')
    const [selected, setSelected] = useState({alias: props.PerSiteHistoryData[0].alias, url: props.PerSiteHistoryData[0].url})
    const perSite = props.PerSiteHistoryData
    const full = props.fullHistoryData

    const createDataSet = (visits) =>{
        setData({
            labels: [...visits.map(o => o.date)],
            datasets: [{
              label: 'Visits Per Day',
              data: [...visits.map(o => o.visits)],
              borderColor: 'rgb(75, 192, 192)',
            }]
        })
    }

    const setFullData = () => {
        setSelected({alias: 'All websites', url: 'All websites user has visited'})
        setData({
            labels: [...new Set(full.map(o => o.date))],
            datasets: [{
                label: 'Visits Per Day',
                data: full.map(o => o.visits),
                borderColor: 'rgb(75, 192, 192)',
            }]
        })
    }

    const handleChange = (all=false, key=0 ) =>{
        if(all){
            setFullData()
        }else{
            setSelected(perSite[key])
            const visits = perSite[key].visits
            createDataSet(visits)
        }
    }


    useEffect (()=> {
        setFullData()
    }, [])


    return(
        <div className="container">
            <br />
            <h1>Showing statistics for alias - {selected.alias}</h1>
            <h1>URL -  {selected.url}</h1>
            <Line
                options={{responsive: true}}
                data={data}
            />
            <DropdownButton value={selected.alias}  id="dropdown-basic-button" title={selected.alias}>
                <Dropdown.Item onSelect={() => handleChange(true)}>All websites</Dropdown.Item>
                {perSite.map((site, key) => {
                    return <Dropdown.Item value={site.alias} key={key} onSelect={() => handleChange(false, key)}>{site.alias}</Dropdown.Item>
                })}
            </DropdownButton>
        </div>
    )
}

export default UserChart