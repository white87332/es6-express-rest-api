
import { isArray, isObject } from 'util';

const Db = require('tingodb')().Db;

export default class Tingodb
{
    constructor()
    {
        this.db = new Db(__dirname, { nativeObjectID: true });
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
        let limitNumber = conditionData.sort;
        let skipNumber = conditionData.sort;
        let sort = conditionData.sort;

        // one record data
        if (queryData !== undefined)
        {
            data = queryData;
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

        let collection = this.db.collection(collectionName);
        collection.find(data).skip(skipNumber).limit(limitNumber).sort(sort)
        .toArray((err, docs) =>
        {
            callback(err, docs);
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
        let collection = this.db.collection(collectionName);
        collection.insert(arrayData, (err, result) =>
        {
            callback(err, result);
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

        let collection = this.db.collection(collectionName);
        collection.update(whereObject, setObject, (err) =>
        {
            callback(err);
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
        let collection = this.db.collection(collectionName);
        collection.remove(whereObject, (err, result) =>
        {
            callback(err, result);
        });
    }
}
