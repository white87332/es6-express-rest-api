import { MongoClient, ObjectID } from 'mongodb';
import { isArray, isObject } from 'util';
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
     * @param  {[type]}   document       collectionName
     * @param  {[type]}   queryData      { _id: 56a07a7c57c3b99e3d5969fe }
     * @param  {[type]}   tmpSkipNumber  skip numbers
     * @param  {[type]}   tmpLimitNumber limit numbers
     * @param  {[type]}   sort           { _id: -1 }
     * @param  {Function} callback       callback
     */
    select(collectionName, queryData, tmpSkipNumber, tmpLimitNumber, sort, callback)
    {
        let data, skipNumber, limitNumber;
        if (queryData === undefined)
        {
            data = {};
            skipNumber = limitNumber = 0;
        }
        else
        {
            data = queryData;
            skipNumber = (Number.isInteger(tmpSkipNumber)) ? tmpSkipNumber : 0;
            limitNumber = (Number.isInteger(tmpLimitNumber)) ? tmpLimitNumber : 0;
            if (data._id !== undefined)
            {
                data._id = new ObjectID(data._id);
            }
        }

        // sort
        if (sort === null || !isObject(sort))
        {
            sort = {
                _id: -1
            };
        }
        else
        {
            for (var key in sort)
            {
                if (!Number.isInteger(sort[key]) || sort[key] !== 1 || sort[key] !== -1)
                {
                    sort[key] = -1;
                }
            }
        }

        this.connect((err) =>
        {
            if (err === null)
            {
                let collection = this.db.collection(collectionName);
                collection.find(data).skip(skipNumber).limit(limitNumber).sort(sort).toArray((err, docs) =>
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
        if (whereObject._id !== undefined)
        {
            whereObject._id = new ObjectID(whereObject._id);
        }
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
                if (whereObject._id !== undefined)
                {
                    whereObject._id = new ObjectID(whereObject._id);
                }
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
