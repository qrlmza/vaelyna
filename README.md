# Vaelyna Bot v2 🎉 <img src="https://img.shields.io/badge/Discord-5865F2?style=for-the-badge&logo=discord&logoColor=white" /> <img src="https://img.shields.io/badge/Node%20js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white" />

**Vaelyna** is a public version of a powerful and modular Discord bot developed with Discord.js. Designed for fun and utility, it features a range of commands and supports persistent storage through MySQL.

## Features ✨

- 🎭 **Fun Commands** — Includes interactive commands like `cat`, `cafe`, and more.
- ⚙️ **Modular Structure** — Commands are organized by category for easy scaling.
- 💾 **Database Integration** — Uses MySQL for persistent data storage.
- 🔒 **.env Configuration** — Keeps sensitive information secure.

## Installation 🚀

1. **Clone the Repository**
   ```bash
   git clone https://github.com/qrlmza/vaelyna.git
   cd vaelyna
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Configure Environment Variables**

   Rename the `.env.example` to `.env` file in the root directory:

4. **Start the Bot**
   ```bash
   npm start
   ```

## Usage 💡

Once added to your Discord server, you can try out:

```
!cat    - Sends a random cat image  
!cafe   - Sends a coffee-themed response
```

You can explore more in the `commands/` folder.

## Project Structure 🗂

```
./
├── .env.example
├── .gitignore
├── LICENSE
├── README.md
├── db.js
├── main.js
├── package-lock.json
├── package.json
├── Events/
│   ├── guildUserJoin.js
│   └── levelSystem.js
├── Handlers/
│   ├── commands.js
│   └── ready.js
├── commands/
│   ├── Fun/
│   │
│   ├── Moderation/
│   │
│   └── Utils/
```

## Contributing 🤝

Pull requests and issues are welcome at the [GitHub repo](https://github.com/qrlmza/vaelyna).

## License 📄

Licensed under the [Apache 2.0 License](./LICENSE). 

## Author ✍️

|                                                                                                                                                    Author                                                                                                                                                     |
| :-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------: 
| [<img src="https://avatars.githubusercontent.com/u/88981713?v=4" width=115><br><sub>@selunik</sub>](https://github.com/qrlmza) <br><br> [![](https://img.shields.io/badge/Portfolio-255E63?style=for-the-badge&logo=About.me&logoColor=white)](https://selunik.whst.fr) 
## Support 🙋

Get help on my [Discord server](https://discord.gg/kpegty9a)
