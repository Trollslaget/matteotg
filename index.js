const firebase = require("firebase");
require("firebase/storage");

const TelegramBot = require("node-telegram-bot-api");
const express = require("express");
const cors = require("cors");
const fs = require("fs");
const token = "6399615168:AAEQZt1rwvfoYxIEnPwHm87tk_j32wNLvYs";
const bot = new TelegramBot(token, { polling: true });
const app = express();
const firebaseConfig = {
	apiKey: "AIzaSyCyLdSghz1CouVGqkXLYJtoC2Qi6sx5YvY",
	authDomain: "fe-upload-a201b.firebaseapp.com",
	databaseURL:
		"https://fe-upload-a201b-default-rtdb.europe-west1.firebasedatabase.app",
	projectId: "fe-upload-a201b",
	storageBucket: "fe-upload-a201b.appspot.com",
	messagingSenderId: "387821229193",
	appId: "1:387821229193:web:15613a693c32ce9513a258",
};
firebase.initializeApp(firebaseConfig);
const db = firebase.database();
const storage = firebase.storage();
app.use(express.json());
app.use(cors());
bot.setMyCommands([{ command: "/start", description: "начать" }]);

bot.on("message", async (msg) => {
	const chatId = msg.chat.id;
	let dbRef = db.ref("name");
	let products;
	await dbRef.once("value", function (snapshot) {
		products = snapshot.val();
	
	});
	
	  
	const text = msg.text;
	 // Получение введенного пользователем названия товара
	const selectedProduct = products.find(product => product.name === text); // Поиск соответствующего товара в массиве data
	const selectedCategory = products.find(product => product.category === text)
	


	if (selectedCategory) {
		const filteredProducts = products.filter((product) => product.category === selectedCategory.category);
		const keyboard = [];
		for (let i = 0; i < filteredProducts.length; i += 2) {
		  const row = [
			filteredProducts[i].name,
			filteredProducts[i + 1] ? filteredProducts[i + 1].name : "",
		  ];
		  keyboard.push(row);
		}
		await bot.sendMessage(chatId, "Выбери Товар из списка", {
			reply_markup: {
				keyboard: [["Назад"], ...keyboard],
			},
		});
	
	}
	if (selectedProduct) {
		const mediaGroup = [];
	  
		for (let i = 0; i < selectedProduct.img.length; i++) {
		  const mediaObject = {
			type: "photo",
			media: selectedProduct.img[i],
		  };
	  
		  if (i === 0) {
			mediaObject.caption = `${selectedProduct.description}\nПо поводу заказа писать - @fastdeliveryfromch`;
		  }
	  
		  mediaGroup.push(mediaObject);
		}
	  
		await bot.sendMediaGroup(chatId, mediaGroup);
	  }

	if (text === "/start" || text === "Назад") {
		let dbRef = db.ref("name");
		let products;
		await dbRef.once("value", function (snapshot) {
			products = snapshot.val();
		
		});
		const uniqueCategories = products.reduce((categories, product) => {
			if (!categories.includes(product.category)) {
			  categories.push(product.category);
			}
			return categories;
		  }, []);
		  const keyboard = uniqueCategories.reduce((keyboard, category, index) => {
			if (index % 2 === 0) {
			  keyboard.push([category, uniqueCategories[index + 1] || '']);
			}
			return keyboard;
		  }, []);
		await bot.sendMessage(chatId, "Выбери категорию из списка", {
			reply_markup: {
				keyboard: keyboard
			},
		});

	}

	
});

const PORT = 8000;

app.listen(PORT, () => console.log("server started on PORT " + PORT));
