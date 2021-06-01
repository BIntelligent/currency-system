/**
 * @author Silent-Coder
 * @license Apache-2.0
 * @copyright Silent-Coder
 * @file index.js
 */

'use-strict';
const db = require("mongoose");
const ms = require("parse-ms");
const cs = require("./models/currency");
/**
 * @class CurrencySystem
 */
class CurrencySystem {
    connect(password) {
        if (!password.startsWith("mongodb+srv")) throw new TypeError("Invalid MongoURL");
        let connected = true;
        db.connect(password, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        }).catch(e => {
            connected = false;
            throw new TypeError(`${e}`);
        }).then(() => {
            if (connected === true) console.info("Connected to DB successfully.")
        });
    };

    async gamble(settings) {

        let data = await findUser(settings)
        if (!data) data = await makeUser(settings);

        const money = settings.amount;
        const amount = parseInt(money)
        const result = Math.floor(Math.random() * 10);
        const balance = data.wallet;
        let lastGamble = data.lastGamble;
        const minAmount = settings.minAmount || 0;
        let cooldown = settings.cooldown || 5;
        cooldown = cooldown * 1000;

        if (!amount) return "Please insert an amount first.";
        if (isNaN(amount)) return "The amount was not a number.";
        const neededMoney = balance - amount;
        if (amount > balance || !balance || balance === 0) return `You don't have enough money. You need ${neededMoney}$ more to perform the action. `;
        if (amount < minAmount) return `You don't have enough money for gambling. The minimum was $${minAmount}.`;
        let pad_zero = num => (num < 10 ? '0' : '') + num;
        if (lastGamble !== null && cooldown - (Date.now() - lastGamble) > 0) {
            let timeObj = ms(cooldown - (Date.now() - lastGamble));
            let second = pad_zero(timeObj.seconds).padStart(2, "0");
            return `Wooo that is too fast. You need to wait **${second}** second(s) before you can gamble again.`;
        }
        if (result < 5) {
            data.lastGamble = Date.now();
            data.wallet = data.wallet - amount;
            data.save().catch(err => {
                throw `${err}`
            });
            return `Ahh, no. You lose $${amount}. You've $${data.wallet} left. Good luck next time.`;
        } else if (result > 5) {
            data.lastGamble = Date.now();
            data.wallet = (data.wallet + amount);
            data.save().catch(e => {
                throw `${e}`
            });
            return `Woohoo! You won $${amount}! You've $${data.wallet}. Good luck, have fun!`;

        };
    };


    async withdraw(settings) {
        let data = await findUser(settings)
        if (!data) data = await makeUser(settings);

        const money = settings.amount;
        const amount = parseInt(money);
        const bank = data.bank;

        if (!money) return "Specify an amount to withdraw";
        if (money.includes('-')) return "You can't withdraw negative money";
        if (bank < amount) return "You don't have that much money in bank.";

        if (money == 'all') {

            if (bank === 0) return "You don't have any money to withdraw"
            data.wallet = data.wallet + data.bank;
            data.bank = 0;
            await saveUser(data);
            return "You have withdraw'd all your money from your bank"

        } else {

            data.wallet = data.wallet + amount;
            data.bank = data.bank - amount;
            await saveUser(data);
            return `You have withdraw $${amount} money from your bank.`;

        }
    };

    /**
     * 
     * @param {object} settings  
     */


    async deposite(settings) {
        let data = await findUser(settings)
        if (!data) data = await makeUser(settings);

        const money = settings.amount;
        const amount = parseInt(money);
        const wallet = data.wallet;
        if (!money) return "Specify an amount to deposite";
        if (money.includes('-')) return "You can't deposite negative money";
        if (amount < wallet) return "You don't have that much money in wallet.";

        if (money == 'all') {

            if (wallet === 0) return "You don't have any money to deposite"
            data.bank = data.wallet + data.bank;
            data.wallet = 0;
            await saveUser(data);
            return "You have deposited all your money to your bank"

        } else {

            data.wallet = data.wallet - amount;
            data.bank = data.bank + amount;
            await saveUser(data);
            return `You have deposited $${amount} money to your bank.`;

        }
    };

    /**
     * 
     * @param {object} settings  
     */


    async balance(settings) {
        let data = await findUser(settings)
        if (!data) data = await makeUser(settings);

        return {
            bank: data.bank,
            wallet: data.wallet
        }
    };

    /**
     * 
     * @param {object} settings  
     */


    async leaderboard(guildID) {
        let data = await cs.find({
            guildID: guildID
        }).sort([
            ['wallet', 'descending']
        ]).exec();
        return data;
    };

    /**
     * 
     * @param {object} settings  
     */


    async work(settings) {
        let data = await findUser(settings)
        if (!data) data = await makeUser(settings);

        let lastWork = data.lastWork;
        let timeout = settings.cooldown;

        if (lastWork !== null && timeout - (Date.now() - lastWork) > 0) {
            let time = ms(timeout - (Date.now() - lastWork));
            return `You have already worked recently Try again in ${time.minutes}m ${time.seconds}s`;

        } else {

            let amount = Math.floor(Math.random() * settings.maxAmount || 100) + 1;
            data.lastWork = Date.now();
            data.wallet = data.wallet + amount;
            await saveUser(data);
            let result = Math.floor((Math.random() * settings.replies.length));
            return `You worked as a ${settings.replies[result]} and earned $${amount}.`;

        };
    };

    /**
     * 
     * @param {object} settings  
     */


    async rob(settings) {
        let user1 = await findUser(settings)
        if (!user1) user1 = await makeUser(settings);

        let user2 = await cs.findOne({
            userID: settings.user2.id,
            guildID: settings.guild.id || false
        });
        if (!user2) user2 = await makeUser(settings, true)

        let lastRob = user1.lastRob;
        let timeout = settings.cooldown;

        if (lastRob !== null && timeout - (Date.now() - lastRob) > 0) {
            let time = ms(timeout - (Date.now() - lastRob));
            return `You have already worked recently Try again in ${time.minutes}m ${time.seconds}s`;
        }

        if (user1.wallet < settings.minAmount) return `You need atleast $${settings.minAmount} to rob somebody.`;
        if (user2.wallet < settings.minAmount) return `${settings.user2.username} have less than $${settings.minAmount} to rob.`;

        let random = Math.floor(Math.random() * 1000) + 1; // random number 200-1, you can change 200 to whatever you'd like
        if (random > user2.wallet) random = user2.wallet;

        // 5 here is percentage of success.
        if (testChance(settings.successPercentage || 5)) {
            // Success!

            user2.wallet = user2.wallet - random;
            user1.wallet = user1.wallet + random;
            await saveUser(user1);
            await saveUser(user2);
            return `${settings.user.username} you robbed ${settings.user2.username} and got away with ${random}!`;

        } else {
            // Fail :(

            user2.wallet = user2.wallet + random;
            user1.wallet = user1.wallet - random;
            await saveUser(user1);
            await saveUser(user2);
            return `${settings.user.username} you robbed ${settings.user2.username} and got caught and you payed ${random} to ${settings.user2.username}!`;
        };

    };

    /**
     * 
     * @param {object} settings  
     */


    async addMoney(settings) {
        let data = await findUser(settings);
        if (!data) data = await makeUser(settings);
        let check = settings.amount + "";
        if (check.includes("-")) return "You cant add negitive money";
        let amount = parseInt(settings.amount) || 0;
        let wheretoPutMoney;
        if (settings.wheretoPutMoney === "bank") wheretoPutMoney = data.bank;
        else if (settings.wheretoPutMoney === "wallet") wheretoPutMoney = data.wallet;
        else wheretoPutMoney = data.wallet;
        if (wheretoPutMoney === data.wallet) data.wallet += amount;
        if (wheretoPutMoney === data.bank) data.bank += amount;
        await saveUser(data);
        return true;
    };

    /**
     * 
     * @param {object} settings  
     */


    async removeMoney(settings) {
        let data = await findUser(settings)
        if (!data) data = await makeUser(settings);
        let check = settings.amount + "";
        if (check.includes("-")) return "You cant remove negitive money";
        let amount = parseInt(settings.amount) || 0;
        let wheretoPutMoney;
        if (settings.wheretoPutMoney === "bank") wheretoPutMoney = data.bank;
        else if (settings.wheretoPutMoney === "wallet") wheretoPutMoney = data.wallet;
        else wheretoPutMoney = data.wallet;
        if (wheretoPutMoney === data.wallet) data.wallet -= amount;
        if (wheretoPutMoney === data.bank) data.bank -= amount;
        await saveUser(data);
        return true;
    };

    /**
     * 
     * @param {object} settings  
     */

    async transferMoney(settings) {
        let user1 = await findUser(settings)
        if (!user1) user1 = await makeUser(settings);

        let user2 = await cs.findOne({
            userID: settings.user2.id,
            guildID: settings.guild.id || false
        });
        if (!user2) user2 = await makeUser(settings, true)
        let money = parseInt(settings.amount)
        if (user1.wallet < money) return `**${settings.user.username}** dosn't have enough money in there wallet.`;

        user1.wallet = user1.wallet - money;
        user2.wallet = user2.wallet + money;
        saveUser(user1);
        saveUser(user2);
        return `**${settings.user.username}**, Successfully transfered **${money}** to **${settings.user2.username}**`;
    }

    /* async addItem(settings) {
        let user1 = await findUser(settings)
        if (!user1) user1 = await makeUser(settings);

        let user2 = await cs.findOne({
            userID: settings.user2.id,
            guildID: settings.guild.id
        });
        if (!user2) user2 = await makeUser(settings, true)
        
    }; */
};


module.exports = CurrencySystem;
async function findUser(settings) {
    let find = await cs.findOne({
        userID: settings.user.id,
        guildID: settings.guild.id || false
    });
    return find;
};
async function makeUser(settings, user2 = false) {
    let user = settings.user.id
    if (user2) user = settings.user2.id;
    const newUser = new cs({
        userID: user,
        guildID: settings.guild.id || false,
        wallet: 0,
        bank: 0,
        inventory: "nothing",
        lastUpdated: new Date(),
        lastGamble: 0,
        lastWork: 0,
        lastRob: 0
    });
    await newUser.save().catch(console.error);
    return newUser;
};
async function saveUser(data) {
    await data.save().catch(e => {
        throw new TypeError(`${e}`);
    });
};
// This is for Rob Command
function testChance(successPercentage) {
    let random2 = Math.random() * 10;
    return ((random2 -= successPercentage) < 0);
}
