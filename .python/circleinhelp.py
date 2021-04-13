import requests, prodict


url = "https://api.circleinapp.com/v1.2/leaderboard/leaders?board_id=1"

auth = "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJleUp3Y205MmFXUmxja2xFSWpvaUlpd2ljSEp2ZG1sa1pYSkxaWGtpT2lJaWZRPT0iLCJyb2xlIjp7InVzZXJfaWQiOjE3NTgwMzUxLCJzZWdtZW50IjoiQ29sbGVnZSIsInJvbGVfaWQiOjF9LCJpc3MiOiJDaXJjbGVJbiIsImV4cCI6MTYxODI4Mzg0NCwiaWF0IjoxNjE4MjgzODQ0LCJqdGkiOiJ4aFZrUHREem03bGJtWDJFOWlScjlxQzE5TDgifQ.vxptthwQ_9xxiC1ClzrydEbnsjqTu6lk9GzrREl13TA"

a = requests.get(url, headers={"authorization": auth})

response = prodict.Prodict.from_dict(a.json())

scores = []

for student in response.students:
	scores.append(float(student["score"].split("k")[0]) * 1000)

print(sum(scores) / len(scores))