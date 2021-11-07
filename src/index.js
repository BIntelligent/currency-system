const fs = require('fs');
const event = require('./classes/functions').cs;
/**
 * @author Silent-Coder
 * @license Apache-2.0
 * @copyright Silent-Coder
 * @file index.js
 */

'use strict';
const {
    findUser,
    getInventory,
    makeInventory,
    makeUser,
    saveUser,
    connect,
    updateInventory,
} = require('./classes/functions');
/**
 * @class CurrencySystem
 */
class CurrencySystem {
    setMongoURL(password) {
        if (!password.startsWith("mongodb+srv")) throw new TypeError("Invalid MongoURL");
        connect(password);
        process.mongoURL = password;
        event.emit('debug', `[ CS => Debug ] : Successfully saved MongoDB URL ( Used in Shop Functions )`)
    };




    async buy(settings) {
        event.emit('debug', `[ CS => Debug ] : Buy Function is Executed.`)
        let inventoryData = await getInventory(settings);
        event.emit('debug', `[ CS => Debug ] : Fetching Inventory. ( Buy Function )`)
        if (!inventoryData) {
            inventoryData = await makeInventory(settings);
            event.emit('debug', `[ CS => Debug ] : Making new Inventory ( Buy Function )`)
        }
        event.emit('debug', `[ CS => Debug ] : Fetching User ( Buy Function )`)
        let data = await findUser(settings)
        if (!data) {
            data = await makeUser(settings);
            event.emit('debug', `[ CS => Debug ] : Making new User ( Buy Function )`)
        }
        if (!settings.guild) settings.guild = {
            id: null
        }
        let thing = parseInt(settings.item);
        if (!thing) return {
            error: true,
            type: 'No-Item'
        };
        thing = thing - 1;
        if (!inventoryData.inventory[thing]) return {
            error: true,
            type: 'Invalid-Item'
        };

        if (data.wallet < inventoryData.inventory[thing].price) return {
            error: true,
            type: 'low-money'
        };
        else {
            data.wallet -= inventoryData.inventory[thing].price;
            let done = false;
            let makeItem = true;

            for (let j in data.inventory) {
                if (inventoryData.inventory[thing].name === data.inventory[j].name) makeItem = false;
            };


            if (makeItem == false) {
                for (let i in inventoryData.inventory) {
                    for (let j in data.inventory) {
                        if (inventoryData.inventory[i].name === data.inventory[j].name) {
                            data.inventory[j].amount++
                            done = true;
                        };
                    };
                }
            }

            if (done == false) {
                data.inventory.push({
                    name: inventoryData.inventory[thing].name,
                    amount: 1
                });
            };
            event.emit('debug', `[ CS => Debug ] : Updating Inventory ( Buy Function )`)
            await updateInventory(_getDbURL(), data.inventory, settings, "currencies");
            return {
                error: false,
                type: 'success',
                inventory: inventoryData.inventory[thing]
            };
        };
    };

    async addItem(settings) {
        let inventoryData = await getInventory(settings);
        if (!inventoryData) inventoryData = await makeInventory(settings);
        if (!settings.inventory) return {
            error: true,
            type: 'No-Inventory'
        };
        if (!settings.inventory.name) return {
            error: true,
            type: 'No-Inventory-Name'
        }
        if (!settings.inventory.price) return {
            error: true,
            type: 'No-Inventory-Price'
        }
        if (!parseInt(settings.inventory.price)) return {
            error: true,
            type: 'Invalid-Inventory-Price'
        };
        let item = {
            name: String(settings.inventory.name) || 'Air',
            description: String(settings.inventory.description) || 'Air,
            price: parseInt(settings.inventory.price) || 0,
        }
        inventoryData.inventory.push(item);
        await updateInventory(_getDbURL(), inventoryData.inventory, settings)
        return {
            error: false,
            item: item
        };
    };
    async removeItem(settings) {
        let inventoryData = await getInventory(settings);
        if (!inventoryData) inventoryData = await makeInventory(settings);

        let thing = parseInt(settings.item);
        if (!thing) return {
            error: true,
            type: 'Invalid-Item-Number'
        };
        thing = thing - 1;
        if (!inventoryData.inventory[thing]) return {
            error: true,
            type: 'Unknown-Item'
        };
        const deletedDB = inventoryData.inventory[thing];
        inventoryData.inventory.splice(thing, 1);
        await updateInventory(_getDbURL(), inventoryData.inventory, settings)

        return {
            error: false,
            inventory: deletedDB
        };
    };
    async setItems(settings) {
        if (!settings.shop) return {
            error: true,
            type: 'No-Shop'
        };
        if (!Array.isArray(settings.shop)) return {
            error: true,
            type: 'Invalid-Shop'
        };
        for (const x of settings.shop) {
            if (!x.name) return {
                error: true,
                type: 'Invalid-Shop-name'
            };
            if (!x.price) return {
                error: true,
                type: 'Invalid-Shop-price'
            };
        }
        await updateInventory(_getDbURL(), settings.shop, settings)

        return {
            error: false,
            type: 'success'
        }
    };
    async removeUserItem(settings) {
        let data = await findUser(settings);
        if (!data) data = await makeUser(settings);

        let thing = parseInt(settings.item);
        if (!thing) return {
            error: true,
            type: 'Invalid-Item-Number'
        };
        thing = thing - 1;
        if (!data.inventory[thing]) return {
            error: true,
            type: 'Unknown-Item'
        };
        let done = false;
        let deleteItem = true;

        for (let j in data.inventory) {
            if (data.inventory[thing].name === data.inventory[j].name) deleteItem = false;
        };


        if (deleteItem == false) {
            for (let i in data.inventory) {
                for (let j in data.inventory) {
                    if (data.inventory[i].name === data.inventory[thing].name) {
                        data.inventory[j].amount--
                        done = true;
                        if (data.inventory[j].amount == 0 || data.inventory[j].amount < 0) done = false;
                    };
                };
            }
        }

        const deletedDB = data.inventory[thing];
        if (done == false) data.inventory.splice(thing, 1);

        await updateInventory(_getDbURL(), data.inventory, settings, 'currencies')

        return {
            error: false,
            inventory: deletedDB
        };
    };

};

Object.assign(CurrencySystem.prototype, require('./classes/functions'))
module.exports = CurrencySystem;

function _getDbURL() {
    let url = process.mongoURL;
    if (require("mongoose").connections.length) url = (require("mongoose").connections[0]._connectionString)
    return url;
};
module.exports.cs = event;
