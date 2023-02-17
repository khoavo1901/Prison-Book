import datetime
import pandas as pd
pd.set_option('display.max_rows', None)


def open_file(filename):
    # open CSV file into Pandas Dataframe
    return pd.read_csv(filename)

def to_num(a):
    return float(a)


def compute_stats(data, reference):
    # sum total donations in a given day
    total_byday = data.groupby('Date')['Amount'].sum().reset_index()
    
    # compute donation count for a given day
    num_perday = data.groupby('Date').count().reset_index()
    
    # drop reference column
    num_perday = num_perday.drop(columns = ['Reference'])
    
    # merge the two dataframes
    stats = pd.merge(total_byday, num_perday, on = 'Date')    
    
    # Fill in each date that isn't represented
    stats.Date = pd.to_datetime(stats.Date)
    stats = stats.set_index('Date').asfreq('D').reset_index()
    
    # fill missing column values with 0 and compute rolling average
    for column in stats:
        if column != 'Date':
            stats[column]= stats[column].fillna(0)
            stats[column] = stats[column].rolling(window=15).mean()
            stats[column]= stats[column].fillna(0)
    
    # renaming the columns to represent the current reference    
    stats = stats.rename(columns={'Amount_x': (reference + ' amount (rolling avg)'),
                                      'Amount_y': (reference + ' donations (rolling avg)')})
    return stats
   

def main():
    
    # open the file
    data = open_file('donation_clean1.csv')
    
    # keep only donations from 2020 and onwards
    data = data.iloc[:69790]
    
    # turn date column into dateTime object
    data["Date"] = data.apply(
        lambda row: datetime.datetime.strptime(row["Close Date"], "%m/%d/%y").date(),
        axis = 1)  
    
    # Sort by ascending date starting w/ donations from 1/1/2020
    data = data.sort_values(by='Date', ascending=True)
    data = data.reset_index()
    
    # drop unncessary columns
    to_remove = ['Close Date', 'Account Name', 'Unnamed: 0',
                 'Reference Code', 'Payment Method', 'index']
    data = data.drop(columns = to_remove)
    
    # remove rows where donation amount is missing
    data = data[data['Amount'] != 'data_missing']
    
    # fix amount column to be floats
    data["Amount"] = data["Amount"].str.replace("$", "")
    data["Amount"] = data["Amount"].str.replace(",", "")
    data['Amount'] = data['Amount'].map(to_num)    
    
    # break the dataframe into several dataframes by reference value
    ref_types = data['Reference'].unique()
    grouped = data.groupby(data.Reference)
    
    # initialize final dataframe with total donations
    final_stats = compute_stats(data, 'total')
    
    # add columns for each reference type
    for r in ref_types:
        if r != 'data_missing':
            final_stats = pd.merge(final_stats, compute_stats(grouped.get_group(r), r),on='Date',how='left')
            
    # turn all remaining NaN values to zero    
    for column in final_stats:
        if column != 'Date':
            final_stats[column]= final_stats[column].fillna(0)
           
    # save final dataframe to CSV
    final_stats.to_csv('cleaned_donations.csv')

if __name__ == '__main__':
    main()
