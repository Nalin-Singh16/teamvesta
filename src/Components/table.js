import './table.css';
import React, { useEffect, useState } from 'react';
import Chart from "react-apexcharts";
import axios from 'axios';

const Linechart = () => {
    const [sum, setSum] = useState(0);
    const [departmentNames, setDepartments] = useState([]);
    const [options, setOptions] = useState({
        chart: {
            id: 'apexchart-example',
        },
        xaxis: {
            categories: [],
        },
    });
    const [series, setSeries] = useState([{
        name: 'series-1',
        data: [],
    }]);

    useEffect(() => {
        axios.get('https://checkinn.co/api/v1/int/requests')
            .then(res => {
                const hotelRequestCounts = res.data.requests.reduce((acc, { hotel }) => {
                    acc[hotel.name] = (acc[hotel.name] || 0) + 1;
                    return acc;
                }, {});

                const departments = res.data.requests.reduce((acc, { desk }) => {
                    acc[desk.name] = (acc[desk.name] || 0) + 1;
                    return acc;
                }, {});

                const hotelNames = Object.keys(hotelRequestCounts);
                const totalRequests = Object.values(hotelRequestCounts);
                const departmentNames = Object.keys(departments);

                setOptions(prevOptions => ({
                    ...prevOptions,
                    xaxis: { categories: hotelNames },
                }));

                setSeries([{
                    name: 'series-1',
                    data: totalRequests,
                }]);

                setSum(totalRequests.reduce((acc, value) => acc + value, 0));
                setDepartments(departmentNames);
            })
            .catch(err => {
                console.error(err);
            });
    }, []);

    return (
        <div className='Chart'>
            <Chart
                options={options}
                series={series}
                type="line"
                width="900"
            />
            <p className="total">Total Requests: {sum}</p>
            <div className="departments">
                <span>
                    List of unique department names across all Hotels:
                    {departmentNames.map((department, index) => `${department}${index < departmentNames.length - 1 ? ', ' : ''}`)}
                </span>
            </div>
        </div>
    );
};

export default Linechart;
