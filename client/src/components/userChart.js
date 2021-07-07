import React, { useEffect, useState } from 'react'
import { Line } from 'react-chartjs-2'
import { Dropdown, DropdownButton, Row, Col, Table } from 'react-bootstrap'

const UserChart = (props) => {
    const [data, setData] = useState('')
    const [selected, setSelected] = useState({ alias: props.perSiteHistoryData[0].alias, url: props.perSiteHistoryData[0].url })
    const perSiteHistory = props.perSiteHistoryData
    const perSiteData = props.perSiteData
    const full = props.fullHistoryData

    const createDataSet = (visits) => {
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
        setSelected({ alias: 'All websites', url: 'All websites user has visited' })
        setData({
            labels: [...new Set(full.map(o => o.date))],
            datasets: [{
                label: 'Visits Per Day',
                data: full.map(o => o.visits),
                borderColor: 'rgb(75, 192, 192)',
            }]
        })
    }

    const handleChange = (all = false, key = 0) => {
        if (all) {
            setFullData()
        } else {
            setSelected(perSiteHistory[key])
            const visits = perSiteHistory[key].visits
            createDataSet(visits)
        }
    }


    useEffect(() => {
        setFullData()
    }, [])


    return (
        <div className="container createForm">
            <br />
            <h1>Showing statistics for alias - {selected.alias}</h1>
            <h1>URL -  {selected.url}</h1>
            <Row>
                <Col md={9}>
                    <Line
                        options={{ responsive: true }}
                        data={data}
                    />
                </Col>
                <Col className="mt-4">
                    <DropdownButton value={selected.alias} id="dropdown-basic-button" title={selected.alias}>
                        <Dropdown.Item onSelect={() => handleChange(true)}>All websites</Dropdown.Item>
                        {perSiteHistory.map((site, key) => {
                            return <Dropdown.Item value={site.alias} key={key} onSelect={() => handleChange(false, key)}>{site.alias}</Dropdown.Item>
                        })}
                    </DropdownButton>
                    <div className="mt-4">
                        <h5>All visited aliases</h5>
                        <Table striped hover size="sm">
                            <thead>
                                <tr>
                                    <th>Alias</th>
                                    <th>Visits</th>
                                </tr>
                            </thead>
                            <tbody>
                                {perSiteData.map((site, key) => {
                                    return( 
                                        <tr>
                                            <td>{site.alias}</td>
                                            <td>{site.totalVisits}</td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </Table>
                    </div>
                </Col>
            </Row>

        </div>
    )
}

export default UserChart