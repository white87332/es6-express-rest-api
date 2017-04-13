import { MongoClient, ObjectID } from 'mongodb';
import { isArray, isObject } from 'util';
import mongodbConfig from '../config/mongodb.config';
import Logger from '../class/logger';

let log = new Logger().getLog();

export default class Mongodb
{
    constructor()
    {
        this.url = `mongodb://${mongodbConfig.user}:${mongodbConfig.pwd}@localhost:${mongodbConfig.port}/${mongodbConfig.database}`;
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
                log.error('Connected failurely to server');
            }
            else
            {
                this.db = db;
                // log.info('Connected correctly to server');
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
     * @param  {[type]}   conditionData  {
     *                                   	skipNumber : 0
     *                                   	limitNumber : 20
     *                                   	sort : {
     *                                   		_id : -1
     *                                   	}
     *                                   }
     * @param  {Function} callback       callback
     */
    select(collectionName, queryData, conditionData, callback)
    {
        let data = {};
        let limitNumber;
        let skipNumber;
        let sort = conditionData.sort;

        // one record data
        if (queryData !== undefined)
        {
            data = queryData;
            if (data._id !== undefined)
            {
                data._id = new ObjectID(data._id);
            }

            limitNumber = 0;
            skipNumber = 0;
        }
        else
        {
            limitNumber = (conditionData.limit !== undefined && Number.isInteger(conditionData.limit)) ? conditionData.limit : 20;
            skipNumber = (conditionData.skip !== undefined && Number.isInteger(conditionData.skip)) ? conditionData.skip : 0;
        }

        // sort
        if (sort === undefined || !isObject(sort))
        {
            sort = {
                _id: -1
            };
        }
        else
        {
            for (let key in sort)
            {
                if ((!Number.isInteger(sort[key]) || sort[key] !== 1) && sort[key] !== -1)
                {
                    sort[key] = -1;
                }
            }
        }

        this.connect((conErr) =>
        {
            if (conErr === null)
            {
                let collection = this.db.collection(collectionName);
                collection.find(data).skip(skipNumber).limit(limitNumber).sort(sort)
                .toArray((err, docs) =>
                {
                    callback(err, docs);
                    this.close();
                });
            }
            else
            {
                callback(true, 'connect error');
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
        this.connect((conErr) =>
        {
            if (conErr === null)
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
                callback(true, 'connect error');
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
        this.connect((conErr) =>
        {
            if (conErr === null)
            {
                let collection = this.db.collection(collectionName);
                collection.updateMany(whereObject, setObject, (err, result) =>
                {
                    callback(err, result);
                    this.close();
                });
            }
            else
            {
                callback(true, 'connect error');
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
        this.connect((conErr) =>
        {
            if (conErr === null)
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
                callback(true, 'connect error');
            }
        });
    }
}
