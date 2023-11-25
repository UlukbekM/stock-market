import { BalanceProvider } from './BalanceProvider'
import Dashboard from './Dashboard'

export default async function page() {
    // https://www.alphavantage.co/ STOCK API
    // 'https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=IBM&interval=5min&apikey=demo'
    // https://site.financialmodelingprep.com/developer/docs

    return(
        <BalanceProvider>
            <Dashboard/>
        </BalanceProvider>
    )
}