Pentru deschiderea aplicatiei trebuie sa navigam in fisier folosind terminalul.
Următorul pas este instalarea dependentelor cu ajurorul: "npm install".
Setam "environmnt variables" prin crearea unui fisier .env pentru conectarea cu baza de date locala cu variabilele:
MONGODB_HOST=127.0.0.1
MONGODB_DATABASE=carla
JWT_KEY=supersecret
MONGO_USER=
MONGO_PASS=
PORT=8000

Pentru conectatea cu baza de date Mongo DB atlas in cloud trebuie adaugata linia "mongoose_uri = `mongodb+srv://${process.env.MONGODB_USER}:${process.env.MONGODB_PASSWORD}@${process.env.MONGODB_HOST}/${process.env.MONGODB_DATABASE}?retryWrites=true&w=majority`" in fisierul "startup/db.js" si adaugate in .env variabilele: 
MONGODB_HOST=ibookcluster.uinntkc.mongodb.net
MONGODB_DATABASE=carla
JWT_KEY=supersecret
MONGODB_USER=carla2
MONGODB_PASSWORD=11111

Pornim partea de backend cu comanda: "npm start"

