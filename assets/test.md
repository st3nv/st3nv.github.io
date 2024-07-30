# Add EEG recording to any existing Psychopy experiment in Builder


This is a short guide on how to add __EEG recording__ to any existing Psychopy experiment. This guide is based on my experience using `muse-lsl` and the code component of Psychopy. This method doesn't require to run multiple scripts or use any external software. Also using this method the experiment can still be viewed and modified in __Psychopy Builder__.

You don't need to be an expert in Python to follow this guide, but you should have set up Python and Psychopy correctly on your computer.

To test whether you have correctly set up the computer, try open a terminal window (e.g. Powershell) and run commands `python` and `pip` to see if your python environment is working. If it is, we can start by installing `muse-lsl`.

## Step 1: Install muse-lsl
muse-lsl is a Python package that allows you to stream EEG data from the Muse headband. We can install it using pip. In the terminal window run the following command:
```
pip install muse-lsl
```

It should automatically install all the dependencies.

## Step 2: Write python script to start EEG streaming
This is the only python script we need outside of Psychopy. During the experiment we need to run the scirpt to connect to the Muse headband and start streaming the EEG data.

Use any text editor to create a new file in your experiment folder and name it `start_eeg_stream.py`. Copy and paste the following code into the file:

```python
import os
import sys
import time
from muselsl import stream, list_muses
import datetime

def restart_script():
    print("Restarting script...")
    os.execl(sys.executable, sys.executable, *sys.argv)

while True:
    try:
        # Attempt to connect and stream from the Muse
        muses = list_muses(backend='bgapi')
        if muses:
            print(f"{datetime.datetime.now()} Starting Muse streaming...")
            stream(muses[0]['address'], ppg_enabled=True, acc_enabled=True, gyro_enabled=True, backend='bgapi')
        else:
            print("No Muse devices found. Restarting...")
            time.sleep(5)  # Give some time before restarting
            restart_script()
    except Exception as e:
        print(f"{datetime.datetime.now()} Error: {e}.")
        time.sleep(1)  # Give some time before restarting
        restart_script()
```

If you are using Bluetooth to connect to the Muse headband, you should delete the `backend='bgapi'` argument from the list_muses and stream functions.

The code above can handle disconnections and other errors that might occur during the experiment. It will keep trying to connect to the Muse headband until it succeeds.

To run the script, open a Powershell window and navigate to the folder where the script is located. To do this, type
```
cd 'path\to\your\experiment'
```
You should replace `path\to\your\experiment` with the actual path to your experiment folder. If you don't know how to find the path, first open the folder in file explorer, then click on the address bar there you will see the path to the folder. Copy and paste it should do the work.

After you are in the correct folder, your Powershell window should look like this:
```
PS C:\path\to\your\experiment>
```
Then, you can run the script by running the following command:
```
python start_eeg_stream.py
```

