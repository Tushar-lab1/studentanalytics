import sys
import json
import numpy as np
from sklearn.linear_model import LogisticRegression

# Simple mock dataset
X = np.array([
    [3.8, 5],
    [3.2, -2],
    [2.8, -8],
    [3.9, 3],
    [3.1, 1],
    [3.6, 7],
    [2.9, -5],
    [3.7, 4],
    [2.7, -10],
    [3.4, 2]
])

# Labels: 0 = Stable, 1 = At Risk
y = np.array([0, 0, 1, 0, 0, 0, 1, 0, 1, 0])

model = LogisticRegression()
model.fit(X, y)

# Read GPA and Trend from CLI args
gpa = float(sys.argv[1])
trend = float(sys.argv[2])

prediction = model.predict([[gpa, trend]])
result = "At Risk" if prediction[0] == 1 else "Stable"

print(result)
