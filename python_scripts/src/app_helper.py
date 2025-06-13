#Imports
import pandas as pd
import numpy as np
from sklearn.preprocessing import MinMaxScaler
from tensorflow.keras.layers import Dense, Dropout, LSTM
from tensorflow.keras.models import Sequential
import tensorflow as tf
import subprocess # to run node scripts
import emotes


historicalDataScript = 'node_scripts/kite_connect/historical.mjs'
dataPath = 'data/'

# Get historical data by running node script

def getHistoricalData(symbol, start='', end='', interval='') :
    print(f'{emotes.load}Running Node script to get historical data run completed.')
    # Arguments to pass
    args = [symbol, start, end, interval]
    # Build the command
    cmd = ['node', historicalDataScript] + args
    # Run the command
    result = subprocess.run(cmd, capture_output=True, text=True)
    # Print output
    print(f"{emotes.info}STDOUT:", result.stdout)
    if(result.stderr) : print(f"{emotes.cross}STDERR:", result.stderr)
    print(f"{emotes.done}Node script to get historical data run completed.")
    
# Import historical data csv
def loadAndProcessData(symbol) :
    df = pd.read_csv(dataPath + symbol + '.csv', index_col=False)
    print(f'{emotes.check}Loaded data for {symbol}')
    print(df.head())
    return df

def train(symbol) :
    data = loadAndProcessData(symbol)
    train = pd.DataFrame(data[0:int(len(data)*0.70)])
    test = pd.DataFrame(data[int(len(data)*0.70): int(len(data))])

    scaler = MinMaxScaler(feature_range=(0,1))
    train_close = train.iloc[:, 4:5].values
    test_close = test.iloc[:, 4:5].values
    data_training_array = scaler.fit_transform(train_close)

    x_train = []
    y_train = []

    for i in range(100, data_training_array.shape[0]):
        x_train.append(data_training_array[i-100: i])
        y_train.append(data_training_array[i, 0])

    x_train, y_train = np.array(x_train), np.array(y_train)

    print(f'{emotes.brain}')
    print(x_train.shape)

    # Model Definition
    model = Sequential()
    model.add(LSTM(units = 50, activation = 'relu', return_sequences=True
                  ,input_shape = (x_train.shape[1], 1)))
    model.add(Dropout(0.2))


    model.add(LSTM(units = 60, activation = 'relu', return_sequences=True))
    model.add(Dropout(0.3))


    model.add(LSTM(units = 80, activation = 'relu', return_sequences=True))
    model.add(Dropout(0.4))


    model.add(LSTM(units = 120, activation = 'relu'))
    model.add(Dropout(0.5))

    model.add(Dense(units = 1))

    print(f'{emotes.brain} Model Summary')
    print(model.summary())

    model.compile(optimizer = 'adam', loss = 'mean_squared_error', metrics=[tf.keras.metrics.MeanAbsoluteError()])
    model.fit(x_train, y_train,epochs = 100)

    model.save(f'{symbol}_model.h5')

def loadModelAndPredict(symbol) :
    model_name = f'{symbol}_model.h5'
    past_100_days = 