## Step 3: Add code component to your Psychopy experiment
Now open your experiment in Psychopy Builder and add a code component in any routine (preferably the first one). In the __before experiment__ tab, copy and paste the following code:
```python
## ! -----------IMPORT  --------------
from datetime import datetime
import csv
import pandas as pd
import re
import time
from pylsl import StreamInlet, resolve_byprop, StreamInfo, StreamOutlet, StreamInlet, resolve_stream
import queue
import threading
import os
import random

## ---------- EEG-------------
output_types = ['EEG', 'PPG', 'ACC', 'GYRO']

folder_path_list = []
for output_type in output_types:
    folder_path_list.append('data/' + output_type + '/')

for folder in folder_path_list:
    if not os.path.exists(folder):
        os.makedirs(folder)

# Function to record streams
def record_stream_thread(marker_queue, stream_type):
    def output_csv(path, data, channel_names):
        with open(path ,'w',newline='') as out:
            csv_out = csv.writer(out)
            csv_out.writerow(['Timestamp'] + channel_names + ['Marker'])
            for row in data:
                csv_out.writerow(row)
    data_combine = []
    marker = -1
    channel_names = []

    while True:
        try:
            stream = resolve_stream('type', stream_type)
            inlet = StreamInlet(stream[0])
            if len(channel_names) == 0:
                inlet_info = inlet.info()
                Nchan = inlet_info.channel_count()
                channel = inlet_info.desc().child('channels').first_child()
                channel_names = [channel.child_value('label')]
                for i in range(1, Nchan):
                    channel = channel.next_sibling()
                    channel_names.append(channel.child_value('label'))
            while True:
                if not marker_queue.empty():
                    task = marker_queue.get()
                    if task['command'] == 'SAVE':
                        output_path = task['content']
                        output_csv(output_path, data_combine, channel_names)
                        return
                    elif task['command'] == 'MARKER':
                        marker = task['content']
                else:
                    sample, timestamp = inlet.pull_sample(timeout=5)
                    if sample:
                        tmp_tuple = (timestamp,) + tuple(sample) + (marker,)
                        data_combine.append(tmp_tuple)
        except Exception as e:
            print(e)
            time.sleep(5)
            print('Trying to reconnecting to stream', stream_type)
            continue

eeg_marker_queue = None
ppg_marker_queue = None
acc_marker_queue = None
gyro_marker_queue = None

if 'EEG' in output_types:
    eeg_marker_queue = queue.Queue()
if 'PPG' in output_types:
    ppg_marker_queue = queue.Queue()
if 'ACC' in output_types:
    acc_marker_queue = queue.Queue()
if 'GYRO' in output_types:
    gyro_marker_queue = queue.Queue()

marker_queue_list_not_none = [queue for queue in [eeg_marker_queue, ppg_marker_queue, acc_marker_queue, gyro_marker_queue] if queue is not None]

def add_queue(new_instr):
    for queue in marker_queue_list_not_none:
        queue.put(new_instr)
```
Note that we are recording all four streams of data from the Muse headband (EEG, PPG, ACC, GYRO). If you don't need all of them, you can remove the unnecessary ones from the list variable `output_types`.

Then, In the __begin experiment__ tab of the same code component, copy and paste the following code:

```python
recording_threads = []
for stream_type, marker_queue in zip(output_types, marker_queue_list_not_none):
    t = threading.Thread(target=record_stream_thread, args=(marker_queue, stream_type))
    t.start()
    recording_threads.append(t)
Then, in the end experiment tab, copy and paste the following code:

# Save eeg data
eeg_filename = filename.split('.')[0].split('/')[-1] + '_muse'
for i in range(len(folder_path_list)):
    eeg_tmp_path = folder_path_list[i] + eeg_filename + '_' + output_types[i] + '.csv'
    print('Saving {} data to {}'.format(output_types[i], eeg_tmp_path))
    marker_queue_list_not_none[i].put({'command': 'SAVE', 'content': eeg_tmp_path})

for t in recording_threads:
    t.join()
```
The output will be saved in subfolders in the data folder of your experiment. The structure of the data folder will look like this:

```
data/
    EEG/
        your_experiment_name_muse_EEG.csv
    PPG/
        your_experiment_name_muse_PPG.csv
    ACC/
        your_experiment_name_muse_ACC.csv
    GYRO/
        your_experiment_name_muse_GYRO.csv
```

## Step 4: Send markers to the EEG recording threads
At any time of your experiment, you can send markers to the EEG recording threads using the `add_queue` function. By default, the value of the marker is `-1`. 

For example, if the routine is called trial and it has a component called `stimulus` which starts at the beginning of the routine and ends at the end of the routine, you can use the following code to send the marker as soon as the component starts:

In the __Begin Routine__ tab of the code component in the trial routine, copy and paste the following code:

```python
markerSent = False
```
Then, in the __Each Frame__ tab of the same code component, copy and paste the following code:
```python
if stimulus.status == STARTED and not markerSent:
    add_queue({'command': 'MARKER', 'content': 1})
    markerSent = True
```
The code above will send the marker `1` as soon as the image component stimulus starts. You can replace `1` with any value/string you want to send. 

When the routine ends, we may also want to send a marker to indicate the end of the trial. In the __End Routine__ tab of the code component in the trial routine, copy and paste the following code:
```python
add_queue({'command': 'MARKER', 'content': -1})
```

