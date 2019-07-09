# Kai'Sa Bot

Discord bot that provides the required tools for users to ask and answer questions, with an in-built scoring system.

![Preview](https://i.imgur.com/6Wv64ll.png)
![Preview 2](https://i.imgur.com/OZS6cbU.png)

## Clarification

The code wasn't meant to be public, it was part of a closed-source project and was crafted uniquely for one specific Discord server, hence it might not support being ran in multiple servers. You might have to sort this out.

The scoring system hasn't been completed, the original idea was to make a scoreboard with the top users and display it in a channel with some sort of embed, but it wasn't finished as the project was cancelled, that's why the answers are logged into the database.

I personally wouldn't recommend running this code if you aren't able to modify it.

## How does it work

There are two channels, let's call them #questions and #answers. Users can submit their questions in the #questions channel by using the command `.ask` followed by the question, i.e: `.ask How do I delete my Discord account?`, then the message is deleted and rewritten by the bot, but now it contains an ID, as shown [here](https://i.imgur.com/6Wv64ll.png). The ID is meant to work as a question identifier. 
You can now answer that question by using `.answer <questionId> <answer>`, i.e: `.answer 3134 You should submit a ticket to the Discord support`, then again the message will be deleted and replaced with the answer by the bot, it'll also quote the question so there's some context. 
The bot will automatically react with an up-arrow emoji to every question, so the community can vote for the best answer, as shown [here](https://i.imgur.com/OZS6cbU.png).

## Requirements

* NodeJS 11.3+
* MySQL Server 5.7+
* Discord Bot Token
* Two text channels 
