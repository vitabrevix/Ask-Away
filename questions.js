// Question database organized by categories
const questionDatabase = {
	introduction: [
		{ id: 1, kinkiness: 1, spiciness: 1, question: "What's your age?" },
		{ id: 2, kinkiness: 1, spiciness: 1, question: "What genders are you into?" },
		{ id: 3, kinkiness: 1, spiciness: 1, question: "Zodiac Sign?" },
		{ id: 4, kinkiness: 1, spiciness: 1, question: "Chinese calendar animal?" },
		{ id: 5, kinkiness: 1, spiciness: 1, question: "How many languages do you know?" },
		{ id: 6, kinkiness: 1, spiciness: 1, question: "Do you have pets? How many?" },
		{ id: 7, kinkiness: 1, spiciness: 1, question: "If your pet had a dating profile, what would it say?" },
		{ id: 8, kinkiness: 1, spiciness: 1, question: "What's the weirdest place you've found your pet sleeping?" },
		{ id: 9, kinkiness: 1, spiciness: 1, question: "Favorite activity?" },
		{ id: 10, kinkiness: 1, spiciness: 1, question: "Favorite snack?" },
		{ id: 11, kinkiness: 1, spiciness: 1, question: "Favorite show/film, or one you watched recently that you would recommend?" },
		{ id: 12, kinkiness: 1, spiciness: 1, question: "Top 5 songs of all times?" }, 
		{ id: 13, kinkiness: 1, spiciness: 1, question: "Top 3 hobbies?" }, 
		{ id: 14, kinkiness: 1, spiciness: 1, question: "Have you been called funny nicknames? Which?" }, 
		{ id: 15, kinkiness: 1, spiciness: 1, question: "Favorite animal/s?" }, 
		{ id: 16, kinkiness: 1, spiciness: 1, question: "Sleeping naked or not?" }, 
		{ id: 17, kinkiness: 1, spiciness: 1, question: "Pineapple on pizza or nah?" }, 
		{ id: 18, kinkiness: 1, spiciness: 1, question: "Favorite place to visit?" },
		{ id: 19, kinkiness: 1, spiciness: 1, question: "How do you organize your music playlist? By genere or by ✨vibes✨?" },
		{ id: 20, kinkiness: 1, spiciness: 1, question: "Favorite gift you ever got?" },
		{ id: 21, kinkiness: 1, spiciness: 1, question: "Favorite birtday?" },
		{ id: 22, kinkiness: 1, spiciness: 1, question: "Favorite memory?" },
		{ id: 23, kinkiness: 1, spiciness: 1, question: "Are you the kind that fidgets all the time?" },
		{ id: 24, kinkiness: 1, spiciness: 1, question: "Favorite place to visit near home?" },
		{ id: 25, kinkiness: 1, spiciness: 1, question: "Do you prefer beach or mountain vacations?" },
		{ id: 26, kinkiness: 1, spiciness: 1, question: "What's some food or weirdest combination you thought you wouldnt like that you actually did enjoy?" },
		{ id: 27, kinkiness: 1, spiciness: 1, question: "What hobby would you pick up if time and money weren't factors?" },
		{ id: 28, kinkiness: 1, spiciness: 1, question: "What hobby do you think more people should try?" },
		{ id: 29, kinkiness: 1, spiciness: 1, question: "What's your biggest technology pet peeve? (its okay to sound like a boomer from time to time)" },
		{ id: 30, kinkiness: 1, spiciness: 1, question: "How do you prefer to spend time with friends?" },
		{ id: 31, kinkiness: 1, spiciness: 1, question: "Do you belive in the supernatural? Ghosts, Vampires, etc etc" },
		{ id: 32, kinkiness: 1, spiciness: 1, question: "Do you belive in aliens? Out there, or the abducters, etc etc" },
		{ id: 32, kinkiness: 1, spiciness: 1, question: "How much wood would a woodchuck chuck if a woodchuck could chuck wood?" },
		{ id: 40, kinkiness: 1, spiciness: 2, question: "Have you ever had a travel/long distance romance?" },
		{ id: 41, kinkiness: 1, spiciness: 2, question: "What's the most illegal thing you've accidentally (or not) done?" },
		{ id: 42, kinkiness: 1, spiciness: 2, question: "Have you ever been in serious danger?" },
		{ id: 43, kinkiness: 1, spiciness: 2, question: "Ever stole food from a roomate, colleague or cowerker?" },
		{ id: 44, kinkiness: 1, spiciness: 2, question: "What hobby have you kept secret because it's embarrassing?" },
		{ id: 45, kinkiness: 1, spiciness: 2, question: "What's the most obsessive you've ever been about a hobby?" },
		{ id: 46, kinkiness: 1, spiciness: 2, question: "What's in your browser history that you hope no one ever sees? (porn doesnt count)" },
		{ id: 47, kinkiness: 1, spiciness: 2, question: "What's the most addicted you've ever been to a piece of technology?" },
		{ id: 48, kinkiness: 1, spiciness: 2, question: "What's the most awkward dating experience you've had?" },
		{ id: 49, kinkiness: 1, spiciness: 2, question: "What's a relationship red flag you ignored? (friendship is a relationship too silly)" },
		{ id: 50, kinkiness: 1, spiciness: 2, question: "Ever been on a date or had a partner?" },
		{ id: 51, kinkiness: 1, spiciness: 2, question: "What's the biggest lie you've told in a relationship?" }
	],
	lusty: [
		{ id: 61, spiciness: 2, question: "Fav sex toy?" },
		{ id: 62, spiciness: 2, question: "Fav sex position?" },
		
	],
	bdsm: [
		{ id: 101, spiciness: 2, question: "What's a piece of technology you wish existed?" },
		{ id: 102, spiciness: 2, question: "What's the oldest piece of technology you still use regularly?" },
		{ id: 103, spiciness: 3, question: "What technology do you think is overrated?" },		
		
	],
	couple: [
		{ id: 141, spiciness: 2, question: "What's a piece of technology you wish existed?" },
		{ id: 142, spiciness: 2, question: "What's the oldest piece of technology you still use regularly?" },
		{ id: 143, spiciness: 3, question: "What technology do you think is overrated?" },		
		
	],
	banana: [
		{ id: 181, spiciness: 2, question: "What's a piece of technology you wish existed?" },
		{ id: 182, spiciness: 2, question: "What's the oldest piece of technology you still use regularly?" },
		{ id: 183, spiciness: 3, question: "What technology do you think is overrated?" },		
		
	],
	shell: [
		{ id: 221, spiciness: 2, question: "What's a piece of technology you wish existed?" },
		{ id: 222, spiciness: 2, question: "What's the oldest piece of technology you still use regularly?" },
		{ id: 223, spiciness: 3, question: "What technology do you think is overrated?" },		
		
	],
	wouldyourather: [
		{ id: 261, spiciness: 2, question: "What's a piece of technology you wish existed?" },
		{ id: 262, spiciness: 2, question: "What's the oldest piece of technology you still use regularly?" },
		{ id: 263, spiciness: 3, question: "What technology do you think is overrated?" },		
		
	],
};