import numpy as np
import matplotlib.pyplot as plt
import json

n_steps = 60*24  # minutes in one day
base_value = 0.
gaussians = []
gaussians.append({"cen_step": 6*60, "width_steps":30, "height":1.})
gaussians.append({"cen_step": 13*60, "width_steps":30, "height":1.})
gaussians.append({"cen_step": 18*60, "width_steps":30, "height":1.})

# add gaussians to baseline
time_series = np.zeros(n_steps) + base_value
for gaussian in gaussians:
    cen_step = gaussian['cen_step']
    width_steps = gaussian['width_steps']
    height = gaussian['height']
    time_series += height*np.exp(-((np.arange(n_steps)-cen_step)/width_steps)**2)

# plot
plt.figure()
plt.plot(time_series)
plt.show()

# save to json
time_series_json = json.dumps(time_series.tolist())
with open('time_series.json', 'w') as f:
    f.write(time_series_json)



