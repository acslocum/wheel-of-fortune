import requests
import time
import pprint

while True:
  req = requests.get('http://localhost:3000/score')
  if req.status_code == 200:
    info = req.json()
    pprint.pp(info)
    print()
  else:
    print('Error: ' + str(req.status_code))

  time.sleep(1)
print()