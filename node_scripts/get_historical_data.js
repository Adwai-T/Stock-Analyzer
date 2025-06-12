// node_scripts/get_historical_data.js
// This is a placeholder for your actual Node.js historical data fetching logic.
// It takes a company symbol as an argument and returns dummy JSON data.

const symbol = process.argv[2]; // Get the company symbol from command-line arguments

if (!symbol) {
    console.error("Error: Company symbol not provided.");
    process.exit(1); // Exit with error code
}

// Simulate fetching historical data for the given symbol
// In a real scenario, this would involve making API calls to a stock data provider.
const dummyHistoricalData = [
    { "timestamp": "2024-05-01T00:00:00+0530", "open": 1600.0, "high": 1610.0, "low": 1590.0, "close": 1605.0, "volume": 1000000 },
    { "timestamp": "2024-05-02T00:00:00+0530", "open": 1605.0, "high": 1615.0, "low": 1595.0, "close": 1610.0, "volume": 1100000 },
    { "timestamp": "2024-05-03T00:00:00+0530", "open": 1610.0, "high": 1620.0, "low": 1600.0, "close": 1615.0, "volume": 1200000 },
    { "timestamp": "2024-05-06T00:00:00+0530", "open": 1615.0, "high": 1625.0, "low": 1605.0, "close": 1620.0, "volume": 1300000 },
    { "timestamp": "2024-05-07T00:00:00+0530", "open": 1620.0, "high": 1630.0, "low": 1610.0, "close": 1625.0, "volume": 1400000 },
    { "timestamp": "2024-05-08T00:00:00+0530", "open": 1625.0, "high": 1635.0, "low": 1615.0, "close": 1630.0, "volume": 1500000 },
    { "timestamp": "2024-05-09T00:00:00+0530", "open": 1630.0, "high": 1640.0, "low": 1620.0, "close": 1635.0, "volume": 1600000 },
    { "timestamp": "2024-05-10T00:00:00+0530", "open": 1635.0, "high": 1645.0, "low": 1625.0, "close": 1640.0, "volume": 1700000 },
    { "timestamp": "2024-05-13T00:00:00+0530", "open": 1640.0, "high": 1650.0, "low": 1630.0, "close": 1645.0, "volume": 1800000 },
    { "timestamp": "2024-05-14T00:00:00+0530", "open": 1645.0, "high": 1655.0, "low": 1635.0, "close": 1650.0, "volume": 1900000 },
    { "timestamp": "2024-05-15T00:00:00+0530", "open": 1650.0, "high": 1660.0, "low": 1640.0, "close": 1655.0, "volume": 2000000 },
    { "timestamp": "2024-05-16T00:00:00+0530", "open": 1655.0, "high": 1665.0, "low": 1645.0, "close": 1660.0, "volume": 2100000 },
    { "timestamp": "2024-05-17T00:00:00+0530", "open": 1660.0, "high": 1670.0, "low": 1650.0, "close": 1665.0, "volume": 2200000 },
    { "timestamp": "2024-05-20T00:00:00+0530", "open": 1665.0, "high": 1675.0, "low": 1655.0, "close": 1670.0, "volume": 2300000 },
    { "timestamp": "2024-05-21T00:00:00+0530", "open": 1670.0, "high": 1680.0, "low": 1660.0, "close": 1675.0, "volume": 2400000 },
    { "timestamp": "2024-05-22T00:00:00+0530", "open": 1675.0, "high": 1685.0, "low": 1665.0, "close": 1680.0, "volume": 2500000 },
    { "timestamp": "2024-05-23T00:00:00+0530", "open": 1680.0, "high": 1690.0, "low": 1670.0, "close": 1685.0, "volume": 2600000 },
    { "timestamp": "2024-05-24T00:00:00+0530", "open": 1685.0, "high": 1695.0, "low": 1675.0, "close": 1690.0, "volume": 2700000 },
    { "timestamp": "2024-05-27T00:00:00+0530", "open": 1690.0, "high": 1700.0, "low": 1680.0, "close": 1695.0, "volume": 2800000 },
    { "timestamp": "2024-05-28T00:00:00+0530", "open": 1695.0, "high": 1705.0, "low": 1685.0, "close": 1700.0, "volume": 2900000 },
    { "timestamp": "2024-05-29T00:00:00+0530", "open": 1700.0, "high": 1710.0, "low": 1690.0, "close": 1705.0, "volume": 3000000 },
    { "timestamp": "2024-05-30T00:00:00+0530", "open": 1705.0, "high": 1715.0, "low": 1695.0, "close": 1710.0, "volume": 3100000 },
    { "timestamp": "2024-05-31T00:00:00+0530", "open": 1710.0, "high": 1720.0, "low": 1700.0, "close": 1715.0, "volume": 3200000 },
    { "timestamp": "2024-06-03T00:00:00+0530", "open": 1715.0, "high": 1725.0, "low": 1705.0, "close": 1720.0, "volume": 3300000 },
    { "timestamp": "2024-06-04T00:00:00+0530", "open": 1720.0, "high": 1730.0, "low": 1710.0, "close": 1725.0, "volume": 3400000 },
    { "timestamp": "2024-06-05T00:00:00+0530", "open": 1725.0, "high": 1735.0, "low": 1715.0, "close": 1730.0, "volume": 3500000 },
    { "timestamp": "2024-06-06T00:00:00+0530", "open": 1730.0, "high": 1740.0, "low": 1720.0, "close": 1735.0, "volume": 3600000 },
    { "timestamp": "2024-06-07T00:00:00+0530", "open": 1735.0, "high": 1745.0, "low": 1725.0, "close": 1740.0, "volume": 3700000 },
    { "timestamp": "2024-06-10T00:00:00+0530", "open": 1740.0, "high": 1750.0, "low": 1730.0, "close": 1745.0, "volume": 3800000 },
    { "timestamp": "2024-06-11T00:00:00+0530", "open": 1745.0, "high": 1755.0, "low": 1735.0, "close": 1750.0, "volume": 3900000 },
    { "timestamp": "2024-06-12T00:00:00+0530", "open": 1750.0, "high": 1760.0, "low": 1740.0, "close": 1755.0, "volume": 4000000 },
    // Add more dummy data as needed to satisfy the LOOK_BACK (60 days) requirement for prediction
    // This example provides more than 30 days of data.
];

// Extend dummy data to ensure at least LOOK_BACK (60) entries for prediction
// If the above data is less than 60, add more
while (dummyHistoricalData.length < 60) {
    const lastDay = dummyHistoricalData[dummyHistoricalData.length - 1];
    const newTimestamp = new Date(new Date(lastDay.timestamp.slice(0, -5)).getTime() + 24 * 60 * 60 * 1000); // Add one day
    const newDay = {
        "timestamp": newTimestamp.toISOString().slice(0, -5) + '+0530',
        "open": lastDay.close + Math.random() * 5 - 2.5,
        "high": lastDay.close + Math.random() * 10 + 5,
        "low": lastDay.close - Math.random() * 10 - 5,
        "close": lastDay.close + Math.random() * 5 - 2.5,
        "volume": lastDay.volume + Math.floor(Math.random() * 100000 - 50000)
    };
    dummyHistoricalData.push(newDay);
}


// Output the data as a JSON string
console.log(JSON.stringify(dummyHistoricalData));
