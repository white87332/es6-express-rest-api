import { MongoClient, ObjectID } from 'mongodb';
import { isArray } from 'util';
import Logger from '../class/logger';

let log = new Logger().getLog();

export default class Mongodb
{
    constructor()
    {
        this.url = 'mongodb://localhost:27017/test';
        this.db = null;
    }

    connect(callback)
    {
        MongoClient.connect(this.url, (err, db) =>
        {
            let dbConnection = null;
            if (err)
            {
                dbConnection = true;
                log.error("Connected failurely to server");
            }
            else
            {
                this.db = db;
                log.info("Connected correctly to server");
            }

            callback(dbConnection);
        });
    }

    close()
    {
        this.db.close();
    }

    /**
     * [select description]
     * @param  {[type]}   document collectionName
     * @param  {[type]}   queryData      { _id: 56a07a7c57c3b99e3d5969fe }
     * @param  {[type]}   limitNumber    Integeger
     * @param  {Function} callback       callback
     */
    select(collectionName, queryData, limitNumber, callback)
    {
        let data = (queryData === undefined)? {} : queryData;
        if(data._id !== undefined)
        {
            data._id = new ObjectID(data._id);
        }
        let number = (limitNumber === null || limitNumber === undefined) ? 0 : limitNumber;
        this.connect((err) =>
        {
            if (err === null)
            {
                let collection = this.db.collection(collectionName);
                collection.find(data).limit(number).toArray((err, docs) =>
                {
                    callback(err, docs);
                    this.close();
                });
            }
            else
            {
                callback(true, "connect error");
            }
        });
    }

    /**
     * [insert description]
     * @param  {[type]}   document collectionName
     * @param  {[type]}   data [{a: 1, b: 2, c: 3}]
     * @param  {Function} callback callback
     */
    insert(collectionName, data, callback)
    {
        let arrayData = (isArray(data)) ? data : [data];
        this.connect((err) =>
        {
            if (err === null)
            {
                let collection = this.db.collection(collectionName);
                collection.insertMany(arrayData, (err, result) =>
                {
                    callback(err, result);
                    this.close();
                });
            }
            else
            {
                callback(true, "connect error");
            }
        });
    }

    /**
     * [update description]
     * @param  {[type]}   document collectionName
     * @param  {[type]}   whereObject {a:1}
     * @param  {[type]}   setObject   {b:2}
     * @param  {Function} callback [description]
     */
    update(collectionName, whereObject, setObject, callback)
    {
        setObject = {
            $set: setObject
        };
        this.connect((err) =>
        {
            if (err === null)
            {
                let collection = this.db.collection(collectionName);
                collection.updateOne(whereObject, setObject, (err, result) =>
                {
                    callback(err, result);
                    this.close();
                });
            }
            else
            {
                callback(true, "connect error");
            }
        });
    }

    /**
     * [delete description]
     * @param  {[type]}   document collectionName
     * @param  {[type]}   whereObject {a:1}
     * @param  {Function} callback    [description]
     */
    delete(collectionName, whereObject, callback)
    {
        this.connect((err) =>
        {
            if (err === null)
            {
                let collection = this.db.collection(collectionName);
                collection.deleteOne(whereObject, (err, result) =>
                {
                    callback(err, result);
                    this.close();
                });
            }
            else
            {
                callback(true, "connect error");
            }
        });
    }
}