The data will look like this:
```
Timestamp, EEG Channel 1, EEG Channel 2, ..., Marker
1612345678123, 0.1, 0.2, ..., -1
1612345678124, 0.2, 0.3, ..., -1
1612345678125, 0.3, 0.4, ..., -1
...
1612345678226, 0.4, 0.5, ..., 1
1612345678227, 0.5, 0.6, ..., 1
1612345678228, 0.6, 0.7, ..., 1
...
1612345678329, 0.7, 0.8, ..., -1
1612345678330, 0.8, 0.9, ..., -1
```

So you can easily find the start and end of each trial in the EEG data.

## Step 5: Assign a marker for each trial in a loop
Most Psychopy experiments use loops to present different stimuli in each trial. In this case, you can easily assign a different marker for every trial in the loop. 

If that's the case, you will already have a csv files that defines the conditions of the loop, which looks like the example below:

```
| image |
|-------|
| 1.png |
| 2.png |
| 3.png |
|  ...  |
```

The variable `$image` is then used to define the image component in the loop. We can do the same thing for the marker.

First add a new column to the csv file that defines the marker for each trial:

```
| image | marker |
|-------|--------|
| 1.png | 1      |
| 2.png | 2      |
| 3.png | 3      |
|  ...  | ...    |
```

Then, in the __Begin Routine__ tab of the code component in the trial routine, copy and paste the following code:

```python
markerSent = False
```
Then, in the __Each Frame__ tab of the same code component, copy and paste the following code:
```python
if stimulus.status == STARTED and not markerSent:
    add_queue({'command': 'MARKER', 'content': marker})
    markerSent = True
```

Here `stimulus` should be replaced with the actual name of the image component in your experiment. And `marker` should be replaced with the actual name of the column in the csv file that defines the marker for each trial.

If there are multiple components in the trial routine that you want to track. For instance if you have two images that you show in order, `img1` and `img2`. And your loop conditions will looks something like this:

```
| image1 | image2 | marker |
|--------|--------|--------|
| 1.png  | 2.png  | 1      |
| 3.png  | 4.png  | 2      |
| 5.png  | 6.png  | 3      |
|  ...   |  ...   | ...    |
```


Then in the __Begin Routine__ tab of the code component in the trial routine, we can have the following code:

```python
img1_markerSent = False
img2_markerSent = False
```

Then in the __Each Frame__ tab of the same code component, we can have the following code:

```python
if img1.status == STARTED and not img1_markerSent:
    add_queue({'command': 'MARKER', 'content': marker + '_img1'})
    img1_markerSent = True
if img2.status == STARTED and not img2_markerSent:
    add_queue({'command': 'MARKER', 'content': marker + '_img2'})
    img2_markerSent = True
```

So that you can tell the two images in the same trial apart in the EEG data.

### More control over the markers

Or you can define a marker query function to find the marker you want to send based on a pre-defined Excel spreadsheet and the current condition of the experiment. Here is an example of how to do it:

Suppose you defined your markers in a Excel file with the following structure:

```
| image      | condition | marker |
|------------|-----------|--------|
| 1.png      | T1        | 1      |
| 1.png      | T2        | 2      |
| 2.png      | T1        | 3      |
| 2.png      | T2        | 4      |
```

```python
def marker_query(image, condition):
    # Load the Excel file
    df = pd.read_excel('path/to/your/excel/file.xlsx')
    # Find the marker based on the trial number and condition
    marker = df[(df['image'] == image) & (df['condition'] == condition)]['marker'].values[0]
    return marker
```

Where image and condition are the current image shown and condition of the experiment. You can replace them with the actual variables you are using in your experiment. In most cases it can be the path to the image/video that is shown in the trial.

Then similarly you can modify the `add_queue` function in the __Each Frame__ tab with the following code:
```python
add_queue({'command': 'MARKER', 'content': marker_query(image, 'T1')})
```

### Step 5: Start the EEG stream and run the experiment
There might be some bugs in the code that you need to fix. But if you follow the guide correctly, you should be able to start the EEG stream and collect the data. If you encounter any problems, feel free to ask for help through my [email](mailto:ts3464@columbia.edu). Good luck!

