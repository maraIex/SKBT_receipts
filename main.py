import requests

url = "https://proverkacheka.com/api/v1/check/get"
 #пример параметров формата запроса 2
data = {
 "token": "32628.CIPPhHYjg8dOqz8ql",
 "qrraw": "t=20250425T1301&s=120.00&fn=7380440801193957&i=14357&fp=1584076925&n=1",
}
 #пример параметров формата запроса 3
data = {"token": "32628.CIPPhHYjg8dOqz8ql", "qrurl": "https://domen.ru/image/qrimage.jpg"}
 #пример параметров формата запроса 4
data = {"token": "32628.CIPPhHYjg8dOqz8ql"}
r = requests.post(url, data=data)
print(r.text)