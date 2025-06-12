# Install yfinance
# !pip install yfinance --upgrade --quiet

# Import libraries
import yfinance as yf
import pandas as pd
from google.colab import files
from tqdm.notebook import tqdm
import time

def fetch_fundamentals(ticker_symbol):
    try:
        ticker = yf.Ticker(ticker_symbol)

        # Income Statement
        income_stmt = ticker.quarterly_financials.T
        income_stmt.columns = [f"Income_{col}" for col in income_stmt.columns]

        # Balance Sheet
        balance_sheet = ticker.quarterly_balance_sheet.T
        balance_sheet.columns = [f"Balance_{col}" for col in balance_sheet.columns]

        # Cash Flow
        cash_flow = ticker.quarterly_cashflow.T
        cash_flow.columns = [f"CashFlow_{col}" for col in cash_flow.columns]

        # Merge fundamentals
        fundamentals_df = income_stmt.join(balance_sheet, how='outer').join(cash_flow, how='outer')

        # Key Statistics (snapshot)
        info = ticker.info
        stats_data = {
            'Market Cap': info.get('marketCap'),
            'Enterprise Value': info.get('enterpriseValue'),
            'Trailing P/E': info.get('trailingPE'),
            'Forward P/E': info.get('forwardPE'),
            'PEG Ratio': info.get('pegRatio'),
            'Price to Sales': info.get('priceToSalesTrailing12Months'),
            'Price to Book': info.get('priceToBook'),
            'Beta': info.get('beta'),
            'Dividend Yield': info.get('dividendYield'),
            'Payout Ratio': info.get('payoutRatio'),
            'ROA': info.get('returnOnAssets'),
            'ROE': info.get('returnOnEquity'),
            'Profit Margins': info.get('profitMargins'),
            'Operating Margins': info.get('operatingMargins'),
            'Debt to Equity': info.get('debtToEquity'),
            'Current Ratio': info.get('currentRatio'),
            'Quick Ratio': info.get('quickRatio'),
            'Revenue Growth': info.get('revenueGrowth'),
            'Earnings Growth': info.get('earningsGrowth'),
            'Free Cash Flow': info.get('freeCashflow'),
            'Shares Outstanding': info.get('sharesOutstanding'),
        }

        # Add Ticker & Key Stats to DataFrame
        fundamentals_df['Ticker'] = ticker_symbol
        for key, value in stats_data.items():
            fundamentals_df[key] = value

        return fundamentals_df

    except Exception as e:
        print(f"Error fetching data for {ticker_symbol}: {e}")
        return None

# ---- Main Batch Process ----
# Load tickers from Excel (column name: 'Ticker')
csv_file = 'ind_nifty500list.csv'  # Upload this file to Colab
tickers_df = pd.read_csv(csv_file)
tickers = tickers_df['Symbol'].dropna().unique()

# Add .NS suffix for Indian NSE stocks
tickers = [f"{ticker.strip()}.NS" for ticker in tickers]

# Collect data for all tickers
all_data = []
start_time = time.time()

print(f"Processing {len(tickers)} NSE tickers with safe rate limits...")

for ticker in tqdm(tickers):
    data = fetch_fundamentals(ticker)
    if data is not None:
        all_data.append(data)
    time.sleep(1.0)  # ~1 second delay between calls (safe for Yahoo rate limits)

# Combine into single DataFrame
if all_data:
    final_df = pd.concat(all_data, axis=0)
    output_file = 'India_Stocks_Fundamentals.csv'
    final_df.to_csv(output_file)
    files.download(output_file)
    print(f"All fundamentals saved to {output_file}")
else:
    print("No data fetched.")

print(f"Completed in {round(time.time() - start_time, 2)} seconds.")