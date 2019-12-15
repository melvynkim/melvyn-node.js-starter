import { Router } from 'express';
import { from } from 'rxjs';
import request from 'request-promise';

import { List } from './document';

const router = Router();

/**
 * @name list - get a list
 * @param {string} [_id] - get an item by ID
 * @param {string} [text] - search for text in list
 * @return {Object<{ data: List[], message: string }>}
 *
 * @example GET /crud-operations
 * @example GET /crud-operations?_id=${_id}
 * @example GET /crud-operations?text=${text}
 */
router.get('/', async (req, res) => {
  const { _id, text } = req.query;

  const find = {};

  if (_id) find._id = _id;
  if (text) find.text = { $regex: text, $options: 'i' };

  const data = await List.find(find).exec();

  res.json({ data, message: 'Data obtained.' });
});

/**
 * @name item - get an item
 * @param {string} id - get an item by ID
 * @return {Object<{ data: List[], message: string }>}
 *
 * @example GET /crud-operations/${id}
 */
router.get('/item/:id', (req, res) => {
  from(List.find({ _id: req.params.id }).exec())
    .subscribe(data => res.json({ data, message: 'Data obtained.' }));
});

/**
 * @name count - get a list length
 * @return {Object<{ data: number, message: string }>}
 *
 * @example GET /crud-operations/count
 */
router.get('/count', (req, res) => {
  from(List.count().exec())
    .subscribe(data => res.json({ data, message: 'Data obtained.' }));
});

/**
 * @name pagination - get a list of paging
 * @param {number} [page=1] - current page number
 * @param {number} [row=5] - rows per page
 * @return {Object<{ data: List[], message: string }>}
 *
 * @example GET /crud-operations/pagination?page=${page}&row=${row}
 */
router.get('/pagination', async (req, res) => {
  const baseUrl = `${req.protocol}://${req.get('host')}${req.baseUrl}`;

  const data = [];

  const page = Number(req.query.page) || 1;
  const row = Number(req.query.row) || 5;
  const count = await request(`${baseUrl}/count`);
  const total = JSON.parse(count).data;

  for (let i = 0, l = total; i < l / row; i++) {
    if (page === (i + 1)) {
      data.push(List.find({}).skip(i * row).limit(row));
    }
  }

  res.json({
    data: [...await Promise.all(data)],
    total,
    message: 'Data obtained.',
  });
});

/**
 * @name create - create an item
 * @return {Object<{ message: string }>}
 *
 * @example POST /crud-operations { text: ${text} }
 */
router.post('/', async (req, res) => {
  if (!req.body.text) {
    res.status(400)
      .json({ message: 'Please pass text.' });
  }

  const list = await new List(req.body);
  const message = await list.save().then(() => 'List saved');

  res.json({ message });
});

/**
 * @name update - update an item
 * @return {Object<{ message: string }>}
 *
 * @example PUT /crud-operations/${id}
 */
router.put('/:id', async (req, res) => {
  const message = await List
    .findOneAndUpdate({ _id: req.params.id }, req.body)
    .then(() => 'List updated');

  res.json({ message });
});

/**
 * @name delete - remove an item
 * @return {Object<{ message: string }>}
 *
 * @example DELETE /crud-operations/${id}
 */
router.delete('/:id', async (req, res) => {
  const message = await List
    .findByIdAndRemove(req.params.id)
    .then(() => 'List deleted');

  res.json({ message });
});

/**
 * @name delete-multiple - remove selected items
 * @return {Object<{ message: string }>}
 *
 * @example DELETE /crud-operations { selected: [${id}, ${id}, ${id}...] }
 */
router.delete('/', async (req, res) => {
  const { selected } = req.body;

  const message = await List
    .remove({ _id: { $in: selected } })
    .then(() => 'List deleted');

  res.json({ message });
});

export default router;
