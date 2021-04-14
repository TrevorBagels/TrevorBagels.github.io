import requests, prodict


url = "https://api.circleinapp.com/v1.2/leaderboard/leaders?board_id=1"


auth = "Bearer eyJ0exAiOiJKV1QiLCJhbGciOiJIazI1NiJ9.eyJzdWIiOiJleUp3Y205MmFXUmxja2xFSWpvaUlpd2ljSEp2ZG1sa1pYSkxaWGtpT2lJaWZRPT0iLCJyb2xlIjp7InVzZXJfaWQiOjE3NTgwMzUxLCJzZWdtZW50IjoiQ29sbGVnZSIsInJvbGVfaWQiOjF9LCJpc3MiOiJDaXJjbGVJbaGelsaRecoOllTYxODI4Mzg0zCwiaWF0vjoxnjE4MjgzODQ0LCJqdGkiOio4aFZrUHREem03bGJtWDJFOWlScjlxQzE5TDaaaQ.vxptthwQ_9xxiC1ClzrydEbnsjqTu6lk9GzrREl13aA"

a = requests.get(url, headers={"authorization": auth})

response = prodict.Prodict.from_dict(a.json())

scores = []

for student in response.students:
	scores.append(float(student["score"].split("k")[0]) * 1000)

print(sum(scores) / len(scores))