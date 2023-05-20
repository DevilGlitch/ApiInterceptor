// more reliable
const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const fs = require('fs');

const app = express();
app.use(bodyParser.json());

// Function to remove @everyone and @here mentions from a string
const removeMentions = (str) => {
	return str.replace(/@everyone|@here/gi, '');
};

// POST endpoint to handle API requests
app.post('/api', (req, res) => {
	const { avatar_url, username, content, apiInterL } = req.body;

	// Process the content and strip words
	const strippedContent = removeMentions(content.replace(/word1|word2|word3/gi, ''));
	const strippedUsername = removeMentions(username);

	// Construct the data to be stored in JSON
	const data = {
		avatar_url,
		username: strippedUsername,
		content: strippedContent,
		apiInterL
	};

	// Store the data in a JSON file
	fs.readFile('data.json', 'utf8', (err, jsonString) => {
		if (err) {
			console.log(err);
		} else {
			let jsonData = [];
			if (jsonString) {
				jsonData = JSON.parse(jsonString);
			}
			jsonData.push(data);
			fs.writeFile('data.json', JSON.stringify(jsonData), 'utf8', (err) => {
				if (err) {
					console.log(err);
				} else {
					console.log('Data stored in data.json');
				}
			});
		}
	});

	// Send the processed data to a Discord webhook based on apiInterL value
	let webhookURL = '';

	switch (apiInterL) {
		case 1:
			webhookURL = 'YOUR_DISCORD_WEBHOOK_URL_1';
			break;
		case 2:
			webhookURL = 'YOUR_DISCORD_WEBHOOK_URL_2';
			break;
		case 3:
			webhookURL = 'YOUR_DISCORD_WEBHOOK_URL_3';
			break;
		case 4:
			webhookURL = 'YOUR_DISCORD_WEBHOOK_URL_4';
			break;
		case 5:
			webhookURL = 'YOUR_DISCORD_WEBHOOK_URL_5';
			break;
		case 6:
			webhookURL = 'YOUR_DISCORD_WEBHOOK_URL_6';
			break;
		default:
			webhookURL = 'YOUR_DEFAULT_DISCORD_WEBHOOK_URL';
	}

	const webhookData = {
		embeds: [
			{
				author: {
					name: strippedUsername,
					icon_url: avatar_url
				},
				description: strippedContent
			}
		]
	};

	axios.post(webhookURL, webhookData)
		.then(() => {
			res.status(200).json({ message: 'API request processed and sent to Discord webhook' });
		})
		.catch((error) => {
			console.error('Error sending data to Discord webhook:', error);
			res.status(500).json({ error: 'An error occurred while sending data to Discord webhook' });
		});
});

// Start the server
const port = 443;
app.listen(port, () => {
	console.log(`API server running on port ${port}`);
});
